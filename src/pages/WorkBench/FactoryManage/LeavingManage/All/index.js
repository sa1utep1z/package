import React, {useState, useEffect} from "react";
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useToast } from "react-native-toast-notifications";

import ListApi from "../../../../../request/ListApi";
import { pageEmpty } from "../../../../Home/listComponent";
import { SUCCESS_CODE, INTERVIEW_STATUS } from '../../../../../utils/const';
import Footer from '../../../../../components/FlatList/Footer';

let timer;
const firstPage = {pageSize: 20, pageNumber: 0};

const All = ({
  search
}) => {
  const toast = useToast();

  const [searchContent, setSearchContent] = useState({status: 'ALL', role: 'RECRUIT', ...firstPage});
  const [showList, setShowList] = useState([]);
  const [originData, setOriginData] = useState({});
  const [nextPage, setNextPage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(()=>{
    timer && clearTimeout(timer);
    timer = setTimeout(()=>{
      getList({...search, ...searchContent});
      // getTypeList();
    }, 0)
    return () => timer && clearTimeout(timer);
  }, [searchContent])

  useEffect(()=>{
    setSearchContent({...searchContent, ...search, ...firstPage});
  },[search])
  
  const getList = async(params) => {
    console.log('getList-->params', params);
    setIsLoading(true);
    try{
      const res = await ListApi.InterViewList(params);
      console.log('getList-->res', res);
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
  
  const getTypeList = async() => {
    const params = {
      companyIds: searchContent?.companyIds || [],  
      storeIds: searchContent?.storeIds || [],
      recruitIds: searchContent?.recruitIds || [],
      startDate: searchContent?.startDate || '',
      endDate: searchContent?.endDate || '',
      str: searchContent?.str || ''
    };
    try{
      const res = await ListApi.GetInterviewTypeList(params);
      if(res?.code !== SUCCESS_CODE){
        toast.show(`${res?.msg}`, {type: 'danger'});
        return;
      }
      setTabNumberList(res.data);
    }catch(err){
      toast.show(`出现了意料之外的问题，请联系系统管理员处理`, { type: 'danger' });
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
          style={[
            styles.itemText,
            {color: '#409EFF', textAlign: 'center'}
          ]}
          numberOfLines={2}
          // onPress={() => pressFactory(item)}
          ellipsizeMode="tail">{item.companyShortName || '无'}</Text>
        <Text 
          style={[
            styles.itemText
          ]}
          numberOfLines={2}
          // onPress={() => pressName(item)}
          ellipsizeMode="tail">{item.name || '无'}</Text>
        <Text 
          style={[
            styles.itemText
          ]}
          numberOfLines={2}
          // onPress={() => changeStatus(item)}
          ellipsizeMode="tail">{INTERVIEW_STATUS[item.interviewStatus] || '无'}</Text>
        <Text 
          style={[
            styles.itemText, 
            {color: '#409EFF', fontSize: 24}
          ]}
          numberOfLines={2}
          // onPress={() => item.mobile && callPhone(item)}
          ellipsizeMode="tail">{item.mobile || '无'}</Text>
      </View>
    )
  };

  return (
    <FlatList 
      data={showList}
      style={{backgroundColor: '#fff'}}
      renderItem={renderItem}
      keyExtractor={(item,index) => item.flowId}
      getItemLayout={(data, index)=>({length: 80, offset: 80 * index, index})}
      refreshing={isLoading}
      onRefresh={refresh}
      initialNumToRender={20}
      ListFooterComponent={<Footer hasNext={originData.hasNext}/>}
      ListEmptyComponent={pageEmpty()}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.01}
    />
  )
};

const styles = StyleSheet.create({
  listStyle: {
    height: 80,
    borderBottomWidth: 2, 
    borderBottomColor: 'rgba(0, 0, 0, .05)',
    flexDirection: 'row', 
    marginHorizontal: 34
  },
  itemText: {
    flex: 1,
    fontSize: 28,
    color: '#000',
    textAlign: 'center',
    textAlignVertical: 'center'
  },
});

export default All;