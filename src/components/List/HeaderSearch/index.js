import React, { useState, useRef, useEffect, useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity, Animated, TextInput } from 'react-native';
import { useSelector } from 'react-redux';
import { Formik, Field } from 'formik';
import { Text } from '@rneui/themed';
import moment from "moment";
import { useDispatch } from 'react-redux';
import { useToast } from "react-native-toast-notifications";

import { STATUS_LIST, SUCCESS_CODE, TYPERESULT } from '../../../utils/const';
import SelectItem from '../../Form/SelectItem';
import SearchItem from '../../Form/SearchItem';
import SearchInput from '../../SearchInput';
import DateRangePicker from './DateRangePicker';
import DateRangePickerInLeavingList from './DateRangePickerInLeavingList';
import MyMembersApi from '../../../request/MyMembersApi';
import { setStartDate, setEndDate } from "../../../redux/features/RangeDateOfList";
import HeaderSelectItem from '../../Form/HeaderSelectItem';

let restForm;

const initialValues = {
  enterprise: [],
  status: [],
  type: [],
  store: [],
  staff: [],
  joinIn: { startDate: '', endDate: '' },
  leaving: { startDate: '', endDate: '' },
  dateRange: {},
  staffSearch: '',
  search: '',
  
};

const HeaderSearch = ({
  filterFun,
  staffSearch,
  singleSelect = false,
  noCompanyAndStatus = false,
  noStoreAndStaff = false,
  canFilterStatus = false,
  placeholder = '',
  companyShow = true,
  withoutCompanyFilter = false,
  typeResult = false,
  statusSingleSelect = false,
  batchOperate, // 批量操作函数
  leavingList = false,
  noSearchInput = false,
  clearRangeDate, //进入页面时不要筛选时间
  startText,
  endText,
  status,
  ...rest
}) => {
  const toast = useToast();
  const dispatch = useDispatch();

  const fadeAnim = useRef(new Animated.Value(0)).current;

  const rangeDate = useSelector(state => state.RangeDateOfList);
  const showSearch = useSelector(state => state.listHeaderSearch.canSearch);
  const nowTabName = useSelector(state => state.nowSelectTabNameInList.tabName);

  const [companyList, setCompanyList] = useState([]);
  const [storeList, setStoreList] = useState([]);
  const [recruiterList, setRecruiterList] = useState([]);

  useEffect(() => {
    showSearch && startingAnimation();
    !showSearch && closeAnimation();
    setRangeDate();
  }, [showSearch])

  useEffect(() => {
    getCompaniesList();
    getStoreList();
    getRecruiterList();
  }, [])

  const setRangeDate = () => {
    if (rangeDate.startDate && rangeDate.endDate) return;
    dispatch(setStartDate(!clearRangeDate ? moment().format('YYYY-MM-DD') : ''));
    dispatch(setEndDate(!clearRangeDate ? moment().format('YYYY-MM-DD') : ''));
  };

  const getCompaniesList = async () => {
    try {
      const res = await MyMembersApi.CompaniesList();
      if (res.code !== SUCCESS_CODE) {
        toast.show(`获取企业列表失败，${res.msg}`, { type: 'danger' });
        return;
      }
      if (res.data.length) {
        res.data.forEach((item, index) => {
          item.title = item.label;
          item.id = index + 1;
        });
        setCompanyList(res.data);
      }
    } catch (err) {
      console.log('err', err);
      toast.show(`获取企业列表失败，请联系管理员`, { type: 'danger' });
    }
  };

  const getStoreList = async () => {
    try {
      const res = await MyMembersApi.StoreList();
      if (res.code !== SUCCESS_CODE) {
        toast.show(`获取门店列表失败，${res.msg}`, { type: 'danger' });
        return;
      }
      if (res.data.length) {
        res.data.forEach((item, index) => {
          item.title = item.storeName;
          item.id = index + 1;
          item.value = item.storeId;
        });
        setStoreList(res.data);
      }
    } catch (err) {
      console.log('err', err);
      toast.show(`获取门店列表失败，请联系管理员`, { type: 'danger' });
    }
  };

  const getRecruiterList = async () => {
    try {
      const res = await MyMembersApi.RecruiterList();
      if (res.code !== SUCCESS_CODE) {
        toast.show(`获取招聘员列表失败，${res.msg}`, { type: 'danger' });
        return;
      }
      if (res.data.length) {
        res.data.forEach((item, index) => {
          item.title = item.label;
          item.id = index + 1;
        });
        setRecruiterList(res.data);
      }
    } catch (err) {
      console.log('err', err);
      toast.show(`获取招聘员列表失败，请联系管理员`, { type: 'danger' });
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
      {({ values, ...rest }) => {
        restForm = rest;
        let staffList = [];
        if (values.store && values.store.length > 0) {
          values.store.map((item) => {
            if (item.members.length) {
              item.members.map((member) => {
                staffList.push({
                  title: member.label,
                  id: member.value,
                  value: member.value
                })
              })
            }
          })
        } else {
          staffList = [];
        }
        return (
          <Animated.View style={[styles.topView, { opacity: fadeAnim }, !showSearch && { display: 'none' }, noSearchInput && { marginBottom: 6 }]}>
            {!noCompanyAndStatus && <View style={[{ flexDirection: 'row', marginBottom: 20 }, withoutCompanyFilter && { marginBottom: 0 }]}>
              {
                companyShow && <Field
                  title="企业"
                  name="enterprise"
                  placeholder={canFilterStatus ? '请选择企业' : '请点击选择企业或手动输入筛选'}
                  lastButton={batch}
                  singleSelect={singleSelect}
                  originList={companyList}
                  component={HeaderSelectItem}
                />}
              {typeResult && <View style={{ width: 40 }}></View>}
              {typeResult && <Field
                title="问题类型"
                name="type"
                placeholder='请选择'
                lastButton={batch}
                singleSelect={singleSelect}
                originList={TYPERESULT}
                component={HeaderSelectItem}
              />}
              {canFilterStatus && <View style={{ width: 40 }}></View>}
              {canFilterStatus && <Field
                title="状态"
                name="status"
                placeholder="请选择状态"
                lastButton={batch}
                singleSelect={statusSingleSelect || singleSelect}
                originList={status}
                component={HeaderSelectItem}
              />}
            </View>}
            {!noStoreAndStaff && <View style={{ flexDirection: 'row', marginBottom: 20 }}>
              <Field
                title="门店"
                name="store"
                singleSelect={singleSelect}
                originList={storeList}
                component={HeaderSelectItem}
              />
              <View style={{ width: 40 }}></View>
              {staffSearch ? <Field
                title="招聘员"
                name="staffSearch"
                placeholder="手动输入"
                showLittleTitle
                canSearch
                bottomButton
                noBorder
                autoSubmit
                formalLabel={false}
                component={SearchItem}
              /> : <Field
                title="招聘员"
                name="staff"
                singleSelect={singleSelect}
                originList={recruiterList}
                component={HeaderSelectItem}
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
              startText={startText}
              endText={endText}
              component={DateRangePicker}
            />}
            {!noSearchInput && <Field
              name="search"
              placeholder={placeholder ? placeholder : '请输入会员姓名、身份证或手机号码'}
              borderRadius={8}
              searchInputStyle={styles.searchInputStyle}
              component={SearchInput}
            />}
          </Animated.View>
        )
      }}
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
    marginLeft: 20,
    borderRadius: 10
  },
  btnText: {
    color: '#fff',
    fontSize: 26
  }
})

export default HeaderSearch;