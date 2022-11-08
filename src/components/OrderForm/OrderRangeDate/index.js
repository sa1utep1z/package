import React, {useState} from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useToast } from "react-native-toast-notifications";

const oneYearBefore = moment().subtract(1, 'years').format('YYYY-MM-DD');
const oneYearLater = moment().add(1, 'years').format('YYYY-MM-DD');

/**单选*/
const OrderRangeDate = ({
  field, 
  form, 
  label,
  labelStyle,
  isRequire = false,
  canSelect = true, //是否可以选择
  limitCrossDate = false, //设置多个时间范围内是否可以交叉。（多个时间不支持交叉的话就需要修改对应的时间）
  limit = {startDateLimit: oneYearBefore, endDateLimit: oneYearLater},
  ...rest
}) => {
  const toast = useToast();

  const [showPicker, setShowPicker] = useState(false);
  const [dateTime, setDateTime] = useState(new Date());
  const [timeType, setTimeType] = useState('start');

  const pickerOnPress = (type) => {
    setShowPicker(!showPicker);
    setTimeType(type);
    if(type === 'start'){
      setDateTime(field.value.startDate ? new Date(field.value.startDate) :new Date());
    }else if(type === 'end'){
      setDateTime(field.value.endDate ? new Date(field.value.endDate) : new Date());
    }else{
      setDateTime(new Date());
    }
  };

  const dateChange = async(event, selectedDate) => {
    try{
      let newRangeDate, lastFieldValue, lastFieldStartDateValue, lastFieldEndDateValue, oneDayLaterOfLastFieldEndDateValue;
      setShowPicker(false);
      if(event.type !== 'set') return;
      const formatSelectDate = moment(selectedDate).format('YYYY-MM-DD'); //现在选择的时间转化成【年份-月份-日期】格式；
      const fieldNameIndex = field.name.includes('rule') ? field.name.substr(4, 1) : field.name.substr(field.name.length - 1, 1); //获取当前设置的时间名称索引；（用来与上个时间范围进行比较）
      if(fieldNameIndex > 1){
        if(field.name.includes('rule')){
          lastFieldValue = form.values[`rule${fieldNameIndex - 1}`].orderRangeDate; //获取上个时间范围的表单值；
        }else{
          lastFieldValue = form.values[`orderRangeDate${fieldNameIndex - 1}`]; //获取上个时间范围的表单值；
        }
        lastFieldStartDateValue = lastFieldValue.startDate;
        lastFieldEndDateValue = lastFieldValue.endDate;
        oneDayLaterOfLastFieldEndDateValue = moment(lastFieldEndDateValue).add(1, 'days').format('YYYY-MM-DD');
      }
  
      switch(timeType){
        case 'start':
          if(limitCrossDate){
            if(Number(fieldNameIndex) === 1){
              newRangeDate = {
                ...field.value,
                startDate: formatSelectDate
              };
              form.setFieldValue(field.name, newRangeDate);
              return;
            }
            //选择的开始时间在上个日期范围中，则将当前的日期范围设置与上个日期范围相同；
            if(formatSelectDate <= lastFieldEndDateValue){
              newRangeDate = {
                startDate: lastFieldStartDateValue,
                endDate: lastFieldEndDateValue
              };
              form.setFieldValue(field.name, newRangeDate);
              if(field.name.includes('rule')){
                form.setFieldValue(`rule${fieldNameIndex}.store`, []);
              }
              return;
            }
            //选择的开始时间在上个日期范围外，则将当前的日期范围与上个日期范围保持连续；
            if(formatSelectDate > lastFieldEndDateValue){
              toast.show('多个规则时间范围须保持连续', {type: 'warning'});
              newRangeDate = {
                startDate: oneDayLaterOfLastFieldEndDateValue,
                endDate: formatSelectDate
              };
              form.setFieldValue(field.name, newRangeDate);
              return;
            }
            newRangeDate = {
              ...field.value,
              startDate: oneDayLaterOfLastFieldEndDateValue
            };
            form.setFieldValue(field.name, newRangeDate);
            return;
          }
          if(field.value.endDate && formatSelectDate > field.value.endDate){
            toast.show('开始日期不可大于结束日期', {type: 'warning'});
            return;
          }
          newRangeDate = {
            ...field.value,
            startDate: formatSelectDate
          };
          form.setFieldValue(field.name, newRangeDate);
          break;
        case 'end':
          if(limitCrossDate){
            if(Number(fieldNameIndex) === 1){
              newRangeDate = {
                ...field.value,
                endDate: formatSelectDate
              };
              form.setFieldValue(field.name, newRangeDate);
              return;
            }
            //选择的开始时间在上个日期范围中，则将当前的日期范围设置与上个日期范围相同；
            if(formatSelectDate <= lastFieldEndDateValue){
              newRangeDate = {
                startDate: lastFieldStartDateValue,
                endDate: lastFieldEndDateValue
              };
              form.setFieldValue(field.name, newRangeDate);
              if(field.name.includes('rule')){
                form.setFieldValue(`rule${fieldNameIndex}.store`, []);
              }
              return;
            }
            //选择的结束时间在上个日期范围外，则将当前的日期范围与上个日期范围保持连续；
            if(formatSelectDate > lastFieldEndDateValue){
              newRangeDate = {
                startDate: oneDayLaterOfLastFieldEndDateValue,
                endDate: formatSelectDate
              };
              form.setFieldValue(field.name, newRangeDate);
              return;
            }
          }
          if(field.value.startDate && formatSelectDate < field.value.startDate){
            toast.show('结束时间不可小于开始时间', {type: 'warning'});
            return;
          }
          newRangeDate = {
            ...field.value,
            endDate: formatSelectDate
          };
          form.setFieldValue(field.name, newRangeDate);
          break;
      }
    }catch(err){
      console.log('err', err)
    }
  };

  return (
    <View style={{marginBottom: form.errors[field.name] && form.touched[field.name]?.startDate && form.touched[field.name]?.endDate ? 10 : 20}}>
      <View style={styles.container}>
        <Text style={[styles.labelText, labelStyle]}>
          {isRequire && <Text style={{color: 'red'}}>*</Text>}
          {label}：</Text>
        {canSelect ? <View style={[{flex: 1, flexDirection: 'row'}, form.errors[field.name] && form.touched[field.name]?.startDate && form.touched[field.name]?.endDate && styles.errorBorder]}>
          <View style={{flex: 1}}>
            <TouchableOpacity style={[{flex: 1, borderWidth: 1, borderWidth: 2, borderColor: '#E5E5E5', borderRadius: 6, height: 60, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20}, form.errors[field.name]?.startDate && form.touched[field.name]?.startDate && {borderColor: 'red'}]} onPress={()=>pickerOnPress('start')}>
              <AntDesign
                name='calendar' 
                size={30}
                color={field.value.startDate ? '#333333' : '#999999'}
                style={{marginRight: 10}}
              />
              <Text style={{fontSize: 26, color: field.value.startDate ? '#333333' : '#999999'}}>{field.value.startDate || '请选择日期'}</Text>
            </TouchableOpacity>
            {!!form.errors[field.name] && form.touched[field.name]?.startDate && <Text style={[styles.errorMessage, !form.errors[field.name]?.startDate && form.touched[field.name]?.startDate && {opacity: 0}]}>{form.errors[field.name]?.startDate}</Text>}
          </View>
          <Text style={{fontSize: 26, marginHorizontal: 10, maxHeight: 60, textAlignVertical: 'center'}}>至</Text>
          <View style={{flex: 1}}>
            <TouchableOpacity style={[{flex: 1, borderWidth: 1, borderWidth: 2, borderColor: '#E5E5E5', borderRadius: 6, height: 60, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20}, form.errors[field.name]?.endDate && form.touched[field.name]?.endDate && {borderColor: 'red'}]} onPress={()=>pickerOnPress('end')}>
              <AntDesign
                name='calendar' 
                size={30}
                color={field.value.endDate ? '#333333' : '#999999'}
                style={{marginRight: 10}}
              />
              <Text style={{fontSize: 26, color: field.value.endDate ? '#333333' : '#999999'}}>{field.value.endDate || '请选择日期'}</Text>
            </TouchableOpacity>
            {!!form.errors[field.name] && form.touched[field.name]?.endDate && <Text style={[styles.errorMessage, !form.errors[field.name]?.endDate && form.touched[field.name]?.endDate && {opacity: 0}]}>{form.errors[field.name]?.endDate}</Text>}
          </View>
        </View> : <View style={{flex: 1, justifyContent: 'center'}}>
          <Text style={{fontSize: 26, color: '#333333'}}>{`${field.value.startDate} 至 ${field.value.endDate}`}</Text>
        </View>}
      </View>
      {showPicker && <DateTimePicker 
        value={dateTime} 
        onChange={dateChange} 
        minimumDate={new Date(limit.startDateLimit)}
        maximumDate={new Date(limit.endDateLimit)}
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