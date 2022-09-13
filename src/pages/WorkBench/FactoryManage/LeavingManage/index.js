import React, {useState, useEffect, useRef} from "react";
import { View, Text, StyleSheet, useWindowDimensions, TouchableOpacity, Animated } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from 'react-redux';
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
import { useToast } from "react-native-toast-notifications";

import HeaderSearch from "../../../../components/List/HeaderSearch";
import HeaderCenterSearch from "../../../../components/Header/HeaderCenterSearch";
import { openListSearch } from "../../../../redux/features/listHeaderSearch";
import CenterSelectDate from "../../../../components/List/CenterSelectDate";
import LeavingManageApi from "../../../../request/LeavingManageApi";
import { SUCCESS_CODE } from "../../../../utils/const";
import { deepCopy } from "../../../../utils";
import NormalDialog from '../../../../components/NormalDialog';

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
  const dialogRef = useRef(null);

  const [index, setIndex] = useState(0);
  const [search, setSearch] = useState({});
  const [dialogContent, setDialogContent] = useState({});
  const [routes, setRoutes] = useState([
    { key: 'allNums', title: '全部', number: 0 },
    { key: 'pendingNums', title: '待审核', number: 0 },
    { key: 'failNums', title: '拒绝', number: 0 },
    { key: 'passNums', title: '通过', number: 0 }
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
    try{
      const res = await LeavingManageApi.LeavingApplyNumber(search);
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
    const createDateStart = values.dateRange.startDate;
    const createDateEnd = values.dateRange.endDate;
    const companyId = values.enterprise.length ? values.enterprise[0].value : '';
    const storeId = values.store.length ? values.store[0].storeId : '';
    const recruitId = values.staff.length ? values.staff[0].value : '';
    const userNameOrIdNo = values.search;

    setSearch({ createDateStart, createDateEnd, companyId, storeId, recruitId, userNameOrIdNo });
  };

  const renderScene = ({ route }) => {
    switch (route.key) {
      case 'allNums':
        return <Total search={search} dialogRef={dialogRef} setDialogContent={setDialogContent} />;
      case 'pendingNums':
        return <WaitToAudit search={search} dialogRef={dialogRef} />;
      case 'failNums':
        return <Reject search={search} dialogRef={dialogRef} />;
      case 'passNums':
        return <Pass search={search} dialogRef={dialogRef} />;
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
        singleSelect
        placeholder="请输入会员姓名或身份证"
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
      <NormalDialog 
        ref={dialogRef}
        dialogContent={dialogContent}
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