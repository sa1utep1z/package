import React, {useState, useEffect, useMemo} from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Button, CheckBox } from '@rneui/themed';
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from 'react-redux';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useToast } from "react-native-toast-notifications";
import moment from "moment";

import HeaderSearchOfDormitory from '../../../../../components/HeaderSearchOfDormitory';
import { closeDialog, openDialog, setTitle } from '../../../../../redux/features/PageDialog'; 
import { deepCopy } from "../../../../../utils";
import DormitoryListApi from "../../../../../request/Dormitory/DormitoryListApi";
import OperateDialog from './OperateDialog';
import Footer from '../../../../../components/FlatList/Footer';
import { SUCCESS_CODE } from '../../../../../utils/const';
import { pageEmpty } from "../../../../Home/listComponent";
import NAVIGATION_KEYS from "../../../../../navigator/key";

let timer;
const firstPage = {pageSize: 20, pageNumber: 0};

const BatchOperateDormitory = ({
  route: {
    params: {
      selectIndex
    }
  }
}) => {
  const navigation = useNavigation();
  const toast = useToast();
  const dispatch = useDispatch();

  const [selectedAll, setSelectedAll] = useState(false);
  const [searchContent, setSearchContent] = useState({status: selectIndex === 1 ? 'DORM_LIVE_PENDING' : 'DORM_LIVE_IN', ...firstPage});
  const [showList, setShowList] = useState([]);
  const [selectedList, setSelectedList] = useState([]);
  const [originData, setOriginData] = useState({});
  const [hasNext, setHasNext] = useState(false);
  const [nextPage, setNextPage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(()=>{
    navigation.setOptions({
      headerTitle: `批量${selectIndex === 1 ? '入住' : '退宿'}`
    });
  },[])

  useEffect(()=>{
    timer && clearTimeout(timer);
    timer = setTimeout(()=>{
      getList(searchContent);
    }, 0)
    return () => timer && clearTimeout(timer);
  }, [searchContent])

  useMemo(()=>{
    //有不选的，那CheckRadio就置否；
    const isNotSelected = showList.findIndex(item => !item.isChecked);
    if(isNotSelected !== -1){
      setSelectedAll(false);
      return;
    }
    setSelectedAll(true);
  },[showList])

  useMemo(()=>{
    const checkLength = showList.filter(item => item.isChecked).length;
    if(checkLength === showList.length){
      setSelectedList(showList);
      return;
    }else if(checkLength === 0){
      setSelectedList([]);
    }
  },[selectedAll])

  const filter = (values)=> {
    const filteredParams = {
      name: values.search || '',
      roomBuildingId: values.buildingNum.length ? values.buildingNum[0].value : '', //宿舍楼栋id
      roomFloorId: values.floorNum.length ? values.floorNum[0].value : '', //宿舍楼层id
      roomId: values.roomNum.length ? values.roomNum[0].value : '', //宿舍房间id
    };
    setSearchContent({...searchContent, ...filteredParams});
  };
  
  const getList = async(params) => {
    setIsLoading(true);
    try{
      const res = await DormitoryListApi.getDormitoryList(params);
      console.log('getList --> res', res);
      if(res?.code !== SUCCESS_CODE){
        toast.show(`${res?.msg}`, {type: 'danger'});
        return;
      }
      setHasNext(res.data.hasNext);
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

  const confirm = async(value, reason) => {
    if(selectIndex === 1){
      const params = {
        ids: selectedList.map(item => item.id),
        ...value
      };
      batchLiveIn(params);
    }else{
      const params = {
        ids: selectedList.map(item => item.id),
        liveOnReasonType: reason,
        liveOutDate: value
      };
      batchLiveOut(params);
    }
  };

  const batchLiveIn = async(params) => {
    try {
      console.log('batchLiveIn -> params', params);
      const res = await DormitoryListApi.batchLiveIn(params);
      if(res?.code !== SUCCESS_CODE){
        toast.show(`${res?.msg}`, {type: 'danger'});
        return;
      }
      toast.show('批量入住成功！', {type: 'success'});
      dispatch(closeDialog());
      navigation.navigate(NAVIGATION_KEYS.DORMITORY_LIST, {
        refresh: true
      });
    } catch (error) {
      console.log('error', error);
      toast.show(`出现了意料之外的问题，请联系系统管理员处理`, { type: 'danger' });
    }
  };

  const batchLiveOut = async(params) => {
    try {
      const res = await DormitoryListApi.batchLiveOut(params);
      console.log('batchLiveOut -> res', res);
      if(res?.code !== SUCCESS_CODE){
        toast.show(`${res?.msg}`, {type: 'danger'});
        return;
      }
      toast.show('批量退宿成功！', {type: 'success'});
      dispatch(closeDialog());
      navigation.navigate(NAVIGATION_KEYS.DORMITORY_LIST, {
        refresh: true
      });
    } catch (error) {
      console.log('error', error);
      toast.show(`出现了意料之外的问题，请联系系统管理员处理`, { type: 'danger' });
    }
  };

  const selectedAllOnPress = () => {
    setSelectedAll(!selectedAll);
    const newArr = deepCopy(showList);
    newArr.map(item => item.isChecked = selectedAll ? false : true);
    setShowList(newArr);
  };

  const goBack = () => navigation.goBack();

  const confirmButton = () => {
    dispatch(setTitle(`批量${selectIndex === 1 ? '入住' : '退宿'}`));
    dispatch(openDialog(<OperateDialog selectIndex={selectIndex} confirm={confirm} />));
  };

  const pressItem = (item) => {
    const newArr = deepCopy(showList);
    const pressItem = newArr.find(list => list.id === item.id);
    pressItem.isChecked = !pressItem.isChecked;
    setShowList(newArr);

    let newConfirmList = [...selectedList];
    const selectedIndex = newConfirmList.findIndex(data => data.id === item.id);
    if(selectedIndex > -1){
      newConfirmList.splice(selectedIndex, 1);
      setSelectedList(newConfirmList);
      return;
    }
    newConfirmList.push(item);
    setSelectedList(newConfirmList);
  };

  const renderItem = ({item}) => {
    const isChecked = item.isChecked;
    return (
      <TouchableOpacity key={item.value} style={styles.listItem} onPress={()=>pressItem(item)}>
        <Text style={{fontSize: 28, width: 140, color: '#333333', textAlign: 'center'}}>{item.userName}</Text>
        <Text style={{fontSize: 28, flex: 1, color: '#333333', textAlign: 'center'}}>{item.roomBuildingName
}-{item.roomFloorIndex}F-{item.bedNo}</Text>
        <Text style={{fontSize: 28, color: '#333333', width: 180, textAlign: 'center'}}>{item.liveInDate ? moment(item.liveInDate).format('YYYY/MM/DD') : '无'}</Text>
        <MaterialIcons style={{width: 120, textAlign: 'center'}} name={isChecked ? 'radio-button-checked' : 'radio-button-off'} size={32} color={isChecked ? '#409EFF' : '#999999'} />
      </TouchableOpacity>
  )};

  const refresh = () => setSearchContent({...searchContent, ...firstPage});

  const onEndReached = () => {
    if(hasNext){
      const nextPage = {...searchContent, pageNumber: searchContent.pageNumber += 1};
      setSearchContent(nextPage);
      setNextPage(true);
    }
  };

  return (
    <View style={styles.screen}>
      <HeaderSearchOfDormitory 
        filterFun={filter}
        filterBuilding
        filterFloorAndRoom
        filterMemberInfo
      />
      <View style={styles.topArea}>
        <Text style={styles.topText}>共<Text style={{color: '#409EFF'}}> {showList.length} </Text>条数据，当前 <Text style={{color: '#409EFF', paddingHorizontal: 2}}>{originData.pageNumber + 1}</Text>/{originData.totalPages} 页，已选<Text style={{color: 'red'}}> {selectedList.length} </Text>条数据
        </Text>
        <TouchableOpacity style={styles.selectAllBtn} onPress={selectedAllOnPress}>
          <Text style={[styles.selectAllText, selectedAll && {color: '#333333', fontWeight: 'bold'}]}>全选</Text>
          <MaterialIcons name={selectedAll ? 'radio-button-checked' : 'radio-button-off'} size={32} color={selectedAll ? '#409EFF' : '#999999'} />
        </TouchableOpacity>
      </View>
      <View style={styles.topLine}>
        <Text style={[styles.titleText, {width: 140}]}>姓名</Text>
        <Text style={[styles.titleText, {flex: 1}]}>宿舍信息</Text>
        <Text style={[styles.titleText, {width: 180}]}>入住日期</Text>
        <Text style={[styles.titleText, {width: 120}]}>选择</Text>
      </View>
      <FlatList 
        style={styles.flatListStyle}
        data={showList}
        renderItem={renderItem}
        onRefresh={refresh}
        refreshing={isLoading}
        keyExtractor={item => item.id}
        getItemLayout={(data, index)=>({length: 90, offset: 90 * index, index})}
        initialNumToRender={15}
        ListFooterComponent={<Footer showFooter={showList.length} hasNext={hasNext}/>}
        ListEmptyComponent={pageEmpty()}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.01}
      />
      <View style={styles.buttonArea}>
        <Button
          title="取消"
          onPress={goBack}
          activeOpacity={1}
          buttonStyle={styles.cancelButton}
          containerStyle={styles.buttonContainerStyle}
          titleStyle={styles.cancelButton_title}
        />
        <View style={{width: 20}}></View>
        <Button
          title={selectIndex === 1 ? '入住' : '退宿'}
          onPress={confirmButton}
          disabled={!selectedList.length}
          buttonStyle={styles.confirmButton}
          containerStyle={styles.buttonContainerStyle}
          titleStyle={styles.confirmButton_title}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1
  },
  topArea: {
    flexDirection: 'row', 
    paddingLeft: 25, 
    justifyContent: 'space-between', 
    marginBottom: 5
  },
  topText: {
    fontSize: 26, 
    color: '#999999'
  },
  selectAllBtn: {
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 25
  },
  selectAllText: {
    fontSize: 26, 
    marginRight: 5, 
    color: '#999999'
  },
  topLine: {
    height: 50, 
    flexDirection: 'row', 
    alignItems: 'center',
    marginHorizontal: 20, 
    backgroundColor: '#ffffff', 
    borderTopLeftRadius: 8, 
    borderTopRightRadius: 8, 
    borderBottomWidth: 1, 
    borderColor: '#EFEFEF'
  },
  titleText: {
    fontSize: 26, 
    fontWeight: 'bold', 
    textAlign: 'center', 
    color: '#333333'
  },
  flatListStyle: {
    backgroundColor: '#fff', 
    borderBottomLeftRadius: 8, 
    borderBottomRightRadius: 8, 
    marginHorizontal: 20
  },
  buttonArea: {
    flexDirection: 'row', 
    paddingHorizontal: 32, 
    alignItems: 'center',
    paddingVertical: 20
  },
  cancelButton: {
    borderColor: '#409EFF',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderRadius: 44,
    height: 88
  },
  confirmButton: {
    borderColor: 'white',
    borderRadius: 44,
    height: 88
  },
  cancelButton_title: {
    fontSize: 26, 
    color: '#409EFF',
    letterSpacing: 5
  },
  confirmButton_title: {
    fontSize: 26,
    letterSpacing: 5
  },
  buttonContainerStyle: {
    flex: 1
  },
  checkBox_containerStyle: {
    width: 120,
    paddingLeft: 5,
    justifyContent: 'center',
    padding: 0,
    marginTop: 0,
    marginBottom: 0,
    marginLeft: 0,
    marginRight: 0,
    backgroundColor: 'rgba(0,0,0,0)'
  },
  listItem: {
    height: 90, 
    borderBottomWidth: 1,
    borderColor: '#EFEFEF',
    flexDirection: 'row', 
    alignItems: 'center'
  },
});

export default BatchOperateDormitory;