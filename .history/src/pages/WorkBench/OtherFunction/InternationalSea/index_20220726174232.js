import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useQuery } from '@tanstack/react-query';

import InternationalSeaApi from "../../../../request/InternationalSeaApi";
import moment from "moment";

const InternationalSea = () => {
  const { isLoading, data = [], isError, error, refetch } = useQuery(['internationalSea'], InternationalSeaApi.InternationalSea);
  console.log('data', data);
  console.log('isError', isError);
  console.log('error', error);


  return (
    <ScrollView style={styles.screen}>
      {data?.data?.length && data.data.map((item, index)=>{
        const day = moment(new Date(item.registerDate)).format('YYYY/MM/DD');
        return (
          <View style={styles.itemArea}>
            <View style={styles.text}>
              <Text>姓名：</Text>
            </View>
            <View style={styles.text}>
              <Text>微信号：{item.weChatName || '无'}</Text>
            </View>
            <View style={styles.text}>
              <Text>手机号：{item.mobile}</Text>
            </View>
            <View style={styles.text}>
              <Text>手机号：{item.mobile}</Text>
            </View>
            <View style={styles.text}>
              <Text>位置信息：</Text>
            </View>
            <View style={styles.text}>
              <Text>会员来源：</Text>
            </View>
            <View style={[styles.text, {borderBottomWidth: 0}]}>
              <Text>注册日期：{day}</Text>
            </View>
            <View style={styles.pressArea}>
              <TouchableOpacity style={styles.pressBtn}>
                <Text style={styles.btnText}>领取</Text>
              </TouchableOpacity>
            </View>
          </View>
        )
      })}
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
    justifyContent: 'center',
    paddingLeft: 10,
    color: '#000'
  },
  pressArea: {
    height: 30, 
    alignSelf: 'flex-end'
  },
  pressBtn: {
    marginRight: 10, 
    paddingHorizontal: 10, 
    paddingVertical: 2, 
    borderRadius: 3, 
    backgroundColor: '#409EFF'
  },
  btnText: {
    color: '#fff', 
    textAlign: 'center'
  }
});

export default InternationalSea;