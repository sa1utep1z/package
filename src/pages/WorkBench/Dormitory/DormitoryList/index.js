import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import HeaderSearchOfDormitory from '../../../../components/HeaderSearchOfDormitory';
import CenterSelectDate from '../../../../components/List/CenterSelectDate';

const DormitoryList = () => {

  return (
    <View style={styles.screen}>
      <HeaderSearchOfDormitory />
      {/* <CenterSelectDate /> */}
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1
  }
});

export default DormitoryList;