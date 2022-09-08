import React, { useRef, useEffect, useState, useMemo, useCallback } from "react";
import { View, StyleSheet, TouchableOpacity, Text, Linking, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { useToast } from "react-native-toast-notifications";

import NormalDialog from "../../../../components/NormalDialog";
import HeaderRightButtonOfList from '../../../../components/List/HeaderRightButtonOfList';
import HeaderSearch from "../../../../components/List/HeaderSearch";
import CenterSelectDate from "../../../../components/List/CenterSelectDate";
import HeaderCenterSearch from "../../../../components/Header/HeaderCenterSearch";
import JobResignStatus from "../../../../components/NormalDialog/JobResignStatus";
import FormMemberDetail from "../../../../components/NormalDialog/FormMemberDetail";
import FormCompanyDetail from "../../../../components/NormalDialog/FormCompanyDetail";
import ListApi from "../../../../request/ListApi";
import { SUCCESS_CODE, TAB_OF_LIST, JOB_ON_STATUS } from "../../../../utils/const";
import CallPhone from "../../../../components/NormalDialog/CallPhone";
import { setStartDate, setEndDate } from "../../../../redux/features/RangeDateOfList";
import { openListSearch } from "../../../../redux/features/listHeaderSearch";
import Footer from '../../../../components/FlatList/Footer';
import Empty from '../../../../components/FlatList/Empty';

let timer;

const LeavingList = () => {
  const dispatch = useDispatch();

  const navigation = useNavigation();
  const toast = useToast();
  const firstPage = { pageSize: 20, pageNumber: 0 };
  const dialogRef = useRef(null);
  const rangeDate = useSelector(state => state.RangeDateOfList);
  const role = useSelector(state => state.roleSwitch.role);
  const [searchContent, setSearchContent] = useState({ role, ...firstPage });
  const [showList, setShowList] = useState([]);
  const [tabNumberList, setTabNumberList] = useState({});
  const [dialogContent, setDialogContent] = useState({});
  const [originData, setOriginData] = useState({});
  const [nextPage, setNextPage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [index, setIndex] = useState(0);

  // 手机号隐藏四位数
  const geTel = (tel) => {
    const reg = /^(\d{3})\d{4}(\d{4})$/;
    return tel?.replace(reg, '$1****$2');
  };

  useEffect(() => {
    dispatch(openListSearch());
    clearRangeDate();
    navigation.setOptions({
      headerRight: () => <HeaderRightButtonOfList />,
      headerCenterArea: ({...rest}) => <HeaderCenterSearch routeParams={rest}/>
    })
  }, [])
  
  useEffect(() => {
    timer && clearTimeout(timer);
    timer = setTimeout(()=>{
      getList(searchContent);
      getStatusList();
    }, 0)
    return () => timer && clearTimeout(timer);
  }, [searchContent])

  //修改角色时
  useMemo(() => {
    setSearchContent({
      ...searchContent,
      ...firstPage,
      role
    });
  }, [role])

  //每次进入页面的时候都清空顶部时间筛选值
  const clearRangeDate = () => {
    dispatch(setStartDate(''));
    dispatch(setEndDate(''));
  };

  // 获取在离职名单数据
  const getList = async (params) => {
    setIsLoading(true);
    console.log('getList -> params', params);
    try {
      const res = await ListApi.GetJobOnList(params);
      console.log('getList -> res', res);
      if (res?.code !== SUCCESS_CODE) {
        toast.show(`${res?.msg}`, { type: 'danger' });
        return;
      }
      //初始数据
      setOriginData(res.data);
      //渲染的列表（有下一页时）
      if (nextPage) {
        setShowList([...showList, ...res.data.content]);
        setNextPage(false);
        return;
      }
      //无下一页（第一页）
      setShowList(res.data.content);
    } catch (err) {
      toast.show(`出现了意料之外的问题，请联系系统管理员处理`, { type: 'danger' });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusList = async () => {
    const params = {
      companyIds: searchContent?.companyIds || [],
      storeIds: searchContent?.storeIds || [],
      recruitIds: searchContent?.recruitIds || [],
      jobStartDate: searchContent?.jobStartDate || '',
      jobEndDate: searchContent?.jobEndDate || '',
      resignStartDate: searchContent?.resignStartDate || '',
      resignEndDate: searchContent?.resignEndDate || '',
      str: searchContent?.str || '',
      role
    };
    try {
      console.log('getStatusList -> params', params);
      const res = await ListApi.GetJobStatus(params);
      console.log('getStatusList -> res', res);
      if (res?.code !== SUCCESS_CODE) {
        toast.show(`请求失败，请稍后重试。${res.data?.msg}`, { type: 'danger' });
        return;
      }
      setTabNumberList(res.data);
    } catch (err) {
      toast.show(`出现了意料之外的问题，请联系系统管理员处理`, { type: 'danger' });
    }
  };

  // 获取搜索栏的数据
  const filter = (values) => {
    const jobStartDate = values.joinIn.startDate;
    const jobEndDate = values.joinIn.endDate;
    const resignStartDate = values.leaving.startDate;
    const resignEndDate = values.leaving.endDate;
    const companyIds = values.enterprise.length ? values.enterprise.map(item => item.value) : [];
    const storeIds = values.store.length ? values.store.map(item => item.storeId) : [];
    const recruitIds = values.staff.length ? values.staff.map(item => item.value) : [];
    const str = values.search;

    setSearchContent({
      ...searchContent,
      ...firstPage,
      jobStartDate,
      jobEndDate,
      resignStartDate,
      resignEndDate,
      str,
      companyIds,
      storeIds,
      recruitIds
    });
  };

  // 切换状态
  const selectIndex = (selectIndex) => {
    setIndex(selectIndex);
    switch (selectIndex) {
      case 0:
        searchContent.status = 'ALL';
        break;
      case 1:
        searchContent.status = 'JOB_RESIGN';
        break;
      case 2:
        searchContent.status = 'JOB_ON';
        break;
    }
    setSearchContent({ ...searchContent, ...firstPage });
  };

  // 查看企业详情
  const pressFactory = useCallback(async (item) => {
    try {
      const res = await ListApi.FactoryMessage(item.flowId);
      if (res?.code !== SUCCESS_CODE) {
        if(res?.code === 2){
          toast.show(`${res?.msg}`, {type: 'warning'});
          return;
        }
        toast.show(`${res?.msg}`, { type: 'danger' });
        return;
      }
      dialogRef.current.setShowDialog(true);
      setDialogContent({
        dialogTitle: '岗位信息',
        dialogComponent: <FormCompanyDetail message={res.data} />,
      });
    } catch (err) {
      toast.show(`出现了意料之外的问题，请联系系统管理员处理`, { type: 'danger' });
    }
  }, []);

  // 查看会员详情
  const pressMemberInfo = useCallback(async (item) => {
    try {
      const res = await ListApi.MemberMessage(item.flowId);
      if (res?.code !== SUCCESS_CODE) {
        toast.show(`${res?.msg}`, { type: 'danger' });
        return;
      }
      res.data.flowId = item.flowId;
      dialogRef.current.setShowDialog(true);
      setDialogContent({
        dialogTitle: '会员信息',
        dialogComponent: <FormMemberDetail memberInfoList={res.data} showDate={true} />,
      });
    } catch (err) {
      toast.show(`出现了意料之外的问题，请联系系统管理员处理`, { type: 'danger' });
    }
  }, []);

  const changeStatus = useCallback((item) => {
    if (item.jobStatus === 'JOB_RESIGN') {
      toast.show(`状态已确定！`, { type: 'warning' });
      return;
    }
    dialogRef.current.setShowDialog(true);
    setDialogContent({
      dialogTitle: '待处理',
      bottomButton: false,
      dialogComponent: <JobResignStatus dialogRef={dialogRef} item={item} refresh={refresh}/>,
    });
  }, []);

  const callPhone = useCallback(item => {
    dialogRef.current.setShowDialog(true);
    setDialogContent({
      dialogTitle: '温馨提示',
      confirmOnPress: () => {
        Linking.openURL(`tel:${item.mobile}`)
        dialogRef.current.setShowDialog(false);
      },
      dialogComponent: <CallPhone message={item}/>
    });
  }, []);

  const refresh = () => setSearchContent({ ...searchContent, ...firstPage });

  const onEndReached = () => {
    if (originData.hasNext) {
      const nextPage = { ...searchContent, pageNumber: searchContent.pageNumber += 1 };
      setSearchContent(nextPage);
      setNextPage(true);
    }
  };

  const renderItem = ({ item }) => {
    return (
      <View style={styles.listStyle}>
        <Text 
          style={[
            styles.itemText,
            {color: '#409EFF', textAlign: 'center'}
          ]}
          numberOfLines={2}
          onPress={() => pressFactory(item)}
          ellipsizeMode="tail">{item.companyShortName || '无'}</Text>
        <Text 
          style={[
            styles.itemText
          ]}
          numberOfLines={2}
          onPress={() => pressMemberInfo(item)}
          ellipsizeMode="tail">{item.name || '无'}</Text>
        <Text 
          style={[
            styles.itemText
          ]}
          numberOfLines={2}
          onPress={() => changeStatus(item)}
          ellipsizeMode="tail">{JOB_ON_STATUS[item.jobStatus] || '无'}</Text>
        <Text 
          style={[
            styles.itemText, 
            {color: '#409EFF', fontSize: 24}
          ]}
          numberOfLines={2}
          onPress={() => item.mobile && callPhone(item)}
          ellipsizeMode="tail">{geTel(item.mobile) || '无'}</Text>
      </View>
    )
  };

  const memoList = useMemo(() => showList, [showList])

  return (
    <View style={styles.screen}>
      <HeaderSearch
        leavingList
        filterFun={filter}
        clearRangeDate
      />
      <CenterSelectDate />
      <View style={styles.tab_containerStyle}>
        {TAB_OF_LIST.LEAVING_LIST.map((tabItem, tabIndex) => {
          const active = index === tabIndex;
          return (
            <TouchableOpacity key={tabIndex} style={styles.tabItem} onPress={()=>selectIndex(tabIndex)}>
              <Text style={[styles.tabItem_text, active && styles.tabItem_titleStyle_active]}>{tabItem.title}</Text>
              <Text style={[styles.tabItem_text, active && styles.tabItem_titleStyle_active]}>{tabNumberList[tabItem.type] || 0}</Text>
            </TouchableOpacity>
          )
        })}
      </View>
      <View style={styles.tabArea}>
        <Text style={styles.tab}>企业</Text>
        <Text style={styles.tab}>姓名</Text>
        <Text style={styles.tab}>状态</Text>
        <Text style={styles.tab}>联系方式</Text>
      </View>
      {memoList.length ? <FlatList 
        data={memoList}
        style={{backgroundColor: '#fff'}}
        renderItem={renderItem}
        onRefresh={refresh}
        onEndReached={onEndReached}
        keyExtractor={(item,index) => item.flowId}
        getItemLayout={(data, index)=>({length: 80, offset: 80 * index, index})}
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
    minHeight: 80,
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(0, 0, 0, .05)',
    flexDirection: 'row',
    marginHorizontal: 20
  },
  itemText: {
    flex: 1,
    fontSize: 28,
    color: '#000',
    textAlign: 'center',
    textAlignVertical: 'center'
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
    textAlign: 'center'
  },
  tabItem_titleStyle_active: {
    color: '#409EFF',
    fontWeight: 'bold',
  }
});

export default LeavingList;