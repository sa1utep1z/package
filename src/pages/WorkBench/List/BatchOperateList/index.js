import React, { useState, useRef, useEffect } from "react";
import { StyleSheet, View } from 'react-native';
import { useToast } from "react-native-toast-notifications";
import { useNavigation } from '@react-navigation/native';

import SelectList from "../../../../components/SelectList";
import SearchInput from "../../../../components/SearchInput";
import ListApi from "../../../../request/ListApi";
import { SUCCESS_CODE } from "../../../../utils/const";
import NormalDialog from "../../../../components/NormalDialog";
import StatusChangeInInterviewList from "../../../../components/NormalDialog/StatusChangeInInterviewList";
import OnBoardingStatus from "../../../../components/NormalDialog/OnBoardingStatus";

const BatchOperateList = (props) => {
  const { route: { params } } = props;
  const toast = useToast();
  const navigation = useNavigation();

  const dialogRef = useRef(null);

  const [listArr, setListArr] = useState([]); // 列表数据
  const [dialogContent, setDialogContent] = useState({});

  useEffect(() => {
    switch (params.list) {
      case 'interview':
        getInterviewList();
        break;
      case 'onBoarding':
        getOnBoardingList();
        break;
      default:
        break;
    }
  }, []);

  // 面试待处理数据
  const getInterviewList = async (str = '') => {
    const searchParams = params.searchParams;
    if(str){
      searchParams.str = str;
    }
    try {
      const res = await ListApi.InterViewList(searchParams);
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
    const searchParams = params.searchParams;
    if(str){
      searchParams.str = str;
    }
    try {
      const res = await ListApi.GetWaitList(searchParams);
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
        getOnBoardingList(value);
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
          dialogComponent: <StatusChangeInInterviewList dialogRef={dialogRef} batchOperateList={list} refresh={params.refresh} navigation={navigation}/>
        });
        break;
      case 'onBoarding':
        setDialogContent({
          dialogTitle: `已选${list.length}条`,
          bottomButton: false,
          dialogComponent: <OnBoardingStatus dialogRef={dialogRef} batchOperateList={list} refresh={params.refresh} navigation={navigation}/>
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