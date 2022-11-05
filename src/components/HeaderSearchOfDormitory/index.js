import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Formik, Field } from 'formik';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

import HeaderSelectItem from './HeaderSelectItem';
import HeaderSearchInput from './HeaderSearchInput';
import HeaderRadioItem from './HeaderRadioItem';
import FilterMore from './FilterMore';
import { openDialog, setTitle } from '../../redux/features/PageDialog'; 
import {DORMITORY_STAY_TYPE} from '../../utils/const';
import NAVIGATION_KEYS from '../../navigator/key';

let restForm;
const initialValues = {
  enterprise: [],
  buildingNum: [],
  liveType: [{label: '全部', value: 'ALL'}],
  floorNum: [],
  roomNum: [],
};

const HeaderSearchOfDormitory = ({
  selectIndex = 0,
  isBatchOperate = true
}) => {
  const navigation = useNavigation();

  const dispatch = useDispatch();

  const [isFilterMore, setIsFilterMore] = useState(false);

  const onSubmit = values => {
    if(values?.floorNum || values?.roomNum || values?.bedNum){
      const {floorNum, roomNum, bedNum} = values;
      if(floorNum.length || roomNum.length || bedNum.length){
        setIsFilterMore(true);
      }else{
        setIsFilterMore(false);
      }
    }
  };

  const batchOperate = () => navigation.navigate(NAVIGATION_KEYS.BATCH_OPERATE_DORMITORY);

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
            {isBatchOperate && <View style={styles.lineArea}>
              <Field
                name="enterprise"
                label="企业"
                type="enterprise"
                component={HeaderSelectItem}
              />
              {(selectIndex === 1 || selectIndex === 3) &&<TouchableOpacity style={styles.buttonArea} onPress={batchOperate}>
                <Text style={styles.buttonText}>批量操作</Text>
              </TouchableOpacity>}
            </View>}
            <View style={styles.lineArea}>
              <Field
                name="buildingNum"
                label="宿舍楼栋"
                canSearch={false}
                component={HeaderSelectItem}
              />
              {isBatchOperate && <TouchableOpacity style={[styles.filterMoreButton, isFilterMore && styles.filteringArea]} onPress={filterOnPress}>
                <Text style={[styles.filterMoreText, isFilterMore && styles.filteringText]}>筛选更多</Text>
              </TouchableOpacity>}
            </View>
           {isBatchOperate && <View style={styles.lineArea}>
              <Field
                name="liveType"
                label="入住类别"
                radioList={DORMITORY_STAY_TYPE}
                component={HeaderRadioItem}
              />
            </View>}
           {!isBatchOperate && <View style={styles.lineArea}>
              <Field
                name="floorNum"
                label="楼层"
                type="enterprise"
                component={HeaderSelectItem}
              />
              <View style={{width: 20}}></View>
              <Field
                name="roomNum"
                label="房间号"
                type="enterprise"
                component={HeaderSelectItem}
              />
            </View>}
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
    height: 60, 
    flexDirection: 'row', 
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