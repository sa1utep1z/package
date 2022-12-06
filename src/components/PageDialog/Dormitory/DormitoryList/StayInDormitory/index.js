import React, {useState, useRef} from "react";
import { Text, View, TouchableOpacity, StyleSheet, useWindowDimensions } from "react-native";
import { useDispatch } from "react-redux";
import { TabView } from 'react-native-tab-view';
import { useToast } from "react-native-toast-notifications";

import { closeDialog } from "../../../../../redux/features/PageDialog";
import Leave from './Leave';
import Adjust from './Adjust';

const routes = [
  { key: 'leave', title: '退宿'},
  { key: 'adjustment', title: '调迁宿舍'}
];

const StayInDormitory = ({
  dormitoryInfo,
  refresh,
  canOperate = true,
}) => {
  const dispatch = useDispatch();
  const toast = useToast();

  const leaveRef = useRef(null);
  const adjustRef = useRef(null);

  const layout = useWindowDimensions();

  const [index, setIndex] = useState(0);

  const passOnPress = () => {
    if(!canOperate){
      toast.show('无权限', {type: 'warning'});
      return;
    }
    if(index === 0 && !leaveRef?.current?.selectReason.length){
      leaveRef?.current?.scrollViewRef?.current?.scrollToEnd();
      leaveRef?.current?.setReasonWrong(true);
    }else if(index === 0) {
      leaveRef?.current?.restForm.submitForm();
    }else if(index === 1){
      adjustRef?.current?.restForm.submitForm();
    }
  };

  const rejectOnPress = () => dispatch(closeDialog());

  const renderScene = ({ route }) => {
    switch (route.key) {
      case 'leave':
        return <Leave ref={leaveRef} dormitoryInfo={dormitoryInfo} refresh={refresh} />
      case 'adjustment':
        return <Adjust ref={adjustRef} dormitoryInfo={dormitoryInfo} refresh={refresh} /> 
    }
  };

  const renderTabBar = ({navigationState}) => {
    return (
      <View style={styles.tabBarArea}>
        {navigationState.routes.map((route, routeIndex) => {
          const isSelected = routeIndex === index;
          return (
            <TouchableOpacity key={routeIndex} style={[styles.btnArea, routeIndex === 0 && styles.btn_not_selected, isSelected && styles.btn_selected]} activeOpacity={1} onPress={() => setIndex(routeIndex)}>
              <Text style={[styles.btnText, isSelected && styles.btnText_selected]}>{route.title}</Text>
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
        style={styles.tabViewArea}
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
            <Text style={[styles.confirmText, !canOperate && {color: '#999999'}]}>提交</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  )
};

const styles = StyleSheet.create({
  blueText: {
    color: '#409EFF'
  },
  itemText: {
    fontSize: 26, 
    color: '#333333', 
    marginBottom: 10
  },
  tabViewArea: {
    height: 760, 
    marginHorizontal: 20, 
    marginBottom: 20, 
    borderWidth: 1, 
    borderColor: '#EFEFEF', 
    borderRadius: 10
  },
  tabBarArea: {
    height: 70, 
    flexDirection: 'row', 
    backgroundColor: '#FFFFFF'
  },
  btnArea: {
    flex: 1, 
    justifyContent: 'center', 
    backgroundColor: '#EEEEEE'
  },
  btn_not_selected: {
    borderRightWidth: 1,
    borderColor: '#999999'
  },
  btn_selected: {
    backgroundColor: '#409EFF'
  },
  btnText: {
    fontSize: 26, 
    color: '#999999', 
    textAlign: 'center', 
    fontWeight: 'bold'
  },
  btnText_selected: {
    color: '#FFFFFF',
    fontSize: 28
  },
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