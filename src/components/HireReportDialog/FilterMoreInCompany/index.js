import React, {useState, useEffect} from 'react';
import {StyleSheet, View, TouchableOpacity, Text, FlatList} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import DateTimePicker from '@react-native-community/datetimepicker';
import { CheckBox } from '@rneui/themed';
import { useToast } from 'react-native-toast-notifications';
import { useDispatch } from 'react-redux';
import moment from 'moment';

import { CHART_STATUS_LIST, CHANEL_SOURCE_LIST, SUCCESS_CODE } from '../../../utils/const';
import { closeDialog } from '../../../redux/features/HireReportDialog';
import MyMembersApi from '../../../request/MyMembersApi';
import SearchInput from '../../SearchInput';

const FilterMoreInCompany = () => {
  const toast = useToast();
  const dispatch = useDispatch();

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

  /** 来源渠道 */
  const [showWay, setShowWay] = useState(false);
  const [selectWay, setSelectWay] = useState({});

  /** 其他 */
  const [showOther, setShowOther] = useState(false);
  const [selectOther, setSelectOther] = useState({});

  useEffect(()=>{
    getCompanyList();
  },[])

  const getCompanyList = async() => {
    try{  
      const res = await MyMembersApi.CompaniesList();
      if(res.code !== SUCCESS_CODE){
        toast.show(`获取企业列表失败，${res.msg}`, { type: 'danger' });
        return;
      }
      setList(res.data);
      setOriginList(res.data);
    }catch(err){
      toast.show(`获取企业列表失败，请稍后重试`, { type: 'danger' });
    }
  };

  const changeDateRangePicker = () => {
    setDateRangePicker(!dataRangePicker);
    setShowStatusList(false);
    setShowOther(false);
    setShowWay(false);
  };

  const changeStatus = () => {
    setShowStatusList(!showStatusList);
    setDateRangePicker(false);
    setShowOther(false);
    setShowWay(false);
  };

  const changeOther = () => {
    setShowOther(!showOther);
    setDateRangePicker(false);
    setShowStatusList(false);
    setShowWay(false);
  };

  const changeWay = () => {
    setShowWay(!showWay);
    setDateRangePicker(false);
    setShowStatusList(false);
    setShowOther(false);
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

  const wayOnPress = (way) => {
    setSelectWay(way);
  };

  const selectCompanyOnPress = (value) => {
    setSelectOther(value);
  };

  const onChanging = value => {
    const filterList = originList.filter(item => item.label.includes(value));
    setList(filterList);
  };

  const confirmOnPress = () => {
    console.log('点击了确认！');
    dispatch(closeDialog());
  };

  const renderItem = ({item}) => {
    const isSelected = selectOther.value === item.value;
    return (
      <TouchableOpacity style={{height: 30, borderWidth: 1, borderTopWidth: 0, borderColor: '#EFEFEF', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingLeft: 10}} onPress={() => selectCompanyOnPress(item)}>
        <Text style={{color: '#333333'}}>{item.label}</Text>
        <CheckBox
          checked={isSelected}
          size={18}
          containerStyle={{padding: 0}}
          checkedIcon={"dot-circle-o"}
          uncheckedIcon={"circle-o"}
        />
      </TouchableOpacity>
    )
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
          <TouchableOpacity style={[styles.touchArea, showWay && styles.selectedTouchArea, {marginTop: 10}]} onPress={changeWay}>
            <Text numberOfLines={1} style={[{fontSize: 16, color: '#000'}, showWay && styles.fontBold]}>{`${selectWay.value ? `已选来源渠道：${selectWay.title}` : '请选择来源渠道'}`}</Text>
          </TouchableOpacity>
          {showWay && (
            <View style={[styles.selectArea, {flexDirection: 'column'}]}>
              {CHANEL_SOURCE_LIST.map((way, wayIndex) => {
                const isLastIndex = wayIndex === (CHANEL_SOURCE_LIST.length - 1);
                const isSelected = selectWay.value === way.value;
                return (
                  <TouchableOpacity style={[{height: 35, borderBottomWidth: 1, borderBottomColor: '#EFEFEF', width: '100%', alignItems: 'center', paddingLeft: 10, flexDirection: 'row', justifyContent: 'space-between'}, isLastIndex && {borderBottomWidth: 0}]} onPress={() => wayOnPress(way)} key={wayIndex}>
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
        </>
        <>
          <TouchableOpacity style={[styles.touchArea, showOther && styles.selectedTouchArea, {marginTop: 10}]} onPress={changeOther}>
            <Text numberOfLines={1} style={[{fontSize: 16, color: '#000'}, showOther && styles.fontBold]}>{`${selectOther.value ? `已选企业：${selectOther.label}` : '请选择企业'}`}</Text>
          </TouchableOpacity>
          {showOther && <SearchInput
            placeholder='请输入企业名称'
            smallSize
            withoutButton
            keyboardType='default'
            onChange={onChanging}
            fontStyle={{fontSize: 14}}
            searchInputStyle={styles.searchInputStyle}
            inputContainerStyle={{paddingLeft: 0}}
          />}
          {showOther && 
          <FlatList 
            data={list}
            renderItem={renderItem} 
            initialNumToRender={10}
            getItemLayout={(data, index)=>({length: 30, offset: 30 * index, index})}
            keyExtractor={item => item.value}
          />}
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

export default FilterMoreInCompany;