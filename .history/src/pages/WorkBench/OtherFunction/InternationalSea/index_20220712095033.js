import React from "react";
import { View, Text, StyleSheet } from 'react-native';

const InternationalSea = () => {
  return (
    <View style={styles.screen}>
      <Text>公海</Text>
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

export default InternationalSea;