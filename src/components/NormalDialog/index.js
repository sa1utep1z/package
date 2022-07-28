import React, { useState, useImperativeHandle, forwardRef } from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import { Text, Dialog } from '@rneui/themed';

const NormalDialog = ({
  contentText = '确定吗',
  confirm,
  content,
  title,
  rightTitle,
  singleButton = false,
  rightTitleOnPress,
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
        <View>
          <Text style={styles.title}>{title || '温馨提示'}</Text>
          {rightTitle && <TouchableOpacity style={{position: 'absolute', right: 20}} onPress={rightTitleOnPress}>
            <Text style={{color: '#409EFF'}}>{rightTitle || '编辑'}</Text>
          </TouchableOpacity>}
        </View>
        {content ? content : <Text style={styles.content}>{contentText}</Text>}
        <View style={styles.bottomButtonArea}>
          {singleButton ? <TouchableOpacity style={{borderTopWidth: 1,     borderColor: '#E3E3E3', flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{fontSize: 16}}>提交</Text>
          </TouchableOpacity> : 
          <>
            <TouchableOpacity style={styles.bottomLeft} onPress={() => setShowDialog(!showDialog)}>
              <Text style={styles.leftText}>取消</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.bottomRight} onPress={confirm}>
              <Text style={styles.rightText}>{confirmButton || '确认'}</Text>
            </TouchableOpacity>
          </>}
        </View>
    </Dialog>
  )
}

const styles = StyleSheet.create({
  bottomButtonArea: {
    flexDirection: 'row', 
    height: 45
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
  content: {
    textAlign: 'center', 
    marginVertical: 20,
    fontSize: 16
  }
})

export default forwardRef(NormalDialog);