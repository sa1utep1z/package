import React, { useRef, useEffect, useState, useMemo } from "react";
import { View, StyleSheet, Text, Linking, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { useToast } from "react-native-toast-notifications";
import AntDesign from 'react-native-vector-icons/AntDesign';

import HeaderRightButtonOfList from '../../../../components/List/HeaderRightButtonOfList';
import HeaderSearch from "../../../../components/List/HeaderSearch";
import HeaderCenterSearch from "../../../../components/Header/HeaderCenterSearch";
import NAVIGATION_KEYS from "../../../../navigator/key";
import { SUCCESS_CODE, MEMBERS_STATUS, ADVANCE_STATE_LIST_HEAD, TAB_OF_LIST, ADVANCERESULT } from "../../../../utils/const";
import CenterSelectDate from "../../../../components/List/CenterSelectDate";
import ListApi from "../../../../request/ListApi";
import AdvanceApi from "../../../../request/AdvanceApi";
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
import { setTabName } from "../../../../redux/features/NowSelectTabNameInList";

let timer;
const firstPage = { pageSize: 20, pageNumber: 0 };

const AdvanceManage = () => {
  const flatListRef = useRef(null);
  const dialogRef = useRef(null);

  const dispatch = useDispatch();

  const toast = useToast();

  const navigation = useNavigation();
  const getEnumValue = (optionsData, enumKey) => optionsData.find((val) => val.value === enumKey)?.title;
  const role = useSelector(state => state.roleSwitch.role);
  // 跳转预支审核进度详情
  const toAdvanceAudit = (value) => {
    navigation.navigate(NAVIGATION_KEYS.ADVANCE_AUDIT, {
      msg: value,
    })
  }

  const [searchContent, setSearchContent] = useState({ ...firstPage });
  const [showList, setShowList] = useState([]);
  const [originData, setOriginData] = useState({});
  const [dialogContent, setDialogContent] = useState({});
  const [nextPage, setNextPage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [index, setIndex] = useState(0);
  const [tabNumberList, setTabNumberList] = useState({});

  useEffect(() => {
    dispatch(openListSearch());
    navigation.setOptions({
      // headerRight: () => <HeaderRightButtonOfList />,
      headerCenterArea: ({ ...rest }) => <HeaderCenterSearch routeParams={rest} />
    })
    return () => dispatch(setTabName(''));
  }, [])

  useEffect(() => {
    timer && clearTimeout(timer);
    timer = setTimeout(() => {
      getList(searchContent);
      getTypeTotal(searchContent);
    }, 0)
    return () => timer && clearTimeout(timer);
  }, [searchContent])

  //修改角色时
  useMemo(() => {
    setSearchContent({
      ...searchContent,
      ...firstPage,
      // role
    });
  }, [role])

  // 获取数据总数
  const getTypeTotal = async (params) => {
    try {
      const res = await AdvanceApi.AdvanceTotalList(params);
      if (res?.code !== SUCCESS_CODE) {
        toast.show(`${res?.msg}`, { type: 'danger' });
        return;
      }
      setTabNumberList(res.data);
      console.log('打印全部数量：', res, params)
    } catch (err) {
      toast.show(`出现了意料之外的问题，请联系系统管理员处理`, { type: 'danger' });
    }
  };

  const getList = async (params) => {
    setIsLoading(true);
    try {
      const res = await AdvanceApi.AdvanceList(params);
      console.log('获取预支数据：', res);
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
      setShowList([...res.data.content]);
    } catch (err) {
      toast.show(`出现了意料之外的问题，请联系系统管理员处理`, { type: 'danger' });
    } finally {
      setIsLoading(false);
    }
  };

  const filter = (values) => {
    console.log('打印筛选框的值：', values);
    const jobStartDate = values.dateRange.startDate;
    const jobEndDate = values.dateRange.endDate;
    const companyId = values.enterprise.length ? values.enterprise[0].value : '';
    const storeId = values.store.length ? values.store[0].value : '';
    const recruiterId = values.staff.length ? values.staff[0].value : '';
    const nameOrIdNo = values.search;
    const status = values.status.length ? values.status[0].value : '';

    setSearchContent({
      ...searchContent,
      ...firstPage,
      jobStartDate,
      jobEndDate,
      nameOrIdNo,
      companyId,
      storeId,
      recruiterId,
      status
    });
  };

  const callPhone = (item) => {
    if (!item.mobile) {
      toast.show('暂无联系方式', { type: 'warning' });
      return;
    }
    dialogRef.current.setShowDialog(true);
    setDialogContent({
      dialogTitle: '温馨提示',
      confirmOnPress: () => {
        Linking.openURL(`tel:${item.mobile}`)
        dialogRef.current.setShowDialog(false);
      },
      dialogComponent: <CallPhone message={item} />
    });
  };

  const pressName = async (item) => {
    try {
      const res = await AdvanceApi.MemberMessage(item.recruitFlowId);
      if (res?.code !== SUCCESS_CODE) {
        toast.show(`${res?.msg}`, { type: 'danger' });
        return;
      }
      console.log('打印会员数据：', res.data);
      res.data.flowId = item.recruitFlowId;
      dialogRef.current.setShowDialog(true);
      setDialogContent({
        dialogTitle: '会员信息',
        dialogComponent: <FormMemberDetail memberInfoList={res.data} showDate={true} />
      });
    } catch (err) {
      toast.show(`出现了意料之外的问题，请联系系统管理员处理`, { type: 'danger' });
    }
  };

  const pressFactory = async (item) => {
    try {
      const res = await AdvanceApi.OrderInfo(item.recruitFlowId);
      if (res?.code !== SUCCESS_CODE) {
        if (res?.code === 2) {
          toast.show(`${res?.msg}`, { type: 'warning' });
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
  };

  const selectIndex = (selectIndex) => {
    setIndex(selectIndex);
    const selectItem = TAB_OF_LIST.ADVANCE_LIST.find((item, index) => index === selectIndex);
    const tabName = selectItem.type;
    dispatch(setTabName(tabName));
    if (showList.length) {
      flatListRef?.current?.scrollToIndex({
        index: 0,
        viewPosition: 0
      });
    }
    switch (selectIndex) {
      case 0:
        searchContent.status = '';
        break;
      case 1:
        searchContent.status = 'PENDING';
        break;
      case 2:
        searchContent.status = 'FAIL';
        break;
      case 3:
        searchContent.status = 'PASS';
        break;
    }
    setSearchContent({ ...searchContent, ...firstPage });
  };

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
            { color: '#409EFF', textAlign: 'center' }
          ]}
          numberOfLines={2}
          onPress={() => callPhone(item)}
          ellipsizeMode="tail">{item.userName || '无'}</Text>
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
          ellipsizeMode="tail">{item.storeName || '无'}</Text>
        <Text
          style={[
            styles.itemText,
          ]}
          numberOfLines={2}
          ellipsizeMode="tail">{item.advanceAmount || '无'}</Text>
        <Text
          style={[
            styles.itemText,
            { color: '#409EFF' }
          ]}
          numberOfLines={2}
          onPress={() => toAdvanceAudit(item)}
          ellipsizeMode="tail">{getEnumValue(ADVANCERESULT, item.status) || '无'}</Text>
        <Text
          style={[
            styles.itemText,
            { color: '#409EFF' }
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
        startText="入职开始："
        endText="入职结束"
        filterFun={filter}
        status={ADVANCERESULT}
        clearRangeDate
        singleSelect
        canFilterStatus
      />
      <CenterSelectDate centerDateStyle={{ marginBottom: 0 }} />
      <View style={styles.tab_containerStyle}>
        {TAB_OF_LIST.ADVANCE_LIST.map((tabItem, tabIndex) => {
          const active = index === tabIndex;
          return (
            <TouchableOpacity key={tabIndex} style={styles.tabItem} onPress={() => selectIndex(tabIndex)}>
              <Text style={[styles.tabItem_text, active && styles.tabItem_titleStyle_active]}>{tabItem.title}</Text>
              <Text style={[styles.tabItem_text, active && styles.tabItem_titleStyle_active]}>{tabNumberList[tabItem.type] || 0}</Text>
            </TouchableOpacity>
          )
        })}
      </View>
      <View style={styles.list_head}>
        {ADVANCE_STATE_LIST_HEAD.map((item, index) => <Text key={index} style={styles.list_head_text}>{item.title}</Text>)}
      </View>
      <View style={{ flex: 1 }}>
        <FlatList
          ref={flatListRef}
          data={memoList}
          style={{ backgroundColor: '#fff' }}
          renderItem={renderItem}
          keyExtractor={(item, index) => item.applyId}
          getItemLayout={(data, index) => ({ length: 100, offset: 100 * index, index })}
          refreshing={isLoading}
          onRefresh={refresh}
          initialNumToRender={20}
          ListFooterComponent={<Footer showFooter={memoList.length} hasNext={originData.hasNext} />}
          ListEmptyComponent={<Empty otherEmptyStyle={{ height: 500 }} />}
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

export default AdvanceManage;