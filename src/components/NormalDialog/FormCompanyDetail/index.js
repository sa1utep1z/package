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
      <View style={{alignItems: 'center'}}>
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
      <ScrollView style={styles.message}>
        {message ? <WebView scalesPageToFit={false} style={{height: 300}} source={{ html: message.orderPolicyDetail }}/> : <EmptyArea />}
      </ScrollView>
    </View>
  )
};

const styles = StyleSheet.create({
  msgArea: {
    maxHeight: 400
  },
  itemDateArea: {
    height: 30, 
    flexDirection: 'row', 
    alignItems: 'center'
  },
  itemDate: {
    flexDirection: 'row', 
    alignItems: 'center'
  },
  message: {
    paddingHorizontal: 8
  }
})

export default FormCompanyDetail;