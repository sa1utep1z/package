import React, {useState, useEffect, useMemo, useCallback, useRef} from 'react';
import {StyleSheet, View, TouchableOpacity, Text, ScrollView, ActivityIndicator} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import DateTimePicker from '@react-native-community/datetimepicker';
import { CheckBox } from '@rneui/themed';
import { useToast } from 'react-native-toast-notifications';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';

import HireReportFormApi from '../../../../../../request/HireReportFormApi';
import { CHART_STATUS_LIST, CHANEL_SOURCE_LIST, SUCCESS_CODE, THIS_WEEK_START, THIS_WEEK_END, LAST_WEEK_START, LAST_WEEK_END, THIS_MONTH_START, THIS_MONTH_END, LAST_MONTH_START, LAST_MONTH_END } from '../../../../../../utils/const';
import { closeDialog } from '../../../../../../redux/features/HireReport/HireReportDialog';
import MyMembersApi from '../../../../../../request/MyMembersApi';
import SearchInput from '../../../../../../components/SearchInput';
import * as PageDialog1 from "../../../../../../redux/features/PageDialog";

let timer;

const FilterMoreOfCompare = ({
  rangeDate,
  confirm,
}) => {
  const dispatch = useDispatch();

  /** 时间范围 */
  const [type, setType] = useState('THIS_START');
  const [dateTime, setDateTime] = useState(new Date());
  const [showDataPicker, setShowDataPicker] = useState(false);
  const [dateRangePicker, setDateRangePicker] = useState(true);
  const [rangeTime, setRangeTime] = useState(rangeDate);

  const showDate = (type) => {
    setType(type);
    setShowDataPicker(true);
    switch(type){
      case 'THIS_START':
        setDateTime(new Date(rangeTime.thisRange.startDate));
        break;
      case 'THIS_END': 
        setDateTime(new Date(rangeTime.thisRange.endDate));
        break;
      case 'LAST_START':
        setDateTime(new Date(rangeTime.lastRange.startDate));
        break;
      case 'LAST_END':
        setDateTime(new Date(rangeTime.lastRange.endDate));
        break;
    }
  };

  //选择日期
  const dateChange = (event, selectedDate) => {
    setShowDataPicker(false);
    if (event.type !== 'set') return;
    const formatDate = moment(selectedDate).format('YYYY-MM-DD');
    switch(type){
      case 'THIS_START':
        const thisRangeStart = {
          ...rangeTime.thisRange,
          startDate: formatDate
        };
        setRangeTime({...rangeTime, thisRange: thisRangeStart});
        break;
      case 'THIS_END': 
        const thisRangeEnd = {
          ...rangeTime.thisRange,
          endDate: formatDate
        };
        setRangeTime({...rangeTime, thisRange: thisRangeEnd});
        break;
      case 'LAST_START':
        const lastRangeStart = {
          ...rangeTime.lastRange,
          startDate: formatDate
        };
        setRangeTime({...rangeTime, lastRange: lastRangeStart});
        break;
      case 'LAST_END':
        const lastRangeEnd = {
          ...rangeTime.lastRange,
          endDate: formatDate
        };
        setRangeTime({...rangeTime, lastRange: lastRangeEnd});
        break;
    }
  };

  //获取时间转字符串显示
  const getRangeDate = () => {
    let startText = '', endText = '';
    const startIsThisWeek = rangeTime.thisRange.startDate === THIS_WEEK_START && rangeTime.thisRange.endDate === THIS_WEEK_END;
    const startIsLastWeek = rangeTime.thisRange.startDate === LAST_WEEK_START && rangeTime.thisRange.endDate === LAST_WEEK_END;
    const startIsThisMonth = rangeTime.thisRange.startDate === THIS_MONTH_START && rangeTime.thisRange.endDate === THIS_MONTH_END;
    const startIsLastMonth = rangeTime.thisRange.startDate === LAST_MONTH_START && rangeTime.thisRange.endDate === LAST_MONTH_END;

    const endIsThisWeek = rangeTime.lastRange.startDate === THIS_WEEK_START && rangeTime.lastRange.endDate === THIS_WEEK_END;
    const endIsLastWeek = rangeTime.lastRange.startDate === LAST_WEEK_START && rangeTime.lastRange.endDate === LAST_WEEK_END;
    const endIsThisMonth = rangeTime.lastRange.startDate === THIS_MONTH_START && rangeTime.lastRange.endDate === THIS_MONTH_END;
    const endIsLastMonth = rangeTime.lastRange.startDate === LAST_MONTH_START && rangeTime.lastRange.endDate === LAST_MONTH_END;

    if (startIsThisWeek){
      startText = '本周';
    }else if (startIsLastWeek){
      startText = '上周';
    }else if (startIsThisMonth){
      startText = '本月';
    }else if (startIsLastMonth){
      startText = '上月';
    }else{
      startText = `其他周期`
    }

    if (endIsThisWeek){
      endText = '本周';
    }else if (endIsLastWeek){
      endText = '上周';
    }else if (endIsThisMonth){
      endText = '本月';
    }else if (endIsLastMonth){
      endText = '上月';
    }else{
      endText = `其他周期`
    }
    
    return `${startText} VS ${endText}`
  };

  const close = () => dispatch(PageDialog1.closeDialog());

  const confirmOnPress = () => {
    dispatch(PageDialog1.closeDialog());
    const searchContent = {
      rangeTime
    };
    confirm(searchContent);
  };

  return (
    <>
      <ScrollView style={{maxHeight: 750, paddingHorizontal: 20, marginBottom: 20}}>
        <TouchableOpacity style={[styles.touchArea, dateRangePicker && styles.selectedTouchArea]} onPress={() => setDateRangePicker(!dateRangePicker)}>
          <Text style={[styles.title, dateRangePicker && styles.fontBold]}>
            {`时间范围：${getRangeDate()}`}
          </Text>
        </TouchableOpacity>
        {dateRangePicker && (
          <View style={[styles.selectArea, {flexDirection: 'column'}]}>
            <View style={{flexDirection: 'row', alignItems: 'center', padding: 20, paddingVertical: 15, borderBottomWidth: 1, borderColor: '#999999'}}>
              <Text style={{color: '#333', fontSize: 26}}>本周期：</Text>
              <TouchableOpacity style={styles.selectTime} onPress={()=>showDate('THIS_START')}>
                <AntDesign name='calendar' size={28} color='#999999'/>
                <Text style={{marginLeft: 4, fontSize: 26}}>{moment(rangeTime.thisRange.startDate).format('MM-DD')}</Text>
              </TouchableOpacity>
              <Text style={{color: '#333', marginHorizontal: 10, fontSize: 26}}>至</Text>
              <TouchableOpacity style={styles.selectTime} onPress={()=>showDate('THIS_END')}>
                <AntDesign name='calendar' size={28} color='#999999'/>
                <Text style={{marginLeft: 4, fontSize: 26}}>{moment(rangeTime.thisRange.endDate).format('MM-DD')}</Text>
              </TouchableOpacity>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center', padding: 20, paddingVertical: 15}}>
              <Text style={{color: '#333', fontSize: 26}}>上周期：</Text>
              <TouchableOpacity style={styles.selectTime} onPress={()=>showDate('LAST_START')}>
                <AntDesign name='calendar' size={28} color='#999999'/>
                <Text style={{marginLeft: 4, fontSize: 26}}>{moment(rangeTime.lastRange.startDate).format('MM-DD')}</Text>
              </TouchableOpacity>
              <Text style={{color: '#333', marginHorizontal: 10, fontSize: 26}}>至</Text>
              <TouchableOpacity style={styles.selectTime} onPress={()=>showDate('LAST_END')}>
                <AntDesign name='calendar' size={28} color='#999999'/>
                <Text style={{marginLeft: 4, fontSize: 26}}>{moment(rangeTime.lastRange.endDate).format('MM-DD')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
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
      {showDataPicker && <DateTimePicker value={dateTime} onChange={dateChange}/>}
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
  touchAreaWithDelete: {
    height: 40, 
    flexDirection: 'row',
    borderWidth: 1, 
    borderRadius: 6, 
    backgroundColor: '#fff',
    justifyContent: 'center', 
    borderColor: '#EFEFEF'
  },
  touchTitleArea: {
    flex : 1, 
    justifyContent: 'center', 
    paddingLeft: 10
  },
  clearIcon: {
    justifyContent: 'center',
    paddingHorizontal: 10
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
    borderColor: '#999999', 
    borderTopWidth: 0, 
    borderBottomLeftRadius: 12, 
    borderBottomRightRadius: 12, 
    flexDirection: 'row', 
    alignItems: 'center'
  },
  selectTime: {
    flex: 1, 
    borderWidth: 1, 
    borderColor: '#EFEFEF', 
    height: 55, 
    borderRadius: 6, 
    flexDirection: 'row',
    alignItems: 'center', 
    justifyContent: 'center'
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
  bottomButtonArea: {
    flexDirection: 'row',
    height: 45,
    marginTop: 10
  },
  bottomLeft: {
    flex: 1,
    borderTopWidth: 1,
    borderRightWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 6,
    borderColor: '#E3E3E3'
  },
  leftText: {
    fontSize: 16,
    color: '#999999'
  },
  bottomRight: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#E3E3E3',
    borderBottomRightRadius: 6
  },
  rightText: {
    fontSize: 16,
    color: '#409EFF'
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

export default FilterMoreOfCompare;