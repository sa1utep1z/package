import React, {useState, useEffect} from 'react';
import {StyleSheet, View, TouchableOpacity, ScrollView} from 'react-native';
import { Text, Dialog } from '@rneui/themed';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';

import SearchInput from '../../../../components/SearchInput';
import SelectList from '../../../../components/SelectList';
import { deepCopy } from '../../../../utils';

const TransferFactory = () => {
  let arr = [];
  for(let i = 0; i < 50; i++ ){
    arr.push({
      title: `厂${i+1}`,
      id: `${i+1}`,
      index: `${i+1}`
    })
  }

  const [listArr, setListArr] = useState(arr);

  const filterFactory = (value) => {
    let newArr = deepCopy(arr);
    const filterArr = newArr.filter(item => item.title.includes(value));
    setListArr(filterArr);
  }

  const selectList = (list) => {
    console.log('list', list);
  }

  return (
    <View style={{flex: 1, alignItems: 'center', paddingTop: 10}}>
      <SearchInput 
        placeholder='请输入工厂名称'
        autoSearch={filterFactory}
        searchPress={filterFactory}
      />
      <SelectList data={listArr} confirm={selectList} bottomButton />
    </View>
  )
};

const styles = StyleSheet.create({

})

export default TransferFactory;