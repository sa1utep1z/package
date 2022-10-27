import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Formik, Field } from 'formik';
import { useDispatch } from 'react-redux';

import HeaderSelectItem from './HeaderSelectItem';
import HeaderSearchInput from './HeaderSearchInput';
import FilterMore from './FilterMore';
import { openDialog, setTitle } from '../../redux/features/PageDialog'; 

let restForm;
const initialValues = {
  enterprise: [],
  building: [],
};

const HeaderSearchOfDormitory = () => {
  const dispatch = useDispatch();

  const [isFilterMore, setIsFilterMore] = useState(false);

  const onSubmit = values => {
    console.log('onSubmit-values', values);
    if(values?.floorNum || values?.roomNum || values?.bedNum || values?.startDate || values?.endDate){
      const {floorNum, roomNum, bedNum, startDate, endDate} = values;
      if(floorNum.length || roomNum.length || bedNum.length || !!startDate || !!endDate){
        setIsFilterMore(true);
      }
    }
  };

  const filterOnPress = () => {
    dispatch(setTitle(`筛选更多`));
    dispatch(openDialog(<FilterMore originForm={restForm} />));
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}>
      {({...rest}) => {
        restForm = rest;
        return (
          <View style={styles.totalArea}>
            <View style={styles.lineArea}>
              <Field
                name="enterprise"
                label="企业"
                type="enterprise"
                component={HeaderSelectItem}
              />
              <TouchableOpacity style={styles.buttonArea}>
                <Text style={styles.buttonText}>批量操作</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.lineArea}>
              <Field
                name="enterprise"
                label="宿舍楼栋"
                component={HeaderSelectItem}
              />
              <TouchableOpacity style={[styles.filterMoreButton, isFilterMore && styles.filteringArea]} onPress={filterOnPress}>
                <Text style={[styles.filterMoreText, isFilterMore && styles.filteringText]}>筛选更多</Text>
              </TouchableOpacity>
            </View>
            <Field
              name="search"
              placeholder={'请输入会员姓名、身份证或手机号码'}
              component={HeaderSearchInput}
            />
          </View>
        )
      }}
    </Formik>
  )
};

const styles = StyleSheet.create({
  totalArea: {
    padding: 30
  },
  lineArea: {
    flexDirection: 'row', 
    height: 60, 
    marginBottom: 20
  },
  buttonArea: {
    height: 60, 
    backgroundColor: '#409EFF', 
    marginLeft: 20, 
    borderRadius: 10, 
    justifyContent: 'center'
  },
  buttonText: {
    fontSize: 24, 
    marginHorizontal: 10,
    color: '#ffffff' 
  },
  filterMoreButton: {
    height: 60, 
    marginLeft: 20,
    borderRadius: 10, 
    justifyContent: 'center', 
    borderColor: '#409EFF', 
    borderWidth: 1, 
    backgroundColor: '#ffffff'
  },
  filteringArea: {
    borderWidth: 0, 
    backgroundColor: '#409EFF'
  },
  filterMoreText: {
    fontSize: 24, 
    marginHorizontal: 10, 
    color: '#409EFF'
  },
  filteringText: {
    color: '#ffffff'
  }
});

export default HeaderSearchOfDormitory;