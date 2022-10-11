import React from "react";
import { View, StyleSheet, ScrollView, KeyboardAvoidingView } from 'react-native';
import { Button } from '@rneui/themed';

import OrderInfo from "./OrderInfo";
import Requirement from "./Requirement";
import Policy from "./Policy";
import CommissionDescription from "./CommissionDescription";
import WagesDetail from "./WagesDetail";

const CreateOrder = () => {

  const save = () => {
    console.log('提交保存');
  };

  return (
    <KeyboardAvoidingView
      behavior="height"
      style={styles.container}
      keyboardVerticalOffset={-300}
    >
      <View style={styles.screen}>
        <ScrollView 
          style={styles.screen}
          keyboardShouldPersistTaps="handled">
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
    </KeyboardAvoidingView>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },
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