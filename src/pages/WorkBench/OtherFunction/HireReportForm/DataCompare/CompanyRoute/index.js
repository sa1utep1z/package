import React from "react";
import { View, StyleSheet } from 'react-native';
import { LineChart } from "react-native-chart-kit";
import Svg, { Circle, Text, Line } from 'react-native-svg';

import Tag from "../../Component/Tag";
import { HIRE_DATA_COMPARE_TAB_LIST } from "../../../../../../utils/const";

const CompanyRoute = () => {

  const data = {
    labels: ["", "6.1", "6.2", "6.3", "6.4", "6.5", "6.6"],
    datasets: [
      {
        data: ['', 155, 240, 130, 260, 320, 170], 
        color: () => '#7640FF'
      },
      {
        data: ['', 65, 95, 300, 320, 235, 190], 
        color: () => '#FFA800'
      }
    ],
    legend: ['本周', '上周']
  };

  const chartConfig = {
    color: () => '#333333',
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    propsForLabels: {
      fontSize: '22',
      fontWeight: 'bold'
    },
    propsForBackgroundLines: {
      stroke: '#999999',
      strokeDasharray: '2,2'
    }
  };

  const renderDotContent = ({x, y, index, indexData})=> {
    let belong = '';
    const dataIndex = data.datasets[0].data.findIndex(data => data === indexData);
    if(dataIndex === index){
      belong = 'first';
    }
    return (
      <View>
        <Text
          x={x-20}
          y={y-10}
          fill={belong === 'first' ? "#7640FF" : "#FFA800"}
          fontSize="20"
          fontWeight="bold"
        >
          {indexData}
        </Text>
        <Circle
          cx={x}
          cy={y}
          r="6"
          strokeWidth="2"
          stroke={belong === 'first' ? "#7640FF" : "#FFA800"}
          fill="#fff"
        />
      </View>
    )
  };

  const decorator = ({width, height, ...rest})=>{
    return (
      <Svg width={width} height={height}>
        <Line x1="70" y1={height - 76} x2={width} y2={height - 76} stroke="#999999" strokeWidth="2" />
        <Line x1={width - 10} y1={height - 85} x2={width} y2={height - 76} stroke="#999999" strokeWidth="2" />
        <Line x1={width - 10} y1={height - 65} x2={width} y2={height - 76} stroke="#999999" strokeWidth="2" />
        <Line x1="65" y1={-30} x2="65" y2={height - 82} stroke="#999999" strokeWidth="2" />
        <Line x1="65" y1={-30} x2="55" y2={-20} stroke="#999999" strokeWidth="2" />
        <Line x1="65" y1={-30} x2="75" y2={-20} stroke="#999999" strokeWidth="2" />
        <Text
          x={5}
          y={-25}
          fontSize="22"
          fontWeight="bold"
          fill="#333333">
            人数
        </Text>
        <Text
          x={width - 50}
          y={height - 40}
          fontSize="22"
          fontWeight="bold"
          fill="#333333">
            日期
        </Text>
      </Svg>
    )
  };

  return (
    <View style={{flex: 1}} >
      <Tag tagList={HIRE_DATA_COMPARE_TAB_LIST} lastButton />
      <View style={styles.LineArea}>
        <LineChart
          style={styles.LineStyle}
          data={data}
          chartConfig={chartConfig}
          width={620}
          height={370}
          segments={6}
          bezier
          fromZero
          getDotColor={(...rest) => console.log('getDotColor-color', rest)}
          decorator={decorator}
          withShadow={false}
          withOuterLines={false}
          withVerticalLines={false}
          formatYLabel={(num) => Math.trunc(num)}
          renderDotContent={renderDotContent}
        />
      </View>
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

export default CompanyRoute;