import React, {useState, useRef, useEffect, useMemo} from "react";
import {StyleSheet, View, Text} from 'react-native';
import { useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import { useToast } from "react-native-toast-notifications";

import SelectList from "../../../../components/SelectList";
import SearchInput from "../../../../components/SearchInput";
import SignUpStateDialog from "../../../../components/List/SignUpStateDialog";
import ListApi from "../../../../request/ListApi";
import { SUCCESS_CODE, MEMBER_INFO } from "../../../../utils/const";
import { deepCopy } from "../../../../utils";
import NormalDialog from "../../../../components/NormalDialog";
import StatusChangeInInterviewList from "../../../../components/NormalDialog/StatusChangeInInterviewList";

const firstPage = {pageSize: 30, pageNumber: 0};

const BatchOperateList = (props) => {
  const {route: {params}} = props;
  const toast = useToast();

  const dialogRef = useRef(null);
  const xxxRef = useRef(null);
  
  const role = useSelector(state => state.roleSwitch.role);

  const [listArr, setListArr] = useState([]);
  const [searchContent, setSearchContent] = useState({...firstPage, role});
  const [dialogContent, setDialogContent] = useState({});

  useEffect(()=>{
    switch(params.list){
      case 'interview':
        getInterviewList();
        break;
      //TODO写其他页面的批量操作
      default:
        break;
    }
  },[])

  const getInterviewList = async(str = '') => {
    searchContent.status = 'INTERVIEW_PENDING';
    searchContent.str = str;
    try{
      const res = await ListApi.InterViewList2(searchContent);
      if(res?.code !== SUCCESS_CODE){
        toast.show(`获取列表失败，${res.msg}`, {type: 'danger'});
        return;
      }
      if(res?.data?.content.length){
        res.data.content.map(item => {
          item.label = item.name;
          item.value = item.flowId;
        })
        setListArr(res.data.content);
      }
    }catch(err){
      console.log('err', err);
      toast.show(`出现了意料之外的问题，请联系系统管理员处理`, { type: 'danger' });
    }
  }

  const filterFactory = (value) => {
    switch(params.list){
      case 'interview':
        getInterviewList(value);
        break;
      //TODO写其他页面的批量操作
      default:
        break;
    }
  };

  const batchChangeStatus = (list) => {
    if(!list.length){
      toast.show('请选择数据！', {type: 'warning'});
      return;
    }
    dialogRef.current.setShowDialog(true);
    setDialogContent({
      dialogTitle: `已选${list.length}条`,
      bottomButton: false,
      dialogComponent: <StatusChangeInInterviewList dialogRef={dialogRef} batchOperateList={list} refresh={getInterviewList} />
    });
  };

  return (
    <View style={{flex: 1, alignItems: 'center', paddingTop: 28}}>
      <SearchInput 
        placeholder='请输入姓名或身份证'
        searchPress={filterFactory}
        fontStyle={{fontSize: 26}}
        searchInputStyle={{marginBottom: 20}}
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