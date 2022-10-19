import React from "react";
import { View, Text, StyleSheet } from 'react-native';

const DormitoryViolation = () => {
  return (
    <View style={styles.screen}>
      <Text>宿舍违纪</Text>
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

export default DormitoryViolation;