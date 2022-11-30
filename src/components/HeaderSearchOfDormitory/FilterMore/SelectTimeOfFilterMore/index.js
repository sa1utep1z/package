import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ErrorMessage } from 'formik';

import moment from 'moment';

const SelectItemOfFilterMore = ({
  field,
  form,
  label,
  iconSize = 32,
  fontSize = 28,
  showLabel = true,
  canDelete = true,
  showArrow = true,
  startLimit,
  endLimit,
  borderColor,
  selectOtherFunc,
  totalAreaStyle,
  itemAreaStyle,
  touchAreaStyle,
  labelStyle
}) => {
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateTime, setDateTime] = useState(new Date());

  const selectOnPress = () => {
    setLoading(true);
    setShowDatePicker(true);
    const renderDate = field.value ? new Date(field.value) : new Date();
    setDateTime(renderDate);
  };

  const dateChange = (event, selectedDate) => {
    setLoading(false);
    setShowDatePicker(false);
    if (event.type !== 'set') return;
    const currentDate = moment(selectedDate).format('YYYY-MM-DD');
    form.setFieldValue(field.name, currentDate);
    selectOtherFunc && selectOtherFunc(field.name, currentDate);
  };

  const clearFieldValue = () => form.setFieldValue(field.name, '');

  return (
    <View style={[{marginBottom: 30}, totalAreaStyle]}>
      <View style={[styles.selectItemArea, itemAreaStyle]}>
        {showLabel && <Text style={[styles.showLittleTitleText, fontSize && {fontSize}, labelStyle]}>{label}：</Text>}
        <TouchableOpacity style={[styles.selectArea, borderColor && {borderColor}, touchAreaStyle]} onPress={selectOnPress}>
          <AntDesign name='calendar' size={iconSize} color={!!field?.value ? '#000000' : '#999999'} style={{marginRight: 10}} />
          <Text
            style={[styles.selectText, !field.value && styles.noItem, fontSize && {fontSize}]}
            ellipsizeMode="tail"
            numberOfLines={1}>
            {!!field.value ? `${field.value}` : `请选择${label}`}
          </Text>
          {loading ? <ActivityIndicator color="#409EFF" size={28} /> : <>
            {showArrow && !field.value.length && <AntDesign name='down' size={iconSize} style={{marginRight: 10}} color='#999999'/>}
          </>}
          {canDelete && !!field.value.length && <TouchableOpacity style={styles.clearIconArea} onPress={clearFieldValue}>
            <AntDesign name='closecircle' size={iconSize} style={styles.clearIcon} color='#999999'/>
          </TouchableOpacity>}
        </TouchableOpacity>
      </View>
      <ErrorMessage
        name={field.name}
        component={Text}
        style={{ color: 'red', fontSize: 22, textAlign: 'center' }}
      />
      {showDatePicker &&
        <DateTimePicker 
          value={dateTime} 
          minimumDate={startLimit && new Date(startLimit)}
          maximumDate={endLimit && new Date(endLimit)}
          onChange={dateChange} 
        />
      }
    </View>
  )
};

const styles = StyleSheet.create({
  selectItemArea: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center'
  },
  showLittleTitleText: {
    minWidth: 140,
    fontSize: 28,
    color: '#000',
    textAlignVertical: 'center'
  },
  selectArea: {
    flex: 1,
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingLeft: 20,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#999999'
  },
  selectText: {
    flex: 1,
    color: 'black',
    fontSize: 28
  },
  noItem: {
    color: '#999999'
  },
  clearIconArea: {
    height: 60, 
    paddingHorizontal: 10,
    justifyContent: 'center', 
    alignItems: 'flex-end'
  },
  clearIcon: {
    width: 40, 
    height: 40, 
    textAlign: 'center', 
    textAlignVertical: 'center'
  }
})

export default SelectItemOfFilterMore;