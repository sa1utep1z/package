import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity,   useWindowDimensions } from 'react-native';
import { TabView } from 'react-native-tab-view';

import HeaderSearchOfDormitory from '../../../../components/HeaderSearchOfDormitory';
import CenterSelectDate from '../../../../components/List/CenterSelectDate';
import BottomList from './BottomList';

const DormitoryList = () => {
  const layout = useWindowDimensions();

  const [index, setIndex] = useState(0);
  const [routes, setRoutes] = useState([
    { key: 'all', title: '全部', number: 0 },
    { key: 'pending', title: '待入住', number: 0 },
    { key: 'leaving', title: '离宿', number: 0 },
    { key: 'staying', title: '在宿', number: 0 },
  ]);

  const renderScene = () => <BottomList type={index} />

  const renderTabBar = ({navigationState}) => {
    return (
      <>
        <View style={styles.tabArea}>
          {navigationState.routes.map((route, routeIndex) => {
            const isSelected = routeIndex === index;
            return (
              <TouchableOpacity key={routeIndex} style={styles.tabItem} onPress={() => setIndex(routeIndex)}>
                <Text style={[styles.tabText, isSelected && styles.tabText_selected]}>{route.title}</Text>
                <Text style={[styles.tabNumberText, isSelected && styles.tabNumberText_selected]}>{route.number}</Text>
              </TouchableOpacity>
            )
          })}
        </View>
        <View style={styles.listHeadArea}>
          <Text style={styles.headTitle}>姓名</Text>
          <Text style={styles.headTitle}>宿舍信息</Text>
          <Text style={styles.headTitle}>入住日期</Text>
          <Text style={styles.headTitle}>企业</Text>
          <Text style={styles.headTitle}>状态</Text>
          <Text style={styles.headTitle}>招聘来源</Text>
        </View>
      </>
    )
  };

  return (
    <View style={styles.screen}>
      <HeaderSearchOfDormitory />
      <CenterSelectDate />
      <TabView
        lazy
        bounces
        navigationState={{ index, routes }}
        renderScene={renderScene}
        renderTabBar={renderTabBar}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1
  },
  tabArea: {
    height: 120, 
    flexDirection: 'row', 
    backgroundColor: '#FFFFFF'
  },
  tabItem: {
    flex: 1, 
    justifyContent: 'center'
  },
  tabText: {
    fontSize: 28, 
    color: '#333333', 
    textAlign: 'center'
  },
  tabText_selected: {
    color: '#409EFF', 
    fontWeight: 'bold', 
    fontSize: 32
  },
  tabNumberText: {
    fontSize: 28, 
    textAlign: 'center'
  },
  tabNumberText_selected: {
    color: '#409EFF', 
    fontWeight: 'bold', 
    fontSize: 32
  },
  listHeadArea: {
    height: 50, 
    flexDirection: 'row', 
    alignItems: 'flex-start', 
    backgroundColor: '#ffffff'
  },
  headTitle: {
    flex: 1, 
    textAlign: 'center', 
    fontSize: 26, 
    color: '#333333'
  }
});

export default DormitoryList;