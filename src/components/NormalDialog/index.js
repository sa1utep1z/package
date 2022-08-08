import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Text, Dialog } from '@rneui/themed';
import EmptyArea from '../EmptyArea';

const NormalDialog = ({ dialogContent: {
  dialogComponent = <></>,
  dialogTitle = '',
  leftTitle,
  leftTitleOnPress,
  rightTitle,
  rightTitleOnPress,
  singleButton = false,
  confirmText,
  confirmOnPress,
  backOnPress,
  bottomButton = true
} }, ref) => {
  const [showDialog, setShowDialog] = useState(false);

  useImperativeHandle(ref, () => {
    return { setShowDialog, showDialog };
  }, [showDialog]);

  const defaultBackOnPress = () => setShowDialog(!showDialog);

  const defaultConfirmOnPress = () => setShowDialog(!showDialog);

  return (
    <Dialog
      isVisible={showDialog}
      overlayStyle={styles.dialogStyle}
      onBackdropPress={backOnPress || defaultBackOnPress}>
      <View style={styles.titleArea}>
        {!!leftTitle &&
          <TouchableOpacity style={styles.leftTitle} onPress={leftTitleOnPress}>
            <Text style={styles.leftTitleText}>{leftTitle || '返回'}</Text>
          </TouchableOpacity>}
        <Text style={styles.title} onPress={() => console.log('点击了标题')}>{dialogTitle || '温馨提示'}</Text>
        {!!rightTitle &&
          <TouchableOpacity style={styles.rightTitle} onPress={rightTitleOnPress}>
            <Text style={styles.rightTitleText}>{rightTitle || '编辑'}</Text>
          </TouchableOpacity>}
      </View>
      {dialogComponent ? dialogComponent : <EmptyArea />}
      {bottomButton && <View style={styles.bottomButtonArea}>
        {singleButton ? <TouchableOpacity style={styles.singleButton}>
          <Text style={styles.singleButtonText}>提交</Text>
        </TouchableOpacity> :
          <>
            <TouchableOpacity style={styles.bottomLeft} onPress={backOnPress || defaultBackOnPress}>
              <Text style={styles.leftText}>取消</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.bottomRight} onPress={confirmOnPress || defaultConfirmOnPress}>
              <Text style={styles.rightText}>{confirmText || '确认'}</Text>
            </TouchableOpacity>
          </>}
      </View>}
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
    right: 20,
    zIndex: 999
  },
  rightTitleText: {
    color: '#409EFF'
  },
  leftTitle: {
    position: 'absolute',
    left: 20,
    zIndex: 999
  },
  leftTitleText: {
    color: '#409EFF'
  },
})

export default forwardRef(NormalDialog);