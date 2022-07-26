import React from "react";
import { View, Text, StyleSheet } from 'react-native';

import CompareForm from "./CompareForm";

const DormitoryBedPanel = () => {

  return (
    <View style={styles.totalArea}>
      <View style={styles.titleArea}>
        <View style={styles.titleLine}></View>
        <Text style={styles.title}>楼栋住宿数据对比</Text>
      </View>
      <CompareForm/>
      <View style={styles.bottomText}>
        <View style={{flexDirection: 'row', marginRight: 25, alignItems: 'center'}}>
          <View style={{width: 30, height: 20, marginRight: 8, borderRadius: 5, backgroundColor: '#2fe38c'}}></View>
          <Text style={{fontSize: 24, color: '#333333'}}>常规住宿</Text>
        </View>
        <View style={{flexDirection: 'row', marginRight: 25, alignItems: 'center'}}>
          <View style={{width: 30, height: 20, marginRight: 8, borderRadius: 5, backgroundColor: '#0cbbea'}}></View>
          <Text style={{fontSize: 24, color: '#333333'}}>临时住宿</Text>
        </View>
        <View style={{flexDirection: 'row', marginRight: 25, alignItems: 'center'}}>
          <View style={{width: 30, height: 20, marginRight: 8, borderRadius: 5, backgroundColor: '#160ae9'}}></View>
          <Text style={{fontSize: 24, color: '#333333'}}>在宿</Text>
        </View>
        <View style={{flexDirection: 'row', marginRight: 25, alignItems: 'center'}}>
          <View style={{width: 30, height: 20, marginRight: 8, borderRadius: 5, backgroundColor: '#bbbbbb'}}></View>
          <Text style={{fontSize: 24, color: '#333333'}}>离宿</Text>
        </View>
        <View style={{flexDirection: 'row', marginRight: 25, alignItems: 'center'}}>
          <View style={{width: 30, height: 20, marginRight: 8, borderRadius: 5, backgroundColor: '#ff4d50'}}></View>
          <Text style={{fontSize: 24, color: '#333333'}}>空床位</Text>
        </View>
      </View>
      <View style={{flexDirection: 'row', marginBottom: 10}}>
        <Text style={{fontSize: 24, color: '#333333'}}>总数据：</Text>
        <View style={{flex: 1, flexDirection: 'row', flexWrap: 'wrap', marginLeft: 10}}>
          <Text style={{fontSize: 24, color: '#333333', marginRight: 10}}>常规住宿（<Text style={{color: '#2fe38c'}}>300</Text>）</Text>
          <Text style={{fontSize: 24, color: '#333333', marginRight: 10}}>临时住宿（<Text style={{color: '#0cbbea'}}>50</Text>）</Text>
          <Text style={{fontSize: 24, color: '#333333', marginRight: 10}}>在宿（<Text style={{color: '#160ae9'}}>350</Text>）</Text>
          <Text style={{fontSize: 24, color: '#333333', marginRight: 10}}>离宿（<Text style={{color: '#bbbbbb'}}>150</Text>）</Text>
          <Text style={{fontSize: 24, color: '#333333', marginRight: 10}}>空床位（<Text style={{color: '#ff4d50'}}>420</Text>）</Text>
        </View>
      </View>
    </View>
  )
};

const styles = StyleSheet.create({
  totalArea: {
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 30
  },
  titleArea: {
    flexDirection: 'row', 
    alignItems: 'center'
  },
  titleLine: {
    width: 6,
    height: 32, 
    backgroundColor: '#409EFF', 
    marginRight: 9, 
    borderTopRightRadius: 5, 
    borderBottomLeftRadius: 5
  },
  title: {
    fontSize: 36, 
    color: '#000', 
    fontWeight: 'bold'
  },
  bottomText: {
    width: '100%', 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 20
  }
});

export default DormitoryBedPanel;