import React from "react";
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const InternationalSea = () => {

  return (
    <ScrollView style={styles.screen}>
      <View style={{alignItems: 'center'}}>
        <Text>姓名：</Text>
        <Text>微信号：</Text>
        <Text>手机号：</Text>
        <Text>身份证号：</Text>
        <Text>位置信息：</Text>
        <Text>会员来源：</Text>
        <Text>注册日期：</Text>
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