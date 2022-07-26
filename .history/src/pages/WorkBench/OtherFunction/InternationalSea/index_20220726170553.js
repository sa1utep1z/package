import React from "react";
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const InternationalSea = () => {

  return (
    <ScrollView style={styles.screen}>
      <View style={{alignItems: 'center'}}>
        <Text style={{height: 40, borderWidth: 1, width: '100%', textAlignVertical: 'center'}}>姓名：</Text>
        <Text style={{height: 40, borderWidth: 1, width: '100%', textAlignVertical: 'center'}}>微信号：</Text>
        <Text style={{height: 40, borderWidth: 1, width: '100%', textAlignVertical: 'center'}}>手机号：</Text>
        <Text style={{height: 40, borderWidth: 1, width: '100%', textAlignVertical: 'center'}}>身份证号：</Text>
        <Text style={{height: 40, borderWidth: 1, width: '100%', textAlignVertical: 'center'}}>位置信息：</Text>
        <Text style={{height: 40, borderWidth: 1, width: '100%', textAlignVertical: 'center'}}>会员来源：</Text>
        <Text style={{height: 40, borderWidth: 1, width: '100%', textAlignVertical: 'center'}}>注册日期：</Text>
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