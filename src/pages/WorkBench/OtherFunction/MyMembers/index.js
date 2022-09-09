import React, {useRef, useEffect, useState, useMemo} from "react";
import { View, StyleSheet, TouchableOpacity, Text, FlatList} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { useToast } from "react-native-toast-notifications";

import NAVIGATION_KEYS from "../../../../navigator/key";
import { TAB_OF_LIST, MEMBERS_STATUS, SUCCESS_CODE } from "../../../../utils/const";
import MyMembersApi from "../../../../request/MyMembersApi";
import HeaderSearch from "../../../../components/List/HeaderSearch";
import HeaderCenterSearch from "../../../../components/Header/HeaderCenterSearch";
import NormalDialog from "../../../../components/NormalDialog";
import CompanyDetail from "../../../../components/NormalDialog/CompanyDetail";
import MemberDetail from "../../../../components/NormalDialog/MemberDetail";
import EntryRecord from "../../../../components/NormalDialog/EntryRecord";
import ReviewRecord from "../../../../components/NormalDialog/ReviewRecord";
import { setStartDate, setEndDate } from "../../../../redux/features/RangeDateOfList";
import { openListSearch } from "../../../../redux/features/listHeaderSearch";
import Footer from '../../../../components/FlatList/Footer';
import Empty from '../../../../components/FlatList/Empty';

let timer;
const firstPage = {pageSize: 20, pageNumber: 0};

const MyMembers = () => {
  const toast = useToast();
  const dispatch = useDispatch();

  const navigation = useNavigation();

  const dialogRef = useRef(null);

  const [searchContent, setSearchContent] = useState({...firstPage});
  const [dialogContent, setDialogContent] = useState({});
  const [tabNumberList, setTabNumberList] = useState({});
  const [originData, setOriginData] = useState({});
  const [showList, setShowList] = useState([]);
  const [nextPage, setNextPage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    navigation.setOptions({
      headerCenterArea: ({...rest}) => <HeaderCenterSearch routeParams={rest}/>
    })
    clearRangeDate();
    dispatch(openListSearch());
  }, [])

  useEffect(()=>{
    timer && clearTimeout(timer);
    timer = setTimeout(()=>{
      getList(searchContent);
    }, 0)
    return () => timer && clearTimeout(timer);
  }, [searchContent]);

  //每次进入页面的时候都清空顶部时间筛选值
  const clearRangeDate = () => {
    dispatch(setStartDate(''));
    dispatch(setEndDate(''));
  };

  const getList = async(params) => {
    // console.log('getList --> params', params);
    setIsLoading(true);
    try{
      const res = await MyMembersApi.MyMemberList(params);
      console.log('getList --> res', res);
      if(res?.code !== SUCCESS_CODE){
        toast.show(`${res?.msg}`, {type: 'danger'});
        return;
      }
      //初始数据
      setOriginData(res.data);
      //设置顶部tab栏的数字
      setTabNumberList({
        allNums: res.data.allNums,
        preparingNums: res.data.preparingNums,
        haveWillNums: res.data.haveWillNums,
        noWillNums: res.data.noWillNums
      });
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

  const rightTitleOnPress = (msg, data) => {
    navigation.navigate(NAVIGATION_KEYS.EDIT_RETURN_VISIT, {
      formList: msg,
      historyList: data,
      refresh
    });
    dialogRef.current.setShowDialog(false);
  };

  const rightTitleOnMemberDetail = (msg, poolId) => {
    navigation.navigate(NAVIGATION_KEYS.EDIT_MEMBER_DETAIL,{
      msg,
      poolId,
      refresh
    });
    dialogRef.current.setShowDialog(false);
  };

  const joinInSignUpOnPress = (msg) => {
    navigation.navigate(NAVIGATION_KEYS.JOIN_IN_SIGN_UP, {
      msg
    })
  };

  const memberDetailOnPress = async(msg) => {
    const poolId = msg?.poolId;
    try{
      const res = await MyMembersApi.MemberDetail(poolId);
      if(res?.code !== SUCCESS_CODE){
        toast.show(`请求失败，请稍后重试。${data?.msg}`, {type: 'danger'});
        return;
      }
      dialogRef.current.setShowDialog(true);
      setDialogContent({
        dialogTitle: '会员信息',
        dialogComponent: <MemberDetail memberInfoList={res.data}/>,
        rightTitle: '编辑',
        rightTitleOnPress: () => rightTitleOnMemberDetail(res.data, poolId)
      });
    }catch(err){
      toast.show(`出现了意料之外的问题，请联系系统管理员处理`, { type: 'danger' });
    }
  };

  const companyDetailOnPress = async(msg) => {
    if(!msg.willSignUpCompanyName) {
      toast.show('无企业详情', {type: 'warning'});
      return;
    };
    const poolId = msg?.poolId;
    try{
      const res = await MyMembersApi.CompanyDetail(poolId);
      if(res?.code !== SUCCESS_CODE){
        toast.show(`${res?.msg}`, {type: 'danger'});
        return;
      }
      if(!res.data.orderPolicyDetail){
        toast.show('无订单详情', {type: 'warning'});
        return;
      }
      dialogRef.current.setShowDialog(true);
      setDialogContent({
        dialogTitle: '企业详情',
        dialogComponent: <CompanyDetail msg={res.data} message={res.data.orderPolicyDetail}/>
      });
    }catch(err){
      toast.show(`出现了意料之外的问题，请联系系统管理员处理`, { type: 'danger' });
    }
  };

  const entryRecordOnPress = async(msg) => {
    const poolId = msg?.poolId;
    try{
      const res = await MyMembersApi.EntryRecord(poolId);
      if(res?.code !== SUCCESS_CODE){
        toast.show(`${res?.msg}`, {type: 'danger'});
        return;
      }
      if(!res.data.length){
        toast.show('无入职记录', {type: 'warning'});
        return;
      }
      dialogRef.current.setShowDialog(true);
      setDialogContent({
        dialogTitle: '入职记录',
        dialogComponent: <EntryRecord entryList={res.data}/>
      });
    }catch(err){
      toast.show(`出现了意料之外的问题，请联系系统管理员处理`, { type: 'danger' });
    }
  };

  const reviewRecordOnPress = async(msg) => {
    const poolId = msg?.poolId;
    try{
      const res = await MyMembersApi.ReviewRecord(poolId);
      if(res?.code !== SUCCESS_CODE){
        toast.show(`${data?.msg}`, {type: 'danger'});
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
  
  const filter = (values) => {
    const willSignUpCompanyId = values.enterprise.length ? values.enterprise[0].value : '';
    const storeId = values.store.length ? values.store[0].storeId : '';
    const memberStatus = values.status.length ? values.status[0].value.toUpperCase() : '';
    const nextReturnVisitDateStart = values.dateRange.startDate;
    const nextReturnVisitDateEnd = values.dateRange.endDate;

    setSearchContent({
      ...searchContent,
      ...firstPage,
      willSignUpCompanyId,
      recruiterName: values.staffSearch, 
      nameOrIdNo: values.search, 
      nextReturnVisitDateStart,
      nextReturnVisitDateEnd,
      storeId,
      memberStatus
    });
  };

  const selectIndex = (selectIndex) => {
    setIndex(selectIndex);
    switch(selectIndex){
      case 0:
        searchContent.returnVisitResult = '';
        break;
      case 1:
        searchContent.returnVisitResult = 'PREPARING';
        break;
      case 2:
        searchContent.returnVisitResult = 'HAVE_WILL';
        break;
      case 3:
        searchContent.returnVisitResult = 'NO_WILL';
        break;
    }
    setSearchContent({ ...searchContent, ...firstPage });
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
    return (
      <View style={[ item.highSeasResource === true ? styles.listStyle1 : styles.listStyle]}>
        <Text 
          style={[
            styles.itemText,
            {color: '#409EFF', textAlign: 'center'}
          ]}
          numberOfLines={2}
          onPress={() => memberDetailOnPress(item)}
          ellipsizeMode="tail">{item.userName || '无'}</Text>
        <Text 
          style={[
            styles.itemText
          ]}
          numberOfLines={2}
          onPress={() => companyDetailOnPress(item)}
          ellipsizeMode="tail">{item.willSignUpCompanyName || '无'}</Text>
        <Text 
          style={[
            styles.itemText,
            {color: '#409EFF', textAlign: 'center'}
          ]}
          numberOfLines={2}
          onPress={() => entryRecordOnPress(item)}
          ellipsizeMode="tail">查看</Text>
        <Text 
          style={[
            styles.itemText, 
            {color: '#409EFF', textAlign: 'center'}
          ]}
          numberOfLines={2}
          onPress={() => reviewRecordOnPress(item)}
          ellipsizeMode="tail">查看</Text>
        <Text 
          style={[
            styles.itemText, 
          ]}
          numberOfLines={2}
          ellipsizeMode="tail">{item.memberStatus ?  MEMBERS_STATUS[item.memberStatus] : '无'}</Text>
        <Text 
          style={[
            styles.itemText, 
            {color: '#409EFF', textAlign: 'center'}
          ]}
          numberOfLines={2}
          onPress={() => joinInSignUpOnPress(item)}
          ellipsizeMode="tail">加入</Text>
      </View>
    )
  };

  const memoList = useMemo(() => showList, [showList])

  return (
    <View style={styles.screen}>
      <HeaderSearch 
        filterFun={filter} 
        canFilterStatus 
        staffSearch
        companySingleSelect
        storeSingleSelect
        clearRangeDate
        startText="开始日期："
        endText="结束日期："
      />
      <View style={styles.tab_containerStyle}>
        {TAB_OF_LIST.MY_MEMBERS.map((tabItem, tabIndex) => {
          const active = index === tabIndex;
          return (
            <TouchableOpacity key={tabIndex} style={styles.tabItem} onPress={()=>selectIndex(tabIndex)}>
              <Text style={[styles.tabItem_text, active && styles.tabItem_titleStyle_active]}>{tabItem.title}</Text>
              <Text style={[styles.tabItem_text, active && styles.tabItem_titleStyle_active]}>{tabNumberList[tabItem.type] || 0}</Text>
            </TouchableOpacity>
          )
        })}
      </View>
      <View style={styles.listHead_title}>
        <Text style={styles.listHead_item}>姓名</Text>
        <Text style={styles.listHead_item}>企业</Text>
        <Text style={styles.listHead_item}>入职记录</Text>
        <Text style={styles.listHead_item}>回访记录</Text>
        <Text style={styles.listHead_item}>状态</Text>
        <Text style={styles.listHead_item}>加入报名</Text>
      </View>
      {memoList.length ? <FlatList 
        data={memoList}
        style={{backgroundColor: '#fff'}}
        renderItem={renderItem}
        onRefresh={refresh}
        onEndReached={onEndReached}
        keyExtractor={(item,index) => item.poolId}
        getItemLayout={(data, index)=>({length: 100, offset: 100 * index, index})}
        refreshing={isLoading}
        initialNumToRender={20}
        ListFooterComponent={<Footer hasNext={originData.hasNext}/>}
        onEndReachedThreshold={0.01}
      /> : <Empty />}
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
  listStyle: {
    height: 100,
    borderBottomWidth: 2,
    borderColor: 'rgba(0, 0, 0, .05)',  
    flexDirection: 'row', 
  },
  listStyle1: {
    height: 100,
    borderBottomWidth: 2, 
    borderBottomColor: 'rgba(0, 0, 0, .05)',
    flexDirection: 'row', 
    backgroundColor: '#ffcfcf'
  },
  itemText: {
    flex: 1,
    fontSize: 28,
    color: '#000',
    textAlign: 'center',
    textAlignVertical: 'center'
  },
  listHead_title: {
    height: 60, 
    flexDirection: 'row',
    backgroundColor: '#fff', 
  },
  listHead_item: {
    flex: 1, 
    textAlign: 'center', 
    textAlignVertical: 'center', 
    fontSize: 26, 
    color: '#000'
  },
  tab_containerStyle: {
    minHeight: 120, 
    flexDirection: 'row', 
    backgroundColor: '#fff'
  },
  tabItem: {
    flex: 1, 
    justifyContent: 'center'
  },
  tabItem_text: {
    fontSize: 32,
    color: '#333333',
    textAlign: 'center'
  },
  tabItem_titleStyle_active: {
    color: '#409EFF',
    fontWeight: 'bold',
  }
});

export default MyMembers;