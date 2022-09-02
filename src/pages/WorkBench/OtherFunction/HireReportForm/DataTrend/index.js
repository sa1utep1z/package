import React, {useState} from "react";
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Shadow } from 'react-native-shadow-2';

import Tab from "../Component/Tab";
import { HIRE_DATA_TREND_TAB_LIST } from "../../../../../utils/const";

import CompanyRoute from "./CompanyRoute";
import StoreRoute from "./StoreRoute";
import RecruiterRoute from "./RecruiterRoute";
import SupplierRoute from "./SupplierRoute";

const DataTrend = ({loading}) => {
  
  const renderScene = ({route}) => {
    switch(route.key){
      case 'company': 
        return <CompanyRoute />
      case 'store':
        return <StoreRoute />
      case 'recruiter':
        return <RecruiterRoute />
      case 'supplier':
        return <SupplierRoute />
    }
  };

  return (
    <Shadow>
      <View style={styles.totalArea}>
        <View style={styles.titleArea}>
          <View style={styles.titleLine}></View>
          <Text style={styles.title}>数据趋势</Text>
        </View>
        {loading ?
          <Tab renderScene={renderScene} renderRoute={HIRE_DATA_TREND_TAB_LIST}/> : 
          <View style={{flex: 1, justifyContent: 'center'}}>
            <ActivityIndicator size={48} color="#409EFF" />
          </View>}
      </View>
    </Shadow>
  )
};

const styles = StyleSheet.create({
  totalArea: {
    height: 655,
    width: 686,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 32,
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
    backgroundColor: '#409EFF', 
    marginRight: 9, 
    borderTopRightRadius: 5, 
    borderBottomLeftRadius: 5
  },
  title: {
    fontSize: 36, 
    color: '#000', 
    fontWeight: 'bold'
  }
});

export default DataTrend;