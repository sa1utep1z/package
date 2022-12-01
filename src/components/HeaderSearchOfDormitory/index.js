import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Formik, Field } from 'formik';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';

import HeaderSelectItem from './HeaderSelectItem';
import HeaderSearchInput from './HeaderSearchInput';
import HeaderRadioItem from './HeaderRadioItem';
import HeaderDateRange from './HeaderDateRange';
import FilterMore from './FilterMore';
import TopSearchApi from '../../request/Dormitory/TopSearchApi';
import { openDialog, setTitle } from '../../redux/features/PageDialog'; 
import {DORMITORY_STAY_TYPE, DORMITORY_ALL_TYPE, SUCCESS_CODE} from '../../utils/const';
import NAVIGATION_KEYS from '../../navigator/key';

let restForm;
const initialValues = {
  enterprise: [],
  buildingNum: [],
  floorNum: [],
  roomNum: [],
  bedNum: [],
  liveType: [{label: '全部', value: ''}],
  dormitoryType: [{label: '全部', value: ''}],
  search: '',
};

const MaleOrFemaleRightIcon = ({value}) => value.length ? 
<View style={styles.maleOrFemaleRightIconArea}>
  {value[0].value !== '' && <Ionicons 
    size={36} 
    name={value[0].value === 'DORM_MALE' ? 'man' : 'woman'} 
    color={value[0].value === 'DORM_MALE' ? '#409EFF' : '#eb00d8'}
  />}
</View> : <></>;

const HeaderSearchOfDormitory = ({
  filterFun, //筛选的函数
  selectIndex = 0,
  enterpriseStyle,
  otherHeaderStyle,
  autoQueryBuilding = false, //自动查询宿舍楼栋；
  filterMore = false, //是否筛选更多；
  filterEnterprise = false, //是否筛选企业；
  filterBuilding = false, //是否筛选楼栋；
  filterFloor = false, //是否筛选楼层；
  filterLiveType = false, //是否入住类别；
  filterDormitoryType = false, //是否筛选宿舍分类，默认为否；
  filterMemberInfo = false, //是否筛选会员姓名及身份证；
  filterDateRange = false, //是否筛选日期范围；
  filterFloorAndRoom = false, //是否筛选楼层及房间号（在同一行中）；
  filterBuildingAndFloor = false, //是否筛选楼栋跟楼层（在同一行中）；
  buildingCanDelete = true, //宿舍楼栋是否支持删除；
}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const showSearch = useSelector(state => state.listHeaderSearch.canSearch);

  const [isFilterMore, setIsFilterMore] = useState(false);

  useEffect(() => {
    if(autoQueryBuilding){
      queryBuilding();
      return;
    }
    restForm.submitForm();
  }, [])

  const queryBuilding = async() => {
    try {
      const res = await TopSearchApi.getBuildingList();
      if(res.code !== SUCCESS_CODE){
        toast.show(`获取宿舍楼栋列表失败，${res.msg}`, { type: 'danger' });
        return;
      }
      if(res.data.length){
        restForm.setFieldValue('buildingNum', [res.data[0]]);
      }
    }catch(error){
      console.log('getBuildingList->error', error);
    }finally{
      restForm.submitForm();
    }
  };

  const onSubmit = values => {
    if(values?.floorNum && values?.roomNum && values?.bedNum){
      const {floorNum, roomNum, bedNum} = values;
      if(floorNum.length || roomNum.length || bedNum.length){
        setIsFilterMore(true);
      }else{
        setIsFilterMore(false);
      }
    }
    filterFun(values);
  };

  const batchOperate = () => navigation.navigate(NAVIGATION_KEYS.BATCH_OPERATE_DORMITORY, {
    selectIndex
  });

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
          <>
            {showSearch ? <View style={[styles.totalArea, otherHeaderStyle]}>
              {filterEnterprise && <View style={styles.lineArea}>
                <Field
                  name="enterprise"
                  label="企业"
                  type="enterprise"
                  otherLabelStyle={enterpriseStyle}
                  component={HeaderSelectItem}
                />
                {(selectIndex === 1 || selectIndex === 3) &&<TouchableOpacity style={styles.buttonArea} onPress={batchOperate}>
                  <Text style={styles.buttonText}>批量操作</Text>
                </TouchableOpacity>}
              </View>}
              {filterBuilding && <View style={styles.lineArea}>
                <Field
                  name="buildingNum"
                  label="宿舍楼栋"
                  type="building"
                  canSearch={false}
                  setIsFilterMore={setIsFilterMore}
                  component={HeaderSelectItem}
                />
                {filterMore && <TouchableOpacity style={[styles.filterMoreButton, isFilterMore && styles.filteringArea]} onPress={filterOnPress}>
                  <Text style={[styles.filterMoreText, isFilterMore && styles.filteringText]}>筛选更多</Text>
                </TouchableOpacity>}
              </View>}
            {filterFloorAndRoom && <View style={styles.lineArea}>
                <Field
                  name="floorNum"
                  label="楼层"
                  type="floor"
                  component={HeaderSelectItem}
                />
                <View style={{width: 20}}></View>
                <Field
                  name="roomNum"
                  label="房间号"
                  type="room"
                  component={HeaderSelectItem}
                />
              </View>}
              {filterBuildingAndFloor && <View style={styles.lineArea}>
                <Field
                  name="buildingNum"
                  label="宿舍楼栋"
                  type="building"
                  canDelete={buildingCanDelete}
                  component={HeaderSelectItem}
                />
                <View style={{width: 20}}></View>
                <Field
                  name="floorNum"
                  label="楼层"
                  type="floor"
                  component={HeaderSelectItem}
                />
              </View>}
              {filterFloor && <View style={styles.lineArea}>
                <Field
                  name="floorNum"
                  label="楼层"
                  type="enterprise"
                  otherLabelStyle={{width: 140}}
                  component={HeaderSelectItem}
                />
              </View>}
              {filterLiveType && <View style={styles.lineArea}>
                <Field
                  name="liveType"
                  label="入住类别"
                  radioList={DORMITORY_STAY_TYPE}
                  component={HeaderRadioItem}
                />
              </View>}
              {filterDormitoryType && <View style={styles.lineArea}>
                <Field
                  name="dormitoryType"
                  label="宿舍分类"
                  radioList={DORMITORY_ALL_TYPE}
                  rightComponent={<MaleOrFemaleRightIcon value={rest.values.dormitoryType} />}
                  component={HeaderRadioItem}
                />
              </View>}
              {filterMemberInfo && <Field
                name="search"
                placeholder={'请输入会员姓名、身份证或手机号码'}
                component={HeaderSearchInput}
              />}
              {filterDateRange && <Field
                name="dateRange"
                component={HeaderDateRange}
              />}
            </View> : <></>}
          </>
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
  },
  maleOrFemaleRightIconArea: {
    flex: 1, 
    height: 60, 
    justifyContent: 'center', 
    alignItems: 'flex-end', 
    paddingRight: 10
  },
});

export default HeaderSearchOfDormitory;