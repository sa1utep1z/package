import React from 'react';
import {StyleSheet, View} from 'react-native';
import { Text } from '@rneui/themed';
import AntDesign from 'react-native-vector-icons/AntDesign';

const EmptyArea = ({
    color = '#999999', 
    content = '暂无数据',
    size = 35,
    otherStyle,
    withSearch,
    ...rest
  }) => {

  return (
    <View style={[styles.emptyArea, withSearch && styles.searchBorder, otherStyle]}>
      <AntDesign
        name='frowno'
        size={size}
        color={color}
      />
      <Text style={styles.emptyText}>{content}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  emptyArea: {
    justifyContent: 'center', 
    alignItems: 'center', 
    minHeight: 120,
    paddingTop: 20
  },
  searchBorder: {
    borderWidth: 1, 
    borderBottomLeftRadius: 8, 
    borderBottomRightRadius: 8,
    borderColor: '#E3E3E3'
  },
  emptyText: {
    color: '#999999', 
    marginTop: 10
  }
})

export default EmptyArea;