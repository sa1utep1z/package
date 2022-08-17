import React, {useRef, useEffect, useState, useMemo} from "react";
import { View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { useToast } from "react-native-toast-notifications";
import moment from "moment";

import NAVIGATION_KEYS from "../../../../navigator/key";
import { TAB_OF_LIST, MEMBERS_STATUS, SUCCESS_CODE } from "../../../../utils/const";
import MyMembersApi from "../../../../request/MyMembersApi";
import HeaderSearch from "../../../../components/List/HeaderSearch";
import HeaderCenterSearch from "../../../../components/Header/HeaderCenterSearch";
import BottomList from "../../../../components/List/BottomList";
import NormalDialog from "../../../../components/NormalDialog";
import CompanyDetail from "../../../../components/NormalDialog/CompanyDetail";
import MemberDetail from "../../../../components/NormalDialog/MemberDetail";
import EntryRecord from "../../../../components/NormalDialog/EntryRecord";
import ReviewRecord from "../../../../components/NormalDialog/ReviewRecord";
import { setStartDate, setEndDate } from "../../../../redux/features/RangeDateOfList";
import { openListSearch } from "../../../../redux/features/listHeaderSearch";

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
    console.log('getList --> params', params);
    setIsLoading(true);
    try{
      const res = await MyMembersApi.MyMemberList(params);
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

  const selectIndex = (selectIndex) => {
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
        toast.show('暂无入职记录', {type: 'warning'});
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

  const listHead = (
    <>
      {/* <View style={styles.numberOfList}>
        <Text style={styles.text}>共 <Text style={styles.number}>{originData?.total|| 0}</Text> 条数据</Text>
      </View>  */}
      <View style={styles.listHead_title}>
        <Text style={styles.listHead_item}>姓名</Text>
        <Text style={styles.listHead_item}>企业</Text>
        <Text style={styles.listHead_item}>入职记录</Text>
        <Text style={styles.listHead_item}>回访记录</Text>
        <Text style={styles.listHead_item}>状态</Text>
        <Text style={styles.listHead_item}>加入报名</Text>
      </View>
    </>
  );

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
      { fieldName: item.userName || '无', pressFun: () => memberDetailOnPress(item)},
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
      { fieldName: '加入', pressFun: () => navigation.navigate(NAVIGATION_KEYS.JOIN_IN_SIGN_UP, {
        msg: item
      })}
    ];
    return (
      <View key={item.poolId} style={styles.listStyle}>
        {renderList.map((renderItem, index) => (
          <TouchableOpacity 
            key={index}
            activeOpacity={renderItem.pressFun ? 0.2 : 1}
            style={[styles.listItem, renderItem.itemStyle]} 
            onPress={renderItem.pressFun}>
            <Text 
              ellipsizeMode='tail' 
              numberOfLines={2} 
              style={[styles.itemText, renderItem.pressFun && {color: '#409EFF'}, renderItem.textStyle]}>{renderItem.fieldName}</Text>
          </TouchableOpacity>
        ))}
      </View>
    )
  };

  //优化加载速度；
  const memoizedValue = useMemo(() => renderItem, [showList]);

  return (
    <View style={styles.screen}>
      <HeaderSearch 
        filterFun={filter} 
        canFilterStatus 
        staffSearch
        companySingleSelect
        storeSingleSelect
      />
      <BottomList 
        list={showList}
        isLoading={isLoading}
        listHead={listHead}
        tab={TAB_OF_LIST.MY_MEMBERS}
        tabNumberList={tabNumberList}
        renderItem={memoizedValue}
        onRefresh={refresh}
        onEndReached={onEndReached}
        nowSelectIndex={selectIndex}
        renderItemHeight={100}
        hasNext={originData?.hasNext}
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
    alignItems: 'center', 
    justifyContent: 'center',
    backgroundColor: '#fff'
  },
  text: {
    color: '#409EFF', 
    fontSize: 22
  },
  number: {
    color: 'red'
  },
  listStyle: {
    height: 100,
    borderBottomWidth: 2,
    borderColor: 'rgba(0, 0, 0, .05)',  
    flexDirection: 'row', 
  },
  listItem: {
    flex: 1, 
    flexDirection: 'row',
    justifyContent: 'center', 
    alignItems: 'center'
  },
  itemText: {
    fontSize: 28,
    color: '#000',
    textAlign: 'center'
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
  }
});

export default MyMembers;