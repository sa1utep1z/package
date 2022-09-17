import React, {useState, useEffect, useMemo, memo} from "react";
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { LineChart } from "react-native-chart-kit";
import Svg, { Text, Line } from 'react-native-svg';
import moment from "moment";

import { COLOR_LIST } from "../../../../../../utils/const";

let arrayIndex = 0;
const originRenderData = {
  datasets: [
    {
      data: [0, 0, 0, 0, 0, 0, 0],
      color: () => '#409EFF'
    }
  ],
  labels: [0, 0, 0, 0, 0, 0, 0],
  legend: ['未选择']
};

const TrendForm = ({
  data, //数据源
  loading, //是否显示加载中
  selectedState, //已选择的状态
}) => {
  const [renderData, setRenderData] = useState(originRenderData);

  useEffect(() => {
    console.log('selectedState',selectedState)
    if(data?.length){
      let datasets = [];
      const selectedStatus = selectedState.map(status => status.value);
      selectedStatus.map((status, statusIndex) => {
        const newData = data.map(item => item[status]);
        newData.unshift(0);
        datasets.push({
          data: newData,
          color: () => COLOR_LIST[statusIndex]
        })
      })
      const legend = selectedState.map(status => status.title);
      const labels = data.map(item => moment(item.orderDate).format('M/D'));
      labels.unshift('0');
      const renderData = {
        datasets,
        legend,
        labels
      };
      setRenderData({...renderData});
    }
  }, [data])

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
    if(index === 0){
      arrayIndex ++;
    }
    return (
      <View key={`${arrayIndex}${index}`}>
        <Text
          x={x-17}
          y={y-12}
          fill={'rgba(0,0,0,1)'}
          fontSize="20">
          {!!indexData ? indexData : '' }
        </Text>
      </View>
  )};

  const decorator = ({width, height, ...rest})=>{
    return (
      <Svg width={width} height={height}>
        <Line x1="64" y1={-30} x2="64" y2={height - 101} stroke="#999999" strokeWidth="2" />
        <Line x1="64" y1={-30} x2="55" y2={-20} stroke="#999999" strokeWidth="2" />
        <Line x1="64" y1={-30} x2="75" y2={-20} stroke="#999999" strokeWidth="2" />
        <Text
          x={5}
          y={-25}
          fontSize="22"
          fontWeight="bold"
          fill="#333333">
            人数
        </Text>
        <Text
          x={width - 45}
          y={400}
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
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {!loading ? <LineChart
            data={renderData}
            width={renderData.labels.length * 100}
            chartConfig={chartConfig}
            height={460}
            segments={6}
            bezier
            fromZero
            decorator={decorator}
            withOuterLines={false}
            withVerticalLines={false}
            formatYLabel={(num) => Math.trunc(num)}
            renderDotContent={renderDotContent}
          /> : <View style={{flex: 1, justifyContent: 'center'}}>
            <ActivityIndicator size={48} color="#409EFF" />
          </View>}
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