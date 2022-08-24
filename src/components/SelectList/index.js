import React, {useRef, useState, useEffect, useMemo } from 'react';
import {StyleSheet, View, TouchableOpacity, FlatList} from 'react-native';
import { Text, CheckBox, Button, Icon } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';

import { deepCopy } from '../../utils';
import { empty } from '../../pages/Home/listComponent';
import CheckRadio from '../CheckRadio';
import { MEMBERS_STATUS } from '../../utils/const';

const SelectList = ({
    data,
    confirm, //确定按钮
    canMultiChoice, //是否多选
    bottomButton, //是否有底部按钮
    listStyle,
    bottomButtonStyle,
    totalNumber,
    otherText,
    ...rest
}) => {
  const navigation = useNavigation();

  const [list, setList] = useState([]);
  const [confirmList, setConfirmList] = useState([]);
  const [isSelectAll, setIsSelectAll] = useState(false);

  useEffect(()=> {
    const newArr = deepCopy(data);
    newArr.map(item => item.isChecked = false);
    setConfirmList([]);
    setList(newArr);
  }, [data])

  useMemo(()=>{
    //有不选的，那CheckRadio就置否；
    const isNotSelected = list.findIndex(item => !item.isChecked);
    if(isNotSelected !== -1){
      setIsSelectAll(false);
      return;
    }
    setIsSelectAll(true);
  },[list])

  useMemo(()=>{
    const checkLength = list.filter(item => item.isChecked).length;
    if(checkLength === list.length){
      setConfirmList(list);
      return;
    }else if(checkLength === 0){
      setConfirmList([]);
    }
  },[isSelectAll])

  const pressButton = (item) => {
    //单选
    if(!canMultiChoice){
      const newArr = deepCopy(data);
      const pressItem = newArr.find(list => list.value === item.value);
      pressItem.isChecked = !pressItem.isChecked;
      setList(newArr);

      let newConfirmList = [...confirmList];
      newConfirmList[0] = item;
      setConfirmList(newConfirmList);
      return;
    }

    //多选
    const newArr = deepCopy(list);
    const pressItem = newArr.find(list => list.value === item.value);
    pressItem.isChecked = !pressItem.isChecked;
    setList(newArr);

    let newConfirmList = [...confirmList];
    const selectedIndex = newConfirmList.findIndex(data => data.value === item.value);
    if(selectedIndex > -1){
      newConfirmList.splice(selectedIndex, 1);
      setConfirmList(newConfirmList);
      return;
    }
    newConfirmList.push(item);
    setConfirmList(newConfirmList);
  };

  const goBack = () => navigation.goBack();

  const confirmButton = () => confirm(confirmList);

  const clickAll = () => {
    const newArr = deepCopy(list);
    newArr.map(item => item.isChecked = isSelectAll ? false : true);
    setList(newArr);
  };
  
  const renderItem = ({item}) => {
    const isChecked = item.isChecked;
    return (
      <TouchableOpacity key={item.value} style={styles.listItem} onPress={()=>pressButton(item)}>
        <Text style={{fontSize: 28}}>{item.label}</Text>
        <CheckBox
          center
          size={30}
          checked={isChecked}
          onPress={()=>pressButton(item)}
          containerStyle={styles.checkBox_containerStyle}
          checkedIcon="dot-circle-o"
          uncheckedIcon="circle-o"
        />
      </TouchableOpacity>
  )};

  return (
    <>
      <View style={[styles.listView, listStyle]}>
        <View style={styles.topMessage}>
          <View style={styles.message_text}>
            <Text style={styles.top_text}>共 <Text style={{color: '#409EFF'}}>{totalNumber ? totalNumber : list.length}</Text> 条数据，{otherText}</Text>
            <Text style={styles.top_text}>已选 <Text style={{color: 'red'}}>{confirmList.length}</Text> 条数据</Text>
          </View>
          {!!canMultiChoice && <CheckRadio 
            checked={isSelectAll}
            onClick={clickAll}
            showAll
          />}
        </View>
        <FlatList 
          style={styles.scroll}
          data={list}
          renderItem={renderItem}
          keyExtractor={item => item.value}
          getItemLayout={(data, index)=>({length: 90, offset: 90 * index, index})}
          initialNumToRender={15}
          ListEmptyComponent={empty}
          {...rest}
        />
      </View>
      {bottomButton && (
        <View style={[styles.buttonArea, bottomButtonStyle]}>
          <Button
            title="取 消"
            onPress={goBack}
            buttonStyle={styles.cancelButton}
            containerStyle={styles.buttonContainerStyle}
            titleStyle={styles.cancelButton_title}
          />
          <View style={{width: 20}}></View>
          <Button
            title="确 认"
            onPress={confirmButton}
            buttonStyle={styles.confirmButton}
            containerStyle={styles.buttonContainerStyle}
            titleStyle={styles.confirmButton_title}
          />
        </View>
      )}
      
    </>
  )
}

const styles = StyleSheet.create({
  checkBox_containerStyle: {
    margin: 0,
    padding: 0,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0)',
    marginRight: 5,
    borderWidth: 1
  },
  checkBox_icon: {
    fontFamily: "iconfont", 
    color: '#409EFF', 
    fontSize: 20
  },
  falseColor: {
    color: '#DDDDDD'
  },
  listView: {
    flex: 1, 
    width: '100%', 
    paddingHorizontal: 28,
    borderRadius: 8
  },
  topMessage: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 3, 
    paddingVertical: 5
  },
  message_text: {
    flexDirection: 'row', 
    paddingLeft: 10
  },
  top_text: {
    color: '#999999', 
    fontSize: 28
  },
  scroll: { 
    backgroundColor: '#fff', 
    borderRadius: 8
  },
  listItem: {
    height: 90, 
    borderBottomWidth: 2,
    borderColor: 'rgba(0, 0, 0, .05)', 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 28
  },
  buttonArea: {
    flexDirection: 'row', 
    paddingHorizontal: 32, 
    alignItems: 'center',
    marginVertical: 20
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
    color: '#409EFF'
  },
  confirmButton_title: {
    fontSize: 26
  },
  buttonContainerStyle: {
    flex: 1
  },
  clearSelected: {
    color: '#409EFF', 
    paddingRight: 15
  },
  status: {
    flex: 1,
    fontSize: 28,
    textAlign: 'right', 
    paddingRight: 20
  }
})

export default SelectList;