import React, {useState} from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {ErrorMessage} from 'formik';
import { CheckBox } from '@rneui/themed';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import AntDesign from 'react-native-vector-icons/AntDesign';

/**单选*/
const OrderRangeDate = ({
  field, 
  form, 
  label,
  ...rest
}) => {

  const [showPicker, setShowPicker] = useState(false);
  const [dateTime, setDateTime] = useState(new Date());
  const [timeType, setTimeType] = useState('start');

  const pickerOnPress = (type) => {
    setShowPicker(!showPicker);
    setTimeType(type);
  };

  const dateChange = (event, selectedDate) => {
    let newRangeDate;
    setShowPicker(false);
    if(event.type !== 'set') return;
    switch(timeType){
      case 'start':
        newRangeDate = {
          ...field.value,
          startDate: moment(selectedDate).format('YYYY-MM-DD')
        };
        form.setFieldValue(field.name, newRangeDate);
        break;
      case 'end':
        newRangeDate = {
          ...field.value,
          endDate: moment(selectedDate).format('YYYY-MM-DD')
        };
        form.setFieldValue(field.name, newRangeDate);
        break;
    }
  };
  console.log('field.name', field.name);
  console.log('form', form);

  return (
    <View style={{marginBottom: form.errors[field.name] ? 10 : 20}}>
      <View style={styles.container}>
        <Text style={styles.labelText}>{label}：</Text>
        <View style={[{flex: 1, flexDirection: 'row'}, form.errors[field.name] && styles.errorBorder]}>
          <View style={{flex: 1}}>
            <TouchableOpacity style={[{flex: 1, borderWidth: 1, borderWidth: 2, borderColor: '#E5E5E5', borderRadius: 6, height: 60, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20}, form.errors[field.name]?.startDate && {borderColor: 'red'}]} onPress={()=>pickerOnPress('start')}>
              <AntDesign
                name='calendar' 
                size={30}
                color={field.value.startDate ? '#333333' : '#999999'}
                style={{marginRight: 10}}
              />
              <Text style={{fontSize: 26, color: field.value.startDate ? '#333333' : '#999999'}}>{field.value.startDate || '请选择日期'}</Text>
            </TouchableOpacity>
            {!!form.errors[field.name] && <Text style={[styles.errorMessage, !form.errors[field.name]?.startDate && {opacity: 0}]}>{form.errors[field.name]?.startDate}</Text>}
          </View>
          <Text style={{fontSize: 26, marginHorizontal: 10, maxHeight: 60, textAlignVertical: 'center'}}>至</Text>
          <View style={{flex: 1}}>
            <TouchableOpacity style={[{flex: 1, borderWidth: 1, borderWidth: 2, borderColor: '#E5E5E5', borderRadius: 6, height: 60, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20}, form.errors[field.name]?.endDate && {borderColor: 'red'}]} onPress={()=>pickerOnPress('end')}>
              <AntDesign
                name='calendar' 
                size={30}
                color={field.value.endDate ? '#333333' : '#999999'}
                style={{marginRight: 10}}
              />
              <Text style={{fontSize: 26, color: field.value.endDate ? '#333333' : '#999999'}}>{field.value.endDate || '请选择日期'}</Text>
            </TouchableOpacity>
            {!!form.errors[field.name] && <Text style={[styles.errorMessage, !form.errors[field.name]?.endDate && {opacity: 0}]}>{form.errors[field.name]?.endDate}</Text>}
          </View>
        </View>
      </View>
      {showPicker && <DateTimePicker 
        value={dateTime} 
        onChange={dateChange} 
        neutralButtonLabel='清除'
      />}
    </View>
  )
};

const styles = StyleSheet.create({
  selectArea: {
    marginBottom: 10
  },
  container: {
    flexDirection: 'row'
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
  errorMessage: {
    color: 'red',
    fontSize: 22
  },
  errorBorder: {
    borderColor: 'red'
  },
  errorBorder_radio: {
    borderColor: 'red'
  }
})

export default OrderRangeDate;