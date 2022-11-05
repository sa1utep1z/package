import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Linking } from 'react-native';
import { useDispatch } from "react-redux";
import Entypo from 'react-native-vector-icons/Entypo';

import { closeDialog } from "../../../redux/features/PageDialog";

const CallPhone = ({ message }) => {
  const dispatch = useDispatch();

  const rejectOnPress = () => dispatch(closeDialog());

  const confirmOnPress = (item) => {
    Linking.openURL(`tel:${item.mobile}`);
    dispatch(closeDialog());
  };

  return (
    <>
      <View style={styles.allBox}>
        <Text style={styles.callPhone}>确定拨打该手机吗？</Text>
        {message.mobile && <Text selectable style={[styles.callPhone, styles.phone]}>
          <Text selectable>{message.mobile}</Text>
        </Text>}
      </View>
      <View style={styles.bottomArea}>
        <View style={styles.leftArea}>
          <TouchableOpacity style={styles.buttonArea} onPress={rejectOnPress}>
            <Text style={styles.closeText}>取消</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.rightArea}>
          <TouchableOpacity style={styles.buttonArea} onPress={() => confirmOnPress(message)}>
            <Text style={styles.confirmText}>拨打</Text>
            <Entypo name='phone' size={32} color='#409EFF' />
          </TouchableOpacity>
        </View>
      </View>
    </>
  )
};

const styles = StyleSheet.create({
  allBox: {
    marginTop: 20,
    marginBottom: 40
  },
  callPhone: {
    fontSize: 26,
    color: '#333333',
    textAlign: 'center',
  },
  phone: {
    marginTop: 10,
    color: '#409EFF'
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
    flexDirection: 'row',
    justifyContent: 'center', 
    alignItems: 'center'
  },
  closeText: {
    fontSize: 28, 
  },
  confirmText: {
    fontSize: 28, 
    color: '#409EFF'
  }
})

export default CallPhone;