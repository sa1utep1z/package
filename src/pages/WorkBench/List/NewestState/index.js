import React, {useRef, useEffect, useState, useMemo} from "react";
import { View, StyleSheet, Text, Linking, FlatList} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { useToast } from "react-native-toast-notifications";
import AntDesign from 'react-native-vector-icons/AntDesign';

import HeaderRightButtonOfList from '../../../../components/List/HeaderRightButtonOfList';
import HeaderSearch from "../../../../components/List/HeaderSearch";
import HeaderCenterSearch from "../../../../components/Header/HeaderCenterSearch";
import NAVIGATION_KEYS from "../../../../navigator/key";
import { SUCCESS_CODE, MEMBERS_STATUS, NEWEST_STATE_LIST_HEAD, NEWEST_STATE_KEY } from "../../../../utils/const";
import CenterSelectDate from "../../../../components/List/CenterSelectDate";
import ListApi from "../../../../request/ListApi";
import FormMemberDetail from "../../../../components/NormalDialog/FormMemberDetail";
import NormalDialog from "../../../../components/NormalDialog";
import FormCompanyDetail from "../../../../components/NormalDialog/FormCompanyDetail";
import TwoCard from "../../../../components/NormalDialog/TwoCard";
import NewestStatus from "../../../../components/NormalDialog/NewestStatus";
import CallPhone from "../../../../components/NormalDialog/CallPhone";
import { openListSearch } from "../../../../redux/features/listHeaderSearch";
import Footer from '../../../../components/FlatList/Footer';
import Empty from '../../../../components/FlatList/Empty';
import WaterMark from "../../../../components/WaterMark";

let timer;
const firstPage = {pageSize: 20, pageNumber: 0};

const NewestState = () => {
  const flatListRef = useRef(null);
  const dialogRef = useRef(null);

  const dispatch = useDispatch();

  const toast = useToast();

  const navigation = useNavigation();

  const role = useSelector(state => state.roleSwitch.role);

  const [searchContent, setSearchContent] = useState({role, ...firstPage});
  const [showList, setShowList] = useState([]);
  const [originData, setOriginData] = useState({});
  const [dialogContent, setDialogContent] = useState({});
  const [nextPage, setNextPage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    dispatch(openListSearch());
    navigation.setOptions({
      headerRight: () => <HeaderRightButtonOfList />,
      headerCenterArea: ({...rest}) => <HeaderCenterSearch routeParams={rest}/>
    })
  }, [])

  useEffect(()=>{
    timer && clearTimeout(timer);
    timer = setTimeout(()=>{
      getList(searchContent);
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
    console.log('getList -> params', params);
    setIsLoading(true);
    try{
      const res = await ListApi.NewestList(params);
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
      setShowList([...res.data.content]);
    }catch(err){
      toast.show(`出现了意料之外的问题，请联系系统管理员处理`, { type: 'danger' });
    }finally{
      setIsLoading(false);
    }
  };

  const gotoRecordOfWorking = () => {
    toast.show('敬请期待...');
    return;
    //TODO待开发
    navigation.navigate(NAVIGATION_KEYS.RECORD_OF_WORKING);
  }

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
    const startDate = values.dateRange.startDate;
    const endDate = values.dateRange.endDate;
    const companyIds = values.enterprise.length ? values.enterprise.map(item => item.value) : [];
    const storeIds = values.store.length ? values.store.map(item => item.storeId) : [];
    const recruitIds = values.staff.length ? values.staff.map(item => item.value) : [];
    const status = values.status.length ? values.status[0].value : '';
    const str = values.search;

    setSearchContent({
      ...searchContent,
      ...firstPage,
      startDate,
      endDate,
      str,
      status,
      companyIds,
      storeIds,
      recruitIds
    });
  };

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
      refresh && refresh();
    }catch(err){
      toast.show(`出现了意料之外的问题，请联系系统管理员处理`, { type: 'danger' });
    }finally{
      dialogRef.current.setShowDialog(false);
    }
  };

  const callPhone = (item) => {
    if(!item.mobile){
      toast.show('暂无联系方式', {type: 'warning'});
      return;
    }
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
        toast.show(`${res?.msg}`, {type: 'danger'});
        return;
      }
      console.log('打印会员数据：', res.data);
      res.data.flowId = item.flowId;
      dialogRef.current.setShowDialog(true);
      setDialogContent({
        dialogTitle: '会员信息',
        dialogComponent: <FormMemberDetail memberInfoList={res.data} showDate={true} />
        // rightTitle: '编辑',
        // rightTitleOnPress: () => editMemberMessage(res.data)
      });
    }catch(err){
      toast.show(`出现了意料之外的问题，请联系系统管理员处理`, { type: 'danger' });
    }
  };

  const transferFactory = (item) => {
    dialogRef.current.setShowDialog(false);
    navigation.navigate(NAVIGATION_KEYS.TRANSFER_FACTORY, {
      item, 
      refresh
    });
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

  const showTwoCard = item => {
    dialogRef.current.setShowDialog(true);
    setDialogContent({
      // rightClose: <AntDesign style={{paddingRight: 20}} name='closecircleo' size={20} onPress={() => dialogRef.current.setShowDialog(false)} />,
      dialogTitle: '会员信息',
      dialogComponent: <TwoCard message={item}/>
    });
  };

  const changeStatus = item => {
    dialogRef.current.setShowDialog(true);
    setDialogContent({
      dialogTitle: '状态修改',
      bottomButton: false,
      dialogComponent: <NewestStatus message={item} dialog={dialogRef} confirmOnPress={changeStatusFunc} refresh={refresh}/>
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
    const status = checkStatus(item);

    return (
      <View style={[(item.name && item.mobile) ? styles.listStyle : styles.listStyle1]}>
        <Text 
          style={[
            styles.itemText,
            {color: '#409EFF', textAlign: 'center'}
          ]}
          numberOfLines={2}
          onPress={() => callPhone(item)}
          ellipsizeMode="tail">{item.name || '无'}</Text>
        <Text 
          style={[
            styles.itemText,
          ]}
          numberOfLines={2}
          onPress={() => pressFactory(item)}
          ellipsizeMode="tail">{item.companyShortName || '无'}</Text>
        <Text 
          style={[
            styles.itemText,
          ]}
          numberOfLines={2}
          onPress={() => showTwoCard(item)}
          ellipsizeMode="tail">{status}</Text>
        <Text 
          style={[
            styles.itemText,
            {color: '#409EFF'}
          ]}
          numberOfLines={2}
          onPress={() => gotoRecordOfWorking(item)}
          ellipsizeMode="tail">查看</Text>
        <Text 
          style={[
            styles.itemText,
            {fontSize: 24}
          ]}
          numberOfLines={2}
          onPress={() => changeStatus(item)}
          ellipsizeMode="tail">{MEMBERS_STATUS[item.status] || '无'}</Text>
        <Text 
          style={[
            styles.itemText,
            {color: '#409EFF'}
          ]}
          numberOfLines={2}
          onPress={() => pressName(item)}
          ellipsizeMode="tail">查看</Text>
      </View>
    )
  };

  const memoList = useMemo(() => showList, [showList])

  return (
    <View style={[styles.screen]}>
      <HeaderSearch 
        filterFun={filter} 
        batchOperate={batchOperate} 
        statusSingleSelect
        status={NEWEST_STATE_KEY}
        canFilterStatus
      />
      <CenterSelectDate centerDateStyle={{marginBottom: 0}} />
      <View style={styles.numberOfList}>
        <Text style={styles.text}>共 <Text style={styles.number}>{originData?.total || 0}</Text> 条数据</Text>
      </View> 
      <View style={styles.list_head}>
        {NEWEST_STATE_LIST_HEAD.map((item,index) => <Text key={index} style={styles.list_head_text}>{item.title}</Text>)}
      </View>
      <View style={{flex: 1}}>
        <FlatList
          ref={flatListRef}
          data={memoList}
          style={{backgroundColor: '#fff'}}
          renderItem={renderItem}
          keyExtractor={(item,index) => item.flowId}
          getItemLayout={(data, index)=>({length: 100, offset: 100 * index, index})}
          refreshing={isLoading}
          onRefresh={refresh}
          initialNumToRender={20}
          ListFooterComponent={<Footer showFooter={memoList.length} hasNext={originData.hasNext}/>}
          ListEmptyComponent={<Empty otherEmptyStyle={{height: 500}} />}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.01}
        />
        <WaterMark />
      </View>
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
    backgroundColor: '#fff'
  },
  list_head_text: {
    flex: 1, 
    textAlign: 'center', 
    textAlignVertical: 'center', 
    fontSize: 26, 
    color: '#000'
  },
  listStyle: {
    height: 100,
    borderBottomWidth: 2, 
    borderBottomColor: 'rgba(0, 0, 0, .05)',
    flexDirection: 'row'
  },
  listStyle1: {
    height: 100,
    borderBottomWidth: 2, 
    borderBottomColor: 'rgba(0, 0, 0, .05)',
    flexDirection: 'row', 
    backgroundColor: '#ffcfcf'
  },
  listItem: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center', 
    alignItems: 'center',
  },
  itemText: {
    flex: 1,
    fontSize: 28,
    color: '#000',
    textAlign: 'center',
    textAlignVertical: 'center'
  }
});

export default NewestState;