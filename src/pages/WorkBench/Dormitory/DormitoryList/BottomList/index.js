import React, {useState, useEffect, useRef} from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { useToast } from "react-native-toast-notifications";
import { useDispatch } from 'react-redux';
import moment from "moment";

import LeavingManageApi from "../../../../../request/LeavingManageApi";
import { pageEmpty } from "../../../../Home/listComponent";
import { SUCCESS_CODE } from '../../../../../utils/const';
import Footer from '../../../../../components/FlatList/Footer';
import HomeApi from '../../../../../request/HomeApi';
import { openDialog, setTitle } from "../../../../../redux/features/PageDialog";
import OrderDetail from "../../../../../components/PageDialog/OrderMessage/OrderDetail";
import WaitToEntry from '../../../../../components/PageDialog/Dormitory/DormitoryList/WaitToEntry';
import StayInDormitory from '../../../../../components/PageDialog/Dormitory/DormitoryList/StayInDormitory';

let timer;
const firstPage = {pageSize: 20, pageNumber: 0};

const Total = ({
  type
}) => {
  const flatListRef = useRef(null);

  const toast = useToast();

  const dispatch = useDispatch();

  const [searchContent, setSearchContent] = useState({status: '', ...firstPage});
  const [showList, setShowList] = useState([]);
  const [originData, setOriginData] = useState({});
  const [nextPage, setNextPage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(()=>{
    timer && clearTimeout(timer);
    timer = setTimeout(()=>{
      getList({...searchContent});
    }, 0)
    return () => timer && clearTimeout(timer);
  }, [searchContent])

  useEffect(()=>{
    console.log('type', type);
  },[type])
  
  const getList = async(params) => {
    setIsLoading(true);
    try{
      let arr = [];
      for(let i = 0; i < 30; i++){
        arr.push({
          id: i,
          name: `名单${i+1}`,
          building: `${String(i+1)[0]*100}栋-男`,
          room: `101-${i+1}`,
          date: `2022/3/${i+1}`,
          enterprise: `龙华AC${i+1}`,
          status: i%2 === 0 ? 0 : i %3 === 0 ? 1 : 2,
        })
      }
      setShowList(arr);
    }catch(err){
      console.log('err', err);
      toast.show(`出现了意料之外的问题，请联系系统管理员处理`, { type: 'danger' });
    }finally{
      setIsLoading(false);
    }
  };

  const enterpriseOnPress = async(item) => {
    try {
      const orderDetailRes = await HomeApi.orderDetail("635bb709491cf26efb8bee21");
      const orderTextRes = await HomeApi.orderTextDetail("635bb709491cf26efb8bee21");
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
      case 0:
        dispatch(openDialog(<StayInDormitory />));
        break;
      case 1:
        dispatch(openDialog(<WaitToEntry />));
        break;
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
      <View style={styles.listStyle}>
        <Text 
          style={[styles.itemText, styles.pressItem]}
          numberOfLines={2}
          onPress={() => console.log('你点击了姓名')}
          ellipsizeMode="tail">{item.name || '无'}</Text>
        <TouchableOpacity style={{flex: 1}} onPress={()=>console.log('你点击了宿舍信息')}>
          <Text 
            style={styles.itemText}
            numberOfLines={2}
            ellipsizeMode="tail">{item.building}</Text>
            <Text 
            style={styles.itemText}
            numberOfLines={2}
            ellipsizeMode="tail">{item.room}</Text>
        </TouchableOpacity>
        <Text 
          style={[styles.itemText, {fontSize: 24}]}
          numberOfLines={2}
          ellipsizeMode="tail">{item.date}</Text>
        <Text 
          style={[styles.itemText, styles.pressItem]}
          numberOfLines={2}
          onPress={() => enterpriseOnPress(item)}
          ellipsizeMode="tail">{item.enterprise}</Text>
        <Text 
          style={[styles.itemText, styles.pressItem, {color: item.status === 1 ? 'red' : '#31df07'}]}
          numberOfLines={2}
          onPress={() => statusOnPress(item)}
          ellipsizeMode="tail">{item.status === 0 ? '在宿' : item.status === 1 ? '待入住' : '离宿'}</Text>
        <Text 
          style={[styles.itemText, styles.pressItem]}
          numberOfLines={2}
          onPress={() => console.log('点击了招聘来源')}
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
    fontSize: 28,
    color: '#000',
    textAlign: 'center',
    textAlignVertical: 'center'
  },
  pressItem: {
    color: '#409EFF'
  },
});

export default Total;