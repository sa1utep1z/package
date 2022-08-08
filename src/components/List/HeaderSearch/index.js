import React, { useState, useRef, useEffect, useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity, Animated, TextInput } from 'react-native';
import { useSelector } from 'react-redux';
import {Formik, Field} from 'formik';
import { Text, SearchBar } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import { useToast } from "react-native-toast-notifications";

import { STATUS_LIST, SUCCESS_CODE } from '../../../utils/const';
import SelectItem from '../../Form/SelectItem';
import SearchItem from '../../Form/SearchItem';
import SearchInput from '../../SearchInput';
import DateRangePicker from './DateRangePicker';
import MyMembersApi from '../../../request/MyMembersApi';

let restForm;

const initialValues = {
  enterprise: [],
  status: [],
  store: [],
  staff: [],
  dateRange: {},
  search: ''
};

const HeaderSearch = ({
  batchOperate,
  filterFun,
  staffSearch,
  companySingleSelect,
  storeSingleSelect,
  noStoreAndStaff = false,
  canFilterStatus = false,
  placeholder= '',
  companyShow = true,
    ...rest
  }) => {
  const toast = useToast();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const showSearch = useSelector(state => state.listHeaderSearch.canSearch);

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
    filterFun(values);
  };

  const batch = batchOperate && (
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
          if(!showSearch) return <></>
          return (
            <Animated.View style={[styles.topView, {opacity: fadeAnim}]}>
              <View style={{flexDirection: 'row', marginBottom: 20}}>
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
                  singleSelect={companySingleSelect}
                  // selectAreaStyle={styles.selectAreaStyle}
                  // selectAreaTextStyle={styles.fontSize}
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
                  selectContainerStyle={{marginLeft: 40}}
                  // selectAreaStyle={styles.selectAreaStyle}
                  // selectAreaTextStyle={styles.fontSize}
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
                  singleSelect={storeSingleSelect}
                  formalLabel={false}
                  selectList={storeList}
                  // selectAreaStyle={styles.selectAreaStyle}
                  // selectAreaTextStyle={styles.fontSize}
                  component={SelectItem}
                />
                <View style={{width: 40}}></View>
                <Field
                  title="员工"
                  name="staff"
                  showLittleTitle
                  canSearch
                  bottomButton
                  noBorder
                  autoSubmit
                  formalLabel={false}
                  selectList={staffList}
                  // selectAreaStyle={styles.selectAreaStyle}
                  // selectAreaTextStyle={styles.fontSize}
                  component={staffSearch ? SearchItem : SelectItem }
                />
              </View>}
              <Field
                name="dateRange"
                component={DateRangePicker}
              />
              <Field
                name="search"
                placeholder={placeholder? placeholder : '请输入姓名及身份证'}
                borderRadius={8}
                fontStyle={styles.fontSize}
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
  selectAreaStyle: {
    height: 30, 
    backgroundColor: '#fff', 
    borderRadius: 8,
    paddingLeft: 10
  },
  fontSize: {
    fontSize: 26
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
    paddingHorizontal: 10, 
    paddingVertical: 5, 
    backgroundColor: '#409EFF', 
    marginLeft: 10, 
    borderRadius: 8
  },
  btnText: {
    color: '#fff', 
    fontSize: 14
  }
})

export default HeaderSearch;