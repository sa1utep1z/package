import React from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { Text, Dialog } from '@rneui/themed';
import { useDispatch, useSelector } from 'react-redux';

import { closeDialog } from '../../redux/features/HireReport/HireReportDialog';

const HireReportDialog = () => {
  const dispatch = useDispatch();

  const dialogSwitch = useSelector((state) => state.HireReportDialog.showDialog);
  const dialogContent = useSelector((state) => state.HireReportDialog.dialogComponent);

  const defaultBackOnPress = () => dispatch(closeDialog());

  return (
    <Dialog
      animationType='fade'
      isVisible={dialogSwitch}
      overlayStyle={styles.dialogStyle}
      onBackdropPress={defaultBackOnPress}>
      <View style={styles.titleArea}>
        <Text style={styles.title}>筛选更多</Text>
      </View>
      {dialogContent ? dialogContent : <ActivityIndicator size="large" color="#409EFF"/>}
    </Dialog>
  )
}

const styles = StyleSheet.create({
  dialogStyle: {
    padding: 0,
    borderRadius: 6,
    width: '80%'
  },
  titleArea: {
    marginTop: 20,
    marginBottom: 10,
  },
  title: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20
  }
})

export default HireReportDialog;