import React, {useState, useEffect} from "react";
import { View, Text, StyleSheet, useWindowDimensions, TouchableOpacity, Animated } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from 'react-redux';
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';

import HeaderSearch from "../../../../components/List/HeaderSearch";
import HeaderCenterSearch from "../../../../components/Header/HeaderCenterSearch";
import { openListSearch } from "../../../../redux/features/listHeaderSearch";
import CenterSelectDate from "../../../../components/List/CenterSelectDate";

import All from "./All";

const WaitToAudit = () => (
  <View style={{ flex: 1, backgroundColor: '#673ab7' }} />
);

const Reject = () => (
  <View style={{ flex: 1, backgroundColor: 'green' }} />
);

const Pass = () => (
  <View style={{ flex: 1, backgroundColor: 'blue' }} />
);

const LeavingManage = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const layout = useWindowDimensions();

  const [index, setIndex] = useState(0);
  const [search, setSearch] = useState({});
  const [routes] = useState([
    { key: 'first', title: '全部' },
    { key: 'second', title: '待审核' },
    { key: 'third', title: '拒绝' },
    { key: 'fourth', title: '通过' }
  ]);

  useEffect(() => {
    dispatch(openListSearch());
    navigation.setOptions({
      headerCenterArea: ({...rest}) => <HeaderCenterSearch routeParams={rest}/>
    })
  }, [])

  const filter = values => {
    const startDate = values.dateRange.startDate;
    const endDate = values.dateRange.endDate;
    const companyIds = values.enterprise.length ? values.enterprise.map(item => item.value) : [];
    const storeIds = values.store.length ? values.store.map(item => item.storeId) : [];
    const recruitIds = values.staff.length ? values.staff.map(item => item.value) : [];
    const str = values.search;

    setSearch({ startDate, endDate, str, companyIds, storeIds, recruitIds });
  };

  const renderScene = ({ route }) => {
    switch (route.key) {
      case 'first':
        return <All search={search} />;
      case 'second':
        return <WaitToAudit />;
      case 'third':
        return <Reject />;
      case 'fourth':
        return <Pass />;
      default:
        return null;
    }
  };

  const renderTabBar = ({navigationState}) => {
    return (
      <View style={{height: 120, flexDirection: 'row', backgroundColor: '#FFFFFF'}}>
        {navigationState.routes.map((route, routeIndex) => {
          const isSelected = routeIndex === index;
          return (
            <TouchableOpacity key={routeIndex} style={{flex: 1, justifyContent: 'center'}} onPress={() => setIndex(routeIndex)}>
              <Text style={[{fontSize: 32, color: '#333333', textAlign: 'center'}, isSelected && {color: '#409EFF', fontWeight: 'bold'}]}>{route.title}</Text>
            </TouchableOpacity>
          )
        })}
      </View>
    )
  };

  return (
    <View style={styles.screen}>
      <HeaderSearch 
        filterFun={filter} 
        startText="开始："
        endText="结束："
      />
      <CenterSelectDate />
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        renderTabBar={renderTabBar}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
      />
    </View>
  )
};

const styles = StyleSheet.create({
  screen: {
    flex: 1
  }
});

export default LeavingManage;