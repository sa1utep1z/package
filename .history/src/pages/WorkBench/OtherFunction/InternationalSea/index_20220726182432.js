import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import moment from "moment";

import InternationalSeaApi from "../../../../request/InternationalSeaApi";
import EmptyArea from "../../../../components/EmptyArea";

const InternationalSea = () => {
  const { isLoading, data = [], isError, error, refetch } = useQuery(['internationalSea'], InternationalSeaApi.InternationalSea);
  console.log('data', data);

  const receiveOnPress = async(item) => {
    console.log('item', item);
    try{
      const res = await InternationalSeaApi.Receive()
    }catch(err) {

    }
  };

  const refreshControl = (
    <RefreshControl
      refreshing={isLoading}
      progressBackgroundColor="rgba(0,0,0,0)"
      colors={['#409EFF', 'red', 'green', 'black']}
      progressViewOffset={50}
      onRefresh={refetch} 
    />
  );

  return (
    <ScrollView style={styles.screen} refreshControl={refreshControl}>
      {data?.data?.length ? data.data.map((item, index)=>{
        const day = moment(new Date(item.registerDate)).format('YYYY/MM/DD');
        const isLastIndex = data.data.length - 1 === index;
        return (
          <View style={[styles.itemArea, isLastIndex && {marginBottom: 20}]} key={index}>
            <View style={styles.textArea}>
              <View style={styles.titleArea}>
                <Text style={styles.text}>姓名：</Text>
              </View>
              <Text style={styles.text}>{item.name || '无'}</Text>
            </View>
            <View style={styles.textArea}>
              <View style={styles.titleArea}>
                <Text style={styles.text}>微信号：</Text>
              </View>
              <Text style={styles.text}>{item.weChatName || '无'}</Text>
            </View>
            <View style={styles.textArea}>
              <View style={styles.titleArea}>
                <Text style={styles.text}>手机号：</Text>
              </View>
              <Text style={styles.text}>{item.mobile}</Text>
            </View>
            <View style={styles.textArea}>
              <View style={styles.titleArea}>
                <Text style={styles.text}>身份证号：</Text>
              </View>
              <Text style={styles.text}>{item.idNo}</Text>
            </View>
            <View style={styles.textArea}>
              <View style={styles.titleArea}>
                <Text style={styles.text}>籍贯：</Text>
              </View>
              <Text style={styles.text}>{item.hometown || '无'}</Text>
            </View>
            <View style={styles.textArea}>
              <View style={styles.titleArea}>
                <Text style={styles.text}>位置信息：</Text>
              </View>
              <Text style={styles.text}>{item.location || '无'}</Text>
            </View>
            <View style={styles.textArea}>
              <View style={styles.titleArea}>
                <Text style={styles.text}>会员来源：</Text>
              </View>
              <Text style={styles.text}>{item.sourceType}</Text>
            </View>
            <View style={[styles.textArea, styles.lastItem]}>
              <View style={styles.leftArea}>
                <View style={styles.titleArea}>
                  <Text style={styles.text}>注册日期：</Text>
                </View>
                <Text style={styles.text}>{day}</Text>
              </View>
              <TouchableOpacity style={styles.pressBtn} onPress={() => receiveOnPress(item)}>
                <Text style={styles.btnText}>领取</Text>
              </TouchableOpacity>
            </View>
          </View>
        )
      }) : <EmptyArea />}
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
  textArea: {
    height: 40, 
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1, 
    borderColor: '#CCCCCC', 
    width: '100%', 
    paddingLeft: 10,
    color: '#000'
  },
  titleArea: {
    width: 80
  },
  text: {
    color: '#000'
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
  },
  lastItem: {
    borderBottomWidth: 0, 
    justifyContent: 'space-between'
  },
  leftArea: {
    flexDirection: 'row'
  }
});

export default InternationalSea;