import React, { useState, useRef, useEffect, useMemo } from "react";
import { StyleSheet, View, Text } from 'react-native';
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
  const [searchContent, setSearchContent] = useState(params.searchParams);
  const [originData, setOriginData] = useState({});
  const [nextPage, setNextPage] = useState(false);
  const [load, setLoad] = useState(true);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
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
  }, [searchContent]);

  // 面试待处理数据
  const getInterviewList = async () => {
    try {
      const res = await ListApi.InterViewList(searchContent);
      console.log('getInterviewList --> res', res);
      if (res?.code !== SUCCESS_CODE) {
        toast.show(`获取列表失败，${res.msg}`, { type: 'danger' });
        return;
      }
      if (res?.data?.content.length) {
        res.data.content.map(item => {
          item.label = item.name;
          item.value = item.flowId;
        })
        setOriginData(res.data);
        if(nextPage){
          setListArr([...listArr, ...res.data.content]);
          setNextPage(false);
          return;
        }
        setListArr(res.data.content);
      }
    } catch (err) {
      toast.show(`出现了意料之外的问题，请联系系统管理员处理`, { type: 'danger' });
    } finally{
      setLoading(false);
    }
  }

  // 待入职批量待处理数据
  const getOnBoardingList = async () => {
    try {
      const res = await ListApi.GetWaitList(searchContent);
      console.log('getOnBoardingList --> res', res);
      if (res?.code !== SUCCESS_CODE) {
        toast.show(`获取列表失败，${res.msg}`, { type: 'danger' });
        return;
      }
      if (res?.data?.content.length) {
        res.data.content.map(item => {
          item.label = item.name;
          item.value = item.flowId;
        })
        setOriginData(res.data);
        if(nextPage){
          setListArr([...listArr, ...res.data.content]);
          setNextPage(false);
          return;
        }
        setListArr(res.data.content);
      }
    } catch (err) {
      toast.show(`出现了意料之外的问题，请联系系统管理员处理`, { type: 'danger' });
    } finally{
      setLoading(false);
    }
  }

  const filterFactory = (value) => {
    switch (params.list) {
      case 'interview':
        setSearchContent({...searchContent, str: value, pageNumber: 0});
        break;
      case 'onBoarding':
        setSearchContent({...searchContent, str: value, pageNumber: 0});
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

  const onEndReached = () => {
    if(originData.hasNext){
      const nextPage = {...searchContent, pageNumber: searchContent.pageNumber += 1};
      setSearchContent(nextPage);
      setNextPage(true);
    }
  };

  const onEndReachedFunc = () => {
    if(!load) return;
    onEndReached();
    setLoad(false);
  };

  const ListFooterComponent = (
    <Text style={styles.bottomText}>
      {originData.hasNext ? '加载中...' : '没有更多数据'}
    </Text>
  );

  const onRefresh = () => setSearchContent({...searchContent, pageNumber: 0});

  return (
    <View style={{ flex: 1, alignItems: 'center', paddingTop: 28 }}>
      <SearchInput
        placeholder='请输入会员姓名或身份证'
        searchPress={filterFactory}
        fontStyle={{ fontSize: 26 }}
        searchInputStyle={{ marginBottom: 20 }}
      />
      <SelectList
        data={listArr}
        confirm={batchChangeStatus}
        canMultiChoice
        bottomButton
        refreshing={isLoading}
        onRefresh={onRefresh}
        onEndReachedThreshold={0.01}
        onEndReached={onEndReachedFunc}
        onScrollEndDrag={()=>setLoad(true)}
        ListFooterComponent={ListFooterComponent}
        totalNumber={originData.total}
        otherText={<Text>当前<Text style={{color: '#409EFF'}}>{originData.pageNumber + 1}</Text>/{originData.totalPages}页，</Text>}
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
  },
  bottomText: {
    textAlign: 'center',
    fontSize: 26,
    color: '#CCCCCC'
  }
});

export default BatchOperateList;