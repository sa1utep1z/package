import React, {useState, useEffect} from "react";
import { View, Text, StyleSheet, useWindowDimensions, TouchableOpacity, Animated } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from 'react-redux';
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
import { useToast } from "react-native-toast-notifications";

import HeaderSearch from "../../../../components/List/HeaderSearch";
import HeaderCenterSearch from "../../../../components/Header/HeaderCenterSearch";
import { openListSearch } from "../../../../redux/features/listHeaderSearch";
import CenterSelectDate from "../../../../components/List/CenterSelectDate";
import ListApi from "../../../../request/ListApi";
import { SUCCESS_CODE } from "../../../../utils/const";
import { deepCopy } from "../../../../utils";

import Total from "./Total";
import WaitToAudit from "./WaitToAudit";
import Reject from "./Reject";
import Pass from "./Pass";

let timer;

const LeavingManage = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const layout = useWindowDimensions();
  const toast = useToast();

  const [index, setIndex] = useState(0);
  const [search, setSearch] = useState({});
  const [routes, setRoutes] = useState([
    { key: 'total', title: '全部', number: 0 },
    { key: 'pending', title: '待审核', number: 0 },
    { key: 'noArrive', title: '拒绝', number: 0 },
    { key: 'fail', title: '通过', number: 0 }
  ]);

  useEffect(() => {
    dispatch(openListSearch());
    navigation.setOptions({
      headerCenterArea: ({...rest}) => <HeaderCenterSearch routeParams={rest}/>
    })
  }, [])

  useEffect(() => {
    timer = setTimeout(()=>{
      getTypeList();
    }, 0)
    return () => timer && clearTimeout(timer);
  }, [search])

  const getTypeList = async() => {
    const params = {
      companyIds: search?.companyIds || [],  
      storeIds: search?.storeIds || [],
      recruitIds: search?.recruitIds || [],
      startDate: search?.startDate || '',
      endDate: search?.endDate || '',
      str: search?.str || '',
      role: "RECRUIT"
    };
    try{
      const res = await ListApi.GetInterviewTypeList(params);
      if(res?.code !== SUCCESS_CODE){ 
        toast.show(`${res?.msg}`, {type: 'danger'});
        return;
      }
      const copyRoute = deepCopy(routes);
      copyRoute.find(route => {
        const routeKey = route.key;
        route.number = res.data[routeKey];
      })
      setRoutes(copyRoute);
    }catch(err){
      toast.show(`出现了意料之外的问题，请联系系统管理员处理`, { type: 'danger' });
    }
  };

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
      case 'total':
        return <Total search={search} />;
      case 'pending':
        return <WaitToAudit search={search} />;
      case 'noArrive':
        return <Reject search={search} />;
      case 'fail':
        return <Pass search={search} />;
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
    <View style={styles.screen}>
      <HeaderSearch 
        filterFun={filter} 
        // startText="开始："
        // endText="结束："
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
    </View>
  )
};

const styles = StyleSheet.create({
  screen: {
    flex: 1
  }
});

export default LeavingManage;