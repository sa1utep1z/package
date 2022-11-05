import React from "react";
import { View, Text, StyleSheet } from 'react-native';
import { Button } from '@rneui/themed';

import HeaderSearchOfDormitory from '../../../../../components/HeaderSearchOfDormitory';

const BatchOperateDormitory = () => {

  const goBack = () => console.log('点击了取消');

  const confirmButton = () => console.log('点击了确认');

  return (
    <View style={styles.screen}>
      <HeaderSearchOfDormitory isBatchOperate={false} />
      <View style={{flex: 1, backgroundColor: '#ffffff'}}>

      </View>
      <View style={styles.buttonArea}>
        <Button
          title="取 消"
          onPress={goBack}
          buttonStyle={styles.cancelButton}
          containerStyle={styles.buttonContainerStyle}
          titleStyle={styles.cancelButton_title}
        />
        <View style={{width: 20}}></View>
        <Button
          title="确 认"
          onPress={confirmButton}
          buttonStyle={styles.confirmButton}
          containerStyle={styles.buttonContainerStyle}
          titleStyle={styles.confirmButton_title}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1
  },
  buttonArea: {
    backgroundColor: '#fff',
    flexDirection: 'row', 
    paddingHorizontal: 32, 
    alignItems: 'center',
    paddingVertical: 20
  },
  cancelButton: {
    borderColor: '#409EFF',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderRadius: 44,
    height: 88
  },
  confirmButton: {
    borderColor: 'white',
    borderRadius: 44,
    height: 88
  },
  cancelButton_title: {
    fontSize: 26, 
    color: '#409EFF'
  },
  confirmButton_title: {
    fontSize: 26
  },
  buttonContainerStyle: {
    flex: 1
  },
});

export default BatchOperateDormitory;