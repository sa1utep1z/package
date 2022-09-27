import React, {useState, useEffect, useRef} from "react";
import { View, Text, StyleSheet, useWindowDimensions, TouchableOpacity, Linking } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from 'react-redux';
import { TabView } from 'react-native-tab-view';
import { useToast } from "react-native-toast-notifications";

import HeaderSearch from "../../../../components/List/HeaderSearch";
import HeaderCenterSearch from "../../../../components/Header/HeaderCenterSearch";
import { openListSearch } from "../../../../redux/features/listHeaderSearch";
import CenterSelectDate from "../../../../components/List/CenterSelectDate";
import LeavingManageApi from "../../../../request/LeavingManageApi";
import { SUCCESS_CODE } from "../../../../utils/const";
import { deepCopy } from "../../../../utils";
import NormalDialog from '../../../../components/NormalDialog';
import CallPhone from "../../../../components/NormalDialog/CallPhone";
import FormCompanyDetail from "../../../../components/NormalDialog/FormCompanyDetail";
import FormMemberDetail from "../../../../components/NormalDialog/FormMemberDetail";
import StatusAudit from '../../../../components/NormalDialog/StatusAudit';

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

  const audit = async(type, memberInfo, time) => {
    const detailId = memberInfo.applyDetailId;
    const params = {
      pass: type === 'pass',
      approveData: {
        resignDate: time
      }
    };
    try {
      const res = await LeavingManageApi.Audit(detailId, params);
      if(res?.code !== SUCCESS_CODE){
        toast.show(`${res?.msg}`, {type: 'danger'});
        return;
      }
      toast.show(`修改成功！`, {type: 'success'});
      setSearch({...search});
    } catch (error) {
      console.log('error', error);
      toast.show(`出现了意料之外的问题，请联系系统管理员处理`, { type: 'danger' });
    } finally{
      dialogRef.current.setShowDialog(false);
    }
  };

  const pressName = (item) => {
    dialogRef.current.setShowDialog(true);
    setDialogContent({
      dialogTitle: '温馨提示',
      confirmOnPress: () => {
        Linking.openURL(`tel:${item.mobile}`)
        dialogRef.current.setShowDialog(false);
      },
      dialogComponent: <CallPhone message={item}/>
    });
  };

  const pressStatus = async(item) => {
    if(item.status !== 'PENDING'){
      toast.show('状态已确定！', {type: 'warning'});
      return;
    }
    try{
      const res = await LeavingManageApi.ResignApply(item.applyId);
      if(res?.code !== SUCCESS_CODE){
        toast.show(`${res?.msg}`, {type: 'danger'});
        return;
      }
      dialogRef.current.setShowDialog(true);
      setDialogContent({
        dialogTitle: '离职审核',
        bottomButton: false,
        rightCloseIcon: true,
        dialogComponent: <StatusAudit memberInfo={res.data} audit={audit} />
      });
    }catch(err){
      toast.show(`出现了意料之外的问题，请联系系统管理员处理`, { type: 'danger' });
    }
  };

  const pressDetail = async(item) => {
    try{
      const res = await LeavingManageApi.MemberInfo(item.applyId);
      if(res?.code !== SUCCESS_CODE){
        toast.show(`${res?.msg}`, {type: 'danger'});
        return;
      }
      dialogRef.current.setShowDialog(true);
      setDialogContent({
        dialogTitle: '会员信息',
        dialogComponent: <FormMemberDetail memberInfoList={res.data} noResignDate/>
      });
    }catch(err){
      toast.show(`出现了意料之外的问题，请联系系统管理员处理`, { type: 'danger' });
    }
  };

  const pressFactory = async(item) => {
    try{
      const res = await LeavingManageApi.OrderInfo(item.applyId);
      if(res?.code !== SUCCESS_CODE){
        if(res?.code === 2){
          toast.show(`${res?.msg}`, {type: 'warning'});
          return;
        }
        toast.show(`${res?.msg}`, {type: 'danger'});
        return;
      }
      dialogRef.current.setShowDialog(true);
      setDialogContent({
        dialogTitle: '岗位信息',
        dialogComponent: <FormCompanyDetail message={res.data}/>
      });
    }catch(err){
      toast.show(`出现了意料之外的问题，请联系系统管理员处理`, { type: 'danger' });
    }
  };

  const filter = values => {
    const createDateStart = values.dateRange.startDate;
    const createDateEnd = values.dateRange.endDate;
    const companyId = values.enterprise.length ? values.enterprise[0].value : '';
    const storeId = values.store.length ? values.store[0].storeId : '';
    const recruiterId = values.staff.length ? values.staff[0].value : '';
    const userNameOrIdNo = values.search;

    setSearch({ createDateStart, createDateEnd, companyId, storeId, recruiterId, userNameOrIdNo });
  };

  const renderScene = ({ route }) => {
    switch (route.key) {
      case 'allNums':
        return <Total search={search} pressName={pressName} pressStatus={pressStatus} pressDetail={pressDetail} pressFactory={pressFactory}/>;
      case 'pendingNums':
        return <WaitToAudit search={search} pressName={pressName} pressStatus={pressStatus} pressDetail={pressDetail} pressFactory={pressFactory}/>;
      case 'failNums':
        return <Reject search={search} pressName={pressName} pressStatus={pressStatus} pressDetail={pressDetail} pressFactory={pressFactory} />;
      case 'passNums':
        return <Pass search={search} pressName={pressName} pressStatus={pressStatus} pressDetail={pressDetail} pressFactory={pressFactory} />;
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
        startText="申请开始："
        endText="申请结束："
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