import React, {useState, useEffect, useRef} from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { useToast } from "react-native-toast-notifications";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from "@react-navigation/native";
import moment from 'moment';

import NAVIGATION_KEYS from "../../../../../navigator/key";
import { pageEmpty } from "../../../../Home/listComponent";
import Footer from '../../../../../components/FlatList/Footer';
import { openDialog, setTitle } from "../../../../../redux/features/PageDialog";
import DormitoryCheckListApi from "../../../../../request/Dormitory/DormitoryCheckListApi";
import { SUCCESS_CODE, CHECK_STATUS_LIST } from '../../../../../utils/const';
import CheckedDetail from '../../../../../components/PageDialog/Dormitory/DormitoryChecked/CheckedDetail';
import CheckedRecord from '../../../../../components/PageDialog/Dormitory/DormitoryChecked/CheckedRecord';
import PropertyList from '../../../../../components/PageDialog/Dormitory/DormitoryChecked/PropertyList';

let timer;
const firstPage = {pageSize: 20, pageNumber: 0};

const Warn = ({
  index,
  filterParams, //顶部筛选的参数
  changeRoute, //修改路由函数
  routeParams, 
}) => {
  const flatListRef = useRef(null);
  const toast = useToast();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [searchContent, setSearchContent] = useState({status: 'DORM_CHECK_PENDING', ...firstPage});
  const [showList, setShowList] = useState([]);
  const [originData, setOriginData] = useState({});
  const [nextPage, setNextPage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if(routeParams?.refresh){
      refresh();
    }
  }, [routeParams])

  useEffect(()=>{
    timer && clearTimeout(timer);
    timer = setTimeout(()=>{
      getList({...searchContent, ...filterParams});
      getTypeList({...filterParams});
    }, 0)
    return () => timer && clearTimeout(timer);
  }, [searchContent, filterParams, index])
  
  const getList = async(params) => {
    try{
      setIsLoading(true);
      console.log('getList -> params', params);
      const res = await DormitoryCheckListApi.getCheckList(params);
      console.log('getList -> res', res);
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
      console.log('err', err);
      toast.show(`出现了意料之外的问题，请联系系统管理员处理`, { type: 'danger' });
    }finally{
      setIsLoading(false);
    }
  };
    
  const getTypeList = async(params) => {
    try{
      setIsLoading(true);
      console.log('getTypeList -> params', params);
      const res = await DormitoryCheckListApi.getCheckListStatics(params);
      console.log('getTypeList --> res', res);
      if(res?.code !== SUCCESS_CODE){
        toast.show(`${res?.msg}`, {type: 'danger'});
        return;
      }
      changeRoute && changeRoute(res.data);
    }catch(err){
      console.log('err', err);
      toast.show(`出现了意料之外的问题，请联系系统管理员处理`, { type: 'danger' });
    }finally{
      setIsLoading(false);
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

  const propertyOnPress = (item) => {
    dispatch(setTitle('资产清单'));
    dispatch(openDialog(<PropertyList item={item} />));
  };

  const recordOnPress = async(item) => {
    try {
      dispatch(setTitle('点检记录'));
      dispatch(openDialog(<CheckedRecord item={item} />));
    } catch (error) {
      console.log('error', error);
    }
  };

  const statusOnPress = async(item) => {
    switch(item.status){
      case 'DORM_CHECK_PENDING':
        navigation.navigate(NAVIGATION_KEYS.ADD_DORMITORY_CHECKED, {
          item
        });
        break;
      default:
        dispatch(setTitle('点检详情'));
        dispatch(openDialog(<CheckedDetail item={item} />));
        break;
    }
  };

  const renderItem = ({item}) => {
    return (
      <View style={styles.listStyle}>
        <Text style={[styles.itemText, {width: 130}]} ellipsizeMode="tail">{item.buildingName || '无'}</Text>
        <Text style={[styles.itemText, {width: 150, color: '#409EFF'}]} ellipsizeMode="tail" onPress={() => propertyOnPress(item)}>{item.roomName || '无'}</Text>
        <Text style={[styles.itemText, {flex: 1}]} ellipsizeMode="tail">{item.date ? moment(item.date).format('YYYY-MM-DD') : '无'}</Text>
        <Text style={[styles.itemText, {width: 130, color: item.status === 'DORM_CHECK_PENDING' ? '#409EFF' : '#31df07'}]} ellipsizeMode="tail" onPress={()=>statusOnPress(item)}>{item.status ? CHECK_STATUS_LIST[item.status] : '无'}</Text>
        <Text 
          style={[styles.itemText, {width: 150, color: '#409EFF'}]}
          numberOfLines={2}
          onPress={() => recordOnPress(item)}
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
      keyExtractor={item => item.id}
      getItemLayout={(data, index)=>({length: 90, offset: 90 * index, index})}
      refreshing={isLoading}
      onRefresh={refresh}
      initialNumToRender={20}
      ListFooterComponent={<Footer showFooter={showList.length} hasNext={originData.hasNext}/>}
      ListEmptyComponent={pageEmpty()}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.01}
      showsVerticalScrollIndicator={true}
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
    fontSize: 26, 
    color: '#333333', 
    textAlign: 'center', 
    textAlignVertical: 'center'
  }
});

export default Warn;