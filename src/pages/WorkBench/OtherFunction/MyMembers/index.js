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

  useEffect(async()=>{
    navigation.setOptions({
      headerCenterArea: ({...rest}) => <HeaderCenterSearch routeParams={rest}/>
    })
    try{
      const res = await MyMembersApi.CompanyDetail('62c56a9a4844402adafebd32');
      console.log('res', res);
    }catch(err){

    }
  }, [])

  const { isLoading, data, isError, error, refetch, status } = useQuery(['myMembers', searchContent], MyMembersApi.MyMemberList);
  if(isError){
    toast.show(`出现了意料之外的问题，请联系系统管理员处理`, { type: 'danger' });
  }
  if(status === 'success' && data?.code !== SUCCESS_CODE){
    toast.show(`${data?.msg}`, { type: 'danger' });
  }

  useMemo(()=>{
    console.log('showList',showList);
  },[showList])

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

  const showDialog = (type) => {
    dialogRef.current.setShowDialog(true);
    switch(type){
      case 'memberDetail': 
        setDialogContent({
          dialogTitle: '会员信息',
          dialogComponent: <MemberDetail />
        });
        return;
      case 'companyDetail': 
        setDialogContent({
          dialogTitle: '企业详情',
          dialogComponent: <CompanyDetail />
        });
        return;
      case 'entry':
        setDialogContent({
          dialogTitle: '入职记录',
          dialogComponent: <EntryRecord />
        });
        return;
      case 'review':
        setDialogContent({
          dialogTitle: '回访记录',
          rightTitle: '编辑',
          rightTitleOnPress: rightTitleOnPress,
          dialogComponent: <ReviewRecord />
        });
        return;
    }
  };

  let list = [];
  for(let i = 0; i < 30; i++){
    list.push({
      id: `${i}`,
      name: `某某${i+1}`,
      factory: `厂名哈${i+1}`,
      card: `${i%2 === 0 ? '两卡全': i % 3 === 0 ? '缺身份证' : i%5 === 0 ? '缺银行卡': i% 7 ===0 ? '两卡不全': '缺心眼儿'} `,
      state: `${i%2 === 0 ? '在职' : i%3 === 0 ? '离职': '未报到'}`,
      phone: `18011111111`,
      join: '加入'
    })
  };

  const rightTitleOnPress = () => {
    dialogRef.current.setShowDialog(false);
    //TODO这里路由还要传值；
    navigation.navigate(NAVIGATION_KEYS.EDIT_RETURN_VISIT);
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
      if(data?.code !== SUCCESS_CODE){
        toast.show(`请求失败，请稍后重试。${data?.msg}`, {type: 'danger'});
        return;
      }
      if(!res.data.orderPolicyDetail){
        toast.show('暂无订单详情', {type: 'warning'});
        return;
      }
      dialogRef.current.setShowDialog(true);
      console.log('res!!!!!!!!!!', res);
      // setDialogContent({
      //   dialogTitle: '会员信息',
      //   dialogComponent: <MemberDetail memberInfoList={res.data}/>
      // });
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
      { fieldName: '查看', pressFun: () => showDialog('entry')},
      { fieldName: '查看', pressFun: () => showDialog('review')},
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
        <Text style={styles.text}>共 <Text style={styles.number}>{list.length}</Text> 条数据</Text>
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