import React from 'react';
import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native';

const Mine = () => {

  return (
    <SafeAreaView style={styles.screen}>
      <View style={{height: 200, borderWidth: 1}}>

      </View>
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
