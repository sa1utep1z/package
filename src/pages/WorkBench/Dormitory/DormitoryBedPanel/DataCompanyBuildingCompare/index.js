import React, {useState} from "react";
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import CompareForm from "./CompareForm";

const DataCompanyBuildingCompare = () => {

  const [tag, setTag] = useState('today');

  return (
    <View style={styles.totalArea}>
      <View style={styles.titleArea}>
        <View style={styles.titleLine}></View>
        <Text style={styles.title}>企业住宿数据对比</Text>
      </View>
      <View style={{flexDirection: 'row', marginTop: 10}}>
        <TouchableOpacity key='today' style={[styles.tag, tag === 'today' && styles.selectedTag]} onPress={()=>setTag('today')}>
          <Text style={[styles.tagText, tag === 'today' && styles.selectedTagText]}>今日入住</Text>
        </TouchableOpacity>
        <TouchableOpacity key='total' style={[styles.tag, tag === 'total' && styles.selectedTag]} onPress={()=>setTag('total')}>
          <Text style={[styles.tagText, tag === 'total' && styles.selectedTagText]}>全部</Text>
        </TouchableOpacity>
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
      </View>
      <View style={{flexDirection: 'row', marginBottom: 10}}>
        <Text style={{fontSize: 24, color: '#333333'}}>总数据：</Text>
        <View style={{flex: 1, flexDirection: 'row', flexWrap: 'wrap', marginLeft: 10}}>
          <Text style={{fontSize: 24, color: '#333333', marginRight: 10}}>常规住宿（<Text style={{color: '#2fe38c'}}>300</Text>）</Text>
          <Text style={{fontSize: 24, color: '#333333', marginRight: 10}}>临时住宿（<Text style={{color: '#0cbbea'}}>50</Text>）</Text>
          <Text style={{fontSize: 24, color: '#333333', marginRight: 10}}>在宿（<Text style={{color: '#160ae9'}}>350</Text>）</Text>
          <Text style={{fontSize: 24, color: '#333333', marginRight: 10}}>离宿（<Text style={{color: '#bbbbbb'}}>150</Text>）</Text>
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
    flexDirection: 'row', 
    justifyContent: 'center',
    alignItems: 'center', 
    marginBottom: 20
  },
  tag: {
    height: 40,
    paddingHorizontal: 10,
    marginRight: 30, 
    borderRadius: 5, 
    justifyContent: 'center', 
    borderWidth: 2, 
    borderColor: '#E5E5E5'
  },
  selectedTag: {
    backgroundColor: '#409EFF', 
    borderWidth: 0
  },
  tagText: {
    fontSize: 26, 
    textAlign: 'center', 
    color: '#999999'
  },
  selectedTagText: {
    color: '#fff'
  },
});

export default DataCompanyBuildingCompare;