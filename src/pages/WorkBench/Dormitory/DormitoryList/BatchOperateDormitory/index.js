import React, {useState, useEffect, useMemo} from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Button, CheckBox } from '@rneui/themed';
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from 'react-redux';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import HeaderSearchOfDormitory from '../../../../../components/HeaderSearchOfDormitory';
import { openDialog, setTitle } from '../../../../../redux/features/PageDialog'; 
import { deepCopy } from "../../../../../utils";
import OperateDialog from './OperateDialog';

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
  const dispatch = useDispatch();

  const [selectedAll, setSelectedAll] = useState(false);
  const [searchContent, setSearchContent] = useState({status: '', ...firstPage});
  const [showList, setShowList] = useState([]);
  const [selectedList, setSelectedList] = useState([]);
  const [originData, setOriginData] = useState({});
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
      getList({...searchContent});
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
  
  const getList = async(params) => {
    setIsLoading(true);
    try{
      let arr = [];
      for(let i = 0; i < 30; i++){
        arr.push({
          id: i,
          name: `名单${i+1}`,
          building: `${String(i+1)[0]*100}栋`,
          room: `男-101-${i+1}`,
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

  const selectedAllOnPress = () => {
    setSelectedAll(!selectedAll);
    const newArr = deepCopy(showList);
    newArr.map(item => item.isChecked = selectedAll ? false : true);
    setShowList(newArr);
  };

  const goBack = () => navigation.goBack();

  const confirmButton = () => {
    dispatch(setTitle(`批量${selectIndex === 1 ? '入住' : '退宿'}`));
    dispatch(openDialog(<OperateDialog selectIndex={selectIndex} />));
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
        <Text style={{fontSize: 28, width: 140, color: '#333333', textAlign: 'center'}}>{item.name}</Text>
        <Text style={{fontSize: 28, flex: 1, color: '#333333', textAlign: 'center'}}>{item.building}-{item.room}</Text>
        <Text style={{fontSize: 28, color: '#333333', width: 180, textAlign: 'center'}}>{item.date}</Text>
        <MaterialIcons style={{width: 120, textAlign: 'center'}} name={isChecked ? 'radio-button-checked' : 'radio-button-off'} size={32} color={isChecked ? '#409EFF' : '#999999'} />
      </TouchableOpacity>
  )};

  return (
    <View style={styles.screen}>
      <HeaderSearchOfDormitory 
        filterBuilding
        filterFloorAndRoom
        filterMemberInfo
      />
      <View style={{flexDirection: 'row', paddingLeft: 25, justifyContent: 'space-between', marginBottom: 5}}>
        <Text style={{fontSize: 26, color: '#999999'}}>共<Text style={{color: '#409EFF'}}> {showList.length} </Text>条数据，当前 <Text style={{color: '#409EFF', paddingHorizontal: 2}}>1</Text>/3 页，已选<Text style={{color: 'red'}}> {selectedList.length} </Text>条数据
        </Text>
        <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', paddingHorizontal: 25}} onPress={selectedAllOnPress}>
          <Text style={[{fontSize: 26, marginRight: 5, color: '#999999'}, selectedAll && {color: '#333333', fontWeight: 'bold'}]}>全选</Text>
          <MaterialIcons name={selectedAll ? 'radio-button-checked' : 'radio-button-off'} size={32} color={selectedAll ? '#409EFF' : '#999999'} />
        </TouchableOpacity>
      </View>
      <View style={{flexDirection: 'row', alignItems: 'center', height: 50, marginHorizontal: 20, backgroundColor: '#ffffff', borderTopLeftRadius: 8, borderTopRightRadius: 8, borderBottomWidth: 1, borderColor: '#EFEFEF'}}>
        <Text style={{width: 140, fontSize: 26, fontWeight: 'bold', textAlign: 'center', color: '#333333'}}>姓名</Text>
        <Text style={{flex: 1, fontSize: 26, fontWeight: 'bold', textAlign: 'center', color: '#333333'}}>宿舍信息</Text>
        <Text style={{width: 180, fontSize: 26, fontWeight: 'bold', textAlign: 'center', color: '#333333'}}>入住日期</Text>
        <Text style={{width: 120, fontSize: 26, fontWeight: 'bold', textAlign: 'center', color: '#333333'}}>选择</Text>
      </View>
      <FlatList 
        style={{backgroundColor: '#fff', borderBottomLeftRadius: 8, borderBottomRightRadius: 8, marginHorizontal: 20}}
        data={showList}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        getItemLayout={(data, index)=>({length: 90, offset: 90 * index, index})}
        initialNumToRender={15}
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
          title="确认"
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