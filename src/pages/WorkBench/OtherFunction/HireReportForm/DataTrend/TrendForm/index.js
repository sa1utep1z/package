import React, {useState, useEffect, useMemo, memo} from "react";
import { View, StyleSheet, ScrollView } from 'react-native';
import { LineChart } from "react-native-chart-kit";
import Svg, { Circle, Text, Line } from 'react-native-svg';
import moment from "moment";

import { ORIGIN_SELECTED_STATUS_LIST, COLOR_LIST } from "../../../../../../utils/const";

const originRenderData = {
  datasets: [
    {
      data: [],
      color: () => '#409EFF'
    }
  ],
  labels: [],
  legend: ['']
};

const TrendForm = ({
  datas
}) => {
  console.log('datas', datas);

  const [renderData, setRenderData] = useState(originRenderData);

  useMemo(() => console.log('renderData',renderData), [renderData])

  useEffect(() => {
    if(datas?.length){
      let datasets = [];
      const selectedStatus = ORIGIN_SELECTED_STATUS_LIST.map(status => status.value);
      selectedStatus.map((status, statusIndex) => {
        const data = datas.map(item => item[status]);
        data.unshift('0');
        datasets.push({
          data,
          color: () => COLOR_LIST[statusIndex]
        })
      })
      const legend = ORIGIN_SELECTED_STATUS_LIST.map(status => status.title);
      const labels = datas.map(item => moment(item.orderDate).format('MM.DD'));
      labels.unshift('0');
      const data = {
        datasets,
        legend,
        labels
      };
      setRenderData(data);
    }
  }, [datas])
  
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
    color: () => '#333333',
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    fillShadowGradientFrom: '#fff',
    fillShadowGradientTo: '#fff',
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
    return (
    <View key={index}>
      <Text
        x={x-20}
        y={y-12}
        fill="#409EFF"
        fontSize="20"
        fontWeight="bold"
      >
        {indexData !== 0 ? indexData : '' }
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
  )};

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
      <View style={styles.bottomArea}>
        <ScrollView horizontal>
          <LineChart
            data={data}
            width={data.labels.length * 100}
            chartConfig={chartConfig}
            height={370}
            segments={6}
            bezier
            fromZero
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

export default TrendForm;