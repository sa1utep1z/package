import React, {useEffect, useState} from "react";
import { View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useSelector, useDispatch } from 'react-redux';
import moment from "moment";
import DateTimePicker from '@react-native-community/datetimepicker';
import { useToast } from "react-native-toast-notifications";

import { getYMD } from "../../../../utils";
import { setStartDate, setEndDate } from "../../../../redux/features/RangeDateOfList";

const DateRangePickerInLeavingList = ({
    field, 
    form, 
    clearTimer = true, //时间组件默认支持清空；
    leaving = false, //是否离职时间范围，需和中间快捷切换时间组件联调；
    ...rest
  }) => {
  const toast = useToast();
  const dispatch = useDispatch();

  const rangeDate = useSelector(state => state.RangeDateOfList);

  const [modalVisible, setModalVisible] = useState(false);
  const [dateTime, setDateTime] = useState();
  const [type, setType] = useState('start');

  const {startDate, endDate} = field.value;

  //外部通过其他组件传进来的时间范围一旦发生改变，就主动修改组件内部的起始/结束日期。
  useEffect(()=>{
    if(leaving){
      const formRangeDate = {
        startDate: rangeDate.startDate ? moment(rangeDate.startDate).format('YYYY-MM-DD') : '', 
        endDate: rangeDate.endDate ? moment(rangeDate.endDate).format('YYYY-MM-DD') : ''
      };
      form.setFieldValue(field.name, formRangeDate);
      form.handleSubmit();
    }
  }, [rangeDate])

  const showDate = (type) => {
    setType(type);
    setModalVisible(!modalVisible);
    const startDate = field.value.startDate ? new Date(field.value.startDate) : new Date();
    const endDate = field.value.endDate ? new Date(field.value.endDate) : new Date();
    setDateTime(type === 'start' ? startDate : endDate);
  };

  const dateChange = (event, selectedDate) => {
    setModalVisible(false);
    //清空
    if(event.type === 'neutralButtonPressed'){
      if(type === 'start'){
        if(leaving){
          dispatch(setStartDate(''));
          return;
        }
        form.setFieldValue(field.name, {
          ...field.value,
          startDate: ''
        })
        form.handleSubmit();
        return;
      }
      if(type === 'end'){
        if(leaving){
          dispatch(setEndDate(''));
          return;
        }
        form.setFieldValue(field.name, {
          ...field.value,
          endDate: ''
        })
        form.handleSubmit();
        return;
      }
    }
    if (event.type !== 'set') return;
    const currentDate = selectedDate || dateTime;
    const currentDateText = getYMD(currentDate);
    switch(type){
      case 'start': 
        if((currentDateText > field.value.endDate) && !!field.value.endDate){
          toast.show(`开始日期不能晚于结束日期！`, { type: 'warning' });
          return;
        }
        if(leaving){
          dispatch(setStartDate(moment.utc(selectedDate)));
        }
        form.setFieldValue(field.name, {
          ...field.value,
          startDate: currentDateText
        })
        form.handleSubmit();
        return;
      case 'end':
        if((currentDateText < field.value.startDate) && !!field.value.startDate){
          toast.show(`结束日期不能早于开始日期！`, { type: 'warning' });
          return;
        }
        if(leaving){
          dispatch(setEndDate(moment.utc(selectedDate)));
        }
        form.setFieldValue(field.name, {
          ...field.value,
          endDate: currentDateText
        })
        form.handleSubmit();
        return;
    }
  };

  const clearStart = () => {
    form.setFieldValue(field.name, {
      ...field.value,
      startDate: ''
    })
    if(leaving && rangeDate.startDate){
      dispatch(setStartDate(''));
    }
    form.handleSubmit();
  };

  const clearEnd = () => {
    form.setFieldValue(field.name, {
      ...field.value,
      endDate: ''
    })
    if(leaving && rangeDate.endDate){
      dispatch(setEndDate(''));
    }
    form.handleSubmit();
  };

  return (
    <>
      <View style={styles.dateArea}>
        <View style={styles.datePicker}>
          <Text style={styles.title}>{`${field.name === 'joinIn' ? '入职' : '离职'}开始日期：`}</Text>
          <View style={styles.pressArea}>
            <TouchableOpacity style={styles.pickerTouchable} onPress={() => showDate('start')}>
              {!field.value.startDate && <AntDesign
                name='calendar' 
                size={30}
                color={startDate ? '#333333' : '#999999'}
              />}
              <Text style={[styles.font, startDate && {color: '#333333'}]}>{field.value.startDate ? moment(field.value.startDate).format('MM-DD') : '无'}</Text>
            </TouchableOpacity>
            {!!field.value.startDate && <TouchableOpacity style={styles.iconStyle} onPress={clearStart}>
              <AntDesign
                name='closecircle' 
                size={30}
                color='#999999'
              />
            </TouchableOpacity>}
          </View>
        </View> 
        <View style={{width: 40}}></View>
        <View style={styles.datePicker}>
          <Text style={styles.title}>{`${field.name === 'joinIn' ? '入职' : '离职'}结束日期：`}</Text>
          <View style={styles.pressArea}>
            <TouchableOpacity style={styles.pickerTouchable} onPress={() => showDate('end')}>
              {!field.value.endDate && <AntDesign
                name='calendar' 
                size={30}
                color={endDate ? '#333333' : '#999999'}
              />}
              <Text style={[styles.font, endDate && {color: '#333333'}]}>{field.value.endDate ? moment(field.value.endDate).format('MM-DD') : '无'}</Text>
            </TouchableOpacity>
            {!!field.value.endDate && <TouchableOpacity style={[styles.iconStyle, !endDate && {opacity: 0}]} onPress={clearEnd}>
              <AntDesign
                name='closecircle' 
                size={30}
                color='#999999'
              />
            </TouchableOpacity>}
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
    justifyContent: 'center',
    alignItems: 'center'
  },
  font: {
    textAlign: 'center',
    color: '#999999',
    fontSize: 28,
    paddingLeft: 10
  },
  iconStyle: {
    height: '100%', 
    justifyContent: 'center'
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
    backgroundColor: '#fff',
    borderRadius: 10
  }
});

export default DateRangePickerInLeavingList;