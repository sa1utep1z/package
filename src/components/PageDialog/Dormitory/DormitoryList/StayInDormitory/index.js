import React, {useState} from "react";
import { ScrollView, Text, View, TouchableOpacity, StyleSheet, useWindowDimensions } from "react-native";
import { useDispatch } from "react-redux";
import { Formik, Field } from 'formik';
import { CheckBox } from '@rneui/themed';
import { Shadow } from 'react-native-shadow-2';
import { TabView, TabBar } from 'react-native-tab-view';

import { closeDialog } from "../../../../../redux/features/PageDialog";
import SelectTimeOfFilterMore from '../../../../HeaderSearchOfDormitory/FilterMore/SelectTimeOfFilterMore';

let restForm;
const initialValues = {
  buildingNum: [],
  stayDate: ''
};

const StayInDormitory = ({
}) => {
  const dispatch = useDispatch();
  const layout = useWindowDimensions();

  const [index, setIndex] = useState(0);
  const [routes, setRoutes] = useState([
    { key: 'allNums', title: '全部', number: 0 },
    { key: 'pendingNums', title: '待审核', number: 0 },
    { key: 'failNums', title: '拒绝', number: 0 },
    { key: 'passNums', title: '通过', number: 0 }
  ]);

  const passOnPress = () => dispatch(closeDialog());

  const rejectOnPress = () => dispatch(closeDialog());

  const renderScene = ({ route }) => {
    switch (route.key) {
      case 'allNums':
        return <View style={{borderWidth: 1, height: 200, borderColor: 'red'}}></View>
      case 'pendingNums':
        return <View style={{borderWidth: 1, height: 200, borderColor: 'blue'}}></View>
      case 'failNums':
        return <View style={{borderWidth: 1, height: 200, borderColor: 'orange'}}></View>
      case 'passNums':
        return <View style={{borderWidth: 1, height: 200, borderColor: '#999999'}}></View>
    }
  };

  const renderTabBar = ({navigationState}) => {
    return (
      <View style={{height: 120, flexDirection: 'row', backgroundColor: '#FFFFFF'}}>
        {navigationState.routes.map((route, routeIndex) => {
          const isSelected = routeIndex === index;
          return (
            <TouchableOpacity key={routeIndex} style={{flex: 1, justifyContent: 'center'}} onPress={() => setIndex(routeIndex)}>
              <Text style={[{fontSize: 28, color: '#333333', textAlign: 'center'}, isSelected && {color: '#409EFF', fontWeight: 'bold', fontSize: 32}]}>{route.title}</Text>
              <Text style={[{fontSize: 28, textAlign: 'center'}, isSelected && {color: '#409EFF', fontWeight: 'bold', fontSize: 32}]}>{route.number}</Text>
            </TouchableOpacity>
          )
        })}
      </View>
    )
  };

  return (
    <>
      <View style={{height: 400, borderWidth: 1, paddingHorizontal: 20}}>
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
  topArea: {
    flex: 1, 
    paddingHorizontal: 30
  },
  blueText: {
    color: '#409EFF'
  },
  itemText: {
    fontSize: 28, 
    color: '#333333', 
    marginBottom: 15
  },
  typeArea: {
    height: 60, 
    marginBottom: 20, 
    flexDirection: 'row'
  },
  typeArea_title: {
    minWidth: 140, 
    fontSize: 28, 
    color: '#000', 
    textAlignVertical: 'center'
  },
  typeArea_radio: {
    flex: 1, 
    borderWidth: 1, 
    borderRadius: 6, 
    borderColor: '#999999', 
    flexDirection: 'row'
  },
  leftRadio: {
    flexDirection: 'row', 
    alignItems: 'center', 
    marginHorizontal: 10
  },
  rightRadio: {
    flexDirection: 'row', 
    alignItems: 'center'
  },
  radioText: {
    fontSize: 26, 
    color: '#000', 
    textAlignVertical: 'center'
  },
  dormitoryArea: {
    width: '100%', 
    marginBottom: 30
  },
  dormitoryArea_topArea: {
    height: 60, 
    backgroundColor: '#EFEFEF', 
    justifyContent: 'center', 
    borderTopRightRadius: 10, 
    borderTopLeftRadius: 10
  },
  dormitoryArea_topAreaText: {
    fontSize: 28, 
    fontWeight: 'bold', 
    textAlign: 'center'
  },
  dormitoryArea_bottomArea: {
    flex: 1, 
    padding: 10
  },
  listItem: {
    height: 50, 
    flexDirection: 'row', 
    borderTopWidth: 1, 
    borderLeftWidth: 1, 
    borderRightWidth: 1, 
    borderColor: '#409EFF', 
    alignItems: 'center'
  },
  lastItem: {
    height: 50, 
    flexDirection: 'row', 
    borderWidth: 1, 
    borderColor: '#409EFF', 
    alignItems: 'center'
  },
  leftTitle: {
    width: 150, 
    height: '100%', 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderRightWidth: 1, 
    borderColor: '#409EFF', 
    backgroundColor: '#ECF5FF'
  },
  titleText: {
    fontSize: 24, 
    color: '#333333', 
    fontWeight: 'bold'
  },
  rightText: {
    fontSize: 24, 
    paddingLeft: 20, 
    color: '#333333'
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
  },
})

export default StayInDormitory;