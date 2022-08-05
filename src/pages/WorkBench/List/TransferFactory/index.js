import React, {useState, useEffect} from 'react';
import {StyleSheet, View, TouchableOpacity, ScrollView} from 'react-native';
import { Text, Dialog } from '@rneui/themed';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useToast } from 'react-native-toast-notifications';

import SearchInput from '../../../../components/SearchInput';
import SelectList from '../../../../components/SelectList';
import { deepCopy } from '../../../../utils';
import ListApi from '../../../../request/ListApi';
import { SUCCESS_CODE } from '../../../../utils/const';

const TransferFactory = (props) => {
  const {route: {params}} = props;
  const toast = useToast();

  const [listArr, setListArr] = useState([]);

  useEffect(()=>{
    getFactoryList();
  },[])

  const getFactoryList = async() => {
    const flowId = params?.item?.flowId;
    const par = {
      pageNumber: 0,
      pageSize: 20,
      flowId
    };
    try{  
      const res = await ListApi.FactoryList(par);
      if(res?.code !== SUCCESS_CODE){
        toast.show(`请求失败，请稍后重试。${res?.msg}`, {type: 'danger'});
        return;
      }
      setListArr(res?.data?.content);
    }catch(err){
      console.log('err', err);
      toast.show(`出现了意料之外的问题，请联系系统管理员处理`, { type: 'danger' });
    }
  }

  const filterFactory = (value) => {
    let newArr = deepCopy(arr);
    const filterArr = newArr.filter(item => item.title.includes(value));
    setListArr(filterArr);
  }

  const selectFactory = async(values) => {
    try{
      const res = await ListApi.FactoryList(par);
      console.log('res', res);
    }catch(err){
      toast.show(`出现了意料之外的问题，请联系系统管理员处理`, { type: 'danger' });
    }
  }

  return (
    <View style={{flex: 1, alignItems: 'center', paddingTop: 32}}>
      <SearchInput 
        placeholder='请输入工厂名称'
        autoSearch={filterFactory}
        searchPress={filterFactory}
      />
      <SelectList data={listArr} confirm={selectFactory} canMultiChoice={false} bottomButton />
    </View>
  )
};

const styles = StyleSheet.create({

})

export default TransferFactory;