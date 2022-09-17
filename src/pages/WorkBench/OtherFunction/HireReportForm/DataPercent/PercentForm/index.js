import React from "react";
import { View, StyleSheet } from 'react-native';
import { PieChart } from "react-native-chart-kit";

import { HIRE_DATA_COMPARE_TAB_LIST } from "../../../../../../utils/const";

const PercentForm = () => {
  const data = [
    {
      name: "Seoul",
      population: 10000000,
      color: "rgba(131, 167, 234, 1)",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15
    },
    {
      name: "Toronto",
      population: 2800000,
      color: "#F00",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15
    },
    {
      name: "Beijing",
      population: 527612,
      color: "red",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15
    },
    {
      name: "New York",
      population: 8538000,
      color: "yellow",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15
    },
    {
      name: "Moscow",
      population: 11920000,
      color: "rgb(0, 0, 255)",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15
    }
  ];

  const chartConfig = {
    backgroundGradientFrom: "#1E2923",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#08130D",
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false // optional
  };

  return (
    <View style={{flex: 1}} >
      <PieChart
        data={data}
        width={620}
        height={470}
        chartConfig={chartConfig}
        accessor={"population"}
        backgroundColor={"transparent"}
        paddingLeft={"15"}
        center={[20, 0]}
        absolute
      />
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

export default PercentForm;