import React, { useRef, useEffect, useState, useMemo } from "react";
import { View, StyleSheet, TouchableOpacity, Text, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import Entypo from 'react-native-vector-icons/Entypo';
import { useSelector } from 'react-redux';
import moment from "moment";
import NormalDialog from "../../../../components/NormalDialog";
import { useToast } from "react-native-toast-notifications";
import HeaderRightButtonOfList from '../../../../components/List/HeaderRightButtonOfList';
import HeaderSearch from "../../../../components/List/HeaderSearch";
import CenterSelectDate from "../../../../components/List/CenterSelectDate";
import HeaderCenterSearch from "../../../../components/Header/HeaderCenterSearch";
import JobResignStatus from "../../../../components/NormalDialog/JobResignStatus";
import FormMemberDetail from "../../../../components/NormalDialog/FormMemberDetail";
import FormCompanyDetail from "../../../../components/NormalDialog/FormCompanyDetail";
import BottomList from "../../../../components/List/BottomList";
import ListApi from "../../../../request/ListApi";
import NAVIGATION_KEYS from "../../../../navigator/key";
import { SUCCESS_CODE, TAB_OF_LIST, JOB_ON_STATUS } from "../../../../utils/const";
import CallPhone from "../../../../components/NormalDialog/CallPhone";
import { setStartDate, setEndDate } from "../../../../redux/features/RangeDateOfList";

let timer;

const LeavingList = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
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
    return tel?.replace(reg, '$1****$2');
  };

  useEffect(() => {
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
      recruitIds: searchContent?.names || [],
      jobStartDate: searchContent?.jobStartDate || '',
      jobEndDate: searchContent?.jobEndDate || '',
      resignStartDate: searchContent?.resignStartDate || '',
      resignEndDate: searchContent?.resignEndDate || '',
      str: searchContent?.str || '',
      role
    };
    try {
      const res = await ListApi.GetJobStatus(params);
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
    const names = values.staff.length ? values.staff.map(item => item.value) : [];
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
      names
    });
  };

  // 切换状态
  const selectIndex = (selectIndex) => {
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
      setDialogContent({
        dialogTitle: '会员信息',
        dialogComponent: <FormMemberDetail memberInfoList={res.data} showDate={true} />,
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
      dialogComponent: <JobResignStatus dialogRef={dialogRef} item={item} refresh={refresh}/>,
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

  const refresh = () => setSearchContent({ ...searchContent, ...firstPage });

  const onEndReached = () => {
    if (originData.hasNext) {
      const nextPage = { ...searchContent, pageNumber: searchContent.pageNumber += 1 };
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
        fieldName: JOB_ON_STATUS[item.jobStatus],
        pressFun: () => changeStatus(item)
      },
      {
        fieldName: geTel(item.mobile) || '无',
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

  const listHead = (
    <View style={styles.tabArea}>
      <Text style={styles.tab}>企业</Text>
      <Text style={styles.tab}>姓名</Text>
      <Text style={styles.tab}>状态</Text>
      <Text style={styles.tab}>联系方式</Text>
    </View>   
  );

  return (
    <View style={styles.screen}>
      <HeaderSearch
        leavingList
        filterFun={filter}
      />
      <CenterSelectDate />
      <BottomList
        list={showList}
        tab={TAB_OF_LIST.LEAVING_LIST}
        renderItem={renderItem}
        tabNumberList={tabNumberList}
        isLoading={isLoading}
        listHead={listHead}
        onRefresh={refresh}
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
  }
});

export default LeavingList;