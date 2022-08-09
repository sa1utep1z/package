import React, { useRef, useEffect, useState, useMemo } from "react";
import { View, StyleSheet, TouchableOpacity, Text, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Entypo from 'react-native-vector-icons/Entypo';
import { useQuery } from '@tanstack/react-query';
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
import { SUCCESS_CODE, TAB_OF_LIST, JOB_ON_STATUS } from "../../../../utils/const";

const LeavingList = () => {
  const navigation = useNavigation();
  const toast = useToast();
  const firstPage = { pageSize: 20, pageNumber: 0 };
  const dialogRef = useRef(null);
  const rangeDate = useSelector(state => state.RangeDateOfList);
  const role = useSelector(state => state.roleSwitch.role);
  const [searchContent, setSearchContent] = useState({ role, ...firstPage });
  const [showList, setShowList] = useState({ content: [] });
  const [tabNumberList, setTabNumberList] = useState({});
  const [dialogContent, setDialogContent] = useState({});
 
  // 获取在离职名单数据
  const { isLoading, data, isError, status } = useQuery(['waitList', searchContent], ListApi.GetJobOnList);
  if (isError) {
    toast.show(`出现了意料之外的问题，请联系系统管理员处理`, { type: 'danger' });
  }
  if (status === 'success' && data?.code !== SUCCESS_CODE) {
    toast.show(`${data?.msg}`, { type: 'danger' });
  }

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => <HeaderRightButtonOfList />,
      headerCenterArea: ({ ...rest }) => <HeaderCenterSearch routeParams={rest} />
    })
  }, [])

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
      const res = await ListApi.GetJobStatus(params);
      console.log('打印获取状态的数据：', res)
      console.log('打印获取状态的参数：', params)
      if (res?.code !== SUCCESS_CODE) {
        toast.show(`请求失败，请稍后重试。${res.data?.msg}`, { type: 'danger' });
        return;
      }
      setTabNumberList(res.data);
    } catch (err) {
      toast.show(`出现了意料之外的问题，请联系系统管理员处理`, { type: 'danger' });
    }
  };

  useMemo(() => {
    if (data) {
      if (showList.content.length >= 20 && (data.data.pageNumber - showList.pageNumber === 1)) {
        showList.content = showList.content.concat(data.data.content);
        showList.pageNumber = data.data.pageNumber;
        setShowList(showList);
        return;
      }
      setShowList(data.data);
      console.log('打印在离职名单数据：', data.data)
    }
    getStatusList();
  }, [data])

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

  // 切换状态
  const selectIndex = (selectIndex) => {
    switch (selectIndex) {
      case 0:
        searchContent.status = '';
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
    navigation.navigate(NAVIGATION_KEYS.TRANSFER_FACTORY, { item })
  };

  // 查看企业详情
  const pressFactory = async (item) => {
    try {
      const res = await ListApi.FactoryMessage(item.flowId);
      if (res?.code !== SUCCESS_CODE) {
        toast.show(`请求失败，请稍后重试。${res?.msg}`, { type: 'danger' });
        return;
      }
      dialogRef.current.setShowDialog(true);
      setDialogContent({
        dialogTitle: '岗位信息',
        dialogComponent: <FormCompanyDetail message={res.data} />,
        rightTitle: '转厂/转单',
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
        toast.show(`请求失败，请稍后重试。${res?.msg}`, { type: 'danger' });
        return;
      }
      res.data.flowId = item.flowId;
      dialogRef.current.setShowDialog(true);
      setDialogContent({
        dialogTitle: '会员信息',
        dialogComponent: <FormMemberDetail memberInfoList={res.data} />,
        rightTitle: '编辑',
        rightTitleOnPress: () => editMemberMessage(res.data)
      });
    } catch (err) {
      toast.show(`出现了意料之外的问题，请联系系统管理员处理`, { type: 'danger' });
    }
  };

  const changeStatus = (item) => {
    if (item.jobStatus === 'JOB_RESIGN') {
      toast.show(`状态已确定！`, { type: 'warning' });
      return;
    }
    dialogRef.current.setShowDialog(true);
    setDialogContent({
      dialogTitle: '待处理',
      bottomButton: false,
      dialogComponent: <OnBoardingStatus dialogRef={dialogRef} item={item} />,
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
      dialogComponent: <Text style={{ textAlign: 'center', marginVertical: 20, fontSize: 18 }}>确定拨打该手机吗？</Text>
    });
  };

  const onEndReached = () => {
    if (showList.content.length < 20) return;
    if ((showList.content.length >= 20) && (showList.pageNumber < showList.totalPages - 1)) {
      if (searchContent.pageNumber < (showList.totalPages - 1)) {
        setSearchContent({ ...searchContent, pageNumber: searchContent.pageNumber += 1 });
      }
    }
  };

  const renderItem = ({ item }) => {
    const renderList = [
      {
        fieldName: item.companyShortName,
        textStyle: { color: '#409EFF', textAlign: 'left' },
        itemStyle: { justifyContent: 'flex-start' },
        pressFun: () => pressFactory(item)
      },
      {
        fieldName: item.name,
        pressFun: () => pressMemberInfo(item)
      },
      {
        fieldName: JOB_ON_STATUS[item.jobStatus],
        pressFun: () => changeStatus(item)
      },
      {
        fieldName: item.mobile || '无',
        textStyle: { color: '#409EFF', fontSize: 28 },
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
        filterFun={filter}
      />
      <CenterSelectDate />
      <BottomList
        list={showList?.content}
        tab={TAB_OF_LIST.LEAVING_LIST}
        renderItem={renderItem}
        tabNumberList={tabNumberList}
        isLoading={isLoading}
        onEndReached={onEndReached}
        nowSelectIndex={selectIndex}
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
    flex: 1,
    paddingTop: 10
  },
  listStyle: {
    minHeight: 64,
    // maxHeight: 64,
    borderColor: '#e3e3e3',
    borderBottomWidth: 1,
    flexDirection: 'row',
    paddingLeft: 20,
    paddingRight: 15
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

export default LeavingList;