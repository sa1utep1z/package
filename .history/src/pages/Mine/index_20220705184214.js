import React from 'react';
import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native';

const Mine = () => {

  return (
  <SafeAreaView style={styles.screen}>
    <Text style={styles.title}>我的</Text>
  </SafeAreaView>
)};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  title: {
    fontSize: 30,
    color: 'red'
  }
});

export default Mine;
