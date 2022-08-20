import React from "react";
import { View, StyleSheet } from 'react-native';
import { LineChart } from "react-native-chart-kit";
import Svg, { Circle, Text } from 'react-native-svg';

import Tag from "../../Component/Tag";

const SupplierStore = () => {
  const data = {
    labels: ["", "6.1", "6.2", "6.3", "6.4", "6.5", "6.6"],
    datasets: [
      {
        data: ['', 155, 240, 130, 260, 320, 170], 
        color: () => '#409EFF'
      }
    ],
    legend: ['已报名']
  };

  const chartConfig = {
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    fillShadowGradientFrom: '#409EFF',
    fillShadowGradientFromOpacity: 1,
    fillShadowGradientFromOffset: 0.2,
    fillShadowGradientTo: '#fff',
    color: () => '#333333',
    strokeWidth: 2, 
    barPercentage: 0.5,
    useShadowColorFromDataset: false, // optional  
    barPercentage: 0.8,
    propsForLabels: {
      fontWeight: 'bold',
      fontSize: '22'
    },
    propsForVerticalLabels: {
      fontWeight: 'bold',
      fontSize: '22'
    },
    propsForBackgroundLines: {
      stroke: '#333333',
      strokeDashoffset: 1
    }
  };

  const renderDotContent = ({x, y, index, indexData})=> (<View key={index}>
      <Text
        x={x-20}
        y={y-15}
        fontSize="22"
        fontWeight="bold"
        fill="#409EFF"
      >
        {indexData}
      </Text>
      <Circle
        cx={x}
        cy={y}
        r= "6"
        strokeWidth="2"
        stroke="#409EFF"
        fill="#fff"
      />
    </View>
  );

  return (
    <View style={{flex: 1}} >
      <Tag lastButton />
      {/* <View style={{flex: 1, justifyContent: 'flex-end', alignItems: 'center'}}>
        <LineChart
          style={styles.LineStyle}
          data={data}
          chartConfig={chartConfig}
          width={620}
          height={370}
          segments={6}
          bezier
          fromZero
          withOuterLines={false}
          withVerticalLines={false}
          formatYLabel={(num) => Math.trunc(num)}
          onDataPointClick={({value, dataset, getColor})=> console.log('哇啊哈哈哈', value, dataset)}
          renderDotContent={renderDotContent}
        />
      </View> */}
    </View>
  )
}

const styles = StyleSheet.create({
  LineStyle: {
    position: 'absolute',
    bottom: -30
  }
});

export default SupplierStore;