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
import NAVIGATION_KEYS from '../../../../navigator/key';
import { setStartDate, setEndDate } from '../../../../redux/features/RangeDateOfList';

import All from './All';
import Pending from './Pending';
import Leave from './Leave';
import Living from './Living';
import { deepCopy } from '../../../../utils';

const DormitoryList = ({
  route: {
    params
  }
}) => {
  const dispatch = useDispatch();
  const layout = useWindowDimensions();
  const navigation = useNavigation();

  const [index, setIndex] = useState(0);
  const [routes, setRoutes] = useState([
    { key: 'allNums', title: '全部', number: 0 },
    { key: 'pendingNums', title: '待入住', number: 0 },
    { key: 'outNums', title: '离宿', number: 0 },
    { key: 'inNums', title: '在宿', number: 0 },
  ]);
  const [filterParams, setFilterParams] = useState({});

  useEffect(() => {
    dispatch(openListSearch());
    dispatch(setStartDate(''));
    dispatch(setEndDate(''));
    navigation.setOptions({
      headerCenterArea: ({...rest}) => <HeaderCenterSearch routeParams={rest}/>
    })
  }, [])

  const filter = (values)=> {
    const filteredParams = {
      companyId: values.enterprise.length ? values.enterprise[0].value : '', //企业
      liveInType: values.liveType[0].value, //入住类别
      name: values.search || '',

      roomBuildingId: values.buildingNum.length ? values.buildingNum[0].value : '', //宿舍楼栋id
      roomFloorId: values.floorNum.length ? values.floorNum[0].value : '', //宿舍楼层id
      roomId: values.roomNum.length ? values.roomNum[0].value : '', //宿舍房间id
      roomBedId: values.bedNum.length ? values.bedNum[0].value : '', //房间床位id
    };
    setFilterParams(filteredParams);
  };

  const changeRoute = values => {
    const copyList = deepCopy(routes);
    copyList.forEach(route => route.number = values[route.key]);
    setRoutes(copyList);
  };

  const createDormitory = () => navigation.navigate(NAVIGATION_KEYS.CREATE_DORMITORY);

  const renderScene = ({ route }) => {
    switch(route.key){
      case 'allNums':
        return <All index={index} filterParams={filterParams} changeRoute={changeRoute} routeParams={params} />
      case 'pendingNums':
        return <Pending index={index} filterParams={filterParams} changeRoute={changeRoute} routeParams={params} />
      case 'outNums':
        return <Leave index={index} filterParams={filterParams} changeRoute={changeRoute} routeParams={params} />
      case 'inNums':
        return <Living index={index} filterParams={filterParams} changeRoute={changeRoute} routeParams={params} />
    }
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
          <Text style={[styles.headTitle, {flex: 0, width: 100}]}>姓名</Text>
          <Text style={styles.headTitle}>宿舍信息</Text>
          <Text style={styles.headTitle}>入住日期</Text>
          <Text style={styles.headTitle}>企业</Text>
          <Text style={[styles.headTitle, {flex: 0, width: 100}]}>状态</Text>
          <Text style={[styles.headTitle, {flex: 0, width: 120}]}>招聘来源</Text>
        </View>
      </>
    )
  };

  return (
    <View style={styles.screen}>
      <HeaderSearchOfDormitory 
        filterFun={filter}
        selectIndex={index}
        filterMore
        filterMemberInfo
        filterEnterprise
        filterBuilding
        filterLiveType
        enterpriseStyle={{width: 140}}
      />
      <CenterSelectDate />
      <TabView
        bounces
        navigationState={{ index, routes }}
        renderScene={renderScene}
        renderTabBar={renderTabBar}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
      />
      <Button
        title="新增住宿"
        onPress={createDormitory}
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

export default DormitoryList;