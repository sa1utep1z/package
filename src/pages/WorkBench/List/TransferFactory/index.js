import React, {useState, useEffect} from 'react';
import {StyleSheet, View, TouchableOpacity, ScrollView} from 'react-native';
import { Text, Dialog } from '@rneui/themed';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';

import SearchInput from '../../../../components/SearchInput';
import SelectList from '../../../../components/SelectList';
import { deepCopy } from '../../../../utils';

const TransferFactory = (props) => {
  const {route: params} = props;
  const navigation = useNavigation();

  let arr = [];
  for(let i = 0; i < 50; i++ ){
    arr.push({
      title: `厂${i+1}`,
      id: `${i+1}`,
      index: `${i+1}`
    })
  }

  useEffect(()=>{
    console.log('params', params);
    if(params?.params?.pageTitle){
      navigation.setOptions({
        headerTitle: params?.params?.pageTitle
      })
    }
  },[])

  const [listArr, setListArr] = useState(params?.params?.list || arr);

  const filterFactory = (value) => {
    let newArr = deepCopy(params?.params?.list);
    const filterArr = newArr.filter(item => item.label.includes(value));
    setListArr(filterArr);
    console.log('newArr,',newArr)
  }

  const selectList = (list) => {
    if(params?.params?.confirm){
      params?.params?.confirm(list);
    }
  };

  return (
    <View style={{flex: 1, alignItems: 'center', paddingTop: 10}}>
      <SearchInput 
        placeholder='请输入工厂名称'
        autoSearch={filterFactory}
        searchPress={filterFactory}
      />
      <SelectList data={listArr} confirm={selectList} canMultiChoice={false} bottomButton />
    </View>
  )
};

const styles = StyleSheet.create({

})

export default TransferFactory;