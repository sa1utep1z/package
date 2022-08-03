import React from "react";
import { View, Text, StyleSheet } from 'react-native';
import HeaderSearch from "../../../../components/List/HeaderSearch";
import CenterSelectDate from "../../../../components/List/CenterSelectDate";

const DATA_Statistics = () => {
  return (
    <View style={styles.screen}>
      <HeaderSearch />
      <CenterSelectDate />
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingTop: 10,
  }
});

export default DATA_Statistics;