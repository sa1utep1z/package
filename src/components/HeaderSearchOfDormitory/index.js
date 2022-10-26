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
    console.log('onSubmit->values', values);
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
          <View style={{padding: 30}}>
            <View style={{flexDirection: 'row', height: 60, marginBottom: 20}}>
              <Field
                name="enterprise"
                label="企业"
                type="enterprise"
                component={HeaderSelectItem}
              />
              <TouchableOpacity style={{height: 60, backgroundColor: '#409EFF', marginLeft: 20, borderRadius: 10, justifyContent: 'center'}}>
                <Text style={{fontSize: 24, marginHorizontal: 10, color: '#ffffff'}}>批量操作</Text>
              </TouchableOpacity>
            </View>
            <View style={{flexDirection: 'row', height: 60, marginBottom: 20}}>
              <Field
                name="enterprise"
                label="宿舍楼栋"
                component={HeaderSelectItem}
              />
              <TouchableOpacity style={{height: 60,  marginLeft: 20, borderRadius: 10, justifyContent: 'center', borderColor: '#409EFF', borderWidth: isFilterMore ? 0 : 1, backgroundColor: isFilterMore ? '#409EFF' : '#ffffff'}} onPress={filterOnPress}>
                <Text style={{fontSize: 24, marginHorizontal: 10, color: isFilterMore ? '#ffffff' : '#409EFF'}}>筛选更多</Text>
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
}

const styles = StyleSheet.create({

});

export default HeaderSearchOfDormitory;