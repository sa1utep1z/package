import React, { useState, useImperativeHandle, forwardRef } from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import { Text, Dialog } from '@rneui/themed';
import {Linking} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

const ReceiveDialog = ({
  receive
}, ref) => {
  const [showDialog, setShowDialog] = useState(false);
  const [dialogContent, setDialogContent] = useState({});

  useImperativeHandle(ref, () => {
    return { setShowDialog, setDialogContent };
  }, []);

  const callPhone = () => Linking.openURL(`tel:${dialogContent.mobile}`);

  return (
    <Dialog
      isVisible={showDialog}
      onBackdropPress={()=> setShowDialog(!showDialog)}>
        <View style={styles.viewArea}>
          <Text style={styles.item}>{`姓名：${dialogContent.name || '无'}`}</Text>
          <Text style={styles.item}>{`身份证：${dialogContent.idNo || '无'}`}</Text>
          <TouchableOpacity style={styles.callPhone} onPress={callPhone}>
            <Text style={styles.item}>手机号：</Text>
            <Feather name='phone-call' size={16} color='#409EFF'/>
            <Text style={styles.callPhoneText}>{dialogContent.mobile || '无'}</Text>
          </TouchableOpacity>
          <Text style={styles.lastItem}>确定领取该会员吗？</Text>
        </View>
        <View style={styles.bottomButtonArea}>
          <TouchableOpacity style={styles.bottomLeft} onPress={() => setShowDialog(!showDialog)}>
            <Text style={styles.leftText}>取消</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bottomRight} onPress={() => receive(dialogContent)}>
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
    paddingTop: 20
  },
  item: {
    marginLeft: 10, 
    marginBottom: 10
  },
  lastItem: {
    textAlign: 'center', 
    marginVertical: 20,
    fontSize: 16, 
    fontWeight: 'bold'
  },
  callPhone: {
    flexDirection: 'row'
  },
  callPhoneText: {
    color: '#409EFF', 
    marginLeft: 5
  }
})

export default forwardRef(ReceiveDialog);