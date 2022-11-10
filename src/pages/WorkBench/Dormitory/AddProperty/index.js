import React from "react";
import { View, Text, StyleSheet } from 'react-native';

const AddProperty = () => {
  return (
    <View style={styles.screen}>
      <Text>添加资产</Text>
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

export default AddProperty;