import React, {useState, useEffect, useRef} from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { useToast } from "react-native-toast-notifications";
import { useDispatch } from 'react-redux';
import { useNavigation } from "@react-navigation/native";

import { pageEmpty } from "../../../../Home/listComponent";
import Footer from '../../../../../components/FlatList/Footer';
import { openDialog, setTitle } from "../../../../../redux/features/PageDialog";
import NAVIGATION_KEYS from "../../../../../navigator/key";
import DormitoryViolationDetail from '../../../../../components/PageDialog/Dormitory/DormitoryViolationDetail';

let timer;
const firstPage = {pageSize: 20, pageNumber: 0};

const BottomList = ({
}) => {
  const navigation = useNavigation();

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
  
  const getList = async(params) => {
    setIsLoading(true);
    try{
      let arr = [];
      for(let i = 0; i < 30; i++){
        arr.push({
          id: i,
          name: `张三${i+1}`,
          building: `24${i}栋`,
          room: `50${i+1}`,
          bed: `${i+1}号`,
          violateDate: `2022/3/${i+1}`,
          status: i%5
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

  const violationOnPress = async() => {
    const violationDetail = {
      name: '哈哈哈你好',
      no: 'zz6516516513198130',
      mobile: '18888888888',
      idNo: '448211156168413248',
      from: '门店自招',
      bumen: '哈哈哈',
      person: '张三王五'
    };
    try {
      dispatch(setTitle('宿舍违纪详情'));
      dispatch(openDialog(<DormitoryViolationDetail violationDetail={violationDetail} />));
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
      <View style={styles.listStyle}>
        <Text style={[styles.itemText, {width: 90}]} ellipsizeMode="tail">{item.name || '无'}</Text>
        <Text style={[styles.itemText, {width: 90}]} ellipsizeMode="tail">{item.building || '无'}</Text>
        <Text style={[styles.itemText, {width: 110}]} ellipsizeMode="tail">{item.room || '无'}</Text>
        <Text style={[styles.itemText, {width: 110}]} ellipsizeMode="tail">{item.bed || '无'}</Text>
        <Text style={[styles.itemText, {flex: 1, color: '#409EFF'}]} ellipsizeMode="tail">{item.violateDate || '无'}</Text>
        <Text style={[styles.itemText, {flex: 1, color: '#000', color: item.status === 0 ? '#409EFF' : item.status === 1 ? 'red' : '#284469'}]} 
          ellipsizeMode="tail">{item.status === 0 ? '警告' : item.status === 1 ? '取消住宿' : '二次警告'}</Text>
        <Text 
          style={[styles.itemText, {width: 100, fontSize: 26, color: '#409EFF'}]}
          numberOfLines={2}
          onPress={() => violationOnPress(item)}
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
    fontSize: 24, 
    color: '#333333', 
    textAlign: 'center', 
    textAlignVertical: 'center'
  }
});

export default BottomList;