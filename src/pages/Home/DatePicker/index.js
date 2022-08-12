import React, {useState, useMemo} from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import { Text } from '@rneui/themed';
import Icon from 'react-native-vector-icons/FontAwesome';
import DateTimePicker from '@react-native-community/datetimepicker';
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
    if (event.type !== 'set') return;
    const currentDate = selectedDate || dateTime;
    const currentDateText = getYMD(currentDate);
    if(type === 'start'){
      if(currentDateText > endDate){
        toast.show(`开始日期不可晚于结束日期！`, { type: 'danger' });
        return;
      }
      setStartDate(currentDateText);
      setRangeDate({...rangeDate, startDate: currentDateText});
    }
    if(type === 'end'){
      if(currentDateText < startDate){
        toast.show(`结束日期不可早于开始日期！`, { type: 'danger' });
        return;
      }
      setEndDate(currentDateText);
      setRangeDate({...rangeDate, endDate: currentDateText});
    }
  };
  
  const datePickerPress = (type) => {
    setType(type);
    setShowDatePicker(true);
    setDateTime(type === 'start' ? new Date(startDate) : new Date(endDate));
  };

  return (
    <View style={styles.dateArea}>
      <View style={styles.datePicker}>
        <Text style={{fontSize: 26}}>开始日期：</Text>
        <TouchableOpacity style={styles.pickerTouchable} onPress={()=>datePickerPress('start')}>
          <Icon
            name='calendar' 
            type='antdesign'
            style={styles.icon}
          />
          <Text style={styles.font}>{moment(startDate).format('MM-DD')}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.datePicker}>
        <Text style={{fontSize: 26}}>结束日期：</Text>
        <TouchableOpacity style={styles.pickerTouchable} onPress={()=>datePickerPress('end')}>
          <Icon
            name='calendar' 
            type='antdesign'
            style={styles.icon}
          />
          <Text style={styles.font}>{moment(endDate).format('MM-DD')}</Text>
        </TouchableOpacity>
      </View>
      {showDatePicker &&
        <DateTimePicker 
          value={dateTime} 
          onChange={dateChange} 
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
    width: 202, 
    height: 60, 
    backgroundColor: '#fff', 
    flexDirection: 'row', 
    alignItems: 'center', 
    borderRadius: 6,
    paddingHorizontal: 30
  },
  icon: {
    fontSize: 30,
    color: '#666666'
  },
  font: {
    color: '#999999',
    fontSize: 26,
    marginLeft: 15,
    flex: 1,
    textAlign: 'center'
  }
})

export default DatePicker;