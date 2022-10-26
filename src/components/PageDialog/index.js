import React, {useEffect} from 'react';
import { View, Text, Modal, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import ScaleView from 'react-native-scale-view';
import AntDesign from 'react-native-vector-icons/AntDesign';

import { closeDialog, setLeftArea, setRightArea } from '../../redux/features/PageDialog';

export const DefaultTitle = ({title}) => {
  const rightArea = useSelector((state) => state.PageDialog.rightArea);
  const leftArea = useSelector((state) => state.PageDialog.leftArea);
  console.log('leftArea', leftArea);
  return (
    <View style={styles.defaultTitle}>
      {!!leftArea.title && <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', position: 'absolute', left: 20}} onPress={leftArea.press}>
        <AntDesign
          name='left'
          size={32}
          color='#409EFF'
        />
        <Text style={{fontSize: 26, color: '#409EFF'}}>{leftArea.title}</Text>
      </TouchableOpacity>}
      <Text style={styles.title}>{title || '温馨提示'}</Text>
      {!!rightArea.title && <TouchableOpacity style={{position: 'absolute', right: 40}} onPress={rightArea.press}>
        <Text style={{fontSize: 22, color: '#409EFF'}}>{rightArea.title}</Text>
      </TouchableOpacity>}
    </View>
  )
};

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

  useEffect(()=>{
    return () => {
      dispatch(setLeftArea({
        title: '',
        press: () => {}
      }));
      dispatch(setRightArea({
        title: '',
        press: () => {}
      }));
    };
  })

  const close = () => {
    dispatch(closeDialog());
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