import React from "react";
import { View, Text, StyleSheet } from 'react-native';

const NewestState = () => {
  return (
    <View style={styles.screen}>
      <Text>最新状态</Text>
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

export default NewestState;