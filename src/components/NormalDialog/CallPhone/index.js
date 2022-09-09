import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

const CallPhone = ({ message }) => {

  return (
    <View style={styles.allBox}>
      <Text style={styles.callPhone}>确定拨打该手机吗？</Text>
      {message.mobile && <Text style={[styles.callPhone, styles.phone]}>
        <Text selectable={true} onLongPress={() => console.log('长按复制')}>{message.mobile}</Text>
        <Text style={{ fontSize: 12 }}> (长按复制)</Text>
      </Text>}
    </View>
  )
};

const styles = StyleSheet.create({
  allBox: {
    marginVertical: 20
  },
  callPhone: {
    textAlign: 'center',
    color: '#000'
  },
  phone: {
    marginTop: 10
  }
})

export default CallPhone;