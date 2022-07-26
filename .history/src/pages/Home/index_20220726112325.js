import React, {useState, useRef, useEffect} from "react";
import { View, StyleSheet, FlatList, TouchableOpacity, RefreshControl} from "react-native";
import { Text } from '@rneui/themed';
import { useToast } from "react-native-toast-notifications";
import { useQuery } from '@tanstack/react-query';

import { Header, homeFooter, empty } from "./listComponent";
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

  const [searchContent, setSearchContent] = useState({
    pageSize: 20,
    pageNumber: 0
  });

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

  const { isLoading, data, isError, error, refetch } = useQuery(['homePage', searchContent], HomeApi.HomePage);
  if(isError){
    toast.show(`${error.message}，请联系管理员！`, { type: 'danger' });
    console.log('error',error)
  }
  if(data?.code !== SUCCESS_CODE){
    toast.show(`${data?.msg}`, { type: 'danger' });
  }

  const msg = "这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容";

  const gotoList = (item) => {
    if(item.num > 1){
      listRef.current.setShowList(true);
      return;
    }
    navigation.navigate(NAVIGATION_KEYS.COMPANY_DETAIL, {
      companyName: item.companyName
    });
  };

  const search = (values) => {
    setSearchContent({...searchContent, companyName: values});
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
      onRefresh={refetch}
    />
  );

  return(
    <>
      <FlatList
        data={data?.data?.content}
        keyExtractor={item => item.orderId}
        renderItem={renderItem}
        refreshControl={refreshControl}
        ListHeaderComponent={<Header search={search} rangeDate={rangeDate} />}
        ListFooterComponent={homeFooter}
        ListEmptyComponent={empty}
        keyboardShouldPersistTaps='always'
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