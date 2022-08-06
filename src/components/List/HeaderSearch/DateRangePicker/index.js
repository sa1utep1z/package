import React, {useMemo, useState} from "react";
import { View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useSelector, useDispatch } from 'react-redux';
import moment from "moment";
import DateTimePicker from '@react-native-community/datetimepicker';
import { useToast } from "react-native-toast-notifications";

import { getYMD } from "../../../../utils";
import { setStartDate, setEndDate } from "../../../../redux/features/RangeDateOfList";

const PickerOfDateRange = ({
    field, 
    form, 
    ...rest
  }) => {
  const toast = useToast();
  const dispatch = useDispatch();

  const rangeDate = useSelector(state => state.RangeDateOfList);

  const [modalVisible, setModalVisible] = useState(false);
  const [dateTime, setDateTime] = useState();
  const [type, setType] = useState('start');


  //外部通过其他组件传进来的时间范围一旦发生改变，就主动修改组件内部的起始/结束日期。
  useMemo(()=>{
    if(rangeDate.startDate && rangeDate.endDate){
      form.setFieldValue(field.name, {
        startDate: moment(rangeDate.startDate).format('YYYY-MM-DD'), 
        endDate: moment(rangeDate.endDate).format('YYYY-MM-DD')
      });
      form.handleSubmit();
    }
  }, [rangeDate])

  const showDate = (type) => {
    setType(type);
    setModalVisible(!modalVisible);
    setDateTime(type === 'start' ? new Date(rangeDate.startDate) : new Date(rangeDate.endDate));
  };

  const dateChange = (event, selectedDate) => {
    setModalVisible(false);
    if (event.type !== 'set') return;
    const currentDate = selectedDate || dateTime;
    const currentDateText = getYMD(currentDate);
    const startDate = moment(rangeDate.startDate).format('YYYY-MM-DD');
    const endDate = moment(rangeDate.endDate).format('YYYY-MM-DD');
    switch(type){
      case 'start': 
        if(currentDateText > endDate){
          toast.show(`开始日期不能晚于结束日期！`, { type: 'warning' });
          return;
        }
        dispatch(setStartDate(moment.utc(selectedDate)));
        return;
      case 'end':
        if(currentDateText < startDate){
          toast.show(`结束日期不能早于开始日期！`, { type: 'warning' });
          return;
        }
        dispatch(setEndDate(moment.utc(selectedDate)));
        return;
    }
  };

  return (
    <>
      <View style={styles.dateArea}>
        <View style={styles.datePicker}>
          <Text style={styles.title}>开始日期：</Text>
          <TouchableOpacity style={styles.pickerTouchable} onPress={() => showDate('start')}>
            <AntDesign
              name='calendar' 
              size={30}
              style={{marginHorizontal: 20}}
              color='#999999'
            />
            <Text style={styles.font}>{moment(rangeDate.startDate).format('MM-DD')}</Text>
          </TouchableOpacity>
        </View> 
        <View style={{width: 40}}></View>
        <View style={styles.datePicker}>
          <Text style={styles.title}>结束日期：</Text>
          <TouchableOpacity style={styles.pickerTouchable} onPress={() => showDate('end')}>
            <AntDesign
              name='calendar' 
              size={30}
              style={{marginHorizontal: 20}}
              color='#999999'
            />
            <Text style={styles.font}>{moment(rangeDate.endDate).format('MM-DD')}</Text>
          </TouchableOpacity>
        </View>
      </View>
      {modalVisible && <DateTimePicker 
        value={dateTime} 
        onChange={dateChange} 
        // minimumDate={new Date()}
      />}
      {/* <DateRangePicker
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
      </DateRangePicker> */}
    </>
  )
}

const styles = StyleSheet.create({
  dateArea: {
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20
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
    alignItems: 'center', 
    borderRadius: 10, 
    paddingLeft: 5,
    marginLeft: 5
  },
  font: {
    color: '#999999',
    fontSize: 28
  },
  title: {
    fontSize: 26,
    color: '#000',
    fontWeight: 'bold'
  }
});

export default PickerOfDateRange;