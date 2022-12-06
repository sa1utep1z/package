import React from "react";
import { View, Text, StyleSheet } from 'react-native';

const DormitoryBedPanel = () => {
  return (
    <View style={styles.screen}>
      <View style={{borderWidth: 1, height: 300}}></View>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1
  }
});

export default DormitoryBedPanel;