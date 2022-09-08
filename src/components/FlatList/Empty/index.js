import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';

const Empty = () => (
    <View style={styles.pageEmptyStyle}>
      <AntDesign
        name='frowno'
        size={60}
        color='#999999'
        style={styles.antIcon}
      />
      <Text style={styles.emptyText}>暂无数据</Text>
    </View>
);

const styles = StyleSheet.create({
  pageEmptyStyle: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center'
  },
  antIcon: {
    marginBottom: 10
  },
  emptyText: {
    color: '#999999',
    fontSize: 28
  }
})

export default Empty;