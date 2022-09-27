import React from 'react';
import { View, Text, Modal, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import ScaleView from 'react-native-scale-view';

import { closeDialog } from '../../redux/features/PageDialog';

export const DefaultTitle = ({title}) => (
  <View style={styles.defaultTitle}>
    <Text style={styles.title}>{title || '温馨提示'}</Text>
  </View>
);

export const DefaultEmptyArea = () => (
  <View style={styles.emptyArea}>
    <ActivityIndicator size={48} color="#409EFF"/>
  </View>
);
const PageDialog = () => {
  const dispatch = useDispatch();

  const dialogSwitch = useSelector((state) => state.PageDialog.showDialog);
  const dialogContent = useSelector((state) => state.PageDialog.dialogComponent);
  const dialogTitle = useSelector((state) => state.PageDialog.dialogTitle);
  console.log('dialogContent', dialogContent)
  console.log('dialogSwitch', dialogSwitch)

  const close = () => {
    console.log('按下');
    dispatch(closeDialog())
  };

  return (
    <Modal
      animationType="fade"
      transparent
      visible={dialogSwitch}>
      <ScaleView designWidth={750}>
        <View style={styles.screen}>
          <TouchableOpacity style={styles.backPress} activeOpacity={1} onPress={close}/>
          <View style={styles.showArea}>
            <DefaultTitle title={dialogTitle}/>
            {dialogContent || <DefaultEmptyArea />}
          </View>
        </View>
      </ScaleView>
    </Modal>
  )
};

const styles = StyleSheet.create({
  screen: {
    flex: 1, 
    justifyContent: 'center'
  },
  backPress: {
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.2)'
  },
  showArea: {
    width: '80%', 
    maxHeight: 1000, 
    position: 'absolute', 
    backgroundColor: '#fff', 
    alignSelf: 'center',
    borderRadius: 12
  },
  emptyArea: {
    height: 100, 
    justifyContent: 'center'
  },
  defaultTitle: {
    height: 100, 
    justifyContent: 'center'
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center', 
    color: '#000000'
  }
})

export default PageDialog;