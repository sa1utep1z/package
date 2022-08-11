import React, {useState, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useToast } from 'react-native-toast-notifications';

import SearchInput from '../../../../components/SearchInput';
import SelectList from '../../../../components/SelectList';
import ListApi from '../../../../request/ListApi';
import { SUCCESS_CODE } from '../../../../utils/const';

const TransferFactory = (props) => {
  const {route: {params}} = props;
  const toast = useToast();
  const navigation = useNavigation();

  const [listArr, setListArr] = useState([]);

  useEffect(()=>{
    getFactoryList();
  },[])

  const getFactoryList = async(search = '') => {
    const flowId = params?.item?.flowId;
    const par = {
      name: search,
      pageNumber: 0,
      pageSize: 50,
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

  const filterFactory = (value) => getFactoryList(value);

  const selectFactory = async(select) => {
    const flowId = params?.item?.flowId;
    const toOrderId = select[0].value;
    try{
      const res = await ListApi.TransferFactory(flowId, toOrderId);
      console.log('res', res);
      if(res?.code !== SUCCESS_CODE){
        toast.show(`请求失败，${res?.msg}`, {type: 'danger'});
        return;
      }
      toast.show(`转单成功！`, {type: 'success'});
      navigation.goBack();
      params.refresh && params.refresh();
    }catch(err){
      toast.show(`出现了意料之外的问题，请联系系统管理员处理`, { type: 'danger' });
    }
  };

  return (
    <View style={{flex: 1, alignItems: 'center', paddingTop: 32}}>
      <SearchInput 
        placeholder='请输入工厂名称'
        searchPress={filterFactory}
      />
      <SelectList 
        data={listArr} 
        confirm={selectFactory} 
        canMultiChoice={false} 
        bottomButton 
      />
    </View>
  )
};

const styles = StyleSheet.create({

})

export default TransferFactory;