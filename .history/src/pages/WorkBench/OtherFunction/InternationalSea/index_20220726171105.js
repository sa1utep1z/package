import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

const InternationalSea = () => {

  return (
    <ScrollView style={styles.screen}>
      <View style={{alignItems: 'center', backgroundColor: '#fff', marginHorizontal: 10, marginBottom: 10, borderRadius: 8}}>
        <Text style={{height: 40, borderBottomWidth: 1, borderColor: '#CCCCCC', width: '100%', textAlignVertical: 'center', paddingLeft: 10}}>姓名：</Text>
        <Text style={{height: 40, borderBottomWidth: 1, borderColor: '#CCCCCC', width: '100%', textAlignVertical: 'center', paddingLeft: 10}}>微信号：</Text>
        <Text style={{height: 40, borderBottomWidth: 1, borderColor: '#CCCCCC', width: '100%', textAlignVertical: 'center', paddingLeft: 10}}>手机号：</Text>
        <Text style={{height: 40, borderBottomWidth: 1, borderColor: '#CCCCCC', width: '100%', textAlignVertical: 'center', paddingLeft: 10}}>身份证号：</Text>
        <Text style={{height: 40, borderBottomWidth: 1, borderColor: '#CCCCCC', width: '100%', textAlignVertical: 'center', paddingLeft: 10}}>位置信息：</Text>
        <Text style={{height: 40, borderBottomWidth: 1, borderColor: '#CCCCCC', width: '100%', textAlignVertical: 'center', paddingLeft: 10}}>会员来源：</Text>
        <Text style={{height: 40, width: '100%', textAlignVertical: 'center', paddingLeft: 10}}>注册日期：</Text>
        <View style={{justifyContent: 'flex-end', height: 30}}>
          <TouchableOpacity>
            <Text>领取</Text>
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
  }
});

export default InternationalSea;