import React, { useState, useImperativeHandle, forwardRef } from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import { Text, Dialog } from '@rneui/themed';
import {Linking} from 'react-native';

const CallPhoneDialog = ({
    memberInfo = []
  }, ref) => {
  const [showCallPhone, setShowCallPhone] = useState(false);

  useImperativeHandle(ref, () => {
    return { showCallPhone, setShowCallPhone };
  }, []);

  const callPhone = () => Linking.openURL(`tel:${memberInfo[2].value}`);

  return (
    <Dialog
      isVisible={showCallPhone}
      onBackdropPress={()=> setShowCallPhone(!showCallPhone)}>
        <View style={styles.viewArea}>
          <Text style={styles.item}>{`会员名：${memberInfo[0]?.value}`}</Text>
          <Text style={styles.item}>{`身份证：${memberInfo[1]?.value}`}</Text>
          <Text style={styles.item}>{`手机号：${memberInfo[2]?.value}`}</Text>
          <Text style={styles.item}>{`职位名称：${memberInfo[3]?.value}`}</Text>
          <Text style={styles.lastItem}>确定要拨打电话吗？</Text>
        </View>
        <View style={styles.bottomButtonArea}>
          <TouchableOpacity style={styles.bottomLeft} onPress={() => setShowCallPhone(!showCallPhone)}>
            <Text style={styles.leftText}>取消</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bottomRight} onPress={callPhone}>
            <Text style={styles.rightText}>确认</Text>
          </TouchableOpacity>
        </View>
    </Dialog>
  )
}

const styles = StyleSheet.create({
  bottomButtonArea: {
    flexDirection: 'row', 
    height: 35
  },
  bottomLeft: {
    flex: 1, 
    borderWidth: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderBottomLeftRadius: 8, 
    borderTopLeftRadius: 8, 
    borderColor: '#E3E3E3'
  },
  leftText: {
    fontSize: 16, 
    color: '#999999'
  },
  bottomRight: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#409EFF', 
    borderBottomRightRadius: 8,
    borderTopRightRadius: 8
  },
  rightText: {
    fontSize: 16, 
    color: '#fff'
  },
  viewArea: {
    height: 200, 
    paddingTop: 20
  },
  item: {
    marginLeft: 10, 
    marginBottom: 10
  },
  lastItem: {
    textAlign: 'center', 
    marginTop: 20, 
    fontSize: 16, 
    fontWeight: 'bold'
  }
})

export default forwardRef(CallPhoneDialog);