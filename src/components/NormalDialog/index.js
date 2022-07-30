import React, { useState, useImperativeHandle, forwardRef } from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import { Text, Dialog } from '@rneui/themed';

const NormalDialog = ({
  dialogContent
}, ref) => {
  const [showDialog, setShowDialog] = useState(false);

  const { 
    contentText = '确定吗', 
    content,
    dialogTitle,
    rightTitle,
    rightTitleOnPress,
    singleButton = false,
    confirmText,
    confirmOnPress,
    backOnPress = defaultBackOnPress
  } = dialogContent;

  useImperativeHandle(ref, () => {
    return { setShowDialog, showDialog };
  }, [showDialog]);

  const defaultBackOnPress = () => setShowDialog(!showDialog);

  return (
    <Dialog
      isVisible={showDialog}
      overlayStyle={styles.dialogStyle}
      onBackdropPress={backOnPress}>
        <View style={styles.titleArea}>
          <Text style={styles.title}>{dialogTitle || '温馨提示'}</Text>
          {!!rightTitle && 
          <TouchableOpacity style={styles.rightTitle} onPress={rightTitleOnPress}>
            <Text style={styles.rightTitleText}>{rightTitle || '编辑'}</Text>
          </TouchableOpacity>}
        </View>
        {content ? 
          <>
            {content}
          </>: <Text style={styles.content}>{contentText}</Text>}
        <View style={styles.bottomButtonArea}>
          {singleButton ? <TouchableOpacity style={styles.singleButton}>
            <Text style={styles.singleButtonText}>提交</Text>
          </TouchableOpacity> : 
          <>
            <TouchableOpacity style={styles.bottomLeft} onPress={backOnPress}>
              <Text style={styles.leftText}>取消</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.bottomRight} onPress={confirmOnPress}>
              <Text style={styles.rightText}>{confirmText || '确认'}</Text>
            </TouchableOpacity>
          </>}
        </View>
    </Dialog>
  )
}

const styles = StyleSheet.create({
  dialogStyle: {
    padding: 0, 
    borderRadius: 6,
  },
  titleArea: {
    marginTop: 20, 
    marginBottom: 10
  },
  bottomButtonArea: {
    flexDirection: 'row', 
    height: 45,
    marginTop: 10
  },
  singleButton: {
    flex: 1, 
    borderTopWidth: 1,
    borderColor: '#E3E3E3', 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  singleButtonText: {
    fontSize: 16
  },
  bottomLeft: {
    flex: 1, 
    borderTopWidth: 1,
    borderRightWidth: 1,
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
    borderTopWidth: 1,
    borderColor: '#E3E3E3',
    borderBottomRightRadius: 6
  },
  rightText: {
    fontSize: 16, 
    color: '#409EFF'
  },
  title: {
    textAlign: 'center', 
    fontWeight: 'bold', 
    fontSize: 20
  },
  rightTitle: {
    position: 'absolute', 
    right: 20
  },
  rightTitleText: {
    color: '#409EFF'
  },
  content: {
    textAlign: 'center', 
    marginVertical: 20,
    fontSize: 16
  }
})

export default forwardRef(NormalDialog);