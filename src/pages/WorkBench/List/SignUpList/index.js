import React, {useRef, useEffect, useState, useMemo} from "react";
import { View, StyleSheet, TouchableOpacity, Text, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { useToast } from "react-native-toast-notifications";
import moment from "moment";

import HeaderRightButtonOfList from '../../../../components/List/HeaderRightButtonOfList';
import HeaderSearch from "../../../../components/List/HeaderSearch";
import CenterSelectDate from "../../../../components/List/CenterSelectDate";
import HeaderCenterSearch from "../../../../components/Header/HeaderCenterSearch";
import BottomList from "../../../../components/List/BottomList";
import NAVIGATION_KEYS from "../../../../navigator/key";
import { TAB_OF_LIST, SUCCESS_CODE, SIGN_UP_STATUS } from "../../../../utils/const";
import ListApi from "../../../../request/ListApi";
import NormalDialog from "../../../../components/NormalDialog";
import FormCompanyDetail from "../../../../components/NormalDialog/FormCompanyDetail";
import FormMemberDetail from "../../../../components/NormalDialog/FormMemberDetail";
import StatusChangeInSignUpList from "../../../../components/NormalDialog/StatusChangeInSignUpList";
import CallPhone from "../../../../components/NormalDialog/CallPhone";
import { replaceMobile } from "../../../../utils";

let timer;
const firstPage = {pageSize: 20, pageNumber: 0};

const SignUpList = () => {
  const toast = useToast();
  const navigation = useNavigation();

  const dialogRef = useRef(null);

  const rangeDate = useSelector(state => state.RangeDateOfList);
  const role = useSelector(state => state.roleSwitch.role);

  const [searchContent, setSearchContent] = useState({role, ...firstPage});
  const [showList, setShowList] = useState([]);
  const [originData, setOriginData] = useState({});
  const [tabNumberList, setTabNumberList] = useState({});
  const [dialogContent, setDialogContent] = useState({});
  const [nextPage, setNextPage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => <HeaderRightButtonOfList />,
      headerCenterArea: ({...rest}) => <HeaderCenterSearch routeParams={rest}/>
    })
  }, [])

  useEffect(()=>{
    timer && clearTimeout(timer);
    timer = setTimeout(()=>{
      getList(searchContent);
      getTypeList();
    }, 0)
    return () => timer && clearTimeout(timer);
  }, [searchContent])

  //修改角色时
  useMemo(()=>{
    setSearchContent({
      ...searchContent,
      ...firstPage,
      role
    });
  },[role])

  const getList = async(params) => {
    console.log('getList --> params', params)
    setIsLoading(true);
    try{
      const res = await ListApi.SignUpList(params);
      console.log('getList --> res', res);
      if(res?.code !== SUCCESS_CODE){
        toast.show(`${res?.msg}`, {type: 'danger'});
        return;
      }
      //初始数据
      setOriginData(res.data);
      //渲染的列表（有下一页时）
      if(nextPage){
        setShowList([...showList, ...res.data.content]);
        setNextPage(false);
        return;
      }
      //无下一页（第一页）
      setShowList(res.data.content);
    }catch(err){
      toast.show(`出现了意料之外的问题，请联系系统管理员处理`, { type: 'danger' });
    }finally{
      setIsLoading(false);
    }
  };

  const getTypeList = async() => {
    const params = {
      companyIds: searchContent?.companyIds || [],  
      storeIds: searchContent?.storeIds || [],
      recruitIds: searchContent?.names || [],
      startDate: searchContent?.startDate || '',
      endDate: searchContent?.endDate || '',
      str: searchContent?.str || '',
      role
    };
    try{
      console.log('getTypeList --> params', params)
      const res = await ListApi.GetTypeList(params);
      console.log('getTypeList --> res', res);
      if(res?.code !== SUCCESS_CODE){
        toast.show(`${res?.msg}`, {type: 'danger'});
        return;
      }
      setTabNumberList(res.data);
    }catch(err){
      toast.show(`出现了意料之外的问题，请联系系统管理员处理`, { type: 'danger' });
    }
  }

  const filter = (values) => {
    const startDate = values.dateRange.startDate;
    const endDate = values.dateRange.endDate;
    const companyIds = values.enterprise.length ? values.enterprise.map(item => item.value) : [];
    const storeIds = values.store.length ? values.store.map(item => item.storeId) : [];
    const names = values.staff.length ? values.staff.map(item => item.value) : [];
    const str = values.search;

    setSearchContent({
      ...searchContent,
      ...firstPage,
      startDate,
      endDate,
      str,
      companyIds,
      storeIds,
      names
    });
  };

  const selectIndex = (selectIndex) => {
    switch(selectIndex){
      case 0:
        searchContent.status = 'ALL';
        break;
      case 1:
        searchContent.status = 'SIGN_UP_PENDING';
        break;
      case 2:
        searchContent.status = 'SIGN_UP_NO_INTENTION';
        break;
      case 3:
        searchContent.status = 'SIGN_UP_INTENTION';
        break;
    }
    setSearchContent({...searchContent, ...firstPage});
  };

  const transferFactory = (item) => {
    dialogRef.current.setShowDialog(false);
    navigation.navigate(NAVIGATION_KEYS.TRANSFER_FACTORY, {
      item,
      refresh
    })
  };

  const pressFactory = async(item) => {
    try{
      const res = await ListApi.FactoryMessage(item.flowId);
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
        dialogComponent: <FormCompanyDetail message={res.data}/>,
        rightTitle: '转厂/转单',
        rightTitleOnPress: () => transferFactory(item)
      });
    }catch(err){
      toast.show(`出现了意料之外的问题，请联系系统管理员处理`, { type: 'danger' });
    }
  };

  const editMemberMessage = (item) => {
    console.log('item', item);
    dialogRef.current.setShowDialog(false);
    navigation.navigate(NAVIGATION_KEYS.COMPLETE_MEMBER, {
      item,
      refresh
    });
  };

  const pressName = async(item) => {
    let hasAllMessage = true;
    try{
      const res = await ListApi.MemberMessage(item.flowId);
      console.log('res', res);
      if(res?.code !== SUCCESS_CODE){
        toast.show(`${res?.msg}`, {type: 'danger'});
        return;
      }
      res.data.flowId = item.flowId;
      dialogRef.current.setShowDialog(true);
      if(!res.data.idNo || !res.data.mobile || !res.data.name){
        hasAllMessage = false;
      }
      setDialogContent({
        dialogTitle: '会员信息',
        dialogComponent: <FormMemberDetail memberInfoList={res.data}/>,
        rightTitle: !hasAllMessage && searchContent.status === 'SIGN_UP_PENDING' ? '完善信息' : '',
        rightTitleOnPress: () => editMemberMessage(item)
      });
    }catch(err){
      toast.show(`出现了意料之外的问题，请联系系统管理员处理`, { type: 'danger' });
    }
  };

  const changeStatus = (item) => {
    if(item.signUpStatus !== 'SIGN_UP_PENDING'){
      toast.show(`状态已确定！`, {type: 'warning'});
      return;
    }
    dialogRef.current.setShowDialog(true);
    setDialogContent({
      dialogTitle: '待处理',
      bottomButton: false,
      dialogComponent: <StatusChangeInSignUpList dialogRef={dialogRef} item={item} refresh={refresh}/>
    });
  };

  const callPhone = item => {
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

  const refresh = () => setSearchContent({...searchContent, ...firstPage});

  const onEndReached = () => {
    if(originData.hasNext){
      const nextPage = {...searchContent, pageNumber: searchContent.pageNumber += 1};
      setSearchContent(nextPage);
      setNextPage(true);
    }
  };
    
  const renderItem = ({item}) => {
    const renderList = [
      { 
        fieldName: item.companyShortName, 
        textStyle: { color: '#409EFF', textAlign: 'center' },
        pressFun: () => pressFactory(item)
      },
      { 
        fieldName: item.name, 
        pressFun: () => pressName(item)
      },
      { 
        fieldName: SIGN_UP_STATUS[item.signUpStatus], 
        pressFun: () => changeStatus(item)
      },
      { 
        fieldName: item.mobile ? replaceMobile(item.mobile) : '无', 
        textStyle: {color: '#409EFF', fontSize: 24},
        pressFun: () => item.mobile && callPhone(item)
      }
    ];
    return (
      <View key={item.id} style={styles.listStyle}>
        {renderList.map((renderItem, index) => (
          <TouchableOpacity 
            key={index} 
            style={[styles.listItem, renderItem.itemStyle]} 
            onPress={renderItem.pressFun}>
            <Text 
              style={[
                styles.itemText, 
                renderItem.textStyle
              ]}
              numberOfLines={2}
              ellipsizeMode="tail">{renderItem.fieldName || '无'}</Text>
          </TouchableOpacity>
        ))}
      </View>
    )
  };

  const listHead = (
    <View style={styles.tabArea}>
      <Text style={styles.tab}>企业</Text>
      <Text style={styles.tab}>姓名</Text>
      <Text style={styles.tab}>状态</Text>
      <Text style={styles.tab}>联系方式</Text>
    </View>   
  );

  return (
    <View style={styles.screen}>
      <HeaderSearch filterFun={filter}/>
      <CenterSelectDate />
      <BottomList
        list={showList}
        renderItem={renderItem}
        tab={TAB_OF_LIST.SIGN_UP_LIST}
        tabNumberList={tabNumberList}
        listHead={listHead}
        isLoading={isLoading}
        onRefresh={refresh}
        onEndReached={onEndReached}
        nowSelectIndex={selectIndex}
        hasNext={originData?.hasNext}
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
  },
  listStyle: {
    minHeight: 80,
    borderBottomWidth: 2, 
    borderBottomColor: 'rgba(0, 0, 0, .05)',
    flexDirection: 'row', 
    marginHorizontal: 34
  },
  listItem: {
    flex: 1, 
    flexDirection: 'row',
    justifyContent: 'center', 
    alignItems: 'center'
  },
  itemText: {
    fontSize: 32,
    color: '#000',
    textAlign: 'center'
  },
  tabArea: {
    height: 60,
    backgroundColor: '#fff', 
    flexDirection: 'row'
  },
  tab: {
    flex: 1, 
    textAlign: 'center', 
    fontSize: 30, 
    color: '#333333'
  }
});

export default SignUpList;