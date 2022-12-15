import React, {useState, useEffect, useMemo} from "react";
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

const CompareForm = ({
  data, //数据源
  loading, //是否显示加载中
  selectedState, //已选择的状态
}) => {
  const [renderData, setRenderData] = useState(originRenderData);

  useEffect(() => {
    if(data?.length){
      let datasets = [], labels = [];
      const selectedStatus = selectedState[0].value;
      data.map((list, listIndex) => {
        const newData = list.content.map(item => item[selectedStatus]);
        newData.unshift(0);
        datasets.push({
          data: newData,
          color: () => COLOR_LIST[listIndex]
        });
        list.content.map((item, itemIndex) => {
          labels[itemIndex] = labels[itemIndex] ? labels[itemIndex] + 'VS' + moment(item.orderDate).format('M/D') : moment(item.orderDate).format('M/D');
        });
      })
      labels.unshift('');
      const renderData = {
        datasets,
        legend: [],
        labels
      };
      setRenderData({...renderData});
    }
  }, [data])

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
    if(index === 0){
      arrayIndex ++;
    }
    return (
      <View key={`${arrayIndex}${index}`}>
        <Text
          x={x-20}
          y={y-10}
          fill={'rgba(0,0,0,0.5)'}
          fontSize="20">
          {!!indexData ? indexData : '' }
        </Text>
      </View>
    )
  };

  const decorator = ({width, height, ...rest})=>{
    return (
      <Svg width={width} height={height}>
        <Line x1="64" y1={-30} x2="64" y2={height - 101} stroke="#999999" strokeWidth="2" />
        <Line x1="64" y1={-30} x2="55" y2={-20} stroke="#999999" strokeWidth="2" />
        <Line x1="64" y1={-30} x2="75" y2={-20} stroke="#999999" strokeWidth="2" />
        <Text x={5} y={-25} fontSize="22" fontWeight="bold" fill="#333333">人数</Text>
        <Text x={width - 45} y={400} fontSize="22" fontWeight="bold" fill="#333333">日期</Text>
      </Svg>
    )
  };

  return (
    <View style={styles.bottomArea}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {!loading ? <LineChart
          data={renderData}
          chartConfig={chartConfig}
          width={renderData.labels.length * 150}
          height={460}
          segments={6}
          bezier
          fromZero
          decorator={decorator}
          withShadow={false}
          withOuterLines={false}
          withVerticalLines={false}
          formatYLabel={(num) => Math.trunc(num)}
          renderDotContent={renderDotContent}
        /> : <View style={{flex: 1, justifyContent: 'center'}}>
        <ActivityIndicator size={48} color="#409EFF" />
      </View>}
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