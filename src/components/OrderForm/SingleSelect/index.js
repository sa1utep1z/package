import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, ActivityIndicator} from 'react-native';
import {ErrorMessage} from 'formik';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useDispatch } from 'react-redux';
import { useToast } from 'react-native-toast-notifications';

import { openDialog, setTitle } from '../../../redux/features/PageDialog'; 
import SingleSelectList from '../../PageDialog/SingleSelectList';
import MyMembersApi from "../../../request/MyMembersApi";
import TopSearchApi from '../../../request/Dormitory/TopSearchApi';
import { SUCCESS_CODE } from '../../../utils/const';

/**单选*/
const SingleSelect = ({
  field, 
  form, 
  label,
  selectList = [], //单选列表自选
  type = '', //单选表单组件：提供几个基础模式：企业，门店，不需要模式也可以在外部传入selectList。
  filterStore = false, //type为store的时候需要对列表进行筛选。
  showLabel = true,
  placeholder = '',
  isRequire = false,
  touchStyle,
  touchAreaStyle,
  labelStyle,
  canSearch = true, //默认可以搜索
  canSelect = true, //是否可以选择；
  emptyText, //列表为空的时候需要显示的其他提示字段（例如级联关系中上一层未选中，则可以提示上一层未选中/操作的提醒）
  otherSelectPress, //点击时候触发其他判断函数；
  ...rest
}) => {
  const toast = useToast();
  const dispatch = useDispatch();
  
  const [loading, setLoading] = useState(false);

  const confirm = (list) => {
    form.setFieldValue(field.name, list);
  };

  const selectOnPress = () => {
    if(!canSelect) return;
    setLoading(true);
    otherSelectPress && otherSelectPress(field.name);
    dispatch(setTitle(`请选择${label}`));
    switch(type){
      case 'store':
        getStoreList();
        break;
      case 'factory':
        getFactoryList();
        break;
      case 'recruiter':
        getRecruiterList();
        break;
      case 'building': 
        getBuildingList();
        break;
      case 'floor':
        getFloorList();
        break;
      case 'room':
        getRoomList();
        break;
      default: //没传入type则自动使用外部传进的selectList。
        setLoading(false);
        dispatch(openDialog(<SingleSelectList emptyText={emptyText} canSearch={canSearch} selectList={selectList} fieldValue={field.value} confirm={confirm}/>));
        break;
    }
  };

  const getBuildingList = async() => {
    try {
      const res = await TopSearchApi.getBuildingList();
      if(res.code !== SUCCESS_CODE){
        toast.show(`获取宿舍楼栋列表失败，${res.msg}`, { type: 'danger' });
        return;
      }
      dispatch(openDialog(<SingleSelectList canSearch={canSearch} selectList={res.data} fieldValue={field.value} confirm={buildingConfirm}/>));
    }catch(error){
      console.log('getBuildingList->error', error);
      toast.show(`出现了意料之外的问题，请联系管理员处理`, { type: 'danger' });
    }finally{
      setLoading(false);
    }
  };

  const buildingConfirm = (list) => {
    form.setFieldValue(field.name, list);
    form.setFieldValue('floorNum', []);
    form.setFieldValue('roomNum', []);
  };

  const getFloorList = async() => {
    const {values: {buildingNum}} = form;
    if(!buildingNum.length){
      toast.show(`请先选择宿舍楼栋！`, { type: 'danger' });
      return;
    }
    try {
      const res = await TopSearchApi.getFloorList(buildingNum[0].value);
      if(res.code !== SUCCESS_CODE){
        toast.show(`获取楼层列表失败，${res.msg}`, { type: 'danger' });
        return;
      }
      res.data.length && res.data.forEach(item => item.label = `${item.label}F`);
      dispatch(openDialog(<SingleSelectList canSearch={canSearch} selectList={res.data} fieldValue={field.value} confirm={floorConfirm}/>));
    }catch(error){
      console.log('getFloorList->error', error);
      toast.show(`出现了意料之外的问题，请联系管理员处理`, { type: 'danger' });
    }finally{
      setLoading(false);
    }
  };

  const floorConfirm = (list) => {
    form.setFieldValue(field.name, list);
    form.setFieldValue('roomNum', []);
  };
  
  const getRoomList = async() => {
    const {values: {floorNum}} = form;
    if(!floorNum.length){
      toast.show(`请先选择宿舍楼层！`, { type: 'danger' });
      return;
    }
    try {
      const res = await TopSearchApi.getRoomList(floorNum[0].value);
      if(res.code !== SUCCESS_CODE){
        toast.show(`获取房间号列表失败，${res.msg}`, { type: 'danger' });
        return;
      }
      res.data.length && res.data.forEach(item => item.label = `${item.label}房`);
      dispatch(openDialog(<SingleSelectList canSearch={canSearch} selectList={res.data} fieldValue={field.value} confirm={confirm}/>));
    }catch(error){
      console.log('getRoomList->error', error);
      toast.show(`出现了意料之外的问题，请联系管理员处理`, { type: 'danger' });
    }finally{
      setLoading(false);
    }
  };

  const getStoreList = async() => {
    try {
      const res = await MyMembersApi.StoreList();
      if(res.code !== SUCCESS_CODE){
        toast.show(`获取门店列表失败，${res.msg}`, { type: 'danger' });
        return;
      }
      res.data.map(item => {
        item.label = item.storeName;
        item.value = item.storeId;
      });
      if(filterStore){
        filterStoreList(res.data);
        return;
      }
      dispatch(openDialog(<SingleSelectList canSearch={canSearch} selectList={res.data} fieldValue={field.value} confirm={confirm}/>));
    } catch (error) {
      console.log('getStoreList -> error', error);
      toast.show(`出现了意料之外的问题，请联系管理员处理`, { type: 'danger' });
    } finally{
      setLoading(false);
    }
  };

  const getFactoryList = async() => {
    try {
      const res = await MyMembersApi.CompaniesList();
      if(res.code !== SUCCESS_CODE){
        toast.show(`获取企业列表失败，${res.msg}`, { type: 'danger' });
        return;
      }
      dispatch(openDialog(<SingleSelectList canSearch={canSearch} selectList={res.data} fieldValue={field.value} confirm={confirm}/>));
    } catch (error) {
      console.log('getFactoryList -> error', error);
      toast.show(`出现了意料之外的问题，请联系管理员处理`, { type: 'danger' });
    } finally{
      setLoading(false);
    }
  };

  const getRecruiterList = async() => {
    try {
      const res = await MyMembersApi.RecruiterList();
      if(res.code !== SUCCESS_CODE){
        toast.show(`获取人员列表失败，${res.msg}`, { type: 'danger' });
        return;
      }
      dispatch(openDialog(<SingleSelectList canSearch={canSearch} selectList={res.data} fieldValue={field.value} confirm={confirm}/>));
    } catch (error) {
      console.log('getRecruiterList -> error', error);
      toast.show(`出现了意料之外的问题，请联系管理员处理`, { type: 'danger' });
    } finally{
      setLoading(false);
    }
  };

  const filterStoreList = (storeList) => {
    const fieldNameIndex = field.name.substr(4, 1); //获取当前设置的表单名称索引；
    const thisRangeTime = form.values[`rule${fieldNameIndex}`].orderRangeDate; //当前设置的规则的时间范围；
    const thisRangeTimeOfStart = thisRangeTime.startDate;

    const ruleNameList = Object.keys(form.values).filter(fieldName => fieldName.includes('rule'));
    let startDateList = [];
    for(const ruleName of ruleNameList){
      const range = form.values[`${ruleName}`].orderRangeDate;
      startDateList.push(range.startDate);
    }
    const thisRangeTimes = startDateList.filter(date => date === thisRangeTimeOfStart).length; //筛选出当前表单中一样时间范围的规则条数。
    if(thisRangeTimes > 1){ //说明存在多条一样时间范围的规则；则门店这里需要筛；
      let sameRangeDateStoreList = [];
      for(const ruleName of ruleNameList){
        if(thisRangeTime.startDate === form.values[`${ruleName}`].orderRangeDate.startDate){ //在表单中筛选当前时间范围一样的表单；
          if(form.values[`${ruleName}`].store.length){ //如果时间范围一样的表单中的store是已有选中的门店（数组长度>0）；
            sameRangeDateStoreList.push(...form.values[`${ruleName}`].store); //则将已选的store丢进数组中；
          }
        }
      }
      if(sameRangeDateStoreList.length){
        const selectedStoreIds = sameRangeDateStoreList.map(item => item.storeId);
        const filterStoreList = storeList.filter(store => !selectedStoreIds.includes(store.storeId));
        const nowFieldSelectedStore = form.values[`rule${fieldNameIndex}`].store;
        if(nowFieldSelectedStore.length){ //如果当前的表单是有值的话，那直接将当前的表单值放列表前列。
          filterStoreList.unshift(...nowFieldSelectedStore);
        }
        dispatch(openDialog(<SingleSelectList canSearch={canSearch} selectList={filterStoreList} fieldValue={field.value} confirm={confirm}/>));
        return;
      }
    }
    dispatch(openDialog(<SingleSelectList canSearch={canSearch} selectList={storeList} fieldValue={field.value} confirm={confirm}/>));
  };

  return (
    <View style={[{flex: 1}, styles.selectArea, form.errors[field.name] && form.touched[field.name] && {marginBottom: 10}, touchStyle]}>
      <View style={styles.container}>
        {showLabel ? <Text style={[styles.labelText, labelStyle]}>
          {isRequire && <Text style={{color: 'red'}}>*</Text>}
          {label}：</Text> : <></>}
        <View style={{flex: 1}}>
          <TouchableOpacity activeOpacity={canSelect ? 0.2 : 1} style={[styles.inputContainer, form.errors[field.name] && form.touched[field.name] && styles.errorBorder, touchAreaStyle]} onPress={selectOnPress}>
            {field.value && <>
              <Text numberOfLines={1} style={[styles.itemText, !field.value.length && styles.itemText_none]}>
                {!!field.value.length ? field.value[0].label || '' : placeholder ? placeholder : `请选择${label}`}
              </Text>
            </>}
            {loading ? <ActivityIndicator color="#409EFF" size={28} /> : <AntDesign
              name='down'
              size={36}
              color={!!field?.value?.length ? '#000000' : '#999999'}
            />}
          </TouchableOpacity>
          <ErrorMessage
            name={field.name}
            style={styles.errorMessage}
            component={Text}
          />
        </View>
      </View>
    </View>
  )
};

const styles = StyleSheet.create({
  selectArea: {
    marginBottom: 20
  },
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start'
  },
  labelText: {
    height: 60,
    textAlignVertical: 'center',
    minWidth: 150,
    fontSize: 28,
    color: '#333333'
  },
  itemText: {
    fontSize: 26,
    color: '#333333'
  },
  itemText_none: {
    fontSize: 26,
    color: '#999999'
  },
  inputContainer: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 2,
    borderColor: '#E5E5E5',
    borderRadius: 6,
    paddingHorizontal: 19
  },
  errorMessage: {
    color: 'red',
    fontSize: 22
  },
  errorBorder: {
    borderColor: 'red'
  }
})

export default SingleSelect;