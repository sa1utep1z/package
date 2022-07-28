import React, {useMemo, useState} from "react";
import { View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useSelector } from 'react-redux';
import moment from "moment";

import DateRangePicker from "../../../DateRangePicker";

const PickerOfDateRange = ({
    field, 
    form, 
    ...rest
  }) => {
  const rangeDate = useSelector(state => state.RangeDateOfList);

  const [modalVisible, setModalVisible] = useState(false);
  const [startDate, setStartDate] = useState(rangeDate.startDate);
  const [endDate, setEndDate] = useState(rangeDate.endDate);
  const [displayedDate, setDisplayedDate] = useState(moment());

  //外部通过其他组件传进来的时间范围一旦发生改变，就主动修改组件内部的起始/结束日期。
  useMemo(()=>{
    setStartDate(rangeDate.startDate);
    setEndDate(rangeDate.endDate);
    if(rangeDate.startDate && rangeDate.endDate){
      form.setFieldValue(field.name, {startDate: rangeDate.startDate?.format('YYYY-MM-DD'), endDate: rangeDate.endDate?.format('YYYY-MM-DD')});
      form.handleSubmit();
    }
  }, [rangeDate])

  const setDates = (dates) => {
    dates?.startDate && setStartDate(dates?.startDate);
    dates?.endDate && setEndDate(dates?.endDate);
    dates?.displayedDate && setDisplayedDate(dates?.displayedDate);
  };

  const confirmBtn = () => {
    form.setFieldValue(field.name, {startDate: startDate.format('YYYY-MM-DD'), endDate: endDate.format('YYYY-MM-DD')});
    form.handleSubmit();
  };

  const showDate = () => setModalVisible(!modalVisible);

  return (
    <>
      <View style={styles.dateArea}>
        <View style={styles.datePicker}>
          <Text style={styles.title}>开始日期:</Text>
          <TouchableOpacity style={styles.pickerTouchable} onPress={showDate}>
            <AntDesign
              name='calendar' 
              size={20}
              color='#999999'
            />
            <Text style={styles.font}>{startDate?.format('YYYY-MM-DD')}</Text>
          </TouchableOpacity>
        </View> 
        <View style={{width: 10}}></View>
        <View style={styles.datePicker}>
          <Text style={styles.title}>结束日期:</Text>
          <TouchableOpacity style={styles.pickerTouchable} onPress={showDate}>
            <AntDesign
              name='calendar' 
              size={20}
              color='#999999'
            />
            <Text style={styles.font}>{endDate?.format('YYYY-MM-DD')}</Text>
          </TouchableOpacity>
        </View>
      </View>
      <DateRangePicker
        range
        startDate={startDate}
        endDate={endDate}
        displayedDate={displayedDate}
        open={modalVisible}
        display={setModalVisible}
        onChange={setDates}
        confirmBtn={confirmBtn}
        moment={moment}>
        <View></View>
      </DateRangePicker>
    </>
  )
}

const styles = StyleSheet.create({
  dateArea: {
    height: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  datePicker: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  pickerTouchable: {
    flex: 1,
    height: '100%',
    backgroundColor: '#fff', 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    alignItems: 'center', 
    borderRadius: 5, 
    paddingLeft: 5,
    marginLeft: 5
  },
  font: {
    color: '#999999'
  },
  title: {
    fontSize: 14,
    color: '#000',
    fontWeight: 'bold'
  }
});

export default PickerOfDateRange;