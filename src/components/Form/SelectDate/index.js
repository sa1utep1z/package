import React, {useState} from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import {Text, Input} from '@rneui/themed';
import {ErrorMessage} from 'formik';
import AntDesign from 'react-native-vector-icons/AntDesign';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';

const SelectDate = ({
  field, 
  form, 
  title,
  labelAreaStyle,
  selectContainerStyle,
  ...rest
}) => {
  const [dateTime, setDateTime] = useState(field.value.length ? new Date(field.value) : new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const showDate = () => setShowDatePicker(true);

  const dateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if(event.type === 'neutralButtonPressed'){
      form.setFieldValue(field.name, '');
      return;
    }
    if(event.type !== "set") return;
    form.setFieldValue(field.name, moment(selectedDate).format('YYYY-MM-DD'));
    setDateTime(selectedDate);
  };

  return (
    <>
      <View style={[styles.selectArea, selectContainerStyle]}>
        <View style={[styles.titleArea, labelAreaStyle]}>
          <Text style={{fontSize: 32}}>{title}：</Text>
        </View>
        <TouchableOpacity style={styles.rightArea} onPress={showDate}>
          <Text style={[styles.rightArea_text, !field.value.length && {color: '#999999'}]}>{field.value ? field.value : `请选择${title}`}</Text>
          <AntDesign
            name={showDatePicker ? 'up' : 'down'}
            size={30}
            color={!field.value.length ? '#CCCCCC' : 'black'}
          />
        </TouchableOpacity>
        {showDatePicker &&
          <DateTimePicker 
            value={dateTime} 
            onChange={dateChange} 
            neutralButtonLabel={field.value && '清除'}
          />
        }
      </View>
      <ErrorMessage
        name={field.name}
        component={Text}
        style={styles.errorInput}
      />
    </>
  )
}

const styles = StyleSheet.create({
  errorInput: {
    textAlign: 'center',
    color: 'red'
  },
  selectArea: {
    height: 91, 
    flexDirection: 'row', 
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(0, 0, 0, .05)',
    paddingHorizontal: 28
  },
  titleArea: {
    marginRight: 10, 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  rightArea: {
    flex: 1, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center'
  },
  rightArea_text: {
    fontSize: 32
  }
})

export default SelectDate;