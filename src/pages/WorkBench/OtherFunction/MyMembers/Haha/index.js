import React, {useState, useImperativeHandle, forwardRef} from 'react';
import {StyleSheet, View, TouchableOpacity, ScrollView} from 'react-native';
import { Text, Dialog } from '@rneui/themed';
import Icon from 'react-native-vector-icons/FontAwesome';

const CompanyDetailDialog = ({
    message
  }, ref) => {

  return (
    <View style={styles.msgArea}>
      <View style={styles.topArea}>
        <View style={styles.itemDateArea}>
          <Text>订单日期：</Text>
          <View style={styles.itemDate}>
            <Icon
              name='calendar' 
              type='antdesign'
              style={styles.icon}
            />
            <Text style={{color: '#999999'}}>2022-04-09</Text>
          </View>
        </View>
        <View style={styles.itemDateArea}>
          <Text>订单名称：</Text>
          <View style={styles.itemDate}>
            <Icon
              name='calendar' 
              type='antdesign'
              style={styles.icon}
            />
            <Text style={{color: '#999999'}}>2022-04-09</Text>
          </View>
        </View>
        <ScrollView style={styles.message}>
          <Text>{message}</Text>
        </ScrollView>
      </View>
    </View>
  )
};

const styles = StyleSheet.create({
  msgArea: {
    height: 450, 
    alignItems: 'center'
  },
  topArea: {
    flex: 1, 
    width: '100%',
    paddingTop: 5
  },
  itemDateArea: {
    height: 30, 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingLeft: 20, 
    marginVertical: 6
  },
  itemDate: {
    height: '100%',
    borderWidth: 1, 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 10, 
    borderRadius: 3, 
    borderColor: '#999999'
  },
  message: {
    flex: 1, 
    marginBottom: 15,
    marginTop: 5
  }
})

export default forwardRef(CompanyDetailDialog);