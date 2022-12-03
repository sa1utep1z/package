import React, {useState, useEffect, useRef} from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { useToast } from "react-native-toast-notifications";
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';

import { pageEmpty } from "../../../../Home/listComponent";
import Footer from '../../../../../components/FlatList/Footer';
import { openDialog, setTitle } from "../../../../../redux/features/PageDialog";
import DormitoryViolationApi from "../../../../../request/Dormitory/DormitoryViolationApi";
import { SUCCESS_CODE, DORMITORY_VIOLATION_LIST, DORMITORY_VIOLATION_LIST_COLOR } from '../../../../../utils/const';
import DormitoryViolationDetail from '../../../../../components/PageDialog/Dormitory/DormitoryViolationDetail';

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
  const dispatch = useDispatch();

  const [searchContent, setSearchContent] = useState({result: 'DORM_DISCIPLINE_RESULT_WARN', ...firstPage});
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
      const res = await DormitoryViolationApi.getViolationList(params);
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
      console.log('getTypeList -> params', params)
      const res = await DormitoryViolationApi.getViolationType(params);
      console.log('getTypeList --> res', res);
      if(res?.code !== SUCCESS_CODE){
        toast.show(`${res?.msg}`, {type: 'danger'});
        return;
      }
      changeRoute && changeRoute(res.data);
    }catch(err){
      toast.show(`出现了意料之外的问题，请联系系统管理员处理`, { type: 'danger' });
    }finally{
      setIsLoading(false);
    }
  };

  const violationOnPress = async(item) => {
    console.log('item', item);
    dispatch(setTitle('宿舍违纪详情'));
    dispatch(openDialog(<DormitoryViolationDetail item={item} />));
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
        <Text style={[styles.itemText, {width: 130}]} ellipsizeMode="tail">{item.name || '无'}</Text>
        <Text style={[styles.itemText, {width: 130}]} ellipsizeMode="tail">{item.buildingName || '无'}</Text>
        <Text style={[styles.itemText, {width: 100}]} ellipsizeMode="tail">{item.roomName || '无'}</Text>
        <Text style={[styles.itemText, {width: 100}]} ellipsizeMode="tail">{item.bedName || '无'}</Text>
        <Text style={[styles.itemText, {flex: 1, color: '#409EFF'}]} ellipsizeMode="tail">{item.date ? moment(item.date).format('YYYY-MM-DD') : '无'}</Text>
        <Text style={[styles.itemText, {width: 120, color: '#000', color: DORMITORY_VIOLATION_LIST_COLOR[item.result]}]} onPress={() => violationOnPress(item)} ellipsizeMode="tail">{DORMITORY_VIOLATION_LIST[item.result]}</Text>
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
    fontSize: 24, 
    color: '#333333', 
    textAlign: 'center', 
    textAlignVertical: 'center'
  }
});

export default Warn;