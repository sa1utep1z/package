import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useQuery } from '@tanstack/react-query';

import InternationalSeaApi from "../../../../request/InternationalSeaApi";

const InternationalSea = () => {
  const { isLoading, data, isError, error, refetch } = useQuery(['internationalSea'], InternationalSeaApi.InternationalSea);
  console.log('data', data);
  console.log('isError', isError);
  console.log('error', error);


  return (
    <ScrollView style={styles.screen}>
      <View style={styles.itemArea}>
        <Text style={styles.text}>姓名：</Text>
        <Text style={styles.text}>微信号：</Text>
        <Text style={styles.text}>手机号：</Text>
        <Text style={styles.text}>身份证号：</Text>
        <Text style={styles.text}>位置信息：</Text>
        <Text style={styles.text}>会员来源：</Text>
        <Text style={[styles.text, {borderBottomWidth: 0}]}>注册日期：</Text>
        <View style={{height: 30, alignSelf: 'flex-end'}}>
          <TouchableOpacity style={{marginRight: 10, paddingHorizontal: 10, paddingVertical: 2, borderRadius: 3, backgroundColor: '#409EFF'}}>
            <Text style={{color: '#fff', textAlign: 'center'}}>领取</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingTop: 10
  },
  itemArea: {
    alignItems: 'center', 
    backgroundColor: '#fff', 
    marginHorizontal: 10, 
    marginBottom: 10, 
    borderRadius: 8
  },
  text: {
    height: 40, 
    borderBottomWidth: 1, 
    borderColor: '#CCCCCC', 
    width: '100%', 
    textAlignVertical: 'center', 
    paddingLeft: 10,
    color: '#000'
  },
});

export default InternationalSea;