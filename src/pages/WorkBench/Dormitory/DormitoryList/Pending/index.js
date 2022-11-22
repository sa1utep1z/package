import React, {useState, useEffect, useRef} from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { useToast } from "react-native-toast-notifications";
import { useDispatch, useSelector } from 'react-redux';
import moment from "moment";

import DormitoryListApi from "../../../../../request/Dormitory/DormitoryListApi";
import { pageEmpty } from "../../../../Home/listComponent";
import { SUCCESS_CODE } from '../../../../../utils/const';
import Footer from '../../../../../components/FlatList/Footer';
import HomeApi from '../../../../../request/HomeApi';
import ListApi from '../../../../../request/ListApi';
import { openDialog, setTitle } from "../../../../../redux/features/PageDialog";
import OrderDetail from "../../../../../components/PageDialog/OrderMessage/OrderDetail";
import WaitToEntry from '../../../../../components/PageDialog/Dormitory/DormitoryList/WaitToEntry';
import StayInDormitory from '../../../../../components/PageDialog/Dormitory/DormitoryList/StayInDormitory';
import CallPhone from '../../../../../components/PageDialog/CallPhone';
import MemberInfo from '../../../../../components/PageDialog/MemberInfo';

let timer;
const firstPage = {pageSize: 20, pageNumber: 0};

const Pending = ({
  filterParams, //顶部筛选的参数
  changeRoute, //修改路由函数
}) => {
  const flatListRef = useRef(null);
  const toast = useToast();
  const dispatch = useDispatch();

  const startDate = useSelector(state => state.RangeDateOfList.startDate);
  const endDate = useSelector(state => state.RangeDateOfList.endDate);

  const [searchContent, setSearchContent] = useState({status: 'DORM_LIVE_PENDING', ...firstPage});
  const [showList, setShowList] = useState([]);
  const [originData, setOriginData] = useState({});
  const [nextPage, setNextPage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(()=>{
    const liveInDateStart = startDate ? moment(startDate).format('YYYY-MM-DD') : '';
    const liveInDateEnd = startDate ? moment(endDate).format('YYYY-MM-DD') : '';
    timer && clearTimeout(timer);
    timer = setTimeout(()=>{
      getList({...searchContent, ...filterParams, liveInDateStart, liveInDateEnd});
    }, 0)
    return () => timer && clearTimeout(timer);
  }, [searchContent, filterParams, startDate, endDate])
  
  const getList = async(params) => {
    setIsLoading(true);
    console.log('getList -> params', params)
    try{
      const res = await DormitoryListApi.getDormitoryList(params);
      console.log('getList --> res', res);
      if(res?.code !== SUCCESS_CODE){
        toast.show(`${res?.msg}`, {type: 'danger'});
        return;
      }
      //初始数据
      setOriginData(res.data);
      //渲染的列表（有下一页时）
      if(nextPage){
        setShowList([...showList, ...res.data.content]);
        setNextPage(false);
        return;
      }
      //无下一页（第一页）
      setShowList([...res.data.content]);
    }catch(err){
      toast.show(`出现了意料之外的问题，请联系系统管理员处理`, { type: 'danger' });
    }finally{
      setIsLoading(false);
    }
  };

  const nameOnPress = async(item) => {
    try {
      dispatch(setTitle('温馨提示'));
      dispatch(openDialog(<CallPhone message={{mobile: item.mobile}}/>));
    } catch (error) {
      console.log('enterpriseOnPress->error', error);
      toast.show(`出现了意料之外的问题，请联系管理员处理`, { type: 'danger' });
    }
  };

  const enterpriseOnPress = async(item) => {
    // try{
    //   const res = await ListApi.FactoryMessage(item.flowId);
    //   if(res?.code !== SUCCESS_CODE){
    //     if(res?.code === 2){
    //       toast.show(`${res?.msg}`, {type: 'warning'});
    //       return;
    //     }
    //     toast.show(`${res?.msg}`, {type: 'danger'});
    //     return;
    //   }
    //   dialogRef.current.setShowDialog(true);
    //   setDialogContent({
    //     dialogTitle: '岗位信息',
    //     dialogComponent: <FormCompanyDetail message={res.data}/>,
    //     rightTitle: '转厂/转单',
    //     rightTitleOnPress: () => transferFactory(item)
    //   });
    // }catch(err){
    //   toast.show(`出现了意料之外的问题，请联系系统管理员处理`, { type: 'danger' });
    // }
    try {
      const orderDetailRes = await HomeApi.orderDetail(item.recruitFlowId);
      const orderTextRes = await HomeApi.orderTextDetail(item.recruitFlowId);
      if(orderDetailRes?.code !== SUCCESS_CODE){
        toast.show(`${orderDetailRes?.msg}`, {type: 'danger'});
        return;
      }
      if(orderTextRes?.code !== SUCCESS_CODE){
        toast.show(`${orderTextRes?.msg}`, {type: 'danger'});
        return;
      }
      const orderData = {
        orderName: orderDetailRes.data.orderName, 
        recruitRange: orderDetailRes.data.recruitRange, 
        orderPolicyDetail: orderDetailRes.data.orderPolicyDetail, 
        orderTextDetail: orderTextRes.data
      };
      dispatch(setTitle('岗位信息'));
      dispatch(openDialog(<OrderDetail orderData={orderData}/>));
    } catch (error) {
      console.log('enterpriseOnPress->error', error);
      toast.show(`出现了意料之外的问题，请联系管理员处理`, { type: 'danger' });
    }
  };

  const statusOnPress = async(item) => {
    dispatch(setTitle('状态处理'));
    switch(item.status){
      case 'DORM_LIVE_IN':
        dispatch(openDialog(<StayInDormitory />));
        break;
      case 'DORM_LIVE_PENDING':
        dispatch(openDialog(<WaitToEntry dormitoryInfo={item} refresh={refresh} />));
        break;
    }
  };

  const originOnPress = async(item) => {
    try {
      const res = await ListApi.MemberMessage(item.recruitFlowId);
      console.log('originOnPress -> res（招聘来源）', res);
      if(res?.code !== SUCCESS_CODE){
        toast.show(`${res?.msg}`, {type: 'danger'});
        return;
      }
      dispatch(setTitle('招聘来源'));
      dispatch(openDialog(<MemberInfo memberInfoList={res.data} showDate={true}/>));
    } catch (error) {
      console.log('error', error);
    }
  };

  const refresh = () => setSearchContent({...searchContent, ...firstPage});

  const onEndReached = () => {
    if(originData.hasNext){
      const nextPage = {...searchContent, pageNumber: searchContent.pageNumber += 1};
      setSearchContent(nextPage);
      setNextPage(true);
    }
  };

  const renderItem = ({item}) => {
    return (
      <View style={[styles.listStyle, !item.scanConfirm && {backgroundColor: '#ffe270'}, item.liveOutApply && {backgroundColor: '#ffcfcf'}]}>
        <Text 
          style={[styles.itemText, styles.pressItem, {flex: 0, width: 100}]}
          numberOfLines={2}
          onPress={() => nameOnPress(item)}
          ellipsizeMode="tail">{item.userName || '无'}</Text>
        <View style={styles.dormitoryInfo}>
          <Text 
            style={[styles.itemText, {fontSize: 24}]}
            numberOfLines={2}
            ellipsizeMode="tail">{item.roomBuildingName}</Text>
            <Text 
            style={[styles.itemText, {fontSize: 24}]}
            numberOfLines={2}
            ellipsizeMode="tail">{item.liveInType === 'DORM-MALE' ? '男' : '女'}-{item.bedNo}</Text>
        </View>
        <Text 
          style={[styles.itemText, {fontSize: 24}]}
          numberOfLines={2}
          ellipsizeMode="tail">{item.liveInDate ? moment(item.liveInDate).format('YYYY-MM-DD') : '无'}</Text>
        <Text 
          style={[styles.itemText, styles.pressItem]}
          numberOfLines={2}
          onPress={() => enterpriseOnPress(item)}
          ellipsizeMode="tail">{item.shortCompanyName}</Text>
        <Text 
          style={[styles.itemText, styles.pressItem, {color: item.status === 'DORM_LIVE_OUT' ? 'red' : '#31df07'}, {flex: 0, width: 100}]}
          numberOfLines={2}
          onPress={() => statusOnPress(item)}
          ellipsizeMode="tail">{item.status === 'DORM_LIVE_IN' ? '在宿' : item.status === 'DORM_LIVE_PENDING' ? '待入住' : '离宿'}</Text>
        <Text 
          style={[styles.itemText, styles.pressItem, {flex: 0, width: 120}]}
          numberOfLines={2}
          onPress={() => originOnPress(item)}
          ellipsizeMode="tail">查看</Text>
      </View>
    )
  };

  return (
    <FlatList 
      ref={flatListRef}
      data={showList}
      style={{backgroundColor: '#fff'}}
      renderItem={renderItem}
      keyExtractor={(item,index) => item.id}
      getItemLayout={(data, index)=>({length: 90, offset: 90 * index, index})}
      refreshing={isLoading}
      onRefresh={refresh}
      initialNumToRender={20}
      ListFooterComponent={<Footer showFooter={showList.length} hasNext={originData.hasNext}/>}
      ListEmptyComponent={pageEmpty()}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.01}
    />
  )
};

const styles = StyleSheet.create({
  listStyle: {
    height: 90,
    borderBottomWidth: 2, 
    borderBottomColor: 'rgba(0, 0, 0, .05)',
    flexDirection: 'row'
  },
  itemText: {
    flex: 1,
    fontSize: 26,
    color: '#000',
    textAlign: 'center',
    textAlignVertical: 'center'
  },
  dormitoryInfo: {
    flex: 1, 
    paddingVertical: 10
  },
  pressItem: {
    color: '#409EFF'
  },
});

export default Pending;