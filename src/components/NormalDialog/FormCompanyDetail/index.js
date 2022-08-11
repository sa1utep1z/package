import React from 'react';
import {StyleSheet, View, ScrollView} from 'react-native';
import { Text, Dialog } from '@rneui/themed';
import { WebView } from 'react-native-webview';
import EmptyArea from '../../EmptyArea';
import moment from 'moment';

const FormCompanyDetail = ({
    message
  }) => {

  return (
    <View style={styles.msgArea}>
      <View style={{paddingLeft: 20, marginBottom: 20}}>
        <View style={styles.itemDateArea}>
          <Text>订单名称：</Text>
          <View style={styles.itemDate}>
            <Text>{message.orderName || '无'}</Text>
          </View>
        </View>
        <View style={styles.itemDateArea}>
          <Text>订单日期：</Text>
          <View style={styles.itemDate}>
            <Text>{moment(message.orderDate).format('YYYY-MM-DD') || '无'}</Text>
          </View>
        </View>
      </View>
      <ScrollView style={styles.message} showsVerticalScrollIndicator={false}>
        {message ? <Text style={{marginHorizontal: 10}}>{message.orderPolicyDetail ? String(message.orderPolicyDetail).replace(/<br\/>/g,"\n") : '无'}</Text> : <EmptyArea />}
      </ScrollView>
    </View>
  )
};

const styles = StyleSheet.create({
  msgArea: {
    maxHeight: 400
  },
  itemDateArea: {
    minHeight: 30, 
    flexDirection: 'row', 
    alignItems: 'center'
  },
  itemDate: {
    flexDirection: 'row', 
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(0,0,0,0.05)'
  },
  message: {
    paddingHorizontal: 8
  }
})

export default FormCompanyDetail;