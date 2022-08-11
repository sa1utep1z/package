import React, {useRef, useEffect, useState, useMemo} from "react";
import { View, StyleSheet, TouchableOpacity, Text, Linking} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import Entypo from 'react-native-vector-icons/Entypo';
import { useQuery } from '@tanstack/react-query';
import { useToast } from "react-native-toast-notifications";
import moment from "moment";

import HeaderRightButtonOfList from '../../../../components/List/HeaderRightButtonOfList';
import HeaderSearch from "../../../../components/List/HeaderSearch";
import HeaderCenterSearch from "../../../../components/Header/HeaderCenterSearch";
import BottomList from "../../../../components/List/BottomList";
import NAVIGATION_KEYS from "../../../../navigator/key";
import { MEMBER_INFO, TAB_OF_LIST, SUCCESS_CODE, MEMBERS_STATUS, NEWEST_STATE_LIST_HEAD } from "../../../../utils/const";
import CenterSelectDate from "../../../../components/List/CenterSelectDate";
import ListApi from "../../../../request/ListApi";
import FormMemberDetail from "../../../../components/NormalDialog/FormMemberDetail";
import NormalDialog from "../../../../components/NormalDialog";
import FormCompanyDetail from "../../../../components/NormalDialog/FormCompanyDetail";
import TwoCard from "../../../../components/NormalDialog/TwoCard";
import NewestStatus from "../../../../components/NormalDialog/NewestStatus";
import CallPhone from "../../../../components/NormalDialog/CallPhone";

const firstPage = {pageSize: 20, pageNumber: 0};

const NewestState = () => {
  const toast = useToast();
  const navigation = useNavigation();

  const dialogRef = useRef(null);

  const rangeDate = useSelector(state => state.RangeDateOfList);
  const role = useSelector(state => state.roleSwitch.role);

  const [searchContent, setSearchContent] = useState({role, ...firstPage});
  const [showList, setShowList] = useState([]);
  const [dialogContent, setDialogContent] = useState({});

  useEffect(()=>{
    navigation.setOptions({
      headerRight: () => <HeaderRightButtonOfList />,
      headerCenterArea: ({...rest}) => <HeaderCenterSearch routeParams={rest}/>
    })
  }, [])

  //修改角色时
  useMemo(()=>{
    setSearchContent({
      ...searchContent,
      ...firstPage,
      role
    });
  },[role])

  //修改时间时
  useMemo(()=>{
    setSearchContent({
      ...firstPage,
      ...searchContent,
      startDate: moment(rangeDate.startDate).format('YYYY-MM-DD'), 
      endDate: moment(rangeDate.endDate).format('YYYY-MM-DD')
    });
  },[rangeDate])

  const { isLoading, data, isError, status, refetch } = useQuery(['newestState', searchContent], ListApi.NewestList);
  if(isError){
    toast.show(`出现了意料之外的问题，请联系系统管理员处理`, { type: 'danger' });
  }
  if(status === 'success' && data?.code !== SUCCESS_CODE){
    toast.show(`${data?.msg}`, { type: 'danger' });
  }

  useMemo(() => {
    console.log('searchContent', searchContent);
    console.log('data', data)
  }, [searchContent, data])
  
  useMemo(()=>{
    if(data){
      // if(showList.content.length >= 20 && (data.data.pageNumber - showList.pageNumber === 1)){
      //   showList.content = showList.content.concat(data.data.content);
      //   showList.pageNumber = data.data.pageNumber;
      //   setShowList(showList);
      //   return;
      // }
      setShowList(data.data.content);
    }
    // getTypeList();
  },[data])

  const gotoRecordOfWorking = () => navigation.navigate(NAVIGATION_KEYS.RECORD_OF_WORKING)

  const checkStatus = (message) => {
    if(message.backAccount && message.idNo){
      return '两卡全';
    }else if(message.backAccount && !message.idNo){
      return '缺身份证';
    }else if(!message.backAccount && message.idNo){
      return '缺银行卡';
    }else{
      return '两卡不全';
    }
  };

  const filter = (values) => {
    const companyIds = values.enterprise.length ? values.enterprise.map(item => item.value) : [];
    const storeIds = values.store.length ? values.store.map(item => item.storeId) : [];
    const names = values.staff.length ? values.staff.map(item => item.value) : [];
    const str = values.search;

    setSearchContent({
      ...searchContent,
      ...firstPage,
      str,
      companyIds,
      storeIds,
      names
    });
  };

  const refresh = () => setSearchContent({...searchContent, ...firstPage});

  const batchOperate = () => navigation.navigate(NAVIGATION_KEYS.BATCH_OPERATE_LIST, {list: 'newestStatus'});

  const editMemberMessage = (item) => {
    dialogRef.current.setShowDialog(false);
    navigation.navigate(NAVIGATION_KEYS.EDIT_MEMBER, {
      fieldList: item
    });
  };

  const changeStatusFunc = async(flowId, params) => {
    try{
      const res = await ListApi.ChangeStatusInNewestList(flowId, params);
      if(res?.code !== SUCCESS_CODE){
        toast.show(`${res?.msg}`, {type: 'danger'});
        return;
      }
      toast.show(`修改成功`, {type: 'success'});
    }catch(err){
      toast.show(`出现了意料之外的问题，请联系系统管理员处理`, { type: 'danger' });
    }finally{
      dialogRef.current.setShowDialog(false);
    }
  };

  const callPhone = (item) => {
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
        dialogComponent: <FormMemberDetail memberInfoList={res.data} showDate={true} />,
        rightTitle: '编辑',
        rightTitleOnPress: () => editMemberMessage(res.data)
      });
    }catch(err){
      toast.show(`出现了意料之外的问题，请联系系统管理员处理`, { type: 'danger' });
    }
  };

  const transferFactory = (item) => {
    dialogRef.current.setShowDialog(false);
    navigation.navigate(NAVIGATION_KEYS.TRANSFER_FACTORY, {item})
  };

  const pressFactory = async(item) => {
    try{
      const res = await ListApi.FactoryMessage(item.flowId);
      if(res?.code !== SUCCESS_CODE){
        toast.show(`请求失败，${res?.msg}`, {type: 'danger'});
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

  const showTwoCard = item => {
    dialogRef.current.setShowDialog(true);
    setDialogContent({
      dialogTitle: '会员信息',
      dialogComponent: <TwoCard message={item}/>
    });
  };

  const changeStatus = item => {
    dialogRef.current.setShowDialog(true);
    setDialogContent({
      dialogTitle: '状态修改',
      bottomButton: false,
      dialogComponent: <NewestStatus message={item} dialog={dialogRef} confirmOnPress={changeStatusFunc}/>
    });
  };

  const renderItem = ({item}) => {
    const status = checkStatus(item);
    const renderList = [
      { 
        fieldName: item.name, 
        textStyle: {color: '#409EFF'},
        pressFun: () => item.mobile && callPhone(item)
      },
      { 
        fieldName: item.companyShortName, 
        textStyle: {fontSize: 26},
        pressFun: () => pressFactory(item)
      },
      { 
        fieldName: status, 
        textStyle: {fontSize: 26},
        pressFun: () => showTwoCard(item)
      },
      { 
        fieldName: 'press', 
        textStyle: {color: '#409EFF'},
        pressFun: gotoRecordOfWorking
      },
      { 
        fieldName: MEMBERS_STATUS[item.status], 
        pressFun: () => changeStatus(item)
      },
      { 
        fieldName: 'press' ,
        textStyle: {color: '#409EFF'},
        pressFun: () => pressName(item)
      }
    ];
    
    return (
      <View key={item.flowId} style={styles.listStyle}>
        {renderList.map((renderItem, index) => (
          <TouchableOpacity key={index} style={[styles.listItem, renderItem.itemStyle]} onPress={renderItem.pressFun}>
            <Text 
              allowFontScaling={false}
              numberOfLines={2}
              ellipsizeMode='tail'
              style={[styles.itemText, renderItem.textStyle]}>{renderItem.fieldName !== 'press' ? renderItem.fieldName : '查看'}</Text>
            {renderItem.fieldName === item.name && <Entypo name='phone' size={32} color='#409EFF'/>}
          </TouchableOpacity>
        ))}
      </View>
    )
  };

  return (
    <View style={[styles.screen]}>
      <HeaderSearch filterFun={filter} batchOperate={batchOperate} canBatchOperate/>
      <CenterSelectDate centerDateStyle={{marginBottom: 0}} />
      <View style={styles.numberOfList}>
        <Text style={styles.text}>共 <Text style={styles.number}>{data?.data.total || 0}</Text> 条数据</Text>
      </View> 
      <View style={styles.list_head}>
        {NEWEST_STATE_LIST_HEAD.map(item => <Text style={styles.list_head_text}>{item.title}</Text>)}
      </View>
      <BottomList 
        list={showList}
        renderItem={renderItem}
        hasTab={false}
        tab={TAB_OF_LIST.NEWEST_STATE}
        isLoading={isLoading}
        onRefresh={refresh}
        tabTextStyle={{fontSize: 30}}
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
  numberOfList: {
    alignItems: 'center', 
    justifyContent: 'center',
    backgroundColor: '#fff'
  },
  text: {
    color: '#409EFF', 
    fontSize: 26
  },
  number: {
    color: 'red'
  },
  list_head: {
    height: 80, 
    flexDirection: 'row', 
    backgroundColor: '#fff',
    paddingHorizontal: 10
  },
  list_head_text: {
    flex: 1, 
    textAlign: 'center', 
    textAlignVertical: 'center', 
    fontSize: 30, 
    color: '#000'
  },
  listStyle: {
    minHeight: 100,
    borderBottomWidth: 2, 
    borderBottomColor: 'rgba(0, 0, 0, .05)',
    flexDirection: 'row',
    marginHorizontal: 10
  },
  listItem: {
    flex: 1, 
    flexDirection: 'row',
    justifyContent: 'center', 
    alignItems: 'center'
  },
  itemText: {
    fontSize: 30,
    color: '#333333',
    textAlign: 'center'
  }
});

export default NewestState;