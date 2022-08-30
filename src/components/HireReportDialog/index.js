import React from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { Text, Dialog } from '@rneui/themed';
import { useDispatch, useSelector } from 'react-redux';

import { closeDialog } from '../../redux/features/HireReportDialog';

const HireReportDialog = () => {
  const dispatch = useDispatch();

  const dialogSwitch = useSelector((state) => state.HireReportDialog.showDialog);
  const dialogContent = useSelector((state) => state.HireReportDialog.dialogComponent);

  const defaultBackOnPress = () => dispatch(closeDialog());

  return (
    <Dialog
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
  icon: {
    position: 'absolute', 
    top: 0, 
    right: 20, 
    color: '#000'
  },
})

export default HireReportDialog;