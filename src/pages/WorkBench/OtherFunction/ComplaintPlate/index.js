import React from "react";
import { View, Text, StyleSheet } from 'react-native';

const ComplaintPlate = () => {
  return (
    <View style={styles.screen}>
      <Text>投诉看板</Text>
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

export default ComplaintPlate;