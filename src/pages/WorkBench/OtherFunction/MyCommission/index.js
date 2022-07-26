import React from "react";
import { View, Text, StyleSheet } from 'react-native';

const MyCommission = () => {
  return (
    <View style={styles.screen}>
      <Text>我的提成</Text>
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

export default MyCommission;