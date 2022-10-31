import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { StyleSheet, View, TouchableOpacity, FlatList, ActivityIndicator, Touchable } from 'react-native';
import { Text, Dialog, CheckBox } from '@rneui/themed';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useDispatch } from 'react-redux';

import { openDialog, setTitle } from '../../../../redux/features/PageDialog2'; 
import SingleSelectList from '../../../PageDialog2/SingleSelectList';

const SelectItemOfFilterMore = ({
  field,
  form,
  label
}) => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  const selectOnPress = () => {
    setLoading(true);
    let arr = [];
    for(let i = 0; i < 30; i++){
      arr.push({label: `${label}-${i+1}`, value: `value${i}`});
    }
    dispatch(setTitle(`请选择${label}`));
    dispatch(openDialog(<SingleSelectList canSearch={false} selectList={arr} fieldValue={field.value} pressItem={pressItem}/>));
  };

  const pressItem = (list) => {
    //点击选择的时候已经是有值的；
    if(form.values[field.name].length){
      //选择的项和之前的表单值不一样-更新表单值；
      if(list.value === form.values[field.name][0].value) return;
      form.setFieldValue(field.name, [list]);
      switch(field.name){
        case 'floorNum':
          if(form.values.roomNum.length){
            form.setFieldValue('roomNum', []);
          }
          if(form.values.bedNum.length){
            form.setFieldValue('bedNum', []);
          }
          break;
        case 'roomNum':
          if(form.values.bedNum.length){
            form.setFieldValue('bedNum', []);
          }
          break;
        default:
          console.log('进来了其他');
          break;
      }
      return;
    }
    form.setFieldValue(field.name, [list]);
  };

  const clearFieldValue = () => form.setFieldValue(field.name, []);

  return (
    <View style={styles.selectItemArea}>
      <Text style={styles.showLittleTitleText}>{label}：</Text>
      <View style={styles.touchArea}>
        <TouchableOpacity
          style={styles.selectArea}
          onPress={selectOnPress}>
          <Text
            style={[styles.selectText, !field.value.length && styles.noItem]}
            ellipsizeMode="tail"
            numberOfLines={1}>
            {!!field.value.length ? field.value[0].label : `请选择${label}`}
          </Text>
          {loading ? <ActivityIndicator color="#409EFF" size={28} /> : <>
            {!field.value.length && <AntDesign name='down' size={36} color='#999999'/>}
          </>}
        </TouchableOpacity>
        {!!field.value.length && <TouchableOpacity style={styles.clearIconArea} onPress={clearFieldValue}>
          <AntDesign name='closecircle' size={32} style={styles.clearIcon} color='#999999'/>
        </TouchableOpacity>}
      </View>
    </View>
  )
};

const styles = StyleSheet.create({
  selectItemArea: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  showLittleTitleText: {
    minWidth: 140,
    fontSize: 28,
    color: '#000',
    textAlignVertical: 'center'
  },
  touchArea: {
    flex: 1,
    flexDirection: 'row',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#999999'
  },
  selectArea: {
    flex: 1,
    borderRadius: 6,
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingLeft: 20,
    paddingRight: 10
  },
  selectText: {
    flex: 1,
    color: 'black',
    fontSize: 28
  },
  noItem: {
    color: '#999999'
  },
  clearIconArea: {
    height: 60, 
    paddingHorizontal: 10,
    justifyContent: 'center', 
    alignItems: 'flex-end'
  },
  clearIcon: {
    width: 40, 
    height: 40, 
    textAlign: 'center', 
    textAlignVertical: 'center'
  }
})

export default SelectItemOfFilterMore;