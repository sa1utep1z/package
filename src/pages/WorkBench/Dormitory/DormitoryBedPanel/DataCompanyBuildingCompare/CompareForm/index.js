import React, {useState} from "react";
import { View, StyleSheet, ScrollView } from 'react-native';
import { StackedBarChart } from "react-native-chart-kit";

const CompareForm = ({
}) => {
  const [renderData, setRenderData] = useState({});
  
  const data = {
    labels: ["龙华CN", "龙华AC", '龙华ID', '龙华DP', '龙华CE', '龙华CE2'],
    data: [
      [60, 60, 120, 50],
      [30, 80, 110, 20],
      [10, 30, 40, 50],
      [30, 50, 80, 40],
      [40, 30, 50, 20],
      [22, 45, 23, 40],
    ],
    barColors: ['#2fe38c', '#0cbbea', '#160ae9', '#bbbbbb']
  };

  const chartConfig = {
    color: () => `rgba(0, 0, 0, 0)`,
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    propsForLabels: {
      fontSize: "18",
      fill: '#ffffff',
    },
    propsForVerticalLabels: {
      fontSize: "22",
      fill: '#000000',
    },
    propsForHorizontalLabels: {
      fontSize: "22",
      fill: '#000000',
    },
    propsForBackgroundLines: {
      stroke: '#999999',
      strokeDasharray: '3,3'
    },
  };

  return (
    <View style={styles.bottomArea}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <StackedBarChart
          style={styles.chartStyle}
          width={data.labels.length * 150}
          height={600}
          data={data}
          formatYLabel={(num)=>Math.trunc(num)} 
          chartConfig={chartConfig}
        />
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  bottomArea: {
    justifyContent: 'flex-end', 
    alignItems: 'center'
  },
  scrollView: {
    paddingLeft: 20, 
    marginTop: 20, 
    paddingBottom: 0
  },
  chartStyle: {
    marginBottom: -80, 
    marginTop: 20
  }
});

export default CompareForm;