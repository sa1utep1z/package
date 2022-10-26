import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { StyleSheet, View, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { Text, Dialog, CheckBox } from '@rneui/themed';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useDispatch } from 'react-redux';

import SearchInput from '../../../SearchInput';
import EmptyArea from '../../../EmptyArea';
import { deepCopy } from '../../../../utils';
import { openDialog, setTitle, setLeftArea } from '../../../../redux/features/PageDialog'; 
import MyMembersApi from '../../../../request/MyMembersApi';
import SingleSelectOfFilterMore from '../SingleSelectOfFilterMore';
import { SUCCESS_CODE } from '../../../../utils/const';

const SelectItemOfFilterMore = ({
  field,
  form,
  label,
  originForm
}) => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  const selectOnPress = () => {
    setLoading(true);
    console.log('执行了？')
    setNormalList();
  };

  const confirm = (list) => {
    form.setFieldValue(field.name, list);
  };

  const setNormalList = async() => {
    try {
      let arr = [];
      for(let i = 0; i < 30; i++){
        arr.push({label: `楼层${i+1}`});
      }
      dispatch(openDialog(<SingleSelectOfFilterMore selectList={arr} originForm={originForm} canSearch  fieldValue={field.value} confirm={confirm}/>));
      dispatch(setTitle(`请选择${label}`));
      dispatch(setLeftArea({
        title: '返回',
        press: () => {console.log('点击了返回')}
      }));
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
    borderRadius: 6,
    borderWidth: 1,
    borderColor: ''
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

export default SelectItemOfFilterMore;