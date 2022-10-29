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
        <Text style={styles.contentText}>订单名称：<Text style={styles.dateText}>{orderData.orderName}</Text></Text>
      </View>
      <ScrollView style={styles.scrollArea} showsHorizontalScrollIndicator={false}>
        <Text style={styles.contentText}>{orderData.orderTextDetail}</Text>
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
    height: 120, 
    justifyContent: 'space-around', 
    marginBottom: 30, 
    paddingHorizontal: 40
  },
  scrollArea: {
    paddingHorizontal: 40
  },
  contentText: {
    fontSize: 28, 
    color: '#333333'
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