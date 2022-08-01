import React from 'react';
import {StyleSheet, View, ScrollView} from 'react-native';
import { Text, Dialog } from '@rneui/themed';

const msg = "这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容";

const CompanyDetail = ({
    message = msg
  }) => {

  return (
    <View style={styles.msgArea}>
      <>
        <View style={styles.itemDateArea}>
          <Text>订单名称：</Text>
          <View style={styles.itemDate}>
            <Text style={{color: '#999999', borderBottomWidth: 1, borderColor: '#999999'}}>哇哈哈</Text>
          </View>
        </View>
        <View style={styles.itemDateArea}>
          <Text>订单日期：</Text>
          <View style={styles.itemDate}>
            <Text style={{color: '#999999', borderBottomWidth: 1, borderColor: '#999999'}}>2022-04-09</Text>
          </View>
        </View>
      </>
      <ScrollView style={styles.message}>
        <Text>{message}</Text>
      </ScrollView>
    </View>
  )
};

const styles = StyleSheet.create({
  msgArea: {
    maxHeight: 400,
    alignItems: 'center'
  },
  itemDateArea: {
    height: 30, 
    flexDirection: 'row', 
    alignItems: 'center'
  },
  itemDate: {
    height: '100%',
    flexDirection: 'row', 
    alignItems: 'center'
  },
  message: {
    margin: 10,
    marginBottom: 0,
    paddingHorizontal: 8,
    paddingBottom: 10
  }
})

export default CompanyDetail;