import React, { useState, useRef, useEffect, useMemo } from "react";
import { StyleSheet, View, Text } from 'react-native';
import { useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import { useToast } from "react-native-toast-notifications";

import SelectList from "../../../../components/SelectList";
import SearchInput from "../../../../components/SearchInput";
import ListApi from "../../../../request/ListApi";
import { SUCCESS_CODE } from "../../../../utils/const";
import NormalDialog from "../../../../components/NormalDialog";
import StatusChangeInInterviewList from "../../../../components/NormalDialog/StatusChangeInInterviewList";
import OnBoardingStatus from "../../../../components/NormalDialog/OnBoardingStatus";
import NewestStatus from "../../../../components/NormalDialog/NewestStatus";

const firstPage = { pageSize: 30, pageNumber: 0 };

const BatchOperateList = (props) => {
  const { route: { params } } = props;
  const toast = useToast();

  const dialogRef = useRef(null);

  const role = useSelector(state => state.roleSwitch.role);

  const [listArr, setListArr] = useState([]); // 列表数据
  const [searchContent, setSearchContent] = useState({ ...firstPage, role });
  const [dialogContent, setDialogContent] = useState({});

  useEffect(() => {
    switch (params.list) {
      case 'interview':
        getInterviewList();
        break;
      case 'onBoarding':
        getOnBoardingList();
        break;
      case 'newestStatus':
        getNewestList();
        break;
      default:
        break;
    }
  }, []);

  // 最新状态数据
  const getNewestList = async(str = '') => {
    searchContent.str = str;
    try {
      const res = await ListApi.NewestList(searchContent);
      if (res?.code !== SUCCESS_CODE) {
        toast.show(`获取列表失败，${res.msg}`, { type: 'danger' });
        return;
      }
      if (res?.data?.content.length) {
        res.data.content.map(item => {
          item.label = item.name;
          item.value = item.flowId;
        })
        setListArr(res.data.content);
      }
    } catch (err) {
      console.log('err', err);
      toast.show(`出现了意料之外的问题，请联系系统管理员处理`, { type: 'danger' });
    }
  };

  // 面试待处理数据
  const getInterviewList = async (str = '') => {
    searchContent.status = 'INTERVIEW_PENDING';
    searchContent.str = str;
    try {
      const res = await ListApi.InterViewList(searchContent);
      if (res?.code !== SUCCESS_CODE) {
        toast.show(`获取列表失败，${res.msg}`, { type: 'danger' });
        return;
      }
      if (res?.data?.content.length) {
        res.data.content.map(item => {
          item.label = item.name;
          item.value = item.flowId;
        })
        setListArr(res.data.content);
      }
    } catch (err) {
      console.log('err', err);
      toast.show(`出现了意料之外的问题，请联系系统管理员处理`, { type: 'danger' });
    }
  }

  // 待入职批量待处理数据
  const getOnBoardingList = async (str = '') => {
    searchContent.status = 'ON_BOARDING_PENDING';
    searchContent.str = str;
    try {
      const res = await ListApi.GetWaitList1(searchContent);
      if (res?.code !== SUCCESS_CODE) {
        toast.show(`获取列表失败，${res.msg}`, { type: 'danger' });
        return;
      }
      if (res?.data?.content.length) {
        res.data.content.map(item => {
          item.label = item.name;
          item.value = item.flowId;
        })
        setListArr(res.data.content);
      }
    } catch (err) {
      toast.show(`出现了意料之外的问题，请联系系统管理员处理`, { type: 'danger' });
    }
  }

  const filterFactory = (value) => {
    switch (params.list) {
      case 'interview':
        getInterviewList(value);
        break;
      case 'onBoarding':
        getOnBoardingList(value)
        break;
      case 'newestStatus':
        getNewestList(value);
        break;
      default:
        break;
    }
  };

  const batchChangeStatus = (list) => {
    if (!list.length) {
      toast.show('请选择数据！', { type: 'warning' });
      return;
    }
    dialogRef.current.setShowDialog(true);
    switch (params.list) {
      case 'interview':
        setDialogContent({
          dialogTitle: `已选${list.length}条`,
          bottomButton: false,
          dialogComponent: <StatusChangeInInterviewList dialogRef={dialogRef} batchOperateList={list} refresh={getInterviewList} />
        });
        break;
      case 'onBoarding':
        setDialogContent({
          dialogTitle: `已选${list.length}条`,
          bottomButton: false,
          dialogComponent: <OnBoardingStatus dialogRef={dialogRef} batchOperateList={list} refresh={getOnBoardingList} />
        });
        break;
      case 'newestStatus':
        setDialogContent({
          dialogTitle: `已选${list.length}条`,
          bottomButton: false,
          dialogComponent: <NewestStatus dialogRef={dialogRef} batchOperateList={list} refresh={getNewestList} />
        });
        break;
      default:
        break;
    }
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', paddingTop: 28 }}>
      <SearchInput
        placeholder='请输入姓名或身份证'
        searchPress={filterFactory}
        fontStyle={{ fontSize: 26 }}
        searchInputStyle={{ marginBottom: 20 }}
      />
      <SelectList
        data={listArr}
        confirm={batchChangeStatus}
        canMultiChoice
        bottomButton
        showStatus={params.list === 'newestStatus'}
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
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default BatchOperateList;