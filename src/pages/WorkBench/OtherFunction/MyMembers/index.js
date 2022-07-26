import React from "react";
import { View, Text, StyleSheet } from 'react-native';

const MyMembers = () => {
  return (
    <View style={styles.screen}>
      <Text>我的会员</Text>
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

export default MyMembers;