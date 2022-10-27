import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { StyleSheet, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Text, Dialog, CheckBox } from '@rneui/themed';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useDispatch } from 'react-redux';
import DateTimePicker from '@react-native-community/datetimepicker';

import moment from 'moment';

const SelectItemOfFilterMore = ({
  field,
  form,
  label
}) => {
  const dispatch = useDispatch();

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
  };

  const clearFieldValue = () => form.setFieldValue(field.name, '');

  return (
    <>
      <View style={styles.selectItemArea}>
        <Text style={styles.showLittleTitleText}>{label}：</Text>
        <TouchableOpacity
          style={styles.selectArea}
          onPress={selectOnPress}>
          <AntDesign
            name='calendar'
            size={32}
            color={!!field?.value ? '#000000' : '#999999'}
            style={{marginRight: 10}}
          />
          <Text
            style={[styles.selectText, !field.value && styles.noItem]}
            ellipsizeMode="tail"
            numberOfLines={1}>
            {!!field.value ? `${field.value}` : `请选择${label}`}
          </Text>
          {loading ? <ActivityIndicator color="#409EFF" size={28} /> : <>
            {!field.value.length && <AntDesign name='down' size={36} style={{marginRight: 10}} color='#999999'/>}
          </>}
          {!!field.value.length && <TouchableOpacity style={styles.clearIconArea} onPress={clearFieldValue}>
            <AntDesign name='closecircle' size={32} style={styles.clearIcon} color='#999999'/>
          </TouchableOpacity>}
        </TouchableOpacity>
      </View>
      {showDatePicker &&
        <DateTimePicker 
          value={dateTime} 
          onChange={dateChange} 
        />
      }
    </>
  )
};

const styles = StyleSheet.create({
  selectItemArea: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  showLittleTitleText: {
    minWidth: 140,
    fontSize: 28,
    color: '#000'
  },
  selectArea: {
    flex: 1,
    height: '100%',
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