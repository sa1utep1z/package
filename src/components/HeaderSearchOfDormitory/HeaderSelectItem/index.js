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
import SingleSelectList from '../../PageDialog/SingleSelectList';
import { SUCCESS_CODE } from '../../../utils/const';

const HeaderSelectItem = ({
  field,
  form,
  originList,
  type = '',
  label
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

  const confirm = (list) => {
    form.setFieldValue(field.name, list);
  };

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
        arr.push({label: `楼栋${i+1}`});
      }
      dispatch(openDialog(<SingleSelectList canSearch selectList={arr} fieldValue={field.value} confirm={confirm}/>));
    }catch(error){
      console.log('setNormalList->error', error);
    }finally{
      setLoading(false);
    }
  };

  return (
    <View style={styles.selectItemArea}>
      <Text style={styles.showLittleTitleText}>{label}：</Text>
      <TouchableOpacity
        style={styles.selectArea}
        onPress={selectOnPress}>
        <Text
          style={[styles.selectText, !field.value.length && styles.noItem]}
          ellipsizeMode="tail"
          numberOfLines={1}>
          {`请选择${label}`}
        </Text>
        {loading ? <ActivityIndicator color="#409EFF" size={28} /> : <AntDesign
          name='down'
          size={36}
          color={!!field?.value?.length ? '#000000' : '#999999'}
        />}
      </TouchableOpacity>
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
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingLeft: 20,
    paddingRight: 10,
    borderRadius: 10
  },
  selectText: {
    flex: 1,
    color: 'black',
    fontSize: 28
  },
  noItem: {
    color: '#999999'
  }
})

export default HeaderSelectItem;