import React, {useState, useEffect, useRef} from 'react';
import {StyleSheet, View, TouchableOpacity, Text, FlatList, ScrollView, ActivityIndicator} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import DateTimePicker from '@react-native-community/datetimepicker';
import { CheckBox } from '@rneui/themed';
import { useToast } from 'react-native-toast-notifications';
import { useDispatch } from 'react-redux';
import moment from 'moment';

import { CHART_STATUS_LIST, CHANEL_SOURCE_LIST, SUCCESS_CODE } from '../../../utils/const';
import { closeDialog } from '../../../redux/features/HireReport/HireReportDialog';
import HireReportFormApi from '../../../request/HireReportForm';
import SearchInput from '../../SearchInput';

const FilterMoreInSupplier = () => {
  const recruiterScrollViewRef = useRef(null);
  const companyScrollViewRef = useRef(null);

  const toast = useToast();
  const dispatch = useDispatch();

  const [supplierList, setSupplierList] = useState([]);
  const [originSupplierList, setOriginSupplierList] = useState([]);

  const [list, setList] = useState([]);
  const [originList, setOriginList] = useState([]);
  
  /** 时间范围 */
  const [type, setType] = useState('start');
  const [dateTime, setDateTime] = useState(new Date());
  const [showDataPicker, setShowDataPicker] = useState(false);
  const [dataRangePicker, setDateRangePicker] = useState(false);
  const [rangeTime, setRangeTime] = useState({startTime: moment().format('YYYY-MM-DD'), endTime: moment().format('YYYY-MM-DD')});

  /** 状态 */
  const [showStatusList, setShowStatusList] = useState(false);
  const [selectedState, setSelectedState] = useState([]);

  /** 招聘员 */
  const [showRecruiter, setShowRecruiter] = useState(false);
  const [selectRecruiter, setSelectRecruiter] = useState({});

  /** 其他 */
  const [showOther, setShowOther] = useState(false);
  const [selectOther, setSelectOther] = useState({});

  const [loading, setLoading] = useState(false);

  const getSupplierList = async() => {
    setLoading(true);
    try{  
      const res = await HireReportFormApi.SupplierList();
      console.log('getSupplierList --> res', res)
      if(res.code !== SUCCESS_CODE){
        toast.show(`获取供应商列表失败，${res.msg}`, { type: 'danger' });
        return;
      }
      setLoading(true);
      setSupplierList(res.data);
      setOriginSupplierList(res.data);
    }catch(err){
      toast.show(`获取供应商列表失败，请稍后重试`, { type: 'danger' });
    }finally{
      setLoading(false);
    }
  };

  const getCompanyList = async() => {
    setLoading(true);
    try{  
      const res = await HireReportFormApi.CompaniesList();
      if(res.code !== SUCCESS_CODE){
        toast.show(`获取企业列表失败，${res.msg}`, { type: 'danger' });
        return;
      }
      setLoading(false);
      setList(res.data);
      setOriginList(res.data);
    }catch(err){
      toast.show(`获取企业列表失败，请稍后重试`, { type: 'danger' });
    }finally{
      setLoading(false);
    }
  };

  const changeDateRangePicker = () => {
    setDateRangePicker(!dataRangePicker);
    setShowStatusList(false);
    setShowOther(false);
    setShowRecruiter(false);
  };

  const changeStatus = () => {
    setShowStatusList(!showStatusList);
    setDateRangePicker(false);
    setShowOther(false);
    setShowRecruiter(false);
  };

  const changeOther = () => {
    setShowOther(!showOther);
    setDateRangePicker(false);
    setShowStatusList(false);
    setShowRecruiter(false);
    getCompanyList();
  };

  const changeSupplier = () => {
    setShowRecruiter(!showRecruiter);
    setDateRangePicker(false);
    setShowStatusList(false);
    setShowOther(false);
    getSupplierList();
  };

  const showDate = (type) => {
    setType(type);
    setShowDataPicker(true);
    setDateTime(type === 'start' ? new Date(rangeTime.startTime) : new Date(rangeTime.endTime));
  };

  const dateChange = (event, selectedDate) => {
    setShowDataPicker(false);
    if (event.type !== 'set') return;
    if(type === 'start'){
      setRangeTime({...rangeTime, startTime: moment(selectedDate).format('YYYY-MM-DD')})
      return;
    }else{
      setRangeTime({...rangeTime, endTime: moment(selectedDate).format('YYYY-MM-DD')})
      return;
    }
  };

  const stateOnPress = (state) => {
    const copyList = [...selectedState];
    const findItemIndex = selectedState.findIndex(select => select.value === state.value);
    if(findItemIndex !== -1){
      copyList.splice(findItemIndex, 1);
      setSelectedState(copyList);
      return;
    }
    if(selectedState.length === 3){
      toast.show('最多选择3个状态', {type: 'warning'});
      let newArrList = [state];
      setSelectedState(newArrList);
      return;
    }
    copyList.push(state);
    setSelectedState(copyList);
  };

  const supplierOnPress = (supplier) => {
    setSelectRecruiter(supplier);
  };

  const selectCompanyOnPress = (value) => {
    setSelectOther(value);
  };

  const recruiterOnChanging = value => {
    const filterList = originSupplierList.filter(item => item.label.includes(value));
    setSupplierList(filterList);
  };

  const onChanging = value => {
    const filterList = originList.filter(item => item.label.includes(value));
    setList(filterList);
  };

  const confirmOnPress = () => {
    console.log('点击了确认！');
    dispatch(closeDialog());
  };

  return (
    <>
      <View style={{maxHeight: 450, paddingHorizontal: 10}}>
        <>
          <TouchableOpacity style={[styles.touchArea, dataRangePicker && styles.selectedTouchArea]} onPress={changeDateRangePicker}>
            <Text style={[{fontSize: 16, color: '#000'}, dataRangePicker && styles.fontBold]}>{`时间范围${!dataRangePicker ? `：${rangeTime.startTime + `~` + rangeTime.endTime}` : ''}`}</Text>
          </TouchableOpacity>
          {dataRangePicker && (
            <View style={styles.selectArea}>
              <TouchableOpacity style={styles.selectTime} onPress={()=>showDate('start')}>
                <AntDesign
                  name='calendar'
                  size={15}
                  color='#333333'
                />
                <Text style={{marginLeft: 4}}>{rangeTime.startTime}</Text>
              </TouchableOpacity>
              <Text>至</Text>
              <TouchableOpacity style={styles.selectTime} onPress={()=>showDate('end')}>
                <AntDesign
                  name='calendar' 
                  size={15}
                  color='#333333'
                />
                <Text style={{marginLeft: 4}}>{rangeTime.endTime}</Text>
              </TouchableOpacity>
            </View>
          )}
          {showDataPicker && <DateTimePicker 
            value={dateTime} 
            onChange={dateChange} 
          />}
        </>
        <>
          <TouchableOpacity style={[styles.touchArea, showStatusList && styles.selectedTouchArea, {marginTop: 10}]} onPress={changeStatus}>
            <Text numberOfLines={1} style={[{fontSize: 16, color: '#000'}, showStatusList && styles.fontBold]}>{`${selectedState.length ? `已选状态：${selectedState.map(select => select.title).join('、')}` : '请选择状态'}`}</Text>
          </TouchableOpacity>
          {showStatusList && (
            <View style={[styles.selectArea, {flexDirection: 'column'}]}>
              {CHART_STATUS_LIST.map((state, stateIndex) => {
                const isLastIndex = stateIndex === (CHART_STATUS_LIST.length - 1);
                const isSelected = selectedState.length ? selectedState.findIndex(select => select.value === state.value) !== -1 : false;
                return (
                  <TouchableOpacity style={[{height: 35, borderBottomWidth: 1, borderBottomColor: '#EFEFEF', width: '100%', alignItems: 'center', paddingLeft: 10, flexDirection: 'row', justifyContent: 'space-between'}, isLastIndex && {borderBottomWidth: 0}]} onPress={() => stateOnPress(state)} key={stateIndex}>
                    <Text style={{color: '#333333'}}>{state.title}</Text>
                    <CheckBox
                      checked={isSelected}
                      size={18}
                      containerStyle={{padding: 0}}
                      checkedIcon={"dot-circle-o"}
                      uncheckedIcon={"circle-o"}
                    />
                  </TouchableOpacity>
                )
              })}
            </View>
          )}
        </>
        <>
          <TouchableOpacity style={[styles.touchArea, showRecruiter && styles.selectedTouchArea, {marginTop: 10}]} onPress={changeSupplier}>
            <Text numberOfLines={1} style={[{fontSize: 16, color: '#000'}, showRecruiter && styles.fontBold]}>{`${selectRecruiter.value ? `已选供应商：${selectRecruiter.label}` : '请选择供应商'}`}</Text>
          </TouchableOpacity>
          {showRecruiter && <>
            {!loading ? 
              <>
                <SearchInput
                  placeholder='请输入供应商'
                  smallSize
                  withoutButton
                  keyboardType='default'
                  onChange={recruiterOnChanging}
                  fontStyle={{fontSize: 14}}
                  searchInputStyle={styles.searchInputStyle}
                  inputContainerStyle={{paddingLeft: 0}}
                />
                <ScrollView ref={recruiterScrollViewRef} keyboardShouldPersistTaps="handled" removeClippedSubviews>
                  {supplierList.map(supplier => {
                    const isSelected = selectRecruiter.value === supplier.value;
                    return (
                      <TouchableOpacity key={supplier.value} style={styles.renderItemStyle} onPress={() => supplierOnPress(supplier)}>
                      <Text style={{color: '#333333'}}>{supplier.label}</Text>
                      <CheckBox
                        checked={isSelected}
                        size={18}
                        onPress={() => supplierOnPress(supplier)}
                        containerStyle={{padding: 0}}
                        checkedIcon={"dot-circle-o"}
                        uncheckedIcon={"circle-o"}
                      />
                    </TouchableOpacity>
                    )})}
                  </ScrollView>
              </> : <View style={styles.emptyArea}>
              <ActivityIndicator size={20} color="#409EFF"/>
            </View>}
          </>}
        </>
        <>
          <TouchableOpacity style={[styles.touchArea, showOther && styles.selectedTouchArea, {marginTop: 10}]} onPress={changeOther}>
            <Text numberOfLines={1} style={[{fontSize: 16, color: '#000'}, showOther && styles.fontBold]}>{`${selectOther.value ? `已选企业：${selectOther.label}` : '请选择企业'}`}</Text>
          </TouchableOpacity>
          {showOther && <>
            {!loading ? 
              <>
                <SearchInput
                  placeholder='请输入企业名称'
                  smallSize
                  withoutButton
                  keyboardType='default'
                  onChange={onChanging}
                  fontStyle={{fontSize: 14}}
                  searchInputStyle={styles.searchInputStyle}
                  inputContainerStyle={{paddingLeft: 0}}
                />
                <ScrollView ref={companyScrollViewRef} keyboardShouldPersistTaps="handled" removeClippedSubviews>
                  {list.map(company => {
                    const isSelected = selectOther.value === company.value;
                    return (
                      <TouchableOpacity key={company.value} style={styles.renderItemStyle} onPress={() => selectCompanyOnPress(company)}>
                      <Text style={{color: '#333333'}}>{company.label}</Text>
                      <CheckBox
                        checked={isSelected}
                        size={18}
                        onPress={() => selectCompanyOnPress(company)}
                        containerStyle={{padding: 0}}
                        checkedIcon={"dot-circle-o"}
                        uncheckedIcon={"circle-o"}
                      />
                    </TouchableOpacity>
                    )})}
                  </ScrollView>
              </> : <View style={styles.emptyArea}>
              <ActivityIndicator size={20} color="#409EFF"/>
            </View>}
          </>}
        </>
      </View>
      <View style={styles.bottomButtonArea}>
        <TouchableOpacity style={styles.bottomLeft} onPress={()=>dispatch(closeDialog())}>
          <Text style={styles.leftText}>取消</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomRight} onPress={confirmOnPress}>
          <Text style={styles.rightText}>确认</Text>
        </TouchableOpacity>
      </View>
    </>
  )
};

const styles = StyleSheet.create({
  fontBold: {
    fontWeight: 'bold'
  },
  touchArea: {
    height: 40, 
    borderWidth: 1, 
    borderRadius: 6, 
    justifyContent: 'center', 
    paddingHorizontal: 10, 
    borderColor: '#EFEFEF'
  },
  selectedTouchArea: {
    borderColor: '#409EFF', 
    borderBottomRightRadius: 0, 
    borderBottomLeftRadius: 0
  },
  selectArea: {
    borderWidth: 1, 
    borderColor: '#EFEFEF', 
    borderTopWidth: 0, 
    borderBottomLeftRadius: 6, 
    borderBottomRightRadius: 6, 
    flexDirection: 'row', 
    alignItems: 'center'
  },
  selectTime: {
    flex: 1, 
    borderWidth: 1, 
    borderColor: '#EFEFEF', 
    marginHorizontal: 10, 
    height: 30, 
    borderRadius: 6, 
    flexDirection: 'row',
    alignItems: 'center', 
    justifyContent: 'center',
    marginVertical: 10
  },
  searchInputStyle: {
    borderWidth: 1,
    height: 30,
    marginBottom: 0,
    borderTopWidth: 0,
    borderColor: '#EFEFEF',
    paddingHorizontal: 0
  },
  renderItemStyle: {
    height: 30, 
    borderWidth: 1, 
    borderTopWidth: 0, 
    borderColor: '#EFEFEF', 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingLeft: 10
  },
  emptyArea: {
    borderWidth: 1, 
    borderColor: '#EFEFEF', 
    borderTopWidth: 0, 
    paddingVertical: 10, 
    borderBottomLeftRadius: 8, 
    borderBottomRightRadius: 8
  },
  bottomButtonArea: {
    flexDirection: 'row',
    height: 45,
    marginTop: 10
  },
  bottomLeft: {
    flex: 1,
    borderTopWidth: 1,
    borderRightWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 6,
    borderColor: '#E3E3E3'
  },
  leftText: {
    fontSize: 16,
    color: '#999999'
  },
  bottomRight: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#E3E3E3',
    borderBottomRightRadius: 6
  },
  rightText: {
    fontSize: 16,
    color: '#409EFF'
  }
})

export default FilterMoreInSupplier;