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
import OnBoardingStatus from "../../../../components/NormalDialog/OnBoardingStatus";
import FormMemberDetail from "../../../../components/NormalDialog/FormMemberDetail";
import FormCompanyDetail from "../../../../components/NormalDialog/FormCompanyDetail";
import ListApi from "../../../../request/ListApi";
import NAVIGATION_KEYS from "../../../../navigator/key";
import { SUCCESS_CODE, TAB_OF_LIST, ON_BOARDING_STATUS } from "../../../../utils/const";
import CallPhone from "../../../../components/NormalDialog/CallPhone";
import { setTabName } from "../../../../redux/features/NowSelectTabNameInList";
import { openListSearch } from "../../../../redux/features/listHeaderSearch";
import Footer from '../../../../components/FlatList/Footer';
import Empty from '../../../../components/FlatList/Empty';

let timer;
const firstPage = { pageSize: 20, pageNumber: 0 };

const WaitToEntryList = () => {
  const flatListRef = useRef(null);
  const dialogRef = useRef(null);

  const dispatch = useDispatch();

  const navigation = useNavigation();

  const toast = useToast();

  const role = useSelector(state => state.roleSwitch.role);

  const [searchContent, setSearchContent] = useState({status: 'ALL', role, ...firstPage });
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
    navigation.setOptions({
      headerRight: () => <HeaderRightButtonOfList />,
      headerCenterArea: ({...rest}) => <HeaderCenterSearch routeParams={rest}/>
    })
    return () => dispatch(setTabName(''));
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

  // 获取待入职名单数据
  const getList = async (params) => {
    // console.log('getList --> params', params)
    setIsLoading(true);
    try {
      // console.log('getList --> params', params);
      const res = await ListApi.GetWaitList(params);
      // console.log('getList --> res', res);
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
      startDate: searchContent?.startDate || '',
      endDate: searchContent?.endDate || '',
      str: searchContent?.str || '',
      role
    };
    try {
      const res = await ListApi.GetWaitStatus(params);
      if (res?.code !== SUCCESS_CODE) {
        toast.show(`${res.data?.msg}`, { type: 'danger' });
        return;
      }
      setTabNumberList(res.data);
    } catch (err) {
      toast.show(`出现了意料之外的问题，请联系系统管理员处理`, { type: 'danger' });
    }
  };

  // 获取搜索栏的数据
  const filter = (values) => {
    const startDate = values.dateRange.startDate;
    const endDate = values.dateRange.endDate;
    const companyIds = values.enterprise.length ? values.enterprise.map(item => item.value) : [];
    const storeIds = values.store.length ? values.store.map(item => item.storeId) : [];
    const recruitIds = values.staff.length ? values.staff.map(item => item.value) : [];
    const str = values.search;

    setSearchContent({
      ...searchContent,
      ...firstPage,
      startDate,
      endDate,
      str,
      companyIds,
      storeIds,
      recruitIds
    });
  };

  // 批量操作
  const batchOperate = () => {
    const searchParams = {
      ...searchContent,
      pageNumber: 0
    };
    navigation.navigate(NAVIGATION_KEYS.BATCH_OPERATE_LIST, { 
      list: 'onBoarding',
      searchParams,
      refresh
    })
  };

  // 切换状态
  const selectIndex = (selectIndex) => {
    setIndex(selectIndex);
    const selectItem = TAB_OF_LIST.WAIT_TO_ENTRY_LIST.find((item, index) => index === selectIndex);
    const tabName = selectItem.type;
    dispatch(setTabName(tabName));
    if(showList.length){
      flatListRef?.current?.scrollToIndex({
        index: 0,
        viewPosition: 0
      });
    }
    if(searchContent.startDate && searchContent.endDate){
      switch (selectIndex) {
        case 0:
          searchContent.status = 'ALL';
          break;
        case 1:
          searchContent.status = 'ON_BOARDING_PENDING';
          break;
        case 2:
          searchContent.status = 'ON_BOARDING_FAIL';
          break;
        case 3:
          searchContent.status = 'ON_BOARDING_PASS';
          break;
      }
      setSearchContent({ ...searchContent, ...firstPage });
    }
  };

  // 跳转编辑会员信息页面
  const editMemberMessage = (item) => {
    dialogRef.current.setShowDialog(false);
    navigation.navigate(NAVIGATION_KEYS.EDIT_MEMBER, {
      fieldList: item
    });
  };

  // 跳转转场转单页面
  const transferFactory = (item) => {
    dialogRef.current.setShowDialog(false);
    navigation.navigate(NAVIGATION_KEYS.TRANSFER_FACTORY, {
      item,
      refresh
    })
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
        rightTitle: searchContent.status !== 'ON_BOARDING_PASS' ? '转厂/转单' : '',
        rightTitleOnPress: () => transferFactory(item)
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
    if (item.onBoardingStatus !== 'ON_BOARDING_PENDING') {
      toast.show(`状态已确定！`, { type: 'warning' });
      return;
    }
    dialogRef.current.setShowDialog(true);
    setDialogContent({
      dialogTitle: '待处理',
      bottomButton: false,
      dialogComponent: <OnBoardingStatus dialogRef={dialogRef} item={item} refresh={refresh}/>,
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

  const refresh = () => setSearchContent({...searchContent, ...firstPage});

  const onEndReached = () => {
    if(originData.hasNext){
      const nextPage = {...searchContent, pageNumber: searchContent.pageNumber += 1};
      setSearchContent(nextPage);
      setNextPage(true);
    }
  };

  const renderItem = ({ item }) => {
    return (
      <View style={[(item.name && item.mobile) ? styles.listStyle : styles.listStyle1]}>
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
          ellipsizeMode="tail">{ON_BOARDING_STATUS[item.onBoardingStatus] || '无'}</Text>
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
        batchOperate={batchOperate}
        filterFun={filter}
        startText="入职开始："
        endText="入职结束："
      />
      <CenterSelectDate />
      <View style={styles.tab_containerStyle}>
        {TAB_OF_LIST.WAIT_TO_ENTRY_LIST.map((tabItem, tabIndex) => {
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
      <FlatList 
        ref={flatListRef}
        data={memoList}
        style={{backgroundColor: '#fff'}}
        renderItem={renderItem}
        keyExtractor={(item,index) => item.flowId}
        getItemLayout={(data, index)=>({length: 80, offset: 80 * index, index})}
        refreshing={isLoading}
        onRefresh={refresh}
        onEndReached={onEndReached}
        initialNumToRender={20}
        ListFooterComponent={<Footer showFooter={memoList.length} hasNext={originData.hasNext}/>}
        ListEmptyComponent={<Empty otherEmptyStyle={{height: 500}} />}
        onEndReachedThreshold={0.01}
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
  listStyle: {
    height: 80,
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(0, 0, 0, .05)',
    flexDirection: 'row',
    marginHorizontal: 32
  },
  listStyle1: {
    height: 80,
    borderBottomWidth: 2, 
    borderBottomColor: 'rgba(0, 0, 0, .05)',
    flexDirection: 'row', 
    backgroundColor: '#ffcfcf',
    marginHorizontal: 32
  },
  listItem: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
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
    flexDirection: 'row',
    paddingHorizontal: 32
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
    color: '#333333',
    textAlign: 'center'
  },
  tabItem_titleStyle_active: {
    color: '#409EFF',
    fontWeight: 'bold',
  }
});

export default WaitToEntryList;