import React, {useState, useEffect, useRef} from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

import DataOverview from "./DataOverview";
import DataTrend from "./DataTrend";
import DataCompare from "./DataCompare";
import DataPercent from "./DataPercent";

import HireReportDialog from "../../../../components/HireReportDialog";

const HireReportForm = () => {

  return (
    <>
      <ScrollView style={styles.screen}>
        <View style={{flex: 1, flexDirection: 'column', alignItems: 'center', paddingTop: 32}}>
          {/* <DataOverview /> */}
          <DataTrend />
          {/* <DataCompare /> */}
          {/* <DataPercent /> */}
        </View>
      </ScrollView>
      <HireReportDialog/>
    </>
  )
};

const styles = StyleSheet.create({
  screen: {
    flex: 1
  }
});

export default HireReportForm;