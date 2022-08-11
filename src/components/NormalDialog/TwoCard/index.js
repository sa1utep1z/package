import React from 'react';
import {StyleSheet, View, Text} from 'react-native';

const TwoCard = ({message}) => {
  return (
    <View style={styles.totalArea}>
      <View style={styles.itemArea}>
        <Text style={styles.title}>姓名：</Text>
        <Text style={styles.content}>{message.name}</Text>
      </View>
      <View style={styles.itemArea}>
        <Text style={styles.title}>身份证：</Text>
        <Text style={styles.content}>{message.idNo || '无'}</Text>
      </View>
      <View style={styles.itemArea}>
        <Text style={styles.title}>银行卡：</Text>
        <Text style={styles.content}>{message.backAccount || '无'}</Text>
      </View>
    </View>
  )
};

const styles = StyleSheet.create({
  totalArea: {
    paddingHorizontal: 20
  },
  itemArea: {
    flexDirection: 'row'
  },
  title: {
    minWidth: 80, 
    minHeight: 40, 
    textAlignVertical: 'center', 
    textAlign: 'center', 
    color: '#333333'
  },
  content: {
    flex: 1, 
    textAlignVertical: 'center', 
    borderBottomWidth: 1, 
    borderBottomColor: '#CCCCCC', 
    color: '#333333',
    paddingHorizontal: 5
  }
})

export default TwoCard;