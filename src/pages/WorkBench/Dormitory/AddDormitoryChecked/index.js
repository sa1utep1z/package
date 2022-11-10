import React from "react";
import { View, Text, StyleSheet } from 'react-native';

const AddDormitoryChecked = () => {
  return (
    <View style={styles.screen}>
      <Text>添加点检记录</Text>
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

export default AddDormitoryChecked;