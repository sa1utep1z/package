import React, {useState, useEffect} from "react";
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { StackedBarChart } from "react-native-chart-kit";

const CompareForm = ({
}) => {
  const [renderData, setRenderData] = useState({});

  useEffect(()=>{
    console.log('进来了没啊');
    
    setRenderData(data);
  },[])
  
  const data = {
    labels: ["241栋", "55栋", '33栋', '251栋', '811栋'],
    data: [
      [60, 60, 120, 50, 20],
      [30, 80, 110, 20, 30],
      [10, 30, 40, 50, 40],
      [30, 50, 80, 40, 50],
      [20, 78, 98, 200, 60],
    ],
    barColors: ['#2fe38c', '#0cbbea', '#160ae9', '#bbbbbb', '#ff4d50']
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
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{paddingLeft: 20, marginTop: 20, paddingBottom: 0}}>
        <StackedBarChart
          data={data}
          style={{ marginBottom: -80, marginTop: 20}}
          width={data.labels.length * 150}
          height={600}
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
  }
});

export default CompareForm;