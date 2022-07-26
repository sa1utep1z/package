import React, {useRef, useState, useEffect } from 'react';
import {StyleSheet, View, TouchableOpacity, FlatList} from 'react-native';
import { Text, CheckBox, Button, Icon } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';

import { deepCopy } from '../../utils';
import { empty } from '../../pages/Home/listComponent';
import CheckRadio from '../CheckRadio';
import { useMemo } from 'react';

const SelectList = ({
    data,
    confirm, //确定按钮
    canMultiChoice, //是否多选
    bottomButton, //是否有底部按钮
    listStyle,
    bottomButtonStyle,
    ...rest
}) => {
  const navigation = useNavigation();

  const [list, setList] = useState([]);
  const [confirmList, setConfirmList] = useState([]);
  const [isSelectAll, setIsSelectAll] = useState(false);

  useEffect(()=> {
    const newArr = deepCopy(data);
    newArr.map(item => item.isChecked = false);
    setList(newArr);
  }, [])

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
    const newArr = deepCopy(!canMultiChoice ? data : list);
      //把初始数据copy一份，那每次操作就是全新的数组里面去设置isChecked属性，就实现单选；把最新list数据copy一份，每次操作就是新增加isChecked，就实现多选；
    newArr.map(data => {
      if(data.id === item.id){
        data.isChecked = !data.isChecked;
      }
    })
    setList(newArr);

    let newConfirmList = [...confirmList];
    //单选
    if(!canMultiChoice){
      newConfirmList[0] = item;
      setConfirmList(newConfirmList);
      return;
    }
    //多选
    if(newConfirmList.length){
      const selectedIndex = newConfirmList.findIndex(data => data.id === item.id);
      if(selectedIndex > -1){
        newConfirmList.splice(selectedIndex, 1);
        setConfirmList(newConfirmList);
        return;
      }
      newConfirmList.push(item);
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
    <TouchableOpacity key={item.id} style={styles.listItem} onPress={()=>pressButton(item)}>
      <Text>{item.title}</Text>
      <CheckBox
        center
        checked={isChecked}
        onPress={()=>pressButton(item)}
        containerStyle={styles.checkBox_containerStyle}
        checkedIcon={<Text style={[styles.checkBox_icon, !isChecked && styles.falseColor]}>{'\ue669'}</Text>}
        uncheckedIcon={<Text style={[styles.checkBox_icon, !isChecked && styles.falseColor]}>{'\ue68d'}</Text>}
      />
    </TouchableOpacity>
  )};

  return (
    <>
      <View style={[styles.listView, listStyle]}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3, paddingVertical: 5 }}>
          <View style={{flexDirection: 'row'}}>
            <Text style={{color: '#999999'}}>共 <Text style={{color: 'blue'}}>{list.length}</Text> 条数据，</Text>
            <Text style={{color: '#999999'}}>已选择 <Text style={{color: 'red'}}>{confirmList.length}</Text> 条数据</Text>
          </View>
          <CheckRadio 
            checked={isSelectAll}
            onClick={clickAll}
            showAll
          />
        </View>
        <FlatList 
          style={styles.scroll}
          data={list}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          getItemLayout={(data, index)=>({length: 40, offset: 40 * index, index})}
          initialNumToRender={15}
          ListEmptyComponent={empty}
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
    height: 20,
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
    paddingHorizontal: 10, 
    borderRadius: 8
  },
  scroll: { 
    backgroundColor: '#fff', 
    borderRadius: 8
  },
  listItem: {
    height: 40, 
    borderBottomWidth: 1, 
    borderColor: '#E9E9E9', 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingRight: 5, 
    paddingLeft: 15
  },
  buttonArea: {
    flexDirection: 'row', 
    paddingHorizontal: 8, 
    alignItems: 'center', 
    marginVertical: 10
  },
  cancelButton: {
    borderColor: '#409EFF',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderRadius: 30,
    height: 45
  },
  confirmButton: {
    borderColor: 'white',
    borderRadius: 30,
    height: 45
  },
  cancelButton_title: {
    fontSize: 18, 
    color: '#409EFF'
  },
  confirmButton_title: {
    fontSize: 18
  },
  buttonContainerStyle: {
    flex: 1,
    marginHorizontal: 5
  },
  clearSelected: {
    color: '#409EFF', 
    paddingRight: 15
  }
})

export default SelectList;