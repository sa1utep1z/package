import React, {useState, useRef, useEffect} from "react";
import { View, StyleSheet, FlatList, TouchableOpacity, RefreshControl} from "react-native";
import { Text } from '@rneui/themed';
import { useToast } from "react-native-toast-notifications";
import { useQuery } from '@tanstack/react-query';

import { header, homeFooter, empty } from "./listComponent";
import CompanyDetailDialog from '../../components/Home/CompanyDetailDialog';
import CompanyListDialog from "../../components/Home/CompanyListDialog";
import NAVIGATION_KEYS from "../../navigator/key";
import HeaderCenterSearch from "../../components/Header/HeaderCenterSearch";
import { SUCCESS_CODE } from "../../utils/const";
import HomeApi from "../../request/HomeApi";

const Home = (props) => {
  const {navigation} = props;

  const toast = useToast();

  const detailRef = useRef(null);
  const listRef = useRef(null);

  let DATA = [];
  for(let i = 0; i < 30; i++){
    DATA.push({
      title: `企业芜湖${i+1}`,
      index: i + 1,
      id: i,
      time: `2022-07-${i+1}`
    })
  }

  useEffect(()=>{
    navigation.setOptions({
      headerCenterArea: ({...rest}) => <HeaderCenterSearch routeParams={rest}/>
    })
  }, [])

  const params = {
    pageSize: 20,
    pageNumber: 0
  };

  const { isLoading, data, isError, error } = useQuery(['homePage', params], async() => await HomeApi.HomePage(params));
  if(isError){
    toast.show(`${error.message}，请联系管理员！`, { type: 'danger' });
  }
  if(data.code !== SUCCESS_CODE){
    toast.show(`${res.msg}`, { type: 'danger' });
  }

  const msg = "这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容";

  const gotoList = (item) => {
    console.log('ietm', item);
    // if(item.num > 1){
    //   listRef.current.setShowList(true);
    //   return;
    // }
    // navigation.navigate(NAVIGATION_KEYS.COMPANY_DETAIL, {
    //   companyName: item.companyName
    // });
    if(item.index%2 === 0){
      listRef.current.setShowList(true);
      return;
    }
    navigation.navigate(NAVIGATION_KEYS.COMPANY_DETAIL, {
      companyName: item.title
    });
  };

  const search = (values) => {
    console.log('values', values);
  };

  const rangeDate = (startDate, endDate) => {
    console.log('startDate', startDate);
    console.log('endDate', endDate);
  };

  const renderItem = ({item, index}) => {
    return (
      <View style={styles.itemArea}>
        <Text style={styles.item_flex1}>{index+1}</Text>
        <TouchableOpacity style={{flex: 2}} onPress={()=>detailRef.current.setShowDetail(true)}>
          <Text style={styles.itemPress}>{item.companyName}</Text>
        </TouchableOpacity>
        <Text style={styles.item_flex2}>{item.recruitRange}</Text>
        <TouchableOpacity style={{flex: 1}} onPress={()=>gotoList(item)}>
          <Text style={styles.itemPress}>进入</Text>
        </TouchableOpacity>
      </View>
  )};

  const refreshControl = (
    <RefreshControl
      refreshing={isLoading}
      onRefresh={() => console.log('刷新了123')}
    />
  );

  return(
    <>
      <FlatList
        data={data?.data?.content}
        keyExtractor={item => item.orderId}
        renderItem={renderItem}
        refreshControl={refreshControl}
        ListHeaderComponent={() => header(search, rangeDate)}
        ListFooterComponent={homeFooter}
        ListEmptyComponent={empty}
      />
      <CompanyDetailDialog ref={detailRef} message={msg} />
      <CompanyListDialog ref={listRef} navigation={navigation} />
    </>
)};

const styles = StyleSheet.create({
  itemArea: {
    height: 35, 
    marginHorizontal: 10, 
    backgroundColor: '#fff', 
    borderBottomWidth: 1, 
    borderBottomColor: '#CCCCCC', 
    flexDirection: 'row', 
    alignItems: 'center'
  },
  item_flex1: {
    flex: 1, 
    textAlign: 'center'
  },
  item_flex2: {
    flex: 2, 
    textAlign: 'center'
  },
  itemPress: {
    textAlign: 'center',
    textAlignVertical: 'center',
    color: '#409EFF',
    height: '100%'
  },
  icon: {
    fontSize: 20,
    color: '#999999',
    marginRight: 10
  }
})


export default Home;