import React, {useRef, useEffect, useState, useMemo} from "react";
import { View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import moment from "moment";
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useSelector, useDispatch } from 'react-redux';

import { setStartDate, setEndDate } from "../../../redux/features/RangeDateOfList";

import { getWeekName } from "../../../utils";

const CenterSelectDate = ({
  centerDateStyle,
  ...rest
  }) => {
  const dispatch = useDispatch();

  const rangeDate = useSelector(state => state.RangeDateOfList);
  const startDate = rangeDate.startDate ? moment(rangeDate.startDate).format('YYYY-MM-DD') : '';
  const endDate = rangeDate.endDate ? moment(rangeDate.endDate).format('YYYY-MM-DD') : '';

  const [showYear, setShowYear] = useState(moment().year());
  const [btnType, setBtnType] = useState('');
  const [weekArr, setWeekArr] = useState([]);
  const [selectDay, setSelectDay] = useState(moment());
  const [changeWeekTimes, setChangeWeekTimes] = useState(0);
  const [returnToday, setReturnToday] = useState(false);

  useEffect(()=>{
    getThisWeek();
    setBtnType('');
    dispatch(setStartDate(moment()));
    dispatch(setEndDate(moment()));
  },[])

  //检查是否选中的日期是近一月/近一周;
  const checkIfWeekOrMonth = () => {
    const before30Day = moment(endDate).subtract(30, 'days').format('YYYY-MM-DD');
    const before7Day = moment(endDate).subtract(7, 'days').format('YYYY-MM-DD');
    const today = moment().format('YYYY-MM-DD');
    if(startDate === before30Day && endDate === today){
      setBtnType('month');
    }else if (startDate === before7Day && endDate === today){
      setBtnType('week');
    }else{
      setBtnType('');
    }
  };

  useMemo(() => {
    const today = moment().format('YYYY-MM-DD');
    if (startDate !== endDate){
      checkIfWeekOrMonth();
      setSelectDay(null);
      setReturnToday(true);
      return;
    } else if (startDate === endDate){
      //都为空
      if(!startDate && !endDate){
        setReturnToday(true);
        setSelectDay(null);
        return;
      }
      setSelectDay(rangeDate.startDate);
      setReturnToday(startDate === today ? false : true);
      return;
    }
  }, [rangeDate])

  //检查切换的星期中年份是否和之前有区别，星期里某一天和原来的不同就返回并且修改显示的年份。
  useMemo(()=>{
    weekArr.map(day => {
      const year = moment(day).year();
      if(year !== showYear){
        setShowYear(year);
        return;
      }
    });
  },[weekArr])

  const getThisWeek = () => {
    let arr = [];
    for(let i = 0; i < 7; i++){
      arr.push(moment().day(i));
    }
    setWeekArr(arr);
  };
  
  const changeWeek = (type) => {
    switch (type) {
      case 'lastWeek' :
        let lastWeekArr = [];
        for(let i = 0; i < 7; i++){
          lastWeekArr.push(moment().day(i + 7 * (changeWeekTimes - 1)));
        }
        setChangeWeekTimes(changeWeekTimes - 1);
        setWeekArr(lastWeekArr);
        return;
      case 'nextWeek' :
        let nextWeekArr = [];
        for(let i = 0; i < 7; i++){
          nextWeekArr.push(moment().day(i + 7 * (changeWeekTimes + 1)));
        }
        setChangeWeekTimes(changeWeekTimes + 1);
        setWeekArr(nextWeekArr);
        return;
    }
  };
  
  const returnTodayPress = () => {
    if(!returnToday) return;
    setSelectDay(moment());
    getThisWeek();
    setBtnType('');
    dispatch(setStartDate(moment()));
    dispatch(setEndDate(moment()));
  };

  const recentlyWeek = () => {
    setBtnType('week');
    setSelectDay(null);
    dispatch(setStartDate(moment().subtract(7, 'days')));
    dispatch(setEndDate(moment()));
  };

  const recentlyMonth = () => {
    setBtnType('month');
    setSelectDay(null);
    dispatch(setStartDate(moment().subtract(30, 'days')));
    dispatch(setEndDate(moment()));
  };

  const dayPress = day => {
    setSelectDay(day);
    setBtnType('');
    dispatch(setStartDate(day));
    dispatch(setEndDate(day));
  };

  return (
    <View style={[styles.centerDateArea, centerDateStyle]}>
      <View style={styles.topArea}>
        <View style={styles.bothArea}>
          <TouchableOpacity style={[styles.topBtn, btnType === 'week' && styles.topBtn_selected]} onPress={recentlyWeek}>
            <Text style={[styles.topBtnText, btnType === 'week' && styles.topBtnText_selected]}>近一周</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.centerYear} onPress={returnTodayPress}>
          <Text style={styles.centerYearText}>{showYear}</Text>
          {returnToday && <Text style={styles.centerYearText_selected}>切换今天</Text>}
        </TouchableOpacity>
        <View style={styles.bothArea}>
          <TouchableOpacity style={[styles.topBtn, btnType === 'month' && styles.topBtn_selected]} onPress={recentlyMonth}>
            <Text style={[styles.topBtnText, btnType === 'month' && styles.topBtnText_selected]}>近一月</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.bottomArea}>
        <TouchableOpacity style={styles.bothBtn} onPress={() => changeWeek('lastWeek')}>
          <AntDesign
            name='left'
            size={40}
            color='#999999'
          />
        </TouchableOpacity>
        <View style={styles.bottomCenter}>
          {weekArr.map(week => {
            const weekName = getWeekName(moment(week).day());
            const weekDay = moment(week).format('MM-DD');
            const isSelected = moment(selectDay).isSame(week, 'day');
            return(
              <TouchableOpacity key={week.format('YYYY-MM-DD')} style={styles.dayArea} onPress={() => dayPress(week)}>
                <Text style={styles.week}>{weekName}</Text>
                <Text style={[styles.date, isSelected && styles.date_selected]}>{weekDay}</Text>
              </TouchableOpacity>
            )
          })}
        </View>
        <TouchableOpacity style={styles.bothBtn} onPress={() => changeWeek('nextWeek')}>
          <AntDesign
            name='right'
            size={40}
            color='#999999'
          />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  centerDateArea: {
    height: 203, 
    backgroundColor: '#fff', 
    flexDirection: 'column',
    marginBottom: 30
  },
  topArea: {
    height: 90, 
    flexDirection: 'row'
  },
  bothArea: {
    flex: 2, 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  topBtn: {
    paddingVertical: 9,
    paddingHorizontal: 29, 
    backgroundColor: '#EEEEEE', 
    borderRadius: 5
  },
  topBtn_selected: {
    backgroundColor: '#D9ECFF'
  },
  topBtnText: {
    fontSize: 32, 
    color: '#999999'
  },
  topBtnText_selected: {
    fontWeight: 'bold', 
    color: '#409EFF'
  },
  centerYear: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  centerYearText: {
    fontSize: 40, 
    color: '#409EFF'
  },
  centerYearText_selected: {
    fontSize: 20, 
    color: '#fff', 
    backgroundColor: '#409EFF', 
    paddingHorizontal: 10, 
    borderRadius: 6
  },
  bottomArea: {
    flex: 1, 
    flexDirection: 'row'
  },
  bothBtn: {
    width: 60, 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  bottomCenter: {
    flex: 1, 
    flexDirection: 'row'
  },
  dayArea: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  week: {
    fontSize: 28,
    fontWeight: 'bold', 
    color: '#666666',
    paddingBottom: 3
  },
  date: {
    fontSize: 24,
    color: '#666666'
  },
  date_selected: {
    color: '#fff',
    backgroundColor: '#409EFF', 
    borderRadius: 6,
    paddingHorizontal: 8
  }
});

export default CenterSelectDate;