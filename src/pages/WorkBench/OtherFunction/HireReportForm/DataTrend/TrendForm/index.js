import React, {useState, useEffect} from "react";
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { LineChart } from "react-native-chart-kit";
import Svg, { Text, Line } from 'react-native-svg';
import moment from "moment";

import { COLOR_LIST } from "../../../../../../utils/const";
import EmptyArea from '../../../../../../components/EmptyArea';

let arrayIndex = 0;
const originRenderData = {
  datasets: [
    {
      data: [0, 0, 0, 0, 0, 0, 0],
      color: () => '#409EFF'
    }
  ],
  labels: [0, 0, 0, 0, 0, 0, 0],
  legend: ['无数据']
};

const TrendForm = ({
  data, //数据源
  loading, //是否显示加载中
}) => {
  const [renderData, setRenderData] = useState(originRenderData);

  useEffect(() => {
    if(data.length){
      const labels = data[0].content.map(item => moment(item.orderDate).format('M/D'));
      labels.unshift('0');
      let datasets = [];
      data.map((item, index) => {
        if(item.content.length){
          const itemArr = item.content.map(data => data.num);
          itemArr.unshift(0);
          datasets.push({
            data: itemArr,
            color: () => COLOR_LIST[index]
          })
        }
      })
      const renderData = {
        datasets,
        labels,
        legend: []
      };
      setRenderData(renderData);
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
          fill={'rgba(0,0,0,0.5)'}
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
    <View style={styles.bottomArea}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {!loading ? <>
          {data.length ? <LineChart
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
            <EmptyArea />
          </View>}
        </> : <View style={{flex: 1, justifyContent: 'center'}}>
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

export default TrendForm;