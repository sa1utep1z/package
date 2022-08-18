import React, {useMemo, useState} from "react";
import { View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useSelector, useDispatch } from 'react-redux';
import moment from "moment";
import DateTimePicker from '@react-native-community/datetimepicker';
import { useToast } from "react-native-toast-notifications";

import { getYMD } from "../../../../utils";
import { setStartDate, setEndDate } from "../../../../redux/features/RangeDateOfList";

const PickerOfDateRange = ({
    field, 
    form, 
    clearTimer = true, //时间组件默认支持清空
    ...rest
  }) => {
  const toast = useToast();
  const dispatch = useDispatch();

  const rangeDate = useSelector(state => state.RangeDateOfList);

  const [modalVisible, setModalVisible] = useState(false);
  const [dateTime, setDateTime] = useState();
  const [type, setType] = useState('start');


  //外部通过其他组件传进来的时间范围一旦发生改变，就主动修改组件内部的起始/结束日期。
  useMemo(()=>{
    form.setFieldValue(field.name, {
      startDate: rangeDate.startDate ? moment(rangeDate.startDate).format('YYYY-MM-DD') : '', 
      endDate: rangeDate.endDate ? moment(rangeDate.endDate).format('YYYY-MM-DD') : ''
    });
    form.handleSubmit();
  }, [rangeDate])

  const showDate = (type) => {
    setType(type);
    setModalVisible(!modalVisible);
    const startDate = rangeDate.startDate ? new Date(rangeDate.startDate) : new Date();
    const endDate = rangeDate.endDate ? new Date(rangeDate.endDate) : new Date();
    setDateTime(type === 'start' ? startDate : endDate);
  };

  const dateChange = (event, selectedDate) => {
    setModalVisible(false);
    //清空
    if(event.type === 'neutralButtonPressed'){
      if(type === 'start'){
        dispatch(setStartDate(''));
        return;
      }
      if(type === 'end'){
        dispatch(setEndDate(''));
        return;
      }
    }
    if (event.type !== 'set') return;
    const currentDate = selectedDate || dateTime;
    const currentDateText = getYMD(currentDate);
    const startDate = moment(rangeDate.startDate).format('YYYY-MM-DD');
    const endDate = moment(rangeDate.endDate).format('YYYY-MM-DD');
    switch(type){
      case 'start': 
        if(currentDateText > endDate){
          toast.show(`开始日期不能晚于结束日期！`, { type: 'warning' });
          return;
        }
        dispatch(setStartDate(moment.utc(selectedDate)));
        return;
      case 'end':
        if(currentDateText < startDate){
          toast.show(`结束日期不能早于开始日期！`, { type: 'warning' });
          return;
        }
        dispatch(setEndDate(moment.utc(selectedDate)));
        return;
    }
  };

  const clearStart = () => {
    if(rangeDate.startDate){
      dispatch(setStartDate(''));
    }
  };

  const clearEnd = () => {
    if(rangeDate.endDate){
      dispatch(setEndDate(''));
    }
  };

  return (
    <>
      <View style={styles.dateArea}>
        <View style={styles.datePicker}>
          <Text style={styles.title}>开始日期：</Text>
          <View style={styles.pressArea}>
            <TouchableOpacity style={styles.pickerTouchable} onPress={() => showDate('start')}>
              <AntDesign
                name='calendar' 
                size={30}
                color={rangeDate.startDate ? '#333333' : '#999999'}
              />
              <Text style={[styles.font, rangeDate.startDate && {color: '#333333'}]}>{rangeDate.startDate ? moment(rangeDate.startDate).format('MM-DD') : '无'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.iconStyle, !rangeDate.startDate && {opacity: 0}]} onPress={clearStart}>
              <AntDesign
                name='closecircle' 
                size={30}
                color='#999999'
              />
            </TouchableOpacity>
          </View>
        </View> 
        <View style={{width: 40}}></View>
        <View style={styles.datePicker}>
          <Text style={styles.title}>结束日期：</Text>
          <View style={styles.pressArea}>
            <TouchableOpacity style={styles.pickerTouchable} onPress={() => showDate('end')}>
              <AntDesign
                name='calendar' 
                size={30}
                color={rangeDate.endDate ? '#333333' : '#999999'}
              />
              <Text style={[styles.font, rangeDate.endDate && {color: '#333333'}]}>{rangeDate.endDate ? moment(rangeDate.endDate).format('MM-DD') : '无'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.iconStyle, !rangeDate.endDate && {opacity: 0}]} onPress={clearEnd}>
              <AntDesign
                name='closecircle' 
                size={30}
                color='#999999'
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {modalVisible && <DateTimePicker 
        value={dateTime} 
        onChange={dateChange} 
        neutralButtonLabel={clearTimer ? '清除' : ''}
      />}
    </>
  )
}

const styles = StyleSheet.create({
  dateArea: {
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20
  },
  datePicker: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  pickerTouchable: {
    flex: 1,
    height: '100%',
    flexDirection: 'row', 
    alignItems: 'center'
  },
  font: {
    flex: 1,
    textAlign: 'center',
    color: '#999999',
    fontSize: 28
  },
  iconStyle: {
    height: '100%', 
    justifyContent: 'center', 
    paddingHorizontal: 10
  },
  title: {
    fontSize: 26,
    color: '#000',
    fontWeight: 'bold'
  },
  pressArea: {
    flex: 1,
    height: '100%',
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingLeft: 20,
    backgroundColor: '#fff',
    borderRadius: 10
  }
});

export default PickerOfDateRange;