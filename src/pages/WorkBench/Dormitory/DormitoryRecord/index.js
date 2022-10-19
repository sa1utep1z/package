import React from "react";
import { View, Text, StyleSheet } from 'react-native';

const DormitoryRecord = () => {
  return (
    <View style={styles.screen}>
      <Text>宿舍抄表</Text>
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

export default DormitoryRecord;