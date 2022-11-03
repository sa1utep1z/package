import React from "react";
import { View, Text, StyleSheet } from 'react-native';

const BatchOperateDormitory = () => {
  return (
    <View style={styles.screen}>
      <Text>批量操作在离俗名单</Text>
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

export default BatchOperateDormitory;