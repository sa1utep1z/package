import React, {useState, useEffect} from "react";
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { PieChart } from "react-native-chart-kit";

import { PERCENT_COLOR_LIST } from "../../../../../../utils/const";
import EmptyArea from '../../../../../../components/EmptyArea';

const originRenderData = [
  {
    name: "无",
    population: 100,
    color: "rgba(131, 167, 234, 1)",
    legendFontColor: "#7F7F7F",
    legendFontSize: 20
  }
];

const PercentForm = ({
  data, //数据源
  loading, //是否显示加载中
  bottomText = '', //底部显示top10文字内容
}) => {

  const [renderData, setRenderData] = useState(originRenderData);

  useEffect(() => {
    let formatData = [];
    if(data.length){
      data.map((renderData, renderDataIndex) => {
        formatData.push({
          name: `${renderData.name}(${renderData.num}人)`,
          population: renderData.num,
          color: PERCENT_COLOR_LIST[renderDataIndex],
          legendFontColor: "#000000",
          legendFontSize: 20
        })
      })
      setRenderData(formatData);
    }else{
      setRenderData([]);
    }
  }, [data])

  const chartConfig = {
    backgroundGradientFrom: "#1E2923",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#08130D",
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false
  };

  return (
    <View style={{flex: 1}} >
      {!loading ? <>
        {renderData.length ? 
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <PieChart
              data={renderData}
              width={660}
              height={470}
              chartConfig={chartConfig}
              accessor={"population"}
              backgroundColor={"transparent"}
              center={[25,0]}
            />
          </ScrollView> : 
          <View style={{flex: 1}}>
            <EmptyArea otherStyle={{height: 450}} size={45} />
        </View>} 
        </> : <View style={{height: 470, justifyContent: 'center'}}>
          <ActivityIndicator size={48} color="#409EFF" />
      </View>}
      <Text style={styles.bottomTextArea}>{bottomText}</Text>
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
  },
  bottomTextArea: {
    textAlign: 'center', 
    color: '#FF4040', 
    fontSize: 22
  }
});

export default PercentForm;