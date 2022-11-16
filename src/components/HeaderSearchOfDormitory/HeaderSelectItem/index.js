import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { StyleSheet, View, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { Text, Dialog, CheckBox } from '@rneui/themed';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useDispatch } from 'react-redux';

import SearchInput from '../../SearchInput';
import EmptyArea from '../../EmptyArea';
import { deepCopy } from '../../../utils';
import { openDialog, setTitle } from '../../../redux/features/PageDialog'; 
import MyMembersApi from '../../../request/MyMembersApi';
import SingleSelectList from '../../PageDialog2/SingleSelectList';
import { SUCCESS_CODE } from '../../../utils/const';

const HeaderSelectItem = ({
  field,
  form,
  type = '',
  label,
  canSearch = true,
  otherLabelStyle,
}) => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  const selectOnPress = () => {
    setLoading(true);
    dispatch(setTitle(`请选择${label}`));
    switch(type){
      case 'enterprise':
        getEnterpriseList();
        break;
      default: //没传入type则自动使用外部传进的selectList。
        setNormalList();
        break;
    }
  };

  const confirm = (list) => form.setFieldValue(field.name, list);

  const getEnterpriseList = async() => {
    try {
      const res = await MyMembersApi.CompaniesList();
      if(res.code !== SUCCESS_CODE){
        toast.show(`获取企业列表失败，${res.msg}`, { type: 'danger' });
        return;
      }
      dispatch(openDialog(<SingleSelectList canSearch selectList={res.data} fieldValue={field.value} confirm={confirm}/>));
    }catch(error){
      console.log('getEnterpriseList->error', error);
    }finally{
      setLoading(false);
    }
  };

  const setNormalList = async() => {
    try {
      let arr = [];
      for(let i = 0; i < 30; i++){
        arr.push({label: `楼栋${i+1}`, value: `${label}-${i+1}`});
      }
      dispatch(openDialog(<SingleSelectList canSearch={canSearch} selectList={arr} fieldValue={field.value} confirm={confirm}/>));
    }catch(error){
      console.log('setNormalList->error', error);
    }finally{
      setLoading(false);
    }
  };

  const clearFieldValue = () => form.setFieldValue(field.name, []);

  return (
    <View style={styles.selectItemArea}>
      <Text style={[styles.showLittleTitleText, otherLabelStyle]}>{label}：</Text>
      <View style={{flex: 1, flexDirection: 'row', backgroundColor: '#ffffff', borderRadius: 10}}>
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
    fontSize: 28,
    color: '#000'
  },
  selectArea: {
    flex: 1,
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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

export default HeaderSelectItem;