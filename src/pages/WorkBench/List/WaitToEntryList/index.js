import React, { useRef, useEffect, useState, useMemo } from "react";
import { View, StyleSheet, TouchableOpacity, Text, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Entypo from 'react-native-vector-icons/Entypo';
import { useSelector } from 'react-redux';
import moment from "moment";
import NormalDialog from "../../../../components/NormalDialog";
import { useToast } from "react-native-toast-notifications";
import HeaderRightButtonOfList from '../../../../components/List/HeaderRightButtonOfList';
import HeaderSearch from "../../../../components/List/HeaderSearch";
import CenterSelectDate from "../../../../components/List/CenterSelectDate";
import HeaderCenterSearch from "../../../../components/Header/HeaderCenterSearch";
import OnBoardingStatus from "../../../../components/NormalDialog/OnBoardingStatus";
import FormMemberDetail from "../../../../components/NormalDialog/FormMemberDetail";
import FormCompanyDetail from "../../../../components/NormalDialog/FormCompanyDetail";
import BottomList from "../../../../components/List/BottomList";
import ListApi from "../../../../request/ListApi";
import NAVIGATION_KEYS from "../../../../navigator/key";
import { SUCCESS_CODE, TAB_OF_LIST, ON_BOARDING_STATUS } from "../../../../utils/const";
import CallPhone from "../../../../components/NormalDialog/CallPhone";

let timer;

const WaitToEntryList = () => {
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

  // 手机号隐藏四位数
  const geTel = (tel) => {
    const reg = /^(\d{3})\d{4}(\d{4})$/;
    return tel.replace(reg, '$1****$2');
  };
  useEffect(() => {
    navigation.setOptions({
      headerCenterArea: ({...rest}) => <HeaderCenterSearch routeParams={rest}/>,
      headerRight: () => <HeaderRightButtonOfList />
    })
    timer && clearTimeout(timer);
    timer = setTimeout(()=>{
      getList(searchContent);
      getStatusList();
    }, 0)
    return () => {
      setShowList([]);
      setOriginData({});
      timer && clearTimeout(timer);
    }
  }, [searchContent])

  // 获取待入职名单数据
  const getList = async (params) => {
    console.log('getList --> params', params);
    setIsLoading(true);
    try {
      const res = await ListApi.GetWaitList(params);
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

  //修改角色时
  useMemo(() => {
    setSearchContent({
      ...searchContent,
      ...firstPage,
      role
    });
  }, [role])

  //修改时间时
  useMemo(() => {
    setSearchContent({
      ...firstPage,
      ...searchContent,
      startDate: moment(rangeDate.startDate).format('YYYY-MM-DD'),
      endDate: moment(rangeDate.endDate).format('YYYY-MM-DD')
    });
  }, [rangeDate])

  const getStatusList = async () => {
    const params = {
      companyIds: searchContent?.companyIds || [],
      storeIds: searchContent?.storeIds || [],
      recruitIds: searchContent?.names || [],
      startDate: searchContent?.startDate || '',
      endDate: searchContent?.endDate || '',
      str: searchContent?.str || '',
      role
    };
    try {
      const res = await ListApi.GetWaitStatus(params);
      console.log('打印获取状态的数据：', res)
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

  // 批量操作
  const batchOperate = () => {
    navigation.navigate(NAVIGATION_KEYS.BATCH_OPERATE_LIST, { 
      list: 'onBoarding',
      searchParams: searchContent,
      refresh
    })
  };

  // 切换状态
  const selectIndex = (selectIndex) => {
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
  const pressFactory = async (item) => {
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
  };

  // 查看会员详情
  const pressMemberInfo = async (item) => {
    try {
      const res = await ListApi.MemberMessage(item.flowId);
      if (res?.code !== SUCCESS_CODE) {
        toast.show(`${res?.msg}`, { type: 'danger' });
        return;
      }
      res.data.flowId = item.flowId;
      dialogRef.current.setShowDialog(true);
      console.log('查看会员详情：', res)
      setDialogContent({
        dialogTitle: '会员信息',
        dialogComponent: <FormMemberDetail memberInfoList={res.data} showDate={true} />,
      });
    } catch (err) {
      toast.show(`出现了意料之外的问题，请联系系统管理员处理`, { type: 'danger' });
    }
  };

  const changeStatus = (item) => {
    console.log('选择的状态：', item)
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
  };

  const callPhone = item => {
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

  const refresh = () => setSearchContent({...searchContent, ...firstPage});

  const onEndReached = () => {
    if(originData.hasNext){
      const nextPage = {...searchContent, pageNumber: searchContent.pageNumber += 1};
      setSearchContent(nextPage);
      setNextPage(true);
    }
  };

  const renderItem = ({ item }) => {
    const renderList = [
      {
        fieldName: item.companyShortName,
        textStyle: { color: '#409EFF', textAlign: 'center' },
        pressFun: () => pressFactory(item)
      },
      {
        fieldName: item.name,
        pressFun: () => pressMemberInfo(item)
      },
      {
        fieldName: ON_BOARDING_STATUS[item.onBoardingStatus],
        pressFun: () => changeStatus(item)
      },
      {
        fieldName: geTel(item.mobile) || '无',
        textStyle: { color: '#409EFF', fontSize: 24 },
        pressFun: () => item.mobile && callPhone(item)
      }
    ];
    return (
      <View key={item.id} style={styles.listStyle}>
        {renderList.map((renderItem, index) => (
          <TouchableOpacity key={index} style={[styles.listItem, renderItem.itemStyle]} onPress={renderItem.pressFun}>
            <Text style={[styles.itemText, renderItem.textStyle]}>{renderItem.fieldName}</Text>
            {renderItem.fieldName === item.phone && <Entypo name='phone' size={16} color='#409EFF' />}
          </TouchableOpacity>
        ))}
      </View>
    )
  };

  return (
    <View style={styles.screen}>
      <HeaderSearch
        batchOperate={batchOperate}
        filterFun={filter}
      />
      <CenterSelectDate />
      <BottomList
        list={showList}
        tab={TAB_OF_LIST.WAIT_TO_ENTRY_LIST}
        renderItem={renderItem}
        tabNumberList={tabNumberList}
        isLoading={isLoading}
        onRefresh={refresh}
        onEndReached={onEndReached}
        nowSelectIndex={selectIndex}
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
  listStyle: {
    minHeight: 80,
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(0, 0, 0, .05)',
    flexDirection: 'row',
    marginHorizontal: 20
  },
  listItem: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  itemText: {
    fontSize: 28,
    color: '#333'
  }
});

export default WaitToEntryList;