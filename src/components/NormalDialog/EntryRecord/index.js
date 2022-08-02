import React, {useState, useImperativeHandle, forwardRef} from 'react';
import {StyleSheet, View, ScrollView} from 'react-native';
import { Text } from '@rneui/themed';
import moment from 'moment';

const fakeList = [
  {qiye: '富士康-ACKN', rDate: '2022/05/02', lDate: '2022/09/23', days: '100'},
  {qiye: '白石', rDate: '2022/05/02', lDate: '2022/09/23', days: '60'},
  {qiye: '爱普生-BBC', rDate: '2022/05/02', lDate: '2022/09/23', days: '156'},
  {qiye: '哇哈哈', rDate: '2022/05/02', lDate: '2022/09/23', days: '356'}
];

const EntryRecord = ({
  entryList = fakeList
}) => {

  return (
    <View style={styles.totalArea}>
      <View style={styles.topArea}>
        <View style={styles.topItem}>
          <Text style={styles.topItem_text}>入职企业</Text>
        </View>
        <View style={styles.topItem}>
          <Text style={styles.topItem_text}>入职日期</Text>
        </View>
        <View style={styles.topItem}>
          <Text style={styles.topItem_text}>离职日期</Text>
        </View>
        <View style={styles.topItem}>
          <Text style={styles.topItem_text}>在职天数</Text>
        </View>
      </View>
      {entryList.map((item, index) => {
        if(index < 3){
          const enterDate = item.enterDate ? moment(item.enterDate).format('YYYY-MM-DD') : '无';
          const resignDate = item.resignDate ? moment(item.resignDate).format('YYYY-MM-DD') : '无';
          return (
            <View style={styles.bottomArea} key={index}>
              <Text style={styles.bottomArea_text}>{item.enterCompanyName}</Text>
              <Text style={styles.bottomArea_text}>{enterDate}</Text>
              <Text style={styles.bottomArea_text}>{resignDate}</Text>
              <Text style={styles.bottomArea_text}>{item.stayDays || '无'}</Text>
            </View>
          )
        }
      })}
    </View>
  )
};

const styles = StyleSheet.create({
  totalArea: {
    minHeight: 30, 
    marginHorizontal: 10, 
    borderTopWidth: 1, 
    borderLeftWidth: 1, 
    borderBottomWidth: 0, 
    borderColor: '#409EFF'
  },
  topArea: {
    flexDirection: 'row', 
    backgroundColor: '#ecf5ff'
  },
  topItem: {
    flex: 1, 
    height: 30, 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderRightWidth: 1, 
    borderBottomWidth: 1, 
    borderColor: '#409EFF'
  },
  topItem_text: {
    fontSize: 12, 
    color: '#000', 
    fontWeight: 'bold'
  },
  bottomArea: {
    height: 30, 
    flexDirection: 'row'
  },
  bottomArea_text: {
    flex: 1, 
    borderRightWidth: 1, 
    borderBottomWidth: 1, 
    borderColor: '#409EFF', 
    fontSize: 11, 
    textAlign: 'center', 
    textAlignVertical: 'center', 
    paddingHorizontal: 5, 
    color: '#000'
  }
})

export default EntryRecord;