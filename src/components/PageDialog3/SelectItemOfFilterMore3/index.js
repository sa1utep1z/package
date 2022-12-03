import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { StyleSheet, View, TouchableOpacity, FlatList, ActivityIndicator, Touchable } from 'react-native';
import { Text, Dialog, CheckBox } from '@rneui/themed';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useToast } from "react-native-toast-notifications";
import { useDispatch } from 'react-redux';

import TopSearchApi from '../../../request/Dormitory/TopSearchApi';
import * as PageDialog1 from '../../../redux/features/PageDialog';
import * as PageDialog2 from '../../../redux/features/PageDialog2'; 
import * as PageDialog3 from '../../../redux/features/PageDialog3'; 
import { SUCCESS_CODE } from '../../../utils/const';
import SingleSelectList from '../../PageDialog2/SingleSelectList';

const SelectItemOfFilterMore3 = ({
  field,
  form,
  label,
  showLabel = true,
  canDelete = true,
  showArrow = true,
  fontSize = 28,
  iconSize = 32,
  borderColor,
  selectStyle,
  type,
  originForm,
  selectList = [], //type没传的话就是传自定义数组
}) => {
  const dispatch = useDispatch();
  const toast = useToast();

  const [loading, setLoading] = useState(false);

  const selectOnPress = () => {
    setLoading(true);
    dispatch(PageDialog3.setTitle(`请选择${label}`));
    switch(type){
      default: //没传入type则自动使用外部传进的selectList。
        setOtherList();
        break;
    }
  };

  const setOtherList = async() => {
    dispatch(PageDialog3.openDialog(<SingleSelectList isDialog3 canSearch={false} selectList={selectList} fieldValue={field.value} confirm={pressItem}/>));
    setLoading(false);
  };

  const pressItem = (list) => {
    //点击选择的时候已经是有值的；
    if(form.values[field.name].length){
      //选择的项和之前的表单值不一样-更新表单值；
      if(list.value === form.values[field.name][0].value) return;
      form.setFieldValue(field.name, [list]);
      switch(field.name){
        case 'buildingNum':
          if(form.values.floorNum.length){
            form.setFieldValue('floorNum', []);
          }
          if(form.values.roomNum.length){
            form.setFieldValue('roomNum', []);
          }
          if(form.values.bedNum.length){
            form.setFieldValue('bedNum', []);
          }
          break;
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

  const clearFieldValue = () => {
    form.setFieldValue(field.name, []);
    if(type === 'floor'){
      form.setFieldValue('roomNum', []);
      form.setFieldValue('bedNum', []);
    }else if(type === 'room'){
      form.setFieldValue('bedNum', []);
    }
  }

  return (
    <View style={styles.selectItemArea}>
      {showLabel && <Text style={styles.showLittleTitleText}>{label}：</Text>}
      <View style={[styles.touchArea, borderColor && {borderColor}]}>
        <TouchableOpacity
          style={[styles.selectArea, selectStyle]}
          onPress={selectOnPress}>
          <Text
            style={[styles.selectText, !field.value.length && styles.noItem, fontSize && {fontSize}]}
            ellipsizeMode="tail"
            numberOfLines={1}>
            {!!field.value.length ? field.value[0].label : `请选择${label}`}
          </Text>
          {loading ? <ActivityIndicator color="#409EFF" size={iconSize} /> : <>
            {showArrow && !field.value.length && <AntDesign name='down' size={iconSize} color='#999999'/>}
          </>}
        </TouchableOpacity>
        {canDelete && !!field.value.length && <TouchableOpacity style={styles.clearIconArea} onPress={clearFieldValue}>
          <AntDesign name='closecircle' size={iconSize} style={styles.clearIcon} color='#999999'/>
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
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#999999'
  },
  selectArea: {
    flex: 1,
    borderRadius: 4,
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

export default SelectItemOfFilterMore3;