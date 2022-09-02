import React, {useState, useEffect, useRef, useMemo} from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useSelector, useDispatch } from "react-redux";

import DataOverview from "./DataOverview";
import DataTrend from "./DataTrend";
import DataCompare from "./DataCompare";
import DataPercent from "./DataPercent";

import HireReportDialog from "../../../../components/HireReportDialog";
import {setStartDate, setEndDate} from '../../../../redux/features/HireReport/RangeDateOfTrend';

let timer;

const HireReportForm = () => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  const rangeDate = useSelector(state => state.RangeDateOfTrend);

  useMemo(() => console.log('rangeDate', rangeDate), [rangeDate])

  useEffect(()=>{
    timer = setTimeout(() => {
      setLoading(true);
    }, 1000)
    return () => {
      timer && clearTimeout(timer);
      //清空所有选择的时间;
      clearRangeTime();
    }
  }, [])

  const clearRangeTime = () => {
    dispatch(setStartDate(''));
    dispatch(setEndDate(''));
  };

  return (
    <>
      <ScrollView style={styles.screen}>
        <View style={{flex: 1, flexDirection: 'column', alignItems: 'center', paddingTop: 32}}>
          <DataOverview />
          <DataTrend loading={loading} />
          <DataCompare loading={loading} />
          <DataPercent loading={loading} />
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