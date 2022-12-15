import React, {useState, useEffect} from "react";
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { StackedBarChart } from "react-native-chart-kit";

const CompareForm = ({
}) => {
  const [renderData, setRenderData] = useState({});

  useEffect(()=>{
    console.log('进来了没啊');
    
    setRenderData(data);
  },[])
  
  const data = {
    labels: ["241栋", "55栋", '33栋', '251栋'],
    legend: ["L1", "L2", "L3", 'L4'],
    data: [
      [60, 60, 60, 50],
      [30, 80, 10, 20],
      [10, 30, 60, 50],
      [30, 50, 90, 40],
    ],
    barColors: ["#dfe4ea", "#ced6e0", "#a4b0be", '#409EFF']
  };

  const chartConfig = {
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => '#333333',
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    propsForLabels: {
      fontSize: '22',
    },
    propsForBackgroundLines: {
      stroke: '#999999',
      strokeDasharray: '3,3'
    },
  };

  return (
    <View style={styles.bottomArea}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{paddingLeft: 20, marginTop: 20}}>
        <StackedBarChart
          data={data}
          width={data.labels.length * 200}
          height={500}
          formatYLabel={(num) => Math.trunc(num)}
          chartConfig={chartConfig}
        />
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  bottomArea: {
    height: 480,
    justifyContent: 'flex-end', 
    alignItems: 'center'
  }
});

export default CompareForm;