import React, {useRef, useEffect, useState, useMemo} from "react";
import { View, StyleSheet, TouchableOpacity, Text, ScrollView} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import { useToast } from "react-native-toast-notifications";

import NAVIGATION_KEYS from "../../../../navigator/key";
import { TAB_OF_LIST, MEMBERS_STATUS } from "../../../../utils/const";
import MyMembersApi from "../../../../request/MyMembersApi";
import { SUCCESS_CODE } from "../../../../utils/const";
import HeaderSearch from "../../../../components/List/HeaderSearch";
import HeaderCenterSearch from "../../../../components/Header/HeaderCenterSearch";
import BottomList from "../../../../components/List/BottomList";
import NormalDialog from "../../../../components/NormalDialog";
import CompanyDetail from "../../../../components/NormalDialog/CompanyDetail";
import MemberDetail from "../../../../components/NormalDialog/MemberDetail";
import EntryRecord from "../../../../components/NormalDialog/EntryRecord";
import ReviewRecord from "../../../../components/NormalDialog/ReviewRecord";


const MyMembers = () => {
  const toast = useToast();
  
  const navigation = useNavigation();

  const dialogRef = useRef(null);

  const showSearch = useSelector(state => state.listHeaderSearch.canSearch);

  const [searchContent, setSearchContent] = useState({ pageSize: 20, pageNumber: 0 });
  const [dialogContent, setDialogContent] = useState({});
  const [showList, setShowList] = useState({
    content: []
  });

  useEffect(()=>{
    navigation.setOptions({
      headerCenterArea: ({...rest}) => <HeaderCenterSearch routeParams={rest}/>
    })
  }, [])

  const { isLoading, data, isError, error, refetch, status } = useQuery(['myMembers', searchContent], MyMembersApi.MyMemberList);
  if(isError){
    toast.show(`出现了意料之外的问题，请联系系统管理员处理`, { type: 'danger' });
  }
  if(status === 'success' && data?.code !== SUCCESS_CODE){
    toast.show(`${data?.msg}`, { type: 'danger' });
  }
  console.log('data', data);

  useMemo(()=>{
    if(data){
      //如果当前的渲染列表中hasNext为true且当前页面与接口请求数据的pageNumber不一样，就将新数据与目前渲染列表衔接到一起并渲染出来；
      if(showList.hasNext && data.data.pageNumber !== showList.pageNumber){
        const concatList = showList.content.concat(data.data.content);
        showList.content = concatList;
        showList.pageNumber = data.data.pageNumber;
        showList.hasNext = data.data.hasNext;
        setShowList(showList);  
        return;
      }
      setShowList(data.data);
    }
  },[data])

  const rightTitleOnPress = (msg, data) => {
    navigation.navigate(NAVIGATION_KEYS.EDIT_RETURN_VISIT, {
      formList: msg,
      historyList: data
    });
  };

  const memberDetailOnPress = async(msg) => {
    const poolId = msg?.poolId;
    try{
      const res = await MyMembersApi.MemberDetail(poolId);
      if(data?.code !== SUCCESS_CODE){
        toast.show(`请求失败，请稍后重试。${data?.msg}`, {type: 'danger'});
        return;
      }
      dialogRef.current.setShowDialog(true);
      setDialogContent({
        dialogTitle: '会员信息',
        dialogComponent: <MemberDetail memberInfoList={res.data}/>
      });
    }catch(err){
      toast.show(`出现了意料之外的问题，请联系系统管理员处理`, { type: 'danger' });
    }
  };

  const companyDetailOnPress = async(msg) => {
    const poolId = msg?.poolId;
    try{
      const res = await MyMembersApi.CompanyDetail(poolId);
      console.log('res', res)
      if(data?.code !== SUCCESS_CODE){
        toast.show(`请求失败，请稍后重试。${data?.msg}`, {type: 'danger'});
        return;
      }
      if(!res.data.orderPolicyDetail){
        toast.show('暂无订单详情', {type: 'warning'});
        return;
      }
      dialogRef.current.setShowDialog(true);
      setDialogContent({
        dialogTitle: '企业详情',
        dialogComponent: <CompanyDetail msg={msg} message={res.data.orderPolicyDetail}/>
      });
    }catch(err){
      toast.show(`出现了意料之外的问题，请联系系统管理员处理`, { type: 'danger' });
    }
  };

  const entryRecordOnPress = async(msg) => {
    const poolId = msg?.poolId;
    try{
      const res = await MyMembersApi.EntryRecord(poolId);
      if(data?.code !== SUCCESS_CODE){
        toast.show(`请求失败，请稍后重试。${data?.msg}`, {type: 'danger'});
        return;
      }
      if(!res.data.length){
        toast.show('暂无入职记录', {type: 'warning'});
        return;
      }
    }catch(err){
      toast.show(`出现了意料之外的问题，请联系系统管理员处理`, { type: 'danger' });
    }
  };

  const reviewRecordOnPress = async(msg) => {
    const poolId = msg?.poolId;
    try{
      const res = await MyMembersApi.ReviewRecord(poolId);
      if(data?.code !== SUCCESS_CODE){
        toast.show(`请求失败，请稍后重试。${data?.msg}`, {type: 'danger'});
        return;
      }
      if(!res.data.length){
        toast.show('暂无回访记录', {type: 'warning'});
        return;
      }
      dialogRef.current.setShowDialog(true);
      setDialogContent({
        dialogTitle: '回访记录',
        rightTitle: '编辑',
        rightTitleOnPress: () => rightTitleOnPress(msg, res.data),
        dialogComponent: <ReviewRecord item={msg} reviewList={res.data}/>
      });
    }catch(err){
      toast.show(`出现了意料之外的问题，请联系系统管理员处理`, { type: 'danger' });
    }
  };

  const renderItem = ({item}) => {
    const renderList = [
      { fieldName: item.userName, pressFun: () => memberDetailOnPress(item)},
      { 
        fieldName: item.willSignUpCompanyName || '无', 
        textStyle: !item.willSignUpCompanyName && {color: '#000'},
        pressFun: () => {
          if(item.willSignUpCompanyName){
            companyDetailOnPress(item);
            return;
          }
          toast.show('暂无企业', { type: 'warning' });
        }
      },
      { fieldName: '查看', pressFun: () => entryRecordOnPress(item)},
      { fieldName: '查看', pressFun: () => reviewRecordOnPress(item)},
      { fieldName: item.memberStatus ?  MEMBERS_STATUS[item.memberStatus] : '无'},
      { fieldName: '加入', pressFun: () => navigation.navigate(NAVIGATION_KEYS.JOIN_IN_SIGN_UP)}
    ];
    
    return (
      <View key={item.poolId} style={styles.listStyle}>
        {renderList.map((renderItem, index) => (
          <TouchableOpacity key={index} style={[styles.listItem, renderItem.itemStyle]} onPress={renderItem.pressFun}>
            <Text style={[styles.itemText, renderItem.pressFun && {color: '#409EFF'}, renderItem.textStyle]}>{renderItem.fieldName}</Text>
          </TouchableOpacity>
        ))}
      </View>
    )
  };
  
  const listHead = (
    <View style={styles.listHead_title}>
      <Text style={styles.listHead_item}>姓名</Text>
      <Text style={styles.listHead_item}>企业</Text>
      <Text style={styles.listHead_item}>入职记录</Text>
      <Text style={styles.listHead_item}>回访记录</Text>
      <Text style={styles.listHead_item}>状态</Text>
      <Text style={styles.listHead_item}>加入报名</Text>
    </View>
  );

  return (
    <View style={[styles.screen, showSearch && {paddingTop: 10}]}>
      <HeaderSearch canFilterStatus/>
      <View style={styles.numberOfList}>
        <Text style={styles.text}>共 <Text style={styles.number}>{data?.data.total}</Text> 条数据</Text>
      </View> 
      <BottomList 
        list={showList?.content}
        renderItem={renderItem}
        listHead={listHead}
        tabList={TAB_OF_LIST.MY_MEMBERS}
      />
      <NormalDialog 
        ref={dialogRef}
        dialogContent={dialogContent}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1
  },
  numberOfList: {
    height: 20,
    alignItems: 'center', 
    justifyContent: 'center'
  },
  text: {
    color: '#409EFF', 
    fontSize: 12
  },
  number: {
    color: 'red'
  },
  listStyle: {
    minHeight: 35, 
    maxHeight: 35,
    borderColor: '#e3e3e3', 
    borderBottomWidth: 1, 
    flexDirection: 'row', 
  },
  listItem: {
    flex: 1, 
    flexDirection: 'row',
    justifyContent: 'center', 
    alignItems: 'center'
  },
  itemText: {
    fontSize: 12,
    color: '#000',
    textAlign: 'center'
  },
  listHead_title: {
    height: 30, 
    flexDirection: 'row', 
    backgroundColor: '#fff', 
    borderTopWidth: 1, 
    borderColor: '#e3e3e3'
  },
  listHead_item: {
    flex: 1, 
    textAlign: 'center', 
    textAlignVertical: 'center', 
    fontSize: 12, 
    color: '#000'
  }
});

export default MyMembers;