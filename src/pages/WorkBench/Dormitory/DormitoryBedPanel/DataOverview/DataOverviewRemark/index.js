import React from 'react';
import {StyleSheet, View, TouchableOpacity, Text, ScrollView } from 'react-native';
import { useDispatch } from 'react-redux';

import * as PageDialog1 from "../../../../../../redux/features/PageDialog";

const DataOverviewRemark = ({}) => {
  const dispatch = useDispatch();

  const close = () => console.log('点击了关闭');

  const confirmOnPress = () => console.log('点击了确认');

  return (
    <>
      <View style={{maxHeight: 450, paddingHorizontal: 20, marginBottom: 20}}>
        <ScrollView style={styles.selectArea}>
          <View>
            <Text style={{fontSize: 30, fontWeight: 'bold', color: '#333333'}}>今日数据</Text>
          </View>
        </ScrollView>
      </View>
      <View style={styles.bottomArea}>
        <View style={styles.leftArea}>
          <TouchableOpacity style={styles.buttonArea} onPress={close}>
            <Text style={styles.closeText}>取消</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.rightArea}>
          <TouchableOpacity style={styles.buttonArea} onPress={confirmOnPress}>
            <Text style={styles.confirmText}>确认</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  )
};

const styles = StyleSheet.create({
  fontBold: {
    fontWeight: 'bold'
  },
  touchArea: {
    height: 80, 
    borderWidth: 2, 
    borderColor: '#EFEFEF',
    borderRadius: 12, 
    justifyContent: 'center', 
    paddingHorizontal: 20
  },
  title: {
    fontSize: 28, 
    color: '#000'
  },
  selectedTouchArea: {
    borderColor: '#409EFF', 
    borderBottomRightRadius: 0, 
    borderBottomLeftRadius: 0
  },
  selectArea: {
    borderWidth: 1, 
    height: 100,
    borderColor: '#999999', 
    borderBottomLeftRadius: 12, 
    borderBottomRightRadius: 12, 
    flexDirection: 'row', 
    padding: 20
  },
  selectTime: {
    flex: 1, 
    borderWidth: 1, 
    borderColor: '#EFEFEF', 
    borderRadius: 6, 
    flexDirection: 'row',
    alignItems: 'center', 
    justifyContent: 'center'
  },
  centerText: {
    fontSize: 28, 
    marginHorizontal: 10, 
    textAlignVertical: 'center'
  },
  bottomArea: {
    height: 100, 
    flexDirection: 'row'
  },
  leftArea: {
    flex: 1, 
    borderTopWidth: 1, 
    borderRightWidth: 1, 
    borderColor: '#E3E3E3'
  },
  rightArea: {
    flex: 1, 
    borderTopWidth: 1, 
    borderColor: '#E3E3E3'
  },
  buttonArea: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  closeText: {
    fontSize: 28, 
    color: '#999999'
  },
  confirmText: {
    fontSize: 28, 
    color: '#409EFF'
  },
})

export default DataOverviewRemark;