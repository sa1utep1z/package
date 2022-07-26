import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useSelector } from 'react-redux';
import {Formik, Field} from 'formik';
import { Text } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';

import SelectItem from '../../Form/SelectItem';
import SearchInput from '../../SearchInput';
import DateRangePicker from './DateRangePicker';

const HeaderSearch = ({
  batchOperate,
  noStoreAndStaff = false,
    ...rest
  }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const showSearch = useSelector(state => state.listHeaderSearch.canSearch);

  let DATA_enterprise = [], DATA_store = [], DATA_staff = []; 
  for(let i = 0; i < 20; i++){
    DATA_enterprise.push({
      title: `企业${i+1}`,
      name: `龙华CN${i+1}`,
      index: i + 1,
      id: i,
      time: `2022-07-${i+1}`
    });
    DATA_store.push({
      title: `门店${i+1}`,
      name: `龙华CN${i+1}`,
      index: i + 1,
      id: i,
      time: `2022-07-${i+1}`
    });
    DATA_staff.push({
      title: `员工${i+1}`,
      name: `龙华CN${i+1}`,
      index: i + 1,
      id: i,
      time: `2022-07-${i+1}`
    });
  }

  useEffect(()=>{
    showSearch && startingAnimation();
    !showSearch && closeAnimation();
  },[showSearch])

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

  const initialValues = () => {
    if(noStoreAndStaff){
      return {
        enterprise: [],
        search: '',
        dateRange: {}
      };
    }
    return {
      enterprise: [],
      store: [],
      staff: [],
      search: '',
      dateRange: {}
    };
  };

  const onSubmit = values => {
    console.log('onSubmit....', values);
  };

  const batch = batchOperate && (
    <TouchableOpacity style={styles.batchButton} onPress={batchOperate}>
      <Text style={styles.btnText}>批量处理</Text>
    </TouchableOpacity>
  );

  return (
    <Formik
      initialValues={initialValues()}
      onSubmit={onSubmit}>
        {({...rest}) => {
          if(!showSearch) return <></>
          return (
            <Animated.View style={[styles.topView, {opacity: fadeAnim}]}>
              <View style={{marginBottom: 8}}>
                <Field
                  title="企业"
                  name="enterprise"
                  placeholder="请点击选择企业或进入搜索内容"
                  showLittleTitle
                  canSearch
                  bottomButton
                  noBorder
                  formalLabel={false}
                  lastButton={batch}
                  selectAreaStyle={styles.selectAreaStyle}
                  selectAreaTextStyle={styles.fontSize}
                  selectList={DATA_enterprise}
                  component={SelectItem}
                />
              </View>
              {!noStoreAndStaff && <View style={{flexDirection: 'row', marginBottom: 8}}>
                <Field
                  title="门店"
                  name="store"
                  showLittleTitle
                  canSearch
                  bottomButton
                  noBorder
                  formalLabel={false}
                  selectList={DATA_store}
                  selectContainerStyle={styles.selectContainerStyle}
                  selectAreaStyle={styles.selectAreaStyle}
                  selectAreaTextStyle={styles.fontSize}
                  component={SelectItem}
                />
                <View style={{width: 10}}></View>
                <Field
                  title="员工"
                  name="staff"
                  showLittleTitle
                  canSearch
                  bottomButton
                  noBorder
                  formalLabel={false}
                  selectList={DATA_staff}
                  selectContainerStyle={styles.selectContainerStyle}
                  selectAreaStyle={styles.selectAreaStyle}
                  selectAreaTextStyle={styles.fontSize}
                  component={SelectItem}
                />
              </View>}
              <Field
                name="dateRange"
                rest={rest}
                component={DateRangePicker}
              />
              <Field
                name="search"
                placeholder='请输入姓名、身份证或手机号'
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
    paddingHorizontal: 10, 
    marginBottom: 10
  },
  selectAreaStyle: {
    height: 30, 
    backgroundColor: '#fff', 
    borderRadius: 8
  },
  fontSize: {
    fontSize: 14
  },
  selectContainerStyle: {
    flex: 1 
  },
  searchInputStyle: {
    height: 30,
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