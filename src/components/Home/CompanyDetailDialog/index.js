import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native';
import { Text, Dialog } from '@rneui/themed';
import { useSelector } from 'react-redux';

import { WATERMARK_LIST_SMALL } from '../../../utils/const';

const CompanyDetailDialog = ({
  message = {},
  transferFactory
}, ref) => {
  const memberInfo = useSelector(state => state.MemberInfo.memberInfo);

  const [showDetail, setShowDetail] = useState(false);

  useImperativeHandle(ref, () => {
    return { setShowDetail, showDetail };
  }, []);

  const date = String(message.recruitRange).substring(5, 11);
  const date2 = String(message.recruitRange).substring(16, 21);
  const recruitRange = date + date2;

  return (
    <Dialog
      animationType="fade"
      isVisible={showDetail}
      overlayStyle={styles.dialogStyle}
      onBackdropPress={() => setShowDetail(!showDetail)}>
      <View style={styles.msgArea}>
        <Text style={styles.title}>岗位信息</Text>
        {transferFactory && <Text style={styles.listText} onPress={transferFactory}>转厂/转单</Text>}
        <View style={styles.topArea}>
          <View style={styles.itemDateArea}>
            <Text>订单日期：</Text>
            <View style={styles.itemDate}>
              <Text style={{ color: '#444444' }}>{recruitRange}</Text>
            </View>
          </View>
          <View style={styles.itemDateArea}>
            <Text>订单名称：</Text>
            <View style={styles.itemDate}>
              <Text style={{ color: '#444444' }}>{message.orderName}</Text>
            </View>
          </View>
          <ScrollView style={styles.message} showsVerticalScrollIndicator={false}>
            <Text style={styles.fontStyle}>{message.orderTextDetail || '无'}</Text>
            {/* <Text style={styles.fontStyle}>{message.orderPolicyDetail ? String(message.orderPolicyDetail).replace(/<br\/>/g, "\n") : '无'}</Text> */}
          </ScrollView>
          <View style={{ paddingHorizontal: 30, paddingBottom: 30, right: 0, height: '100%', width: '100%', position: 'absolute', flexDirection: 'row', flexWrap: 'wrap', overflow: 'hidden' }} pointerEvents={'none'}>
            {WATERMARK_LIST_SMALL.map((item, itemIndex) => {
              return (
                <View key={itemIndex} style={[{ width: '25%', height: 100, transform: [{ rotateZ: '-15deg' }], justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0)' }, { opacity: item }]}>
                  <Text style={{ color: 'rgba(0,0,0,0.15)', fontSize: 10 }}>{memberInfo.store}</Text>
                  <Text style={{ color: 'rgba(0,0,0,0.15)', fontSize: 10 }}>{memberInfo.name}</Text>
                </View>
              )
            })}
          </View>
        </View>
        <TouchableOpacity style={styles.bottomBtn} onPress={() => setShowDetail(!showDetail)}>
          <Text style={styles.btnText}>确定</Text>
        </TouchableOpacity>
      </View>
    </Dialog>
  )
};

const styles = StyleSheet.create({
  dialogStyle: {
    padding: 20,
    borderRadius: 6,
    width: '80%'
  },
  msgArea: {
    height: 450,
    alignItems: 'center'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  topArea: {
    flex: 1,
    width: '100%',
    paddingTop: 5
  },
  itemDateArea: {
    height: 30,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },
  itemDate: {
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderBottomWidth: 2,
    borderColor: 'rgba(0,0,0,.05)'
  },
  message: {
    flex: 1,
    marginBottom: 15,
    marginTop: 5,
    color: '#444444',
    fontSize: 14,
  },
  bottomBtn: {
    height: 40,
    width: '100%',
    backgroundColor: '#409EFF',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  btnText: {
    fontSize: 20,
    color: '#fff',
    letterSpacing: 10,
  },
  listText: {
    position: 'absolute',
    right: 0,
    fontSize: 13,
    color: '#409EFF'
  }
})

export default forwardRef(CompanyDetailDialog);