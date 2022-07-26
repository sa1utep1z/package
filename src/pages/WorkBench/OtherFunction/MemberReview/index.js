import React from "react";
import { View, Text, StyleSheet } from 'react-native';

const MemberReview = () => {
  return (
    <View style={styles.screen}>
      <Text>裂变回访</Text>
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

export default MemberReview;