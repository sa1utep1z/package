import React from "react";
import { ScrollView, Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { useDispatch } from "react-redux";

import WaterMark from '../../../WaterMark';
import { closeDialog, setRightArea } from "../../../../redux/features/PageDialog";

const OrderDetail = ({
  orderData
}) => {
  const dispatch = useDispatch();

  const confirm = () => {
    dispatch(closeDialog());
    dispatch(setRightArea({
      title: '',
      press: () => {}
    }));
  };

  return (
    <>
      <View style={styles.totalArea}>
        <Text style={styles.contentText}>订单日期：<Text style={styles.dateText}>{orderData.recruitRange}</Text></Text>
        <View style={{flexDirection: 'row'}}>
          <Text style={styles.contentText}>订单名称：</Text>
          <Text style={styles.orderName}>{orderData.orderName}</Text>
        </View>
      </View>
      <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
        <Text style={styles.contentText}>{orderData.orderTextDetail ? orderData.orderTextDetail.replace(/<br\/>/g, "\n") : '无'}</Text>
      </ScrollView>
      <WaterMark waterMarkStyle={styles.waterMarkStyle}/>
      <View style={styles.bottomArea}>
        <TouchableOpacity style={styles.bottomBtn} onPress={confirm}>
          <Text style={styles.confirm}>确 定</Text>
        </TouchableOpacity>
      </View>
    </>
  )
};

const styles = StyleSheet.create({
  totalArea: {
    justifyContent: 'space-around', 
    paddingHorizontal: 40,
    marginBottom: 20
  },
  scrollArea: {
    paddingHorizontal: 40
  },
  contentText: {
    fontSize: 28, 
    color: '#333333',
    marginBottom: 10
  },
  orderName: {
    flex: 1, 
    fontSize: 28, 
    color: '#333333', 
    textDecorationLine: 'underline', 
    textDecorationColor: '#FEFEFE'
  },
  dateText: {
    textDecorationLine: 'underline', 
    textDecorationColor: '#FEFEFE'
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
  },
  waterMarkStyle: {
    marginTop: 60
  }
})

export default OrderDetail;