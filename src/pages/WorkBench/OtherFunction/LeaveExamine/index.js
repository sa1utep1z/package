import React from "react";
import { View, Text, StyleSheet } from 'react-native';

const LeaveExamine = () => {
  return (
    <View style={styles.screen}>
      <Text>离职管理</Text>
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

export default LeaveExamine;