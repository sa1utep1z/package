import React, {useState} from "react";
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Shadow } from 'react-native-shadow-2';
import Entypo from 'react-native-vector-icons/Entypo';

import { FAKE_HIRE_DATA_BOX_LIST } from "../../../../../utils/const";
import Tag from "../Component/Tag";

const DataOverview = () => {
  return (
    <View style={styles.totalArea}>
      <View style={styles.titleArea}>
        <View style={styles.titleLine}></View>
        <Text style={styles.title}>数据概览</Text>
      </View>
      <View style={styles.bottomArea}>
        <Tag tagAreaStyle={{paddingLeft: 20}}/>
        <View style={styles.dataArea}>
          {FAKE_HIRE_DATA_BOX_LIST.map((data, dataIndex) => {
            return (
              <View key={dataIndex} style={styles.data}>
                <Shadow distance={15} startColor={'#f5f8fa'} endColor={'#fff'}>
                  <View style={styles.dataBox}>
                    <View style={styles.dataBox_top}>
                      <Text style={styles.dataBox_top_text}>{data.title}</Text>
                    </View>
                    <View style={styles.dataBox_center}>
                      <Text style={styles.dataBox_center_text}>{data.num}</Text>
                    </View>
                    <View style={styles.dataBox_bottom}>
                      <Text style={styles.dataBox_bottom_text}>{`较昨日${data.trendNumber > 0 ? `+${data.trendNumber}` : `${data.trendNumber}`}`}</Text>
                      <Entypo 
                        size={30} 
                        name={data.trendNumber < 0 ? 'arrow-up' : 'arrow-down'}
                        color={data.trendNumber < 0 ? '#FF4040' : '#409EFF'}
                      />
                    </View>
                  </View>
                </Shadow>
              </View>
            )
          })}
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  totalArea: {
    height: 581, 
    width: 686,
    marginBottom: 30, 
    backgroundColor: '#409EFF', 
    borderRadius: 10, 
    padding: 30
  },
  titleArea: {
    marginBottom: 20, 
    flexDirection: 'row', 
    alignItems: 'center'
  },
  titleLine: {
    width: 6,
    height: 32, 
    backgroundColor: '#fff', 
    marginRight: 9, 
    borderTopRightRadius: 5, 
    borderBottomLeftRadius: 5
  },
  title: {
    fontSize: 36, 
    color: '#fff', 
    fontWeight: 'bold'
  },
  bottomArea: {
    flex: 1, 
    backgroundColor: '#fff', 
    borderRadius: 10
  },
  dataArea: {
    flex: 1, 
    flexDirection: 'row', 
    flexWrap: 'wrap'
  },
  data: {
    width: '33.33%', 
    height: '50%', 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  dataBox: {
    width: 160, 
    height: 160, 
    borderRadius: 6
  },
  dataBox_top: {
    flex: 1, 
    justifyContent: 'center'
  },
  dataBox_top_text: {
    fontSize: 24, 
    color: '#000', 
    textAlign: 'center'
  },
  dataBox_center: {
    flex: 1 
  },
  dataBox_center_text: {
    textAlign: 'center', 
    fontSize: 40, 
    fontWeight: 'bold',
    color: '#000'
  },
  dataBox_bottom: {
    flex: 1, 
    justifyContent: 'center', 
    flexDirection: 'row', 
    marginLeft: 10
  },
  dataBox_bottom_text: {
    textAlign: 'center', 
    fontSize: 22, 
    color: '#000'
  }
});

export default DataOverview;