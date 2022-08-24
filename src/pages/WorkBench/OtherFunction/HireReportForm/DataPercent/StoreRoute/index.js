import React from "react";
import { View, StyleSheet } from 'react-native';
import { LineChart } from "react-native-chart-kit";
import Svg, { Circle, Text, Line } from 'react-native-svg';

import Tag from "../../Component/Tag";
import { HIRE_DATA_COMPARE_TAB_LIST } from "../../../../../../utils/const";

const StoreRoute = () => {

  return (
    <View style={{flex: 1}} >
      <Tag tagList={HIRE_DATA_COMPARE_TAB_LIST} lastButton />
    </View>
  )
}

const styles = StyleSheet.create({
  LineArea: {
    flex: 1, 
    justifyContent: 'flex-end', 
    alignItems: 'center'
  },
  LineStyle: {
    position: 'absolute',
    bottom: -30
  }
});

export default StoreRoute;