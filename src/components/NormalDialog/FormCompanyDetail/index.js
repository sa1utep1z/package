import React from 'react';
import {StyleSheet, View, ScrollView} from 'react-native';
import { Text } from '@rneui/themed';
import moment from 'moment';
import { useSelector } from 'react-redux';

import EmptyArea from '../../EmptyArea';
import { WATERMARK_LIST_SMALL } from '../../../utils/const';

const FormCompanyDetail = ({
    message
  }) => {
  const memberInfo = useSelector(state => state.MemberInfo.memberInfo);

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
      <View style={{paddingHorizontal: 30, paddingBottom: 30, right: 0, height: '100%', width: '100%', position: 'absolute', flexDirection: 'row', flexWrap: 'wrap', overflow: 'hidden'}} pointerEvents={'none'}>
        {WATERMARK_LIST_SMALL.map((item, itemIndex) => {
          return (
            <View key={itemIndex} style={[{width: '25%', height: 100, transform: [{ rotateZ: '-15deg' }], justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0)'}, {opacity: item} ]}>
              <Text style={{ color: 'rgba(0,0,0,0.15)', fontSize: 10 }}>{memberInfo.store}</Text>
              <Text style={{ color: 'rgba(0,0,0,0.15)', fontSize: 10 }}>{memberInfo.name}</Text>
            </View>
          )
        })}
      </View>
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