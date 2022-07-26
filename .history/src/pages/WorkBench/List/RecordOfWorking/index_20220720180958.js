import React from "react";
import { View, Text, StyleSheet } from 'react-native';

const RecordOfWorking = () => {
  return (
    <View style={styles.screen}>
      <Text>员工考勤信息</Text>
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

export default RecordOfWorking;