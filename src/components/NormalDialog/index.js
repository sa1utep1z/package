import React, { useState, useImperativeHandle, forwardRef } from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import { Text, Dialog } from '@rneui/themed';

const NormalDialog = ({
  content = '确定吗',
  confirm,
  confirmButton
}, ref) => {
  const [showDialog, setShowDialog] = useState(false);

  useImperativeHandle(ref, () => {
    return { setShowDialog };
  }, []);

  return (
    <Dialog
      isVisible={showDialog}
      overlayStyle={styles.dialogStyle}
      onBackdropPress={()=> setShowDialog(!showDialog)}>
        <>
          <Text style={styles.title}>温馨提示</Text>
          <Text style={styles.content}>{content}</Text>
        </>
        <View style={styles.bottomButtonArea}>
          <TouchableOpacity style={styles.bottomLeft} onPress={() => setShowDialog(!showDialog)}>
            <Text style={styles.leftText}>取消</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bottomRight} onPress={confirm}>
            <Text style={styles.rightText}>{confirmButton || '确认'}</Text>
          </TouchableOpacity>
        </View>
    </Dialog>
  )
}

const styles = StyleSheet.create({
  bottomButtonArea: {
    flexDirection: 'row', 
    height: 45,
    marginTop: 10
  },
  dialogStyle: {
    padding: 0, 
    paddingTop: 20, 
    borderRadius: 6
  },
  bottomLeft: {
    flex: 1, 
    borderWidth: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderBottomLeftRadius: 6, 
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
    borderBottomRightRadius: 6
  },
  rightText: {
    fontSize: 16, 
    color: '#fff'
  },
  title: {
    textAlign: 'center', 
    fontWeight: 'bold', 
    fontSize: 20
  },
  content: {
    textAlign: 'center', 
    marginVertical: 20,
    fontSize: 16
  }
})

export default forwardRef(NormalDialog);