import React, {useEffect} from 'react';
import { View, Text, Modal, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import ScaleView from 'react-native-scale-view';
import AntDesign from 'react-native-vector-icons/AntDesign';

import { setDialogHidden } from '../../redux/features/PageDialog';
import { closeDialog, setRightArea } from '../../redux/features/PageDialog2';

export const DefaultTitle = ({title}) => {
  const dispatch = useDispatch();

  const rightArea = useSelector((state) => state.PageDialog2.rightArea);

  const close = () => {
    dispatch(closeDialog());
    dispatch(setRightArea({
      title: '',
      press: () => {}
    }));
  };

  return (
    <View style={styles.defaultTitle}>
      <TouchableOpacity style={styles.leftArea} onPress={close}>
        <AntDesign
          name='left'
          size={32}
          color='#409EFF'
        />
        <Text style={styles.leftArea_text}>返回</Text>
      </TouchableOpacity>
      <Text style={styles.title}>{title || '温馨提示'}</Text>
      {!!rightArea.title && <TouchableOpacity style={styles.rightArea} onPress={rightArea.press}>
        <Text style={styles.rightArea_text}>{rightArea.title}</Text>
      </TouchableOpacity>}
    </View>
  )
};

export const DefaultEmptyArea = () => (
  <View style={styles.emptyArea}>
    <ActivityIndicator size={48} color="#409EFF"/>
  </View>
);

const PageDialog2 = () => {
  const dispatch = useDispatch();

  const dialogSwitch = useSelector((state) => state.PageDialog2.showDialog);
  const dialogContent = useSelector((state) => state.PageDialog2.dialogComponent);
  const dialogTitle = useSelector((state) => state.PageDialog2.dialogTitle);

  useEffect(() => {
    dispatch(setDialogHidden(dialogSwitch));
  }, [dialogSwitch])

  const close = () => {
    dispatch(closeDialog());
    dispatch(setRightArea({
      title: '',
      press: () => {}
    }));
  };

  return (
    <Modal
      animationType="fade"
      transparent
      visible={dialogSwitch}
      onRequestClose={close}>
      <ScaleView designWidth={750}>
        <View style={styles.screen}>
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
  },
  leftArea: {
    flexDirection: 'row', 
    alignItems: 'center', 
    position: 'absolute', 
    left: 20, 
    zIndex: 999
  },
  leftArea_text: {
    fontSize: 26, 
    color: '#409EFF'
  },
  rightArea: {
    position: 'absolute', 
    right: 40
  },
  rightArea_text: {
    fontSize: 22, 
    color: '#409EFF'
  }
})

export default PageDialog2;