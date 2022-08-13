import React, {useState, useRef, useEffect} from "react";
import { View, StyleSheet, FlatList, TouchableOpacity, RefreshControl} from "react-native";
import { Text } from '@rneui/themed';
import { useToast } from "react-native-toast-notifications";
import { useQuery, useMutation, useQueries } from '@tanstack/react-query';

import { Header, homeFooter, empty } from "./listComponent";
import CompanyDetailDialog from '../../components/Home/CompanyDetailDialog';
import CompanyListDialog from "../../components/Home/CompanyListDialog";
import NAVIGATION_KEYS from "../../navigator/key";
import HeaderCenterSearch from "../../components/Header/HeaderCenterSearch";
import { SUCCESS_CODE } from "../../utils/const";
import HomeApi from "../../request/HomeApi";
import { useMemo } from "react";
import { deepCopy } from "../../utils";

const Home = (props) => {
  const {navigation} = props;

  const toast = useToast();

  const detailRef = useRef(null);
  const listRef = useRef(null);
  const [orderMsg, setOrderMsg] = useState({}); // 订单详情
  const [searchContent, setSearchContent] = useState({ pageSize: 10, pageNumber: 0 });
  const [showList, setShowList] = useState({
    content: []
  });

  useEffect(()=>{
    navigation.setOptions({
      headerCenterArea: ({...rest}) => <HeaderCenterSearch routeParams={rest}/>
    })
    return () => setSearchContent({pageSize: 10, pageNumber: 0});
  }, [])

  const { isLoading, data, isError, error, refetch, status } = useQuery(['homePage', searchContent], HomeApi.HomePage);
  if(isError){
    toast.show(`出现了意料之外的问题，请联系系统管理员处理`, { type: 'danger' });
  }
  if(status === 'success' && data?.code !== SUCCESS_CODE){
    toast.show(`${data?.msg}`, { type: 'danger' });
  }

  useMemo(()=>{
    if(data){
      //如果当前的渲染列表中hasNext为true且当前页面与接口请求数据的pageNumber不一样，就将新数据与目前渲染列表衔接到一起并渲染出来；
      if(showList.hasNext && data.data.pageNumber !== showList.pageNumber){
        const concatList = showList.content.concat(data.data.content);
        showList.content = concatList;
        showList.pageNumber = data.data.pageNumber;
        showList.hasNext = data.data.hasNext;
        setShowList(showList);
        return;
      }
      setShowList(data.data);
    }
  },[data])

  useMemo(()=>{
    console.log('searchContent',searchContent);
    console.log('data', data);
  },[searchContent])

  const gotoList = async(item) => {
    const {current} = listRef;
    if(item.num > 1){
      current?.setShowList(true);
      const params = {
        companyId: item?.companyId,
        recruitStart: searchContent?.recruitStart,
        recruitEnd: searchContent?.recruitEnd
      }
      const res = await HomeApi.CompanyList(params);
      const newList = {
        companyName: item.companyName,
        list: res.data
      };
      current?.setList(newList); 
      return;
    } else {
      current?.setShowList(false);
    }
    navigation.navigate(NAVIGATION_KEYS.COMPANY_DETAIL, {
      companyName: item.companyName,
      orderId: item.orderId,
      orderName: item.orderName,
    });
  };

  const onEndReached = () => {
    if(showList.hasNext){
      setSearchContent({...searchContent, pageNumber: searchContent.pageNumber += 1});
    }
  };

  const search = (values) => {
    setSearchContent({...searchContent, companyName: values, pageNumber: 0});
  };

  const setRangeDate = (rangeDate) => {
    setSearchContent({...searchContent, recruitStart: rangeDate.startDate, recruitEnd: rangeDate.endDate, pageNumber: 0});
  };

  const refresh = () => refetch();

  const renderItem = ({item, index}) => {
    return (
      <View style={styles.itemArea}>
        <Text style={styles.item_flex1}>{index+1}</Text>
        <TouchableOpacity style={{flex: 2}} onPress={()=>gotoList(item)}>
          <Text style={styles.itemPress} numberOfLines={1} ellipsizeMode='tail'>{item.companyName}</Text>
        </TouchableOpacity>
        <Text style={styles.item_flex2}>{item.recruitRange}</Text>
        <TouchableOpacity style={{flex: 1}} onPress={()=>gotoList(item)}>
          <Text style={[styles.itemPress, {fontSize: 28}]}>进入</Text>
        </TouchableOpacity>
      </View>
  )};

  const refreshControl = (
    <RefreshControl
      refreshing={isLoading}
      onRefresh={refresh}
    />
  );

  return(
    <View style={{flex: 1, backgroundColor: '#EEF4F7'}}>
      <FlatList
        data={showList?.content}
        keyExtractor={item => item.orderId}
        renderItem={renderItem}
        refreshControl={refreshControl}
        ListHeaderComponent={<Header search={search} range={setRangeDate} />}
        ListEmptyComponent={empty}
        ListFooterComponent={<View style={{height: 28}}></View>}
        initialNumToRender={8}
        keyboardShouldPersistTaps='handled'
        onEndReachedThreshold={0.01}
        onEndReached={onEndReached}
      />
      <CompanyDetailDialog ref={detailRef} message={orderMsg}/>
      <CompanyListDialog ref={listRef}/>
    </View>
)};

const styles = StyleSheet.create({
  itemArea: {
    height: 80, 
    marginHorizontal: 31, 
    backgroundColor: '#fff', 
    borderBottomWidth: 2, 
    borderColor: 'rgba(0, 0, 0, .05)',
    flexDirection: 'row', 
    alignItems: 'center'
  },
  item_flex1: {
    flex: 1, 
    textAlign: 'center',
    fontSize: 28
  },
  item_flex2: {
    flex: 2, 
    textAlign: 'center',
    fontSize: 25
  },
  itemPress: {
    textAlign: 'center',
    textAlignVertical: 'center',
    color: '#409EFF',
    height: '100%',
    fontSize: 32
  },
  icon: {
    fontSize: 20,
    color: '#999999',
    marginRight: 10
  }
})


export default Home;