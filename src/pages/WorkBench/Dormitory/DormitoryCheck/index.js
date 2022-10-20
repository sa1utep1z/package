import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const DormitoryCheck = () => {
  return (
    <View style={styles.screen}>
      <Text>宿舍点检</Text>
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

export default DormitoryCheck;