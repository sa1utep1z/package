import React, {useState} from "react";
import { View, StyleSheet, ScrollView } from 'react-native';
import { LineChart } from "react-native-chart-kit";
import Svg, { Circle, Text, Line } from 'react-native-svg';

import Tag from "../../Component/Tag";
import { HIRE_DATA_BOX_TAG_LIST } from "../../../../../../utils/const";

const CompanyRoute = ({CompanyList}) => {
  
  const data = {
    labels: ["", "6.1", "6.2", "6.3", "6.4", "6.5", "6.6",  "6.1", "6.2", "6.3", "6.4", "6.5", "6.6",  "6.1", "6.2", "6.3", "6.4", "6.5", "6.6", "6.1", "6.2", "6.3", "6.4", "6.5", "6.6", "6.1", "6.2", "6.3", "6.4", "6.5", "6.6"],
    datasets: [
      {
        data: ['', 155, 240, 130, 260, 320, 170, 155, 240, 130, 260, 320, 170, 155, 240, 130, 260, 320, 170, 155, 240, 130, 260, 320, 170, 155, 240, 130, 260, 320, 170], 
        color: () => '#409EFF'
      }
    ],
    legend: ['已报名']
  };

  const chartConfig = {
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    fillShadowGradientFrom: '#409EFF',
    fillShadowGradientTo: '#fff',
    fillShadowGradientFromOpacity: 1,
    fillShadowGradientFromOffset: 0.1,
    color: () => '#333333',
    strokeWidth: 2, 
    useShadowColorFromDataset: false,
    propsForLabels: {
      fontSize: '22',
      fontWeight: 'bold'
    },
    propsForBackgroundLines: {
      stroke: '#999999',
      strokeDasharray: '2,2'
    }
  };

  const renderDotContent = ({x, y, index, indexData})=> (
    <View key={index}>
      <Text
        x={x-20}
        y={y-12}
        fill="#409EFF"
        fontSize="20"
        fontWeight="bold"
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
          x={width - 40}
          y={height - 50}
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
      <Tag tagList={HIRE_DATA_BOX_TAG_LIST} lastButton CompanyList={CompanyList}/>
      <View style={styles.bottomArea}>
        <ScrollView horizontal>
          <LineChart
            data={data}
            chartConfig={chartConfig}
            width={data.labels.length * 50}
            height={370}
            segments={6}
            bezier
            fromZero
            getDotColor={(...rest) => console.log('getDotColor-rest', rest)}
            decorator={decorator}
            withOuterLines={false}
            withVerticalLines={false}
            formatYLabel={(num) => Math.trunc(num)}
            renderDotContent={renderDotContent}
          />
        </ScrollView>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  bottomArea: {
    flex: 1, 
    justifyContent: 'flex-end', 
    alignItems: 'center'
  }
});

export default CompanyRoute;