import React, {useState, useEffect, useMemo, useCallback, useRef} from 'react';
import {StyleSheet, View, TouchableOpacity, Text, ScrollView, ActivityIndicator} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import DateTimePicker from '@react-native-community/datetimepicker';
import { CheckBox } from '@rneui/themed';
import { useToast } from 'react-native-toast-notifications';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';

import HireReportFormApi from '../../../../../../request/HireReportFormApi';
import { 
  SUCCESS_CODE, 
  CHART_STATUS_LIST, 
  CHANEL_SOURCE_LIST, 
  THIS_WEEK_START, 
  THIS_WEEK_END, 
  LAST_WEEK_START, 
  LAST_WEEK_END, 
  THIS_MONTH_START, 
  THIS_MONTH_END
} from '../../../../../../utils/const';
import { closeDialog } from '../../../../../../redux/features/HireReport/HireReportDialog';
import MyMembersApi from '../../../../../../request/MyMembersApi';
import SearchInput from '../../../../../../components/SearchInput';
import {deepCopy} from '../../../../../../utils';

let timer;

const StoreItem = ({isSelected, store, isLastIndex, selectStoreOnPress}) => {
  return useMemo(() => (
    <TouchableOpacity key={store.storeId} style={[styles.renderItemStyle, isLastIndex && {borderBottomWidth: 0}]} onPress={() => selectStoreOnPress(store)}>
      <Text style={{color: '#333333'}}>{store.storeName}</Text>
      <CheckBox
        checked={isSelected}
        size={18}
        onPress={() => selectStoreOnPress(store)}
        containerStyle={{padding: 0}}
        checkedIcon={"dot-circle-o"}
        uncheckedIcon={"circle-o"}
      />
    </TouchableOpacity>
  ), [isSelected])
};

const RecruiterItem = ({isSelected, recruiter, isLastIndex, recruiterOnPress}) => {
  return useMemo(() => (
    <TouchableOpacity key={recruiter.value} style={[styles.renderItemStyle, isLastIndex && {borderBottomWidth: 0}]} onPress={() => recruiterOnPress(recruiter)}>
      <Text style={{color: '#333333'}}>{recruiter.label}</Text>
      <CheckBox
        checked={isSelected}
        size={18}
        onPress={() => recruiterOnPress(recruiter)}
        containerStyle={{padding: 0}}
        checkedIcon={"dot-circle-o"}
        uncheckedIcon={"circle-o"}
      />
    </TouchableOpacity>
  ), [isSelected])
};

const SupplierItem = ({isSelected, supplier, isLastIndex, supplierOnPress}) => {
  return useMemo(() => (
    <TouchableOpacity key={supplier.value} style={[styles.renderItemStyle, isLastIndex && {borderBottomWidth: 0}]} onPress={() => supplierOnPress(supplier)}>
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
  ), [isSelected])
};

const EnterpriseItem = ({isSelected, company, isLastIndex, selectCompanyOnPress}) => {
  const onChange = useCallback(()=> selectCompanyOnPress(company), [company]);

  return useMemo(() => (
    <TouchableOpacity key={company.value} style={[styles.renderItemStyle, isLastIndex && {borderBottomWidth: 0}]} onPress={onChange}>
      <Text style={{color: '#333333'}}>{company.label}</Text>
      <CheckBox
        checked={isSelected}
        size={18}
        onPress={onChange}
        containerStyle={{padding: 0}}
        checkedIcon={"dot-circle-o"}
        uncheckedIcon={"circle-o"}
      />
    </TouchableOpacity>
  ), [isSelected])
};

const FilterMoreOfTrend = ({
  rangeDate,
  confirm,
  showType,
  selectedState = [], //已选状态
  selectedWay = [], //已选来源渠道
  selectedEnterprise = [], //已选企业
  selectedStore = [], //已选门店
  selectedRecruiter = [], //已选招聘员
  selectedSupplier = [], //已选供应商
}) => {
  const showDialog = useSelector((state) => state.HireReportDialog.showDialog);

  const toast = useToast();
  const dispatch = useDispatch();

  const storeScrollViewRef = useRef(null);
  const companyScrollViewRef = useRef(null);
  const recruiterScrollViewRef = useRef(null);
  const supplierScrollViewRef = useRef(null);

  /** 企业列表 */
  const [enterpriseList, setEnterpriseList] = useState([]);
  const [originEnterpriseList, setOriginEnterpriseList] = useState([]);

  /** 门店列表 */
  const [storeList, setStoreList] = useState([]);
  const [originStoreList, setOriginStoreList] = useState([]);

  /** 招聘员列表 */
  const [recruiterList, setRecruiterList] = useState([]);
  const [originRecruiterList, setOriginRecruiterList] = useState([]);

  /** 供应商列表 */
  const [supplierList, setSupplierList] = useState([]);
  const [originSupplierList, setOriginSupplierList] = useState([]);
  
  /** 时间范围 */
  const [type, setType] = useState('start');
  const [dateTime, setDateTime] = useState(new Date());
  const [showDataPicker, setShowDataPicker] = useState(false);
  const [dateRangePicker, setDateRangePicker] = useState(true);
  const [rangeTime, setRangeTime] = useState({startTime: rangeDate.startDate, endTime: rangeDate.endDate});

  /** 状态 */
  const [showStatus, setShowStatus] = useState(false);
  const [selectState, setSelectState] = useState(selectedState);

  /** 来源渠道 */
  const [showWay, setShowWay] = useState(false);
  const [selectWay, setSelectWay] = useState(selectedWay);

  /** 企业 */
  const [showEnterprise, setShowEnterprise] = useState(false);
  const [selectEnterprise, setSelectEnterprise] = useState(selectedEnterprise);

  /** 门店 */
  const [showStore, setShowStore] = useState(false);
  const [selectStore, setSelectStore] = useState(selectedStore);

  /** 招聘员 */
  const [showRecruiter, setShowRecruiter] = useState(false);
  const [selectRecruiter, setSelectRecruiter] = useState(selectedRecruiter);

  /** 供应商 */
  const [showSupplier, setShowSupplier] = useState(false);
  const [selectSupplier, setSelectSupplier] = useState(selectedSupplier);

  /**加载中 */
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if(showDialog){
      getCompanyList();
      getStoreList();
      getRecruiterList();
      getSupplierList();
    }
    return () => timer && clearTimeout(timer);
  }, [showDialog])

  //获取企业列表
  const getCompanyList = async() => {
    setLoading(true);
    try{  
      const res = await MyMembersApi.CompaniesList();
      console.log('getCompanyList -->res', res);
      if(res.code !== SUCCESS_CODE){
        toast.show(`获取企业列表失败，${res.msg}`, { type: 'danger' });
        return;
      }
      setEnterpriseList(res.data);
      setOriginEnterpriseList(res.data);
    }catch(err){
      toast.show(`获取企业列表失败，请稍后重试`, { type: 'danger' });
      console.log('getCompanyList --> err', err);
    }finally{
      setLoading(false);
    }
  };

  //获取门店列表
  const getStoreList = async() => {
    setLoading(true);
    try{  
      const res = await HireReportFormApi.StoreList();
      console.log('getStoreList --> res', res);
      if(res.code !== SUCCESS_CODE){
        toast.show(`获取门店列表失败，${res.msg}`, { type: 'danger' });
        return;
      }
      setStoreList(res.data);
      setOriginStoreList(res.data);
    }catch(err){
      toast.show(`获取门店列表失败，请稍后重试`, { type: 'danger' });
      console.log('getStoreList --> err', err);
    }finally{
      setLoading(false);
    }
  };

  //获取招聘员列表
  const getRecruiterList = async() => {
    setLoading(true);
    try{  
      const res = await HireReportFormApi.RecruiterList();
      console.log('getRecruiterList --> res', res)
      if(res.code !== SUCCESS_CODE){
        toast.show(`获取招聘员列表失败，${res.msg}`, { type: 'danger' });
        return;
      }
      setRecruiterList(res.data);
      setOriginRecruiterList(res.data);
    }catch(err){
      toast.show(`获取招聘员列表失败，请稍后重试`, { type: 'danger' });
      console.log('getRecruiterList --> err', err);
    }finally{
      setLoading(false);
    }
  };

  //获取供应商列表
  const getSupplierList = async() => {
    setLoading(true);
    try{  
      const res = await HireReportFormApi.SupplierList();
      console.log('getSupplierList --> res', res)
      if(res.code !== SUCCESS_CODE){
        toast.show(`获取供应商列表失败，${res.msg}`, { type: 'danger' });
        return;
      }
      setSupplierList(res.data);
      setOriginSupplierList(res.data);
    }catch(err){
      toast.show(`获取供应商列表失败，请稍后重试`, { type: 'danger' });
      console.log('getSupplierList --> err', err);
    }finally{
      setLoading(false);
    }
  };

  //数据量大的时候打开需要时间，设定一个定时器假装加载中
  const loadingFalse = (range = 500) => {
    timer = setTimeout(() => {
      setLoading(false);
    }, range)
  };

  const changeDateRangePicker = () => {
    setDateRangePicker(!dateRangePicker);
    showStatus && setShowStatus(false);
    showWay && setShowWay(false);
    showEnterprise && setShowEnterprise(false);
    showStore && setShowStore(false);
    showRecruiter && setShowRecruiter(false);
    showSupplier && setShowSupplier(false);
  };

  const changeStatus = () => {
    setShowStatus(!showStatus);
    dateRangePicker && setDateRangePicker(false);
    showWay && setShowWay(false);
    showEnterprise && setShowEnterprise(false);
    showStore && setShowStore(false);
    showRecruiter && setShowRecruiter(false);
    showSupplier && setShowSupplier(false);
  };

  /**打开来源渠道 */
  const changeWay = () => {
    setShowWay(!showWay);
    dateRangePicker && setDateRangePicker(false);
    showStatus && setShowStatus(false);
    showStore && setShowStore(false);
    showRecruiter && setShowRecruiter(false);
    showSupplier && setShowSupplier(false);
    showEnterprise && setShowEnterprise(false);
  };

  /**打开选择门店 */
  const changeStore = () => {
    setShowStore(!showStore);
    setLoading(true);
    loadingFalse(100);
    dateRangePicker && setDateRangePicker(false);
    showStatus && setShowStatus(false);
    showEnterprise && setShowEnterprise(false);
    showWay && setShowWay(false);
    showRecruiter && setShowRecruiter(false);
    showSupplier && setShowSupplier(false);
  };

  /**打开选择招聘员 */
  const changeRecruiter = () => {
    setShowRecruiter(!showRecruiter);
    setLoading(true);
    loadingFalse(500);
    dateRangePicker && setDateRangePicker(false);
    showStatus && setShowStatus(false);
    showEnterprise && setShowEnterprise(false);
    showWay && setShowWay(false);
    showStore && setShowStore(false);
    showSupplier && setShowSupplier(false);
  };

  /**打开选择供应商 */
  const changeSupplier = () => {
    setShowSupplier(!showSupplier);
    setLoading(true);
    loadingFalse(1000);
    dateRangePicker && setDateRangePicker(false);
    showStatus && setShowStatus(false);
    showEnterprise && setShowEnterprise(false);
    showWay && setShowWay(false);
    showStore && setShowStore(false);
    showRecruiter && setShowRecruiter(false);
  };

  /**打开选择企业 */
  const changeEnterprise = () => {
    setShowEnterprise(!showEnterprise);
    setLoading(true);
    loadingFalse(500);
    dateRangePicker && setDateRangePicker(false);
    showWay && setShowWay(false);
    showStatus && setShowStatus(false);
    showStore && setShowStore(false);
    showRecruiter && setShowRecruiter(false);
    showSupplier && setShowSupplier(false);
  };

  const showDate = (type) => {
    setType(type);
    setShowDataPicker(true);
    setDateTime(type === 'start' ? new Date(rangeTime.startTime) : new Date(rangeTime.endTime));
  };

  //选择日期
  const dateChange = (event, selectedDate) => {
    setShowDataPicker(false);
    if (event.type !== 'set') return;
    const formatDate = moment(selectedDate).format('YYYY-MM-DD');
    if(type === 'start'){
      setRangeTime({...rangeTime, startTime: formatDate})
      return;
    }else{
      setRangeTime({...rangeTime, endTime: formatDate})
      return;
    }
  };

  //选择状态
  const stateOnPress = (state) => {
    const copyList = [...selectState];
    const findItemIndex = selectState.findIndex(select => select.value === state.value);
    if(findItemIndex !== -1){
      //如果只剩下一个状态，则不支持取消；
      if(selectState.length === 1)return;
      copyList.splice(findItemIndex, 1);
      setSelectState(copyList);
      return;
    }
    let newArrList = [state];
    setSelectState(newArrList);
  };

  //选择渠道
  const wayOnPress = (way) => {
    const copyList = [...selectWay];
    const findItemIndex = selectWay.findIndex(select => select.value === way.value);
    if(findItemIndex !== -1){
      copyList.splice(findItemIndex, 1);
      setSelectWay(copyList);
      return;
    }
    if(selectWay.length === 3 || showType !== 'way'){
      let newArrList = [way];
      setSelectWay(newArrList);
      return;
    }
    copyList.push(way);
    setSelectWay(copyList);
  };

  const clearWay = () => {
    selectWay.length && setSelectWay([]);
  };
  
  //选择门店
  const selectStoreOnPress = (store) => {
    storeScrollViewRef?.current?.flashScrollIndicators();
    const copyList = [...selectStore];
    const findItemIndex = selectStore.findIndex(select => select.storeId === store.storeId);
    if(findItemIndex !== -1){
      copyList.splice(findItemIndex, 1);
      setSelectStore(copyList);
      return;
    }
    if(selectStore.length === 3 || showType !== 'store'){
      let newArrList = [store];
      setSelectStore(newArrList);
      return;
    }
    copyList.push(store);
    setSelectStore(copyList);
  };

  const clearStore = () => {
    selectStore.length && setSelectStore([]);
  };

  //选择招聘员
  const recruiterOnPress = (recruiter) => {
    recruiterScrollViewRef?.current?.flashScrollIndicators();
    const copyList = [...selectRecruiter];
    const findItemIndex = selectRecruiter.findIndex(select => select.value === recruiter.value);
    if(findItemIndex !== -1){
      copyList.splice(findItemIndex, 1);
      setSelectRecruiter(copyList);
      return;
    }
    if(selectRecruiter.length === 3 || showType !== 'recruiter'){
      let newArrList = [recruiter];
      setSelectRecruiter(newArrList);
      return;
    }
    copyList.push(recruiter);
    setSelectRecruiter(copyList);
  };

  const clearRecruiter = () => {
    selectRecruiter.length && setSelectRecruiter([]);
  };

  //选择供应商
  const supplierOnPress = (supplier) => {
    supplierScrollViewRef?.current?.flashScrollIndicators();
    const copyList = [...selectSupplier];
    const findItemIndex = selectSupplier.findIndex(select => select.value === supplier.value);
    if(findItemIndex !== -1){
      copyList.splice(findItemIndex, 1);
      setSelectSupplier(copyList);
      return;
    }
    if(selectSupplier.length === 3 || showType !== 'supplier'){
      let newArrList = [supplier];
      setSelectSupplier(newArrList);
      return;
    }
    copyList.push(supplier);
    setSelectSupplier(copyList);
  };

  const clearSupplier = () => {
    selectSupplier.length && setSelectSupplier([]);
  };

  //选择企业
  const selectCompanyOnPress = (company) => {
    companyScrollViewRef?.current?.flashScrollIndicators();
    const copyList = [...selectEnterprise];
    const findItemIndex = selectEnterprise.findIndex(select => select.value === company.value);
    if(findItemIndex !== -1){
      copyList.splice(findItemIndex, 1);
      setSelectEnterprise(copyList);
      return;
    }
    if(selectEnterprise.length === 3){
      let newArrList = [company];
      setSelectEnterprise(newArrList);
      return;
    }
    copyList.push(company);
    setSelectEnterprise(copyList);
  };

  const clearEnterprise = () => {
    selectEnterprise.length && setSelectEnterprise([]);
  };

  //筛选企业
  const onChanging = value => {
    const filterList = originEnterpriseList.filter(item => item.label.includes(value));
    setEnterpriseList(filterList);
  };

  //筛选门店
  const storeOnChanging = value => {
    const filterList = originStoreList.filter(item => item.storeName.includes(value));
    setStoreList(filterList);
  };

  //筛选招聘员
  const recruiterOnChanging = value => {
    const filterList = originRecruiterList.filter(item => item.label.includes(value));
    setRecruiterList(filterList);
  };

  //筛选供应商
  const supplierOnChanging = value => {
    const filterList = originSupplierList.filter(item => item.label.includes(value));
    setSupplierList(filterList);
  };

  const confirmOnPress = () => {
    dispatch(closeDialog());
    const searchContent = {
      rangeTime,
      selectState,
      selectWay,
      selectStore,
      selectRecruiter,
      selectSupplier,
      selectEnterprise
    };
    confirm(searchContent);
  };

  //获取时间转字符串显示
  const getRangeDate = () => {
    let rangeText = '';
    if (rangeTime.startTime === THIS_WEEK_START && rangeTime.endTime === THIS_WEEK_END){
      rangeText = '本周';
    }else if (rangeTime.startTime === LAST_WEEK_START && rangeTime.endTime === LAST_WEEK_END){
      rangeText = '上周';
    }else if (rangeTime.startTime === THIS_MONTH_START && rangeTime.endTime === THIS_MONTH_END){
      rangeText = '本月';
    }else{
      rangeText = '其他周期';
    }
    return rangeText;
  };

  const stickyHeaderIndices = () => {
    if(showStatus){
      return [1];
    }else if(showStore){
      return [3];
    }else if(showRecruiter){
      return [4];
    }else if(showSupplier){
      return [5];
    }else if(showEnterprise){
      return [6];
    }
  };

  return (
    <>
      <ScrollView 
      style={{maxHeight: 450, paddingHorizontal: 10}} 
      stickyHeaderIndices={stickyHeaderIndices()}>
        <View style={{marginBottom: 10}}>
          <TouchableOpacity style={[styles.touchArea, dateRangePicker && styles.selectedTouchArea]} onPress={changeDateRangePicker}>
            <Text style={[styles.title, dateRangePicker && styles.fontBold]}>
              {`时间范围：${getRangeDate()}`}
            </Text>
          </TouchableOpacity>
          {dateRangePicker && (
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
        </View>
        <View style={[{backgroundColor: '#fff'}, !showStatus && {marginBottom: 10}]}>
          <TouchableOpacity style={[styles.touchArea, showStatus && styles.selectedTouchArea]} onPress={changeStatus}>
            <Text numberOfLines={1} style={[styles.title, showStatus && styles.fontBold]}>
              {`${selectState.length ? `已选状态：${selectState.map(select => select.title).join('、')}` : '请选择状态'}`}
            </Text>
          </TouchableOpacity>
        </View>
        {showStatus && <View style={[styles.listArea, {marginBottom: 10}]}>
          {CHART_STATUS_LIST.map((state, stateIndex) => {
            const isLastIndex = stateIndex === (CHART_STATUS_LIST.length - 1);
            const isSelected = selectState.length ? selectState.findIndex(select => select.value === state.value) !== -1 : false;
            return (
              <TouchableOpacity style={[styles.itemArea, isLastIndex && {borderBottomWidth: 0}]} onPress={() => stateOnPress(state)} key={stateIndex}>
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
        </View>}
        <View style={{marginBottom: 10}}>
          <View style={[styles.touchAreaWithDelete, showWay && styles.selectedTouchArea]}>
            <TouchableOpacity style={styles.touchTitleArea} onPress={changeWay}>
              <Text numberOfLines={1} style={[styles.title, showWay && styles.fontBold]}>
                {`${selectWay.length ? `已选来源渠道：${selectWay.map(select => select.title).join('、')}` : '请选择来源渠道'}`}
              </Text>
            </TouchableOpacity>
            {!!selectWay.length && <TouchableOpacity style={styles.clearIcon} onPress={clearWay}>
              <AntDesign
                name='closecircle' 
                size={15}
                color='#999999'
              />    
            </TouchableOpacity>}
          </View>
          {showWay && (
            <View style={[styles.selectArea, {flexDirection: 'column'}]}>
              {CHANEL_SOURCE_LIST.map((way, wayIndex) => {
                const isLastIndex = wayIndex === (CHANEL_SOURCE_LIST.length - 1);
                const isSelected = selectWay.length ? selectWay.findIndex(select => select.value === way.value) !== -1 : false;
                return (
                  <TouchableOpacity style={[styles.itemArea, isLastIndex && {borderBottomWidth: 0}]} onPress={() => wayOnPress(way)} key={wayIndex}>
                    <Text style={{color: '#333333'}}>{way.title}</Text>
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
        </View>
        <View style={[{backgroundColor: '#fff'}, !showStore && {marginBottom: 10}]}>
          <View style={[styles.touchAreaWithDelete, showStore && styles.selectedTouchArea]}>
            <TouchableOpacity style={styles.touchTitleArea} onPress={changeStore}>
              <Text numberOfLines={1} style={[styles.title, showStore && styles.fontBold]}>
                {`${selectStore.length ? `已选门店：${selectStore.map(select => select.storeName).join('、')}` : '请选择门店'}`}
              </Text>
            </TouchableOpacity>
            {!!selectStore.length && <TouchableOpacity style={styles.clearIcon} onPress={clearStore}>
              <AntDesign
                name='closecircle' 
                size={15}
                color='#999999'
              />    
            </TouchableOpacity>}
          </View>
          {showStore && <SearchInput
            placeholder='请输入门店名称'
            smallSize
            withoutButton
            keyboardType='default'
            onChange={storeOnChanging}
            fontStyle={{fontSize: 14}}
            searchInputStyle={styles.searchInputStyle}
            inputContainerStyle={{paddingLeft: 0}}
          />}
        </View>
        {showStore && <View style={{marginBottom: 10}}>
          {!loading ? 
            <ScrollView style={styles.listArea} ref={storeScrollViewRef} keyboardShouldPersistTaps="handled" removeClippedSubviews>
              {storeList.map((store, storeIndex) => {
                const isSelected = selectStore.length ? selectStore.findIndex(select => select.storeId === store.storeId) !== -1 : false;
                const isLastIndex = storeIndex === storeList.length - 1;
                return (
                  <TouchableOpacity key={store.storeId} style={[styles.renderItemStyle, isLastIndex && {borderBottomWidth: 0}]} onPress={() => selectStoreOnPress(store)}>
                    <Text style={{color: '#333333'}}>{store.storeName}</Text>
                    <CheckBox
                      checked={isSelected}
                      size={18}
                      onPress={() => selectStoreOnPress(store)}
                      containerStyle={{padding: 0}}
                      checkedIcon={"dot-circle-o"}
                      uncheckedIcon={"circle-o"}
                    />
                  </TouchableOpacity>
                )})}
              </ScrollView> : <View style={styles.emptyArea}>
            <ActivityIndicator size={20} color="#409EFF"/>
          </View>}
        </View>}
        <View style={[{backgroundColor: '#fff'}, !showRecruiter && {marginBottom: 10}]}>
          <View style={[styles.touchAreaWithDelete, showRecruiter && styles.selectedTouchArea]}>
            <TouchableOpacity style={styles.touchTitleArea} onPress={changeRecruiter}>
              <Text numberOfLines={1} style={[styles.title, showRecruiter && styles.fontBold]}>
                {`${selectRecruiter.length ? `已选招聘员：${selectRecruiter.map(select => select.label).join('、')}` : '请选择招聘员'}`}
              </Text>
            </TouchableOpacity>
            {!!selectRecruiter.length && <TouchableOpacity style={styles.clearIcon} onPress={clearRecruiter}>
              <AntDesign
                name='closecircle' 
                size={15}
                color='#999999'
              />    
            </TouchableOpacity>}
          </View>
          {showRecruiter && <SearchInput
            placeholder='请输入招聘员名称'
            smallSize
            withoutButton
            keyboardType='default'
            onChange={recruiterOnChanging}
            fontStyle={{fontSize: 14}}
            searchInputStyle={styles.searchInputStyle}
            inputContainerStyle={{paddingLeft: 0}}
          />}
        </View>
        {showRecruiter && <View style={{marginBottom: 10}}>
          {!loading ? 
            <ScrollView style={styles.listArea} ref={recruiterScrollViewRef} keyboardShouldPersistTaps="handled" removeClippedSubviews>
              {recruiterList.map((recruiter, recruiterIndex) => {
                const isSelected = selectRecruiter.length ? selectRecruiter.findIndex(select => select.value === recruiter.value) !== -1 : false;
                const isLastIndex = recruiterIndex === recruiterList.length - 1;
                return (
                  <TouchableOpacity key={recruiter.value} style={[styles.renderItemStyle, isLastIndex && {borderBottomWidth: 0}]} onPress={() => recruiterOnPress(recruiter)}>
                    <Text style={{color: '#333333'}}>{recruiter.label}</Text>
                    <CheckBox
                      checked={isSelected}
                      size={18}
                      onPress={() => recruiterOnPress(recruiter)}
                      containerStyle={{padding: 0}}
                      checkedIcon={"dot-circle-o"}
                      uncheckedIcon={"circle-o"}
                    />
                  </TouchableOpacity>
                )})}
              </ScrollView>: <View style={styles.emptyArea}>
            <ActivityIndicator size={20} color="#409EFF"/>
          </View>}
        </View>}
        <View style={[{backgroundColor: '#fff'}, !showSupplier && {marginBottom: 10}]}>
          <View style={[styles.touchAreaWithDelete, showSupplier && styles.selectedTouchArea]}>
            <TouchableOpacity style={styles.touchTitleArea} onPress={changeSupplier}>
              <Text numberOfLines={1} style={[styles.title, showSupplier && styles.fontBold]}>
                {`${selectSupplier.length ? `已选供应商：${selectSupplier.map(select => select.label).join('、')}` : '请选择供应商'}`}
              </Text>
            </TouchableOpacity>
            {!!selectSupplier.length && <TouchableOpacity style={styles.clearIcon} onPress={clearSupplier}>
              <AntDesign
                name='closecircle' 
                size={15}
                color='#999999'
              />    
            </TouchableOpacity>}
          </View>
          {showSupplier && <SearchInput
            placeholder='请输入供应商'
            smallSize
            withoutButton
            keyboardType='default'
            onChange={supplierOnChanging}
            fontStyle={{fontSize: 14}}
            searchInputStyle={styles.searchInputStyle}
            inputContainerStyle={{paddingLeft: 0}}
          />}
        </View>
        {showSupplier && <View style={{marginBottom: 10}}>
          {!loading ? 
            <ScrollView style={styles.listArea} ref={supplierScrollViewRef} keyboardShouldPersistTaps="handled" removeClippedSubviews>
              {supplierList.map((supplier, supplierIndex) => {
                const isSelected = selectSupplier.length ? selectSupplier.findIndex(select => select.value === supplier.value) !== -1 : false;
                const isLastIndex = supplierIndex === supplierList.length - 1;
                return (
                  <TouchableOpacity key={supplier.value} style={[styles.renderItemStyle, isLastIndex && {borderBottomWidth: 0}]} onPress={() => supplierOnPress(supplier)}>
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
                )
              })}
              </ScrollView> : <View style={styles.emptyArea}>
            <ActivityIndicator size={20} color="#409EFF"/>
          </View>}
        </View>}
        <View style={{backgroundColor: '#fff'}}>
          <View style={[styles.touchAreaWithDelete, showEnterprise && styles.selectedTouchArea]}>
            <TouchableOpacity style={styles.touchTitleArea} onPress={changeEnterprise}>
              <Text numberOfLines={1} style={[styles.title, showEnterprise && styles.fontBold]}>
                {`${selectEnterprise.length ? `已选企业：${selectEnterprise.map(select => select.label).join('、')}` : '请选择企业'}`}
              </Text>
            </TouchableOpacity>
            {!!selectEnterprise.length && <TouchableOpacity style={styles.clearIcon} onPress={clearEnterprise}>
              <AntDesign
                name='closecircle' 
                size={15}
                color='#999999'
              />    
            </TouchableOpacity>}
          </View>
          {showEnterprise && <SearchInput
            placeholder='请输入企业名称'
            smallSize
            withoutButton
            keyboardType='default'
            onChange={onChanging}
            fontStyle={{fontSize: 14}}
            searchInputStyle={styles.searchInputStyle}
            inputContainerStyle={{paddingLeft: 0}}
          />}
        </View>
        {showEnterprise && <>
          {!loading ? 
            <ScrollView style={styles.listArea} ref={companyScrollViewRef} keyboardShouldPersistTaps="handled" removeClippedSubviews>
              {enterpriseList.map((company, companyIndex) => {
                const isSelected = selectEnterprise.length ? selectEnterprise.findIndex(select => select.value === company.value) !== -1 : false;
                const isLastIndex = companyIndex === enterpriseList.length - 1;
                return (
                  <TouchableOpacity key={company.value} style={[styles.renderItemStyle, isLastIndex && {borderBottomWidth: 0}]} onPress={() => selectCompanyOnPress(company)}>
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
              </ScrollView> : <View style={styles.emptyArea}>
            <ActivityIndicator size={20} color="#409EFF"/>
          </View>}
        </>}
      </ScrollView>
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
    backgroundColor: '#fff',
    justifyContent: 'center', 
    paddingHorizontal: 10,
    borderColor: '#EFEFEF'
  },
  touchAreaWithDelete: {
    height: 40, 
    flexDirection: 'row',
    borderWidth: 1, 
    borderRadius: 6, 
    backgroundColor: '#fff',
    justifyContent: 'center', 
    borderColor: '#EFEFEF'
  },
  touchTitleArea: {
    flex : 1, 
    justifyContent: 'center', 
    paddingLeft: 10
  },
  clearIcon: {
    justifyContent: 'center',
    paddingHorizontal: 10
  },
  title: {
    fontSize: 16, 
    color: '#000'
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
  itemArea: {
    height: 35, 
    borderBottomWidth: 1, 
    borderBottomColor: '#EFEFEF',
    width: '100%', 
    alignItems: 'center', 
    paddingLeft: 10, 
    flexDirection: 'row', 
    justifyContent: 'space-between'
  },
  listArea: {
    borderWidth: 1, 
    borderColor: '#EFEFEF', 
    borderBottomLeftRadius: 6 , 
    borderBottomRightRadius: 6, 
    borderTopWidth: 0
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
    borderBottomWidth: 1,
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

export default FilterMoreOfTrend;