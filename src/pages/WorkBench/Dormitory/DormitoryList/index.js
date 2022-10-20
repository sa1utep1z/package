import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const DormitoryList = () => {
  return (
    <View style={styles.screen}>
      <Text>在离宿名单</Text>
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

export default DormitoryList;