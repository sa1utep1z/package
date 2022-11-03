import React, {useState, useRef} from "react";
import { Text, View, TouchableOpacity, StyleSheet, useWindowDimensions } from "react-native";
import { useDispatch } from "react-redux";
import { TabView } from 'react-native-tab-view';

import { closeDialog } from "../../../../../redux/features/PageDialog";
import Leave from './Leave';
import Adjust from './Adjust';

const routes = [
  { key: 'leave', title: '退宿'},
  { key: 'adjustment', title: '调迁宿舍'}
];

const StayInDormitory = ({
}) => {
  const dispatch = useDispatch();
  const scrollViewRef = useRef(null);

  const layout = useWindowDimensions();

  const [index, setIndex] = useState(0);
  const [selectReason, setSelectReason] = useState('');
  const [reasonWrong, setReasonWrong] = useState(false);

  const passOnPress = () => {
    if(index === 0 && !selectReason.length){
      scrollViewRef?.current.scrollToEnd();
      setReasonWrong(true);
    }
  };

  const rejectOnPress = () => dispatch(closeDialog());

  const renderScene = ({ route }) => {
    switch (route.key) {
      case 'leave':
        return <Leave />
      case 'adjustment':
        return <Adjust /> 
    }
  };

  const renderTabBar = ({navigationState}) => {
    return (
      <View style={{height: 70, flexDirection: 'row', backgroundColor: '#FFFFFF'}}>
        {navigationState.routes.map((route, routeIndex) => {
          const isSelected = routeIndex === index;
          return (
            <TouchableOpacity key={routeIndex} style={[{flex: 1, justifyContent: 'center', backgroundColor: '#EEEEEE'}, routeIndex === 0 && {borderRightWidth: 1, borderColor: '#999999'}, isSelected && {backgroundColor: '#409EFF'}]} activeOpacity={1} onPress={() => setIndex(routeIndex)}>
              <Text style={[{fontSize: 26, color: '#999999', textAlign: 'center', fontWeight: 'bold'}, isSelected && {color: '#FFFFFF',  fontSize: 28}]}>{route.title}</Text>
            </TouchableOpacity>
          )
        })}
      </View>
    )
  };

  return (
    <>
      <TabView
        lazy
        bounces
        style={{height: 760, marginHorizontal: 20, marginBottom: 20, borderWidth: 1, borderColor: '#EFEFEF', borderRadius: 10}}
        navigationState={{ index, routes }}
        renderScene={renderScene}
        renderTabBar={renderTabBar}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
      />
      <View style={styles.bottomArea}>
        <View style={styles.leftArea}>
          <TouchableOpacity style={styles.buttonArea} onPress={rejectOnPress}>
            <Text style={styles.closeText}>取消</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.rightArea}>
          <TouchableOpacity style={styles.buttonArea} onPress={passOnPress}>
            <Text style={styles.confirmText}>提交</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  )
};

const styles = StyleSheet.create({
  bottomArea: {
    height: 100, 
    flexDirection: 'row'
  },
  leftArea: {
    flex: 1, 
    borderTopWidth: 1, 
    borderRightWidth: 1, 
    borderColor: '#E3E3E3'
  },
  rightArea: {
    flex: 1, 
    borderTopWidth: 1, 
    borderColor: '#E3E3E3'
  },
  buttonArea: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  closeText: {
    fontSize: 28, 
  },
  confirmText: {
    fontSize: 28, 
    color: '#409EFF'
  }
})

export default StayInDormitory;