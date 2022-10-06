import React, {useState, useEffect, useRef} from "react";
import { View, StyleSheet, Keyboard, ScrollView } from 'react-native';
import { Button } from '@rneui/themed';

import OrderInfo from "./OrderInfo";
import Requirement from "./Requirement";
import Policy from "./Policy";
import CommissionDescription from "./CommissionDescription";
import WagesDetail from "./WagesDetail";

const CreateOrder = () => {
  const scrollViewRef = useRef(null);

  const [keyBoardBottomHeight, setKeyBoardBottomHeight] = useState(0);

  useEffect(() => {
    Keyboard.addListener("keyboardDidShow", _keyboardDidShow);
    Keyboard.addListener("keyboardDidHide", _keyboardDidHide);

    return () => Keyboard.removeAllListeners('keyboardDidShow', 'keyboardDidHide');
  }, []);

  const _keyboardDidShow = (e) => {
    setKeyBoardBottomHeight(e.endCoordinates.height);
    scrollViewRef.current.scrollTo({x: 0, y: 500, duration: 500});
    console.log('显示键盘');
  };

  const _keyboardDidHide = () => {
    setKeyBoardBottomHeight(0);
    console.log('关闭键盘');
  };

  const save = () => {
    console.log('提交保存');
  };

  return (
    <View style={[styles.screen, {paddingBottom: keyBoardBottomHeight}]}>
      <ScrollView ref={scrollViewRef} style={styles.screen}>
        <OrderInfo />
        <Requirement />
        <Policy />
        <CommissionDescription />
        <WagesDetail />
      </ScrollView>
      <Button
        title="提交保存"
        onPress={save}
        containerStyle={styles.buttonContainerStyle}
        buttonStyle={styles.buttonStyle}
        titleStyle={styles.titleStyle}
      />
    </View>
  )
};

const styles = StyleSheet.create({
  screen: {
    flex: 1
  },
  buttonContainerStyle: {
    margin: 30
  },  
  buttonStyle: {
    height: 80,
    backgroundColor: '#409EFF',
    borderWidth: 0,
    borderRadius: 50
  },
  titleStyle: {
    fontSize: 32,
    fontWeight: 'bold',
    letterSpacing: 10
  }
});

export default CreateOrder;