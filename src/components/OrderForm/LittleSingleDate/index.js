import React, {useState} from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {ErrorMessage} from 'formik';
import { CheckBox } from '@rneui/themed';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import AntDesign from 'react-native-vector-icons/AntDesign';

/**缩小版的单选日期*/
const LittleSingleDate = ({
  field, 
  form, 
  ...rest
}) => {

  const [showPicker, setShowPicker] = useState(false);
  const [dateTime, setDateTime] = useState(new Date());


  const pickerOnPress = () => {
    setShowPicker(!showPicker);
  };

  const dateChange = (event, selectedDate) => {
    setShowPicker(false);
    if(event.type !== 'set') return;
    form.setFieldValue(field.name, moment(selectedDate).format('YYYY-MM-DD'));
  };

  return (
    <View style={{flex: 1, justifyContent: 'center'}}>
      <View style={styles.container}>
        <View style={[{flex: 1, flexDirection: 'row'}, form.errors[field.name] && styles.errorBorder]}>
          <View style={{flex: 1}}>
            <TouchableOpacity style={[{flex: 1, borderWidth: 1, borderWidth: 2, borderColor: '#E5E5E5', borderRadius: 6, height: 60, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10}, form.errors[field.name] && {borderColor: 'red'}]} onPress={pickerOnPress}>
              <AntDesign
                name='calendar' 
                size={26}
                color={field.value ? '#333333' : '#999999'}
                style={{marginRight: 10}}
              />
              <Text style={{fontSize: 22, color: field.value ? '#333333' : '#999999'}}>{field.value || '请选择日期'}</Text>
            </TouchableOpacity>
            {!!form.errors[field.name] && <Text style={[styles.errorMessage, !form.errors[field.name] && {opacity: 0}]}>{form.errors[field.name]}</Text>}
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
  container: {
    flexDirection: 'row'
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

export default LittleSingleDate;