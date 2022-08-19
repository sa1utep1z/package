import React, {useState} from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

import DataOverview from "./DataOverview";
import DataTrend from "./DataTrend";
import DataCompare from "./DataCompare";

const HireReportForm = () => {

  return (
    <ScrollView style={styles.screen}>
      <View style={{flex: 1, flexDirection: 'column', alignItems: 'center', paddingTop: 32}}>
        <DataOverview />
        <DataTrend />
        <DataCompare />
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1
  }
});

export default HireReportForm;