import React, {useState, useRef, useEffect} from "react";
import { View, StyleSheet, FlatList, TouchableOpacity, RefreshControl} from "react-native";
import { Text } from '@rneui/themed';
import { useToast } from "react-native-toast-notifications";
import { useQuery, useMutation } from '@tanstack/react-query';

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

  const [searchContent, setSearchContent] = useState({ pageSize: 20, pageNumber: 0 });

  useEffect(()=>{
    navigation.setOptions({
      headerCenterArea: ({...rest}) => <HeaderCenterSearch routeParams={rest}/>
    })
  }, [])

  const { isLoading, data, isError, error, refetch } = useQuery(['homePage', searchContent], HomeApi.HomePage);
  let list = [];
  for(let i = 0; i< 20; i++){
    list.push({
      orderId: i +1,
      companyName: `${i+1}公司`,
      recruitRange: `222-1~222-2`
    })
  }
  for(let i = 0; i< 8; i++){
    data?.data?.content.concat(list);
  }
  if(isError){
    toast.show(`${error.message}，请联系管理员！`, { type: 'danger' });
  }
  if(data?.code !== SUCCESS_CODE){
    toast.show(`${data?.msg}`, { type: 'danger' });
  }

  const msg = "这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容";

  const gotoList = (item) => {
    console.log('item', item);
    if(item.num > 1){
      const {current} = listRef;
      current?.setShowList(true);
      const params = {
        companyId: item?.companyId,
        recruitStart: item?.recruitStart,
        recruitEnd: item?.recruitEnd
      }
      console.log('params', params);
      const { isLoading, data, isError, error, refetch } = useMutation(HomeApi.HomePage);
      console.log('data-item',data);
      return;
    }
    navigation.navigate(NAVIGATION_KEYS.COMPANY_DETAIL, {
      companyName: item.companyName
    });
  };

  const search = (values) => {
    setSearchContent({...searchContent, companyName: values});
  };

  const setRangeDate = (rangeDate) => {
    setSearchContent({...searchContent, recruitStart: rangeDate.startDate, recruitEnd: rangeDate.endDate});
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

  console.log('list', list);
  return(
    <>
      <FlatList
        data={list}
        keyExtractor={item => item.orderId}
        renderItem={renderItem}
        refreshControl={refreshControl}
        ListHeaderComponent={<Header search={search} range={setRangeDate} />}
        ListFooterComponent={homeFooter}
        ListEmptyComponent={empty}
        keyboardShouldPersistTaps='handled'
        onEndReachedThreshold={0.8}
        onEndReached={()=>{
          let hah = [];
          for(let i = 0; i< 20; i++){
            hah.push({
              orderId: Math.random(),
              companyName: `${i+1}公司`,
              recruitRange: `222-1~222-2`
            })
          }
          list.concat(hah);
        }}
      />
      <CompanyDetailDialog ref={detailRef} message={msg}/>
      <CompanyListDialog ref={listRef}/>
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