import React, { useState, useRef, useEffect, useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity, Animated, TextInput } from 'react-native';
import { useSelector } from 'react-redux';
import {Formik, Field} from 'formik';
import { Text } from '@rneui/themed';
import { useToast } from "react-native-toast-notifications";

import { STATUS_LIST, SUCCESS_CODE } from '../../../utils/const';
import SelectItem from '../../Form/SelectItem';
import SearchItem from '../../Form/SearchItem';
import SearchInput from '../../SearchInput';
import DateRangePicker from './DateRangePicker';
import DateRangePickerInLeavingList from './DateRangePickerInLeavingList';
import MyMembersApi from '../../../request/MyMembersApi';

let restForm;

const initialValues = {
  enterprise: [],
  status: [],
  store: [],
  staff: [],
  joinIn: {startDate: '', endDate: ''},
  leaving: {startDate: '', endDate: ''},
  dateRange: {},
  staffSearch: '',
  search: ''
};

const HeaderSearch = ({
  filterFun,
  staffSearch,
  companySingleSelect,
  storeSingleSelect,
  noStoreAndStaff = false,
  canFilterStatus = false,
  placeholder= '',
  companyShow = true,
  withoutCompanyFilter = false,
  batchOperate, // 批量操作函数
  leavingList = false,
    ...rest
  }) => {
  const toast = useToast();

  const fadeAnim = useRef(new Animated.Value(0)).current;

  const showSearch = useSelector(state => state.listHeaderSearch.canSearch);
  const nowTabName = useSelector(state => state.nowSelectTabNameInList.tabName);

  const [companyList, setCompanyList] = useState([]);
  const [storeList, setStoreList] = useState([]);

  useEffect(()=>{
    showSearch && startingAnimation();
    !showSearch && closeAnimation();
    getCompaniesList();
    getStoreList();
  },[showSearch])

  const getCompaniesList = async() => {
    try{  
      const res = await MyMembersApi.CompaniesList();
      if(res.code !== SUCCESS_CODE){
        toast.show(`获取企业列表失败，${res.msg}`, { type: 'danger' });
        return;
      }
      if(res.data.length){
        res.data.forEach((item,index) => {
          item.title = item.label;
          item.id = index + 1;
        });
        setCompanyList(res.data);
      }
    }catch(err){
      console.log('err', err);
      toast.show(`获取企业列表失败，请稍后重试`, { type: 'danger' });
    }
  };

  const getStoreList = async() => {
    try{  
      const res = await MyMembersApi.StoreList();
      if(res.code !== SUCCESS_CODE){
        toast.show(`获取门店列表失败，${res.msg}`, { type: 'danger' });
        return;
      }
      if(res.data.length){
        res.data.forEach((item,index) => {
          item.title = item.storeName;
          item.id = index + 1;
          item.value = item.storeId;
        });
        setStoreList(res.data);
      }
    }catch(err){
      console.log('err', err);
      toast.show(`获取门店列表失败`, { type: 'danger' });
    }
  };

  const startingAnimation = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true
    }).start();
  };

  const closeAnimation = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: true
    }).start();
  };

  const onSubmit = values => {
    filterFun && filterFun(values);
  };

  const batch = nowTabName === 'pending' && batchOperate && (
    <TouchableOpacity style={styles.batchButton} onPress={batchOperate}>
      <Text style={styles.btnText}>批量处理</Text>
    </TouchableOpacity>
  );

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}>
        {({values, ...rest}) => {
          restForm = rest;
          let staffList = [];
          if(values.store && values.store.length > 0){
            values.store.map((item) => {
              if(item.members.length){
                item.members.map((member) => {
                  staffList.push({
                    title: member.label,
                    id: member.value, 
                    value: member.value
                  })
                })
              }
            })
          }else{
            staffList = [];
          }
          return (
            <Animated.View style={[styles.topView, {opacity: fadeAnim}, !showSearch && {display: 'none'}]}>
              <View style={[{flexDirection: 'row', marginBottom: 20}, withoutCompanyFilter && {marginBottom: 0}]}>
                {
                  companyShow && <Field
                  title="企业"
                  name="enterprise"
                  placeholder={canFilterStatus ? '请选择企业' : '请点击选择企业或手动输入筛选'}
                  showLittleTitle
                  canSearch
                  bottomButton
                  noBorder
                  autoSubmit
                  formalLabel={false}
                  lastButton={batch}
                  selectAreaTextStyle={{fontSize: 28}}
                  singleSelect={companySingleSelect}
                  selectList={companyList}
                  component={SelectItem}
                />
                }
                {canFilterStatus && <Field
                  title="状态"
                  name="status"
                  placeholder="请选择状态"
                  showLittleTitle
                  canSearch
                  bottomButton
                  singleSelect
                  noBorder
                  autoSubmit
                  formalLabel={false}
                  lastButton={batch}
                  selectAreaTextStyle={{fontSize: 28}}
                  selectContainerStyle={{marginLeft: 40}}
                  selectList={STATUS_LIST}
                  component={SelectItem}
                />}
              </View>
              {!noStoreAndStaff && <View style={{flexDirection: 'row', marginBottom: 20}}>
                <Field
                  title="门店"
                  name="store"
                  showLittleTitle
                  canSearch
                  bottomButton
                  noBorder
                  autoSubmit
                  selectAreaTextStyle={{fontSize: 28}}
                  singleSelect={storeSingleSelect}
                  formalLabel={false}
                  selectList={storeList}
                  component={SelectItem}
                />
                <View style={{width: 40}}></View>
                {staffSearch ? <Field
                  title="店员"
                  name="staffSearch"
                  showLittleTitle
                  canSearch
                  bottomButton
                  noBorder
                  autoSubmit
                  fontStyle={{fontSize: 26}}
                  formalLabel={false}
                  component={SearchItem}
                /> : <Field
                  title="员工"
                  name="staff"
                  showLittleTitle
                  canSearch
                  bottomButton
                  noBorder
                  autoSubmit
                  selectAreaTextStyle={{fontSize: 28}}
                  formalLabel={false}
                  selectList={staffList}
                  component={SelectItem}
                />}
              </View>}
              {leavingList && <>
                <Field
                  name="joinIn"
                  component={DateRangePickerInLeavingList}
                />
                <Field
                  name="leaving"
                  leaving
                  component={DateRangePickerInLeavingList}
                />
              </>}
              {!leavingList && <Field
                name="dateRange"
                component={DateRangePicker}
              />}
              <Field
                name="search"
                placeholder={placeholder? placeholder : '请输入姓名或身份证'}
                borderRadius={8}
                fontStyle={{fontSize: 26}}
                searchInputStyle={styles.searchInputStyle}
                component={SearchInput}
              />
            </Animated.View>
        )}}
    </Formik>
  )
}

const styles = StyleSheet.create({
  topView: {
    paddingHorizontal: 32,
    marginVertical: 30
  },
  selectContainerStyle: {
    flex: 1 
  },
  searchInputStyle: {
    height: 60,
    marginBottom: 0, 
    paddingHorizontal: 0
  },
  batchButton: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#409EFF', 
    marginLeft: 28, 
    borderRadius: 10
  },
  btnText: {
    color: '#fff', 
    fontSize: 26
  }
})

export default HeaderSearch;