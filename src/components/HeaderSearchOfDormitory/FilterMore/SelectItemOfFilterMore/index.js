import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { StyleSheet, View, TouchableOpacity, FlatList, ActivityIndicator, Touchable } from 'react-native';
import { Text, Dialog, CheckBox } from '@rneui/themed';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useToast } from "react-native-toast-notifications";
import { useDispatch } from 'react-redux';

import TopSearchApi from '../../../../request/Dormitory/TopSearchApi';
import * as PageDialog1 from '../../../../redux/features/PageDialog';
import * as PageDialog2 from '../../../../redux/features/PageDialog2'; 
import { SUCCESS_CODE } from '../../../../utils/const';
import SingleSelectList from '../../../PageDialog2/SingleSelectList';

const SelectItemOfFilterMore = ({
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
  originForm
}) => {
  const dispatch = useDispatch();
  const toast = useToast();

  const [loading, setLoading] = useState(false);

  const selectOnPress = () => {
    setLoading(true);
    dispatch(PageDialog2.setTitle(`请选择${label}`));
    switch(type){
      case 'floor':
        getFloorList();
        break;
      case 'room':
        getRoomList();
        break;
      case 'bed':
        getBedList();
        break;
      default: //没传入type则自动使用外部传进的selectList。
        setNormalList();
        break;
    }
  };

  const getFloorList = async() => {
    try {
      const {values: {buildingNum}} = originForm;
      if(!buildingNum.length){
        toast.show(`请先选择宿舍楼栋！`, { type: 'danger' });
        return;
      }
      const res = await TopSearchApi.getFloorList(buildingNum[0].value);
      if(res.code !== SUCCESS_CODE){
        toast.show(`获取楼层列表失败，${res.msg}`, { type: 'danger' });
        return;
      }
      res.data.length && res.data.forEach(item => item.label = `${item.label}F`);
      dispatch(PageDialog2.openDialog(<SingleSelectList isDialog2 canSearch={false} selectList={res.data} fieldValue={field.value} confirm={pressItem}/>));
    }catch(error){
      console.log('getFloorList->error', error);
    }finally{
      setLoading(false);
    }
  };

  const getRoomList = async() => {
    try {
      const {values: {floorNum}} = form;
      if(!floorNum.length){
        toast.show(`请先选择宿舍楼层！`, { type: 'danger' });
        return;
      }
      const res = await TopSearchApi.getRoomList(floorNum[0].value);
      if(res.code !== SUCCESS_CODE){
        toast.show(`获取房间列表失败，${res.msg}`, { type: 'danger' });
        return;
      }
      res.data.length && res.data.forEach(item => item.label = `${item.label}房`);
      dispatch(PageDialog2.openDialog(<SingleSelectList isDialog2 canSearch={false} selectList={res.data} fieldValue={field.value} confirm={pressItem}/>));
    }catch(error){
      console.log('getRoomList->error', error);
    }finally{
      setLoading(false);
    }
  };

  const getBedList = async() => {
    try {
      const {values: {roomNum}} = form;
      if(!roomNum.length){
        toast.show(`请先选择宿舍房间！`, { type: 'danger' });
        return;
      }
      const res = await TopSearchApi.getBedList(roomNum[0].value);
      if(res.code !== SUCCESS_CODE){
        toast.show(`获取床位列表失败，${res.msg}`, { type: 'danger' });
        return;
      }
      res.data.length && res.data.forEach(item => item.label = `${item.label}床`);
      dispatch(PageDialog2.openDialog(<SingleSelectList isDialog2 canSearch={false} selectList={res.data} fieldValue={field.value} confirm={pressItem}/>));
    }catch(error){
      console.log('getBedList->error', error);
    }finally{
      setLoading(false);
    }
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

export default SelectItemOfFilterMore;