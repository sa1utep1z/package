import React from "react";
import { View, StyleSheet, ScrollView } from 'react-native';

import DataOverview from "./DataOverview";
import DataTrend from "./DataTrend";
import DataCompare from "./DataCompare";
import DataPercent from "./DataPercent";

import HireReportDialog from "../../../../components/HireReportDialog";

const HireReportForm = () => {

  return (
    <ScrollView style={styles.screen}>
      <View style={{flexDirection: 'column', alignItems: 'center', paddingTop: 32}}>
        <DataOverview />
        <DataTrend />
        <DataCompare />
        <DataPercent />
      </View>
      <HireReportDialog/>
    </ScrollView>
  )
};

const styles = StyleSheet.create({
  screen: {
    flex: 1
  }
});

export default HireReportForm;