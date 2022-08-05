import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AntDesign from 'react-native-vector-icons/AntDesign';

import NAVIGATION_KEYS from './key';
import NAVIGATION_PAGES from '../pages/index';

const Tab = createBottomTabNavigator();

const Tabbar = () => {
  
  return (
    <Tab.Navigator
      initialRouteName={NAVIGATION_KEYS.HOME}
      screenOptions={{
        headerTitleAlign: 'center',
        tabBarActiveTintColor: '#409EFF',
        tabBarInactiveTintColor: '#666666',
        tabBarItemStyle: {height: 100, paddingBottom: 6},
        tabBarLabelStyle: {fontSize: 25},
        header: ({navigation, options, route}) => {
          const params = {navigation, options, route};
          const title = options?.headerTitle;
          const headerCenterArea = options?.headerCenterArea && options?.headerCenterArea(params);

          return (
            <View style={styles.headerArea}>
              {headerCenterArea ? headerCenterArea : <View style={styles.centerArea}>
                <Text style={styles.centerAreaText}>{title}</Text>
              </View>}
            </View>
          )
        }
      }}>
      <Tab.Screen
        name={NAVIGATION_KEYS.HOME}
        component={NAVIGATION_PAGES.HOME}
        options={{
            tabBarLabel: '首页',
            headerTitle: '首页',
            tabBarIcon: ({focused}) => (
              <AntDesign
                name='home'
                size={48}
                color={focused ? '#409EFF' : '#666666'}
              />)
        }}/>
      <Tab.Screen
        name={NAVIGATION_KEYS.WORKBENCH}
        component={NAVIGATION_PAGES.WORKBENCH}
        options={{
            tabBarLabel: '工作台',
            headerTitle: '工作台',
            tabBarIcon: ({focused}) => (
              <AntDesign
                name='appstore-o' 
                size={48}
                color={focused ? '#409EFF' : '#666666'}
              />)
        }}/>
      <Tab.Screen
        name={NAVIGATION_KEYS.MESSAGE}
        component={NAVIGATION_PAGES.MESSAGE}
        options={{
            tabBarLabel: '消息',
            headerTitle: '消息',
            tabBarIcon: ({focused}) => (
              <AntDesign
                name='message1' 
                size={48}
                color={focused ? '#409EFF' : '#666666'}
              />)
        }}/>
      <Tab.Screen
        name={NAVIGATION_KEYS.MINE}
        component={NAVIGATION_PAGES.MINE}
        options={{
            tabBarLabel: '我的',
            headerTitle: '我的',
            tabBarIcon: ({focused}) => (
              <AntDesign
                name='user' 
                size={48}
                color={focused ? '#409EFF' : '#666666'}
              />)
        }}/>
    </Tab.Navigator>
)};

const styles = StyleSheet.create({
  headerArea: {
    height: 88, 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#ffffff'
  },
  centerArea: {
    flex: 1, 
    height: '100%', 
    flexDirection: 'column', 
    alignItems: 'center', 
    justifyContent: 'center'
  },
  centerAreaText: {
    textAlign: 'center', 
    fontSize: 36, 
    color: '#000'
  }
});

export default Tabbar;

