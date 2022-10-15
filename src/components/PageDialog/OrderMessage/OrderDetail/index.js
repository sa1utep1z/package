import React from "react";
import { ScrollView, Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { useSelector, useDispatch } from "react-redux";

import { WATERMARK_LIST_SMALL } from '../../../../utils/const';
import { closeDialog, setRightArea } from "../../../../redux/features/PageDialog";

const OrderDetail = ({
  orderData
}) => {
  const dispatch = useDispatch();

  const memberInfo = useSelector(state => state.MemberInfo.memberInfo);

  const confirm = () => {
    dispatch(closeDialog());
    dispatch(setRightArea({
      title: '',
      press: () => {}
    }));
  };

  return (
    <>
      <View style={{height: 120, justifyContent: 'space-around', marginBottom: 30, paddingHorizontal: 40}}>
        <Text style={styles.contentText}>订单日期：<Text style={{textDecorationLine: 'underline', textDecorationColor: '#FEFEFE'}}>{orderData.recruitRange}</Text></Text>
        <Text style={styles.contentText}>订单名称：<Text style={{textDecorationLine: 'underline', textDecorationColor: '#FEFEFE'}}>{orderData.orderName}</Text></Text>
      </View>
      <ScrollView style={styles.scrollArea} showsHorizontalScrollIndicator={false}>
        <Text style={styles.contentText}>{orderData.orderTextDetail}</Text>
      </ScrollView>
      <View style={{ paddingHorizontal: 30, paddingBottom: 30, right: 0, height: '100%', width: '100%', position: 'absolute', flexDirection: 'row', flexWrap: 'wrap', overflow: 'hidden', paddingTop: 100}} pointerEvents={'none'}>
        {WATERMARK_LIST_SMALL.map((item, itemIndex) => {
          return (
            <View key={itemIndex} style={[{ width: '25%', height: 200, transform: [{ rotateZ: '-15deg' }], justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0)' }, { opacity: item }]}>
              <Text style={{ color: 'rgba(0,0,0,0.15)', fontSize: 22 }}>{memberInfo.store}</Text>
              <Text style={{ color: 'rgba(0,0,0,0.15)', fontSize: 22 }}>{memberInfo.name}</Text>
            </View>
          )
        })}
      </View>
      <View style={styles.bottomArea}>
        <TouchableOpacity style={styles.bottomBtn} onPress={confirm}>
          <Text style={styles.confirm}>确 定</Text>
        </TouchableOpacity>
      </View>
    </>
  )
};

const styles = StyleSheet.create({
  scrollArea: {
    paddingHorizontal: 40
  },
  contentText: {
    fontSize: 28, 
    color: '#333333'
  },
  bottomArea: {
    height: 120, 
    padding: 20
  },
  bottomBtn: {
    flex: 1, 
    backgroundColor: '#409EFF', 
    borderRadius: 12, 
    justifyContent: 'center'
  },
  confirm: {
    fontSize: 32, 
    textAlign: 'center', 
    color: '#FFFFFF'
  }
})

export default OrderDetail;