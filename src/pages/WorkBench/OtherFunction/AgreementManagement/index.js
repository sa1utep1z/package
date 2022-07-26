import React from "react";
import { View, Text, StyleSheet } from 'react-native';

const AgreementManagement = () => {
  return (
    <View style={styles.screen}>
      <Text>合同管理</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default AgreementManagement;