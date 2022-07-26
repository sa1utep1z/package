import React from "react";
import { View, Text, StyleSheet } from 'react-native';

const DATA_Statistics = () => {
  return (
    <View style={styles.screen}>
      <Text>数据统计</Text>
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

export default DATA_Statistics;