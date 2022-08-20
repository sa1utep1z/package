import React from "react";
import { View, Text, StyleSheet } from 'react-native';
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart
} from "react-native-chart-kit";

import Tag from "../../Component/Tag";

const CompanyRoute = () => {

  const data = {
    labels: ["6.1", "6.2", "6.3", "6.4", "6.5", "6.6"],
    datasets: [
      {
        data: [155, 240, 130, 260, 320, 170],
        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`
      }
    ],
    // legend: ["Rainy Days"] // optional
  };

  const chartConfig = {
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    fillShadowGradientFrom: '#409EFF',
    fillShadowGradientFromOpacity: 1,
    fillShadowGradientFromOffset: 0.3,
    fillShadowGradientTo: '#fff',
    color: (opacity = 1) => '#333333',
    strokeWidth: 3, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false, // optional  
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: "#409EFF"
    },
    propsForLabels: {
      fontWeight: 'bold',
      fontSize: '22'
    },
    propsForVerticalLabels: {
      fontWeight: 'bold',
      fontSize: '22',
      rotation: '0'
    },
    propsForBackgroundLines: {
      
    }
  };

  return (
    <View style={{flex: 1}} >
      <Tag lastButton />
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <LineChart
          data={data}
          width={626}
          height={380}
          verticalLabelRotation={30}
          chartConfig={chartConfig}
          bezier
          style={{
            borderWidth: 1,
          }}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({

});

export default CompanyRoute;