import React, {useState, useMemo} from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import { Text } from '@rneui/themed';
import Icon from 'react-native-vector-icons/FontAwesome';
import DateTimePicker from '@react-native-community/datetimepicker';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useToast } from "react-native-toast-notifications";
import moment from 'moment';

import {getYMD} from '../../../utils';

const DatePicker = ({
  rangeDate,
  setRangeDate
}) => {
  const toast = useToast();

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateTime, setDateTime] = useState();
  const [type, setType] = useState('start');
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();

  useMemo(()=>{
    setStartDate(rangeDate.startDate);
    setEndDate(rangeDate.endDate);
  },[rangeDate])

  const dateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if(event.type === 'neutralButtonPressed'){
      if(type === 'start'){
        setRangeDate({...rangeDate, startDate: ''});
        return;
      }
      if(type === 'end'){
        setRangeDate({...rangeDate, endDate: ''});
        return;
      }
    }
    if (event.type !== 'set') return;
    const currentDate = selectedDate || dateTime;
    const currentDateText = getYMD(currentDate);
    if(type === 'start'){
      setStartDate(currentDateText);
      setRangeDate({...rangeDate, startDate: currentDateText});
    }
    if(type === 'end'){
      setEndDate(currentDateText);
      setRangeDate({...rangeDate, endDate: currentDateText});
    }
  };
  
  const datePickerPress = (type) => {
    setType(type);
    setShowDatePicker(true);
    const startDate = rangeDate.startDate ? new Date(rangeDate.startDate) : new Date();
    const endDate = rangeDate.endDate ? new Date(rangeDate.endDate) : new Date();
    setDateTime(type === 'start' ? startDate : endDate);
  };

  const clearStart = () => {
    if(rangeDate.startDate){
      setRangeDate({...rangeDate, startDate: ''});
    }
  };

  const clearEnd = () => {
    if(rangeDate.endDate){
      setRangeDate({...rangeDate, endDate: ''});
    }
  };

  return (
    <View style={styles.dateArea}>
      <View style={styles.datePicker}>
        <Text style={{fontSize: 26}}>开始日期：</Text>
        <View style={styles.totalArea}>
          <TouchableOpacity style={styles.pickerTouchable} onPress={()=>datePickerPress('start')}>
            <AntDesign
              name='calendar' 
              size={30}
              color={startDate ? '#333333' : '#999999'}
            />
            <Text style={[styles.font, !startDate && {color: '#999999'}]}>{startDate ? moment(startDate).format('MM-DD'):'无'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.iconArea, !startDate && {opacity: 0}]} onPress={clearStart}>
            <AntDesign
              name='closecircle' 
              size={30}
              color='#999999'
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.datePicker}>
        <Text style={{fontSize: 26}}>结束日期：</Text>
        <View style={styles.totalArea}>
          <TouchableOpacity style={styles.pickerTouchable} onPress={()=>datePickerPress('end')}>
            <AntDesign
              name='calendar' 
              size={30}
              color={endDate ? '#333333' : '#999999'}
            />
            <Text style={[styles.font, !endDate && {color: '#999999'}]}>{endDate ? moment(endDate).format('MM-DD'):'无'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.iconArea, !endDate && {opacity: 0}]} onPress={clearEnd}>
            <AntDesign
              name='closecircle' 
              size={30}
              color='#999999'
            />
          </TouchableOpacity>
      </View>
      </View>
      {showDatePicker &&
        <DateTimePicker 
          value={dateTime} 
          onChange={dateChange} 
          neutralButtonLabel='清除'
          // minimumDate={new Date()}
        />
      }
    </View>
  )
}

const styles = StyleSheet.create({
  dateArea: {
    height: 60,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    paddingHorizontal: 32,
    marginBottom: 30
  },
  datePicker: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  pickerTouchable: {
    flex: 1,
    flexDirection: 'row', 
    alignItems: 'center'
  },
  icon: {
    fontSize: 30,
    color: '#666666'
  },
  font: {
    flex: 1,
    color: '#333333',
    fontSize: 26,
    textAlign: 'center'
  },
  totalArea: {
    width: 202, 
    height: 60, 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#fff', 
    borderRadius: 10, 
    paddingLeft: 20
  },
  iconArea: {
    height: '100%', 
    paddingHorizontal: 10, 
    alignItems: 'center', 
    justifyContent: 'center'
  }
})

export default DatePicker;