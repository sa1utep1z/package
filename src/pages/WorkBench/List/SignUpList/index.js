import React, {useRef, useEffect, useState, useMemo} from "react";
import { View, StyleSheet, TouchableOpacity, Text, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import { useToast } from "react-native-toast-notifications";
import moment from "moment";

import HeaderRightButtonOfList from '../../../../components/List/HeaderRightButtonOfList';
import HeaderSearch from "../../../../components/List/HeaderSearch";
import CenterSelectDate from "../../../../components/List/CenterSelectDate";
import HeaderCenterSearch from "../../../../components/Header/HeaderCenterSearch";
import BottomList from "../../../../components/List/BottomList";
import NAVIGATION_KEYS from "../../../../navigator/key";
import { MEMBER_INFO, TAB_OF_LIST, SUCCESS_CODE, SIGN_UP_STATUS, today } from "../../../../utils/const";
import ListApi from "../../../../request/ListApi";
import NormalDialog from "../../../../components/NormalDialog";
import FormCompanyDetail from "../../../../components/NormalDialog/FormCompanyDetail";
import FormMemberDetail from "../../../../components/NormalDialog/FormMemberDetail";
import ListChangeStatus from "../../../../components/NormalDialog/ListChangeStatus";

const SignUpList = () => {
  const toast = useToast();
  const navigation = useNavigation();

  const dialogRef = useRef(null);

  const rangeDate = useSelector(state => state.RangeDateOfList);

  const [memberInfoList, setMemberInfoList] = useState(MEMBER_INFO);
  const [dialogContent, setDialogContent] = useState({});
  const [searchContent, setSearchContent] = useState({ 
    pageSize: 20, 
    pageNumber: 0
  });
  const [showList, setShowList] = useState({
    content: []
  });
  const [tabList, setTabList] = useState(TAB_OF_LIST.SIGN_UP_LIST);
  const [tabNumberList, setTabNumberList] = useState({});

  useEffect(()=>{
    navigation.setOptions({
      headerCenterArea: ({...rest}) => <HeaderCenterSearch routeParams={rest}/>,
      headerRight: () => <HeaderRightButtonOfList />
    })
  }, [])

  useMemo(()=>{
    setSearchContent({
      pageSize: 20, 
      pageNumber: 0,
      startDate: moment(rangeDate.startDate).format('YYYY-MM-DD'), 
      endDate: moment(rangeDate.endDate).format('YYYY-MM-DD')
    });
  },[rangeDate])

  const getTypeList = async() => {
    const params = {
      companyIds: searchContent?.companyIds || [],  
      storeIds: searchContent?.storeIds || [],
      recruitIds: searchContent?.names || [],
      startDate: searchContent?.startDate || '',
      endDate: searchContent?.endDate || '',
      str: searchContent?.str || ''
    };
    try{
      const res = await ListApi.GetTypeList(params);
      console.log('获取tab下面数字的接口', res);
      if(res?.code !== SUCCESS_CODE){
        toast.show(`请求失败，请稍后重试。${res.data?.msg}`, {type: 'danger'});
        return;
      }
      setTabNumberList(res.data);
    }catch(err){
      toast.show(`出现了意料之外的问题，请联系系统管理员处理`, { type: 'danger' });
    }
  }

  const { isLoading, data, isError, status } = useQuery(['myMembers', searchContent], ListApi.SignUpList);
  if(isError){
    toast.show(`出现了意料之外的问题，请联系系统管理员处理`, { type: 'danger' });
  }
  if(status === 'success' && data?.code !== SUCCESS_CODE){
    toast.show(`${data?.msg}`, { type: 'danger' });
  }

  useMemo(()=>{
    if(data){
      if(showList.content.length >= 20 && (data.data.pageNumber - showList.pageNumber === 1)){
        showList.content = showList.content.concat(data.data.content);
        showList.pageNumber = data.data.pageNumber;
        setShowList(showList);
        return;
      }
      setShowList(data.data);
    }
    getTypeList();
  },[data])

  const filter = (values) => {
    const companyIds = values.enterprise.length ? values.enterprise.map(item => item.value) : [];
    const storeIds = values.store.length ? values.store.map(item => item.storeId) : [];
    const names = values.staff.length ? values.staff.map(item => item.value) : [];

    setSearchContent({
      pageSize: 20, 
      pageNumber: 0,
      startDate: values.dateRange.startDate, 
      endDate: values.dateRange.endDate, 
      str: values.search,
      companyIds,
      storeIds,
      names
    });
  };

  const selectIndex = (selectIndex) => {
    switch(selectIndex){
      case 0:
        searchContent.status = '';
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
    setSearchContent({...searchContent, pageNumber: 0, pageSize: 20});
  };

  const transferFactory = (item) => {
    dialogRef.current.setShowDialog(false);
    navigation.navigate(NAVIGATION_KEYS.TRANSFER_FACTORY, {item})
  };

  const pressFactory = async(item) => {
    try{
      const res = await ListApi.FactoryMessage(item.flowId);
      if(res?.code !== SUCCESS_CODE){
        toast.show(`请求失败，请稍后重试。${res?.msg}`, {type: 'danger'});
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
    dialogRef.current.setShowDialog(false);
    navigation.navigate(NAVIGATION_KEYS.EDIT_MEMBER, {
      fieldList: item
    });
  };

  const pressName = async(item) => {
    try{
      const res = await ListApi.MemberMessage(item.flowId);
      if(res?.code !== SUCCESS_CODE){
        toast.show(`请求失败，请稍后重试。${res?.msg}`, {type: 'danger'});
        return;
      }
      res.data.flowId = item.flowId;
      dialogRef.current.setShowDialog(true);
      setDialogContent({
        dialogTitle: '会员信息',
        dialogComponent: <FormMemberDetail memberInfoList={res.data}/>,
        rightTitle: '编辑',
        rightTitleOnPress: () => editMemberMessage(res.data)
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
      dialogComponent: <ListChangeStatus dialogRef={dialogRef} item={item}/>,
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
      dialogComponent: <Text style={{textAlign: 'center', marginVertical: 20, fontSize: 18}}>确定拨打该手机吗？</Text>
    });
  };
    
  const onEndReached = () => {
    if(showList.content.length < 20) return;
    if((showList.content.length >= 20) && (showList.pageNumber < showList.totalPages - 1)){
      if(searchContent.pageNumber < (showList.totalPages - 1)){
        setSearchContent({...searchContent, pageNumber: searchContent.pageNumber += 1});
      }
    }
  };

  const renderItem = ({item}) => {
    const renderList = [
      { fieldName: item.companyShortName, pressFun: () => pressFactory(item), textStyle: {color: '#409EFF', textAlign: 'left'}, itemStyle: {justifyContent: 'flex-start'}},
      { fieldName: item.name, pressFun: () => pressName(item)},
      { fieldName: SIGN_UP_STATUS[item.signUpStatus], pressFun: () => changeStatus(item)},
      { fieldName: item.mobile || '无', pressFun: () => {
        if(item.mobile){
          callPhone(item)
        }
      }, textStyle: {color: '#409EFF', fontSize: 24}}
    ];
    return (
      <View key={item.id} style={styles.listStyle}>
        {renderList.map((renderItem, index) => (
          <TouchableOpacity key={index} style={[styles.listItem, renderItem.itemStyle]} onPress={renderItem.pressFun}>
            <Text style={[
              styles.itemText, 
              renderItem.textStyle
            ]}
            numberOfLines={2}
            ellipsizeMode="tail">{renderItem.fieldName || '无'}</Text>
            {/* {renderItem.fieldName === item.mobile && <Entypo name='phone' size={30} color='#409EFF'/>} */}
          </TouchableOpacity>
        ))}
      </View>
    )
  };

  return (
    <View style={styles.screen}>
      <HeaderSearch 
        filterFun={filter} 
      />
      <CenterSelectDate />
      <BottomList
        tab={tabList}
        tabNumberList={tabNumberList}
        list={showList?.content}
        isLoading={isLoading}
        renderItem={renderItem}
        onEndReached={onEndReached}
        nowSelectIndex={selectIndex}
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
  }
});

export default SignUpList;