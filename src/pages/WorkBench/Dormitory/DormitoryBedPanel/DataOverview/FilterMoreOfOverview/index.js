import React, {useState} from 'react';
import {StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useDispatch } from 'react-redux';
import moment from 'moment';

import { THIS_WEEK_START, THIS_WEEK_END, LAST_WEEK_START, LAST_WEEK_END, THIS_MONTH_START, THIS_MONTH_END } from '../../../../../../utils/const';
import * as PageDialog1 from "../../../../../../redux/features/PageDialog";

const FilterMoreOfOverview = ({
  rangeDate,
  confirm
}) => {
  const dispatch = useDispatch();
  
  /** 时间范围 */
  const [type, setType] = useState('start');
  const [dateTime, setDateTime] = useState(new Date());
  const [showDataPicker, setShowDataPicker] = useState(false);
  const [dateRangePicker, setDateRangePicker] = useState(true);
  const [rangeTime, setRangeTime] = useState({startTime: rangeDate.startDate, endTime: rangeDate.endDate});

  const changeDateRangePicker = () => {
    setDateRangePicker(!dateRangePicker);
  };

  const showDate = (type) => {
    setType(type);
    setShowDataPicker(true);
    setDateTime(type === 'start' ? new Date(rangeTime.startTime) : new Date(rangeTime.endTime));
  };

  //选择日期
  const dateChange = (event, selectedDate) => {
    setShowDataPicker(false);
    if (event.type !== 'set') return;
    const formatDate = moment(selectedDate).format('YYYY-MM-DD');
    if(type === 'start'){
      setRangeTime({...rangeTime, startTime: formatDate})
      return;
    }else{
      setRangeTime({...rangeTime, endTime: formatDate})
      return;
    }
  };

  const confirmOnPress = () => {
    dispatch(PageDialog1.closeDialog());
    const searchContent = {
      rangeTime
    };
    confirm(searchContent);
  };

  const close = () => dispatch(PageDialog1.closeDialog());

  //获取时间转字符串显示
  const getRangeDate = () => {
    let rangeText = '';
    if (rangeTime.startTime === THIS_WEEK_START && rangeTime.endTime === THIS_WEEK_END){
      rangeText = '本周';
    }else if (rangeTime.startTime === LAST_WEEK_START && rangeTime.endTime === LAST_WEEK_END){
      rangeText = '上周';
    }else if (rangeTime.startTime === THIS_MONTH_START && rangeTime.endTime === THIS_MONTH_END){
      rangeText = '本月';
    }else{
      rangeText = '其他周期';
    }
    return rangeText;
  };

  return (
    <>
      <View style={{maxHeight: 450, paddingHorizontal: 20, marginBottom: 20}}>
        <TouchableOpacity style={[styles.touchArea, dateRangePicker && styles.selectedTouchArea]} onPress={changeDateRangePicker}>
          <Text style={[styles.title, dateRangePicker && styles.fontBold]}>
            {`时间范围：${getRangeDate()}`}
          </Text>
        </TouchableOpacity>
        {dateRangePicker && <View style={styles.selectArea}>
          <TouchableOpacity style={styles.selectTime} onPress={()=>showDate('start')}>
            <AntDesign name='calendar' size={28} color='#333333'/>
            <Text style={{marginLeft: 4, fontSize: 26}}>{rangeTime.startTime}</Text>
          </TouchableOpacity>
          <Text style={styles.centerText}>至</Text>
          <TouchableOpacity style={styles.selectTime} onPress={()=>showDate('end')}>
            <AntDesign name='calendar' size={28} color='#333333'/>
            <Text style={{marginLeft: 4, fontSize: 26}}>{rangeTime.endTime}</Text>
          </TouchableOpacity>
        </View>}
        {showDataPicker && <DateTimePicker value={dateTime} onChange={dateChange}/>}
      </View>
      <View style={styles.bottomArea}>
        <View style={styles.leftArea}>
          <TouchableOpacity style={styles.buttonArea} onPress={close}>
            <Text style={styles.closeText}>取消</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.rightArea}>
          <TouchableOpacity style={styles.buttonArea} onPress={confirmOnPress}>
            <Text style={styles.confirmText}>确认</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  )
};

const styles = StyleSheet.create({
  fontBold: {
    fontWeight: 'bold'
  },
  touchArea: {
    height: 80, 
    borderWidth: 2, 
    borderColor: '#EFEFEF',
    borderRadius: 12, 
    justifyContent: 'center', 
    paddingHorizontal: 20
  },
  title: {
    fontSize: 28, 
    color: '#000'
  },
  selectedTouchArea: {
    borderColor: '#409EFF', 
    borderBottomRightRadius: 0, 
    borderBottomLeftRadius: 0
  },
  selectArea: {
    borderWidth: 1, 
    height: 100,
    borderColor: '#999999', 
    borderTopWidth: 0, 
    borderBottomLeftRadius: 12, 
    borderBottomRightRadius: 12, 
    flexDirection: 'row', 
    padding: 20
  },
  selectTime: {
    flex: 1, 
    borderWidth: 1, 
    borderColor: '#EFEFEF', 
    borderRadius: 6, 
    flexDirection: 'row',
    alignItems: 'center', 
    justifyContent: 'center'
  },
  centerText: {
    fontSize: 28, 
    marginHorizontal: 10, 
    textAlignVertical: 'center'
  },
  itemArea: {
    height: 35, 
    borderBottomWidth: 1, 
    borderBottomColor: '#EFEFEF',
    width: '100%', 
    alignItems: 'center', 
    paddingLeft: 10, 
    flexDirection: 'row', 
    justifyContent: 'space-between'
  },
  listArea: {
    borderWidth: 1, 
    borderColor: '#EFEFEF', 
    borderBottomLeftRadius: 6 , 
    borderBottomRightRadius: 6, 
    borderTopWidth: 0
  },
  searchInputStyle: {
    borderWidth: 1,
    height: 30,
    marginBottom: 0,
    borderTopWidth: 0,
    borderColor: '#EFEFEF',
    paddingHorizontal: 0
  },
  renderItemStyle: {
    height: 30, 
    borderBottomWidth: 1,
    borderColor: '#EFEFEF', 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingLeft: 10
  },
  emptyArea: {
    borderWidth: 1, 
    borderColor: '#EFEFEF', 
    borderTopWidth: 0, 
    paddingVertical: 10, 
    borderBottomLeftRadius: 8, 
    borderBottomRightRadius: 8
  },
  bottomArea: {
    height: 100, 
    flexDirection: 'row'
  },
  leftArea: {
    flex: 1, 
    borderTopWidth: 1, 
    borderRightWidth: 1, 
    borderColor: '#E3E3E3'
  },
  rightArea: {
    flex: 1, 
    borderTopWidth: 1, 
    borderColor: '#E3E3E3'
  },
  buttonArea: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  closeText: {
    fontSize: 28, 
    color: '#999999'
  },
  confirmText: {
    fontSize: 28, 
    color: '#409EFF'
  },
})

export default FilterMoreOfOverview;