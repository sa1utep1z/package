import React, {useState, useMemo} from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import { Text } from '@rneui/themed';
import Icon from 'react-native-vector-icons/FontAwesome';
import DateTimePicker from '@react-native-community/datetimepicker';

import {getYMD} from '../../../utils';

const DatePicker = ({
  startTime,
  endTime
}) => {
  console.log('startTime', startTime);
  console.log('endTime', endTime);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateTime, setDateTime] = useState(new Date());
  const [type, setType] = useState('start');
  const [startDate, setStartDate] = useState(startTime);
  const [endDate, setEndDate] = useState(endTime);

  useMemo(() => {
    setStartDate(startTime);
    setEndDate(endTime);
  }, [startTime, endTime])

  const dateChange = (event, selectedDate) => {
    console.log('event',event.type);
    console.log('selectedDate', selectedDate);
    if (event.type !== 'set') return;
    const currentDate = selectedDate || dateTime;
    const currentDateText = getYMD(currentDate);
    type === 'start' && setStartDate(currentDateText);
    type === 'end' && setEndDate(currentDateText);
    setShowDatePicker(false);
  };
  
  const datePickerPress = (type) => {
    setType(type);
    setShowDatePicker(true);
    setDateTime(type === 'start' ? new Date(startDate) : new Date(endDate));
  };

  return (
    <View style={styles.dateArea}>
      <View style={styles.datePicker}>
        <Text>开始日期:</Text>
        <TouchableOpacity style={styles.pickerTouchable} onPress={()=>datePickerPress('start')}>
          <Icon
            name='calendar' 
            type='antdesign'
            style={styles.icon}
          />
          <Text style={styles.font}>{startDate}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.datePicker}>
        <Text>结束日期:</Text>
        <TouchableOpacity style={styles.pickerTouchable} onPress={()=>datePickerPress('end')}>
          <Icon
            name='calendar' 
            type='antdesign'
            style={styles.icon}
          />
          <Text style={styles.font}>{endDate}</Text>
        </TouchableOpacity>
      </View>
      {showDatePicker && 
        <DateTimePicker 
          value={dateTime} 
          onChange={dateChange} 
          minimumDate={new Date()}
          negativeButtonLabel={''}
        />}
    </View>
  )
}

const styles = StyleSheet.create({
  dateArea: {
    height: 40,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginBottom: 10
  },
  datePicker: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  pickerTouchable: {
    width: 110, 
    height: 34, 
    backgroundColor: '#fff', 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    alignItems: 'center', 
    borderRadius: 5, 
    paddingLeft: 5,
    marginLeft: 5
  },
  icon: {
    fontSize: 20,
    color: '#999999'
  },
  font: {
    color: '#999999'
  }
})

export default DatePicker;