import React, {useRef, useEffect, useState, useMemo } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { useToast } from "react-native-toast-notifications";
import { useSelector } from 'react-redux';
import moment from "moment";

import HeaderRightButtonOfList from '../../../../components/List/HeaderRightButtonOfList';
import HeaderSearch from "../../../../components/List/HeaderSearch";
import CenterSelectDate from "../../../../components/List/CenterSelectDate";
import HeaderCenterSearch from "../../../../components/Header/HeaderCenterSearch";
import BottomList from "../../../../components/List/BottomList";
import NAVIGATION_KEYS from "../../../../navigator/key";
import ListApi from "../../../../request/ListApi";
import { SUCCESS_CODE, SIGN_UP_STATUS, TAB_OF_LIST } from "../../../../utils/const";

const firstPage = {pageSize: 20, pageNumber: 0};

const InterviewList = () => {
  const toast = useToast();
  const navigation = useNavigation();

  const rangeDate = useSelector(state => state.RangeDateOfList);
  const role = useSelector(state => state.roleSwitch.role);

  const [searchContent, setSearchContent] = useState({role, ...firstPage});
  const [showList, setShowList] = useState({content: []});
  const [tabNumberList, setTabNumberList] = useState({});

  useEffect(()=>{
    navigation.setOptions({
      headerRight: () => <HeaderRightButtonOfList />,
      headerCenterArea: ({...rest}) => <HeaderCenterSearch routeParams={rest}/>
    })
  }, [])

  //修改角色时
  useMemo(()=>{
    setSearchContent({
      ...searchContent,
      ...firstPage,
      role
    });
  },[role])

  //修改时间时
  useMemo(()=>{
    setSearchContent({
      ...firstPage,
      ...searchContent,
      startDate: moment(rangeDate.startDate).format('YYYY-MM-DD'), 
      endDate: moment(rangeDate.endDate).format('YYYY-MM-DD')
    });
  },[rangeDate])

  useMemo(()=>{
    console.log('searchContent', searchContent);
  },[searchContent])

  const { isLoading, data, isError, status } = useQuery(['interViewList', searchContent], ListApi.InterViewList);
  if(isError){
    toast.show(`出现了意料之外的问题，请联系系统管理员处理`, { type: 'danger' });
  }
  if(status === 'success' && data?.code !== SUCCESS_CODE){
    toast.show(`${data?.msg}`, { type: 'danger' });
  }

  const getTypeList = async() => {
    const params = {
      companyIds: searchContent?.companyIds || [],  
      storeIds: searchContent?.storeIds || [],
      recruitIds: searchContent?.names || [],
      startDate: searchContent?.startDate || '',
      endDate: searchContent?.endDate || '',
      str: searchContent?.str || '',
      role
    };
    try{
      const res = await ListApi.GetInterviewTypeList(params);
      if(res?.code !== SUCCESS_CODE){
        toast.show(`请求失败，请稍后重试。${res.data?.msg}`, {type: 'danger'});
        return;
      }
      setTabNumberList(res.data);
    }catch(err){
      toast.show(`出现了意料之外的问题，请联系系统管理员处理`, { type: 'danger' });
    }
  };

  useMemo(()=>{
    if(data){
      if(showList.content.length >= 20 && (data.data.pageNumber - showList.pageNumber === 1)){
        showList.content = showList.content.concat(data.data.content);
        showList.pageNumber = data.data.pageNumber;
        setShowList(showList);
        return;
      }
      setShowList(data.data);
    }
    getTypeList();
  },[data])

  const batchOperate = () => navigation.navigate(NAVIGATION_KEYS.BATCH_OPERATE_LIST);

  const renderItem = ({item}) => {
    const renderList = [
      { 
        fieldName: item.companyShortName, 
        textStyle: {color: '#409EFF', textAlign: 'left'}, 
        itemStyle: {justifyContent: 'flex-start'},
        pressFun: () => pressFactory(item)
      },
      { 
        fieldName: item.name, 
        pressFun: () => pressName(item)
      },
      { 
        fieldName: SIGN_UP_STATUS[item.signUpStatus], 
        pressFun: () => changeStatus(item)
      },
      { 
        fieldName: item.mobile || '无', 
        textStyle: {color: '#409EFF', fontSize: 24},
        pressFun: () => item.mobile && callPhone(item)
      }
    ];
    return (
      <View key={item.id} style={styles.listStyle}>
        {renderList.map((renderItem, index) => (
          <TouchableOpacity 
            key={index} 
            style={[styles.listItem, renderItem.itemStyle]} 
            onPress={renderItem.pressFun}>
            <Text 
              style={[
                styles.itemText, 
                renderItem.textStyle
              ]}
              numberOfLines={2}
              ellipsizeMode="tail">{renderItem.fieldName || '无'}</Text>
          </TouchableOpacity>
        ))}
      </View>
    )
  };

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

  const selectIndex = (selectIndex) => {
    switch(selectIndex){
      case 0:
        searchContent.status = '';
        break;
      case 1:
        searchContent.status = 'INTERVIEW_PENDING';
        break;
      case 2:
        searchContent.status = 'INTERVIEW_NO_ARRIVE';
        break;
      case 3:
        searchContent.status = 'INTERVIEW_FAIL';
        break;
      case 4:
        searchContent.status = 'INTERVIEW_PASS';
        break;
    }
    setSearchContent({...searchContent, ...firstPage});
  };

  return (
    <View style={styles.screen}>
      <HeaderSearch 
        batchOperate={batchOperate}
        filterFun={filter} 
      />
      <CenterSelectDate />
      <BottomList 
        list={showList?.content}
        renderItem={renderItem}
        tab={TAB_OF_LIST.INTERVIEW_LIST}
        tabNumberList={tabNumberList}
        nowSelectIndex={selectIndex}
      />
    </View>
  )
};

const styles = StyleSheet.create({
  screen: {
    flex: 1
  },
  listStyle: {
    minHeight: 80,
    borderBottomWidth: 2, 
    borderBottomColor: 'rgba(0, 0, 0, .05)',
    flexDirection: 'row', 
    marginHorizontal: 34
  },
  listItem: {
    flex: 1, 
    flexDirection: 'row',
    justifyContent: 'center', 
    alignItems: 'center'
  },
  itemText: {
    fontSize: 32,
    color: '#000',
    textAlign: 'center'
  }
});

export default InterviewList;