import React from "react";
import { View, Text, StyleSheet } from 'react-native';

const ApplyDormitory = () => {
  return (
    <View style={styles.screen}>
      <Text>宿舍申请</Text>
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

export default ApplyDormitory;