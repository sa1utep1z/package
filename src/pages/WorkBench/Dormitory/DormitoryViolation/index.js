import React, {useState, useEffect} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { TabView } from 'react-native-tab-view';
import { useDispatch } from 'react-redux';
import { Button } from '@rneui/themed';

import HeaderCenterSearch from "../../../../components/Header/HeaderCenterSearch";
import HeaderSearchOfDormitory from '../../../../components/HeaderSearchOfDormitory';
import CenterSelectDate from '../../../../components/List/CenterSelectDate';
import { openListSearch } from "../../../../redux/features/listHeaderSearch";
import { setStartDate, setEndDate } from '../../../../redux/features/RangeDateOfList';
import { deepCopy } from '../../../../utils';
import NAVIGATION_KEYS from '../../../../navigator/key';

import All from './All';
import Warn from './Warn';
import SecondWarn from './SecondWarn';
import Out from './Out';

const DormitoryViolation = ({
  route: {
    params
  }
}) => {
  const dispatch = useDispatch();
  const layout = useWindowDimensions();
  const navigation = useNavigation();

  useEffect(() => {
    dispatch(openListSearch());
    dispatch(setStartDate(''));
    dispatch(setEndDate(''));
    navigation.setOptions({
      headerCenterArea: ({...rest}) => <HeaderCenterSearch routeParams={rest}/>
    })
  }, [])

  const [index, setIndex] = useState(0);
  const [filterParams, setFilterParams] = useState({});
  const [routes, setRoutes] = useState([
    { key: 'total', title: '全部', number: 0 },
    { key: 'DORM_DISCIPLINE_RESULT_WARN', title: '警告', number: 0 },
    { key: 'DORM_DISCIPLINE_RESULT_SECONDARY_WARN', title: '二次警告', number: 0 },
    { key: 'DORM_DISCIPLINE_RESULT_OUT', title: '取消住宿', number: 0 },
  ]);

  const addViolation = () => navigation.navigate(NAVIGATION_KEYS.ADD_VIOLATION);

  const filter = (values)=> {
    const filteredParams = {
      buildingId: values.buildingNum.length ? values.buildingNum[0].value : '', //宿舍楼栋id
      floorId: values.floorNum.length ? values.floorNum[0].value : '', //宿舍楼层id
      roomId: values.roomNum.length ? values.roomNum[0].value : '', //宿舍房间id
      startDate: values.dateRange.startDate,
      endDate: values.dateRange.endDate,
    };
    setFilterParams(filteredParams);
  };

  const changeRoute = values => {
    const copyList = deepCopy(routes);
    copyList.forEach(route => route.number = (values.data.hasOwnProperty(route.key) ? values.data[route.key] : 0));
    setRoutes(copyList);
  };

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
          <Text style={[styles.titleText, {width: 130}]}>姓名</Text>
          <Text style={[styles.titleText, {width: 130}]}>楼栋</Text>
          <Text style={[styles.titleText, {width: 100}]}>房间号</Text>
          <Text style={[styles.titleText, {width: 100}]}>床位号</Text>
          <Text style={[styles.titleText, {flex: 1}]}>处罚日期</Text>
          <Text style={[styles.titleText, {width: 120}]}>结果</Text>
        </View>
      </>
    )
  };

  const renderScene = ({ route }) => {
    switch(route.key){
      case 'total':
        return <All index={index} filterParams={filterParams} changeRoute={changeRoute} routeParams={params} />
      case 'DORM_DISCIPLINE_RESULT_WARN':
        return <Warn index={index} filterParams={filterParams} changeRoute={changeRoute} routeParams={params} />
      case 'DORM_DISCIPLINE_RESULT_SECONDARY_WARN':
        return <SecondWarn index={index} filterParams={filterParams} changeRoute={changeRoute} routeParams={params} />
      case 'DORM_DISCIPLINE_RESULT_OUT':
        return <Out index={index} filterParams={filterParams} changeRoute={changeRoute} routeParams={params} />
    }
  };

  return (
    <View style={styles.screen}>
      <HeaderSearchOfDormitory 
        filterFun={filter}
        filterBuilding
        filterFloorAndRoom
        filterDateRange
        enterpriseStyle={{width: 140}}
        otherHeaderStyle={{paddingBottom: 10}}
      />
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
      <Button
        title="开罚单"
        onPress={addViolation}
        containerStyle={styles.buttonContainerStyle}
        buttonStyle={styles.buttonStyle}
        titleStyle={styles.titleStyle}
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
  titleText: {
    fontSize: 26, 
    textAlign: 'center', 
    color: '#333333'
  },
  headTitle: {
    flex: 1, 
    textAlign: 'center', 
    fontSize: 26, 
    color: '#333333'
  },
  buttonContainerStyle: {
    margin: 20
  },  
  buttonStyle: {
    height: 80,
    backgroundColor: '#409EFF',
    borderWidth: 0,
    borderRadius: 50
  },
  titleStyle: {
    fontSize: 32,
    fontWeight: 'bold',
    letterSpacing: 10
  }
});

export default DormitoryViolation;