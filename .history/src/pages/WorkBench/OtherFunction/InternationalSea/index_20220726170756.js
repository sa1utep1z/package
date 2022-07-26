import React from "react";
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const InternationalSea = () => {

  return (
    <ScrollView style={styles.screen}>
      <View style={{alignItems: 'center'}}>
        <Text style={{height: 40, borderBottomWidth: 1, borderColor: '#000000', width: '100%', textAlignVertical: 'center', paddingLeft: 10}}>姓名：</Text>
        <Text style={{height: 40, borderBottomWidth: 1, borderColor: '#000000', width: '100%', textAlignVertical: 'center', paddingLeft: 10}}>微信号：</Text>
        <Text style={{height: 40, borderBottomWidth: 1, borderColor: '#000000', width: '100%', textAlignVertical: 'center', paddingLeft: 10}}>手机号：</Text>
        <Text style={{height: 40, borderBottomWidth: 1, borderColor: '#000000', width: '100%', textAlignVertical: 'center', paddingLeft: 10}}>身份证号：</Text>
        <Text style={{height: 40, borderBottomWidth: 1, borderColor: '#000000', width: '100%', textAlignVertical: 'center', paddingLeft: 10}}>位置信息：</Text>
        <Text style={{height: 40, borderBottomWidth: 1, borderColor: '#000000', width: '100%', textAlignVertical: 'center', paddingLeft: 10}}>会员来源：</Text>
        <Text style={{height: 40, borderBottomWidth: 1, borderColor: '#000000', width: '100%', textAlignVertical: 'center', paddingLeft: 10}}>注册日期：</Text>
        <View style={{justifyContent: 'flex-end'}}>

        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1
  }
});

export default InternationalSea;