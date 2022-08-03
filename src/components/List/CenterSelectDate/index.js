import React, {useRef, useEffect, useState, useMemo} from "react";
import { View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import moment from "moment";
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useSelector, useDispatch } from 'react-redux';

import { setStartDate, setEndDate } from "../../../redux/features/RangeDateOfList";

import { getWeekName } from "../../../utils";

const CenterSelectDate = ({
    ...rest
  }) => {
  const dispatch = useDispatch();

  const rangeDate = useSelector(state => state.RangeDateOfList);

  const [showYear, setShowYear] = useState(moment().year());
  const [btnType, setBtnType] = useState('');
  const [weekArr, setWeekArr] = useState([]);
  const [selectDay, setSelectDay] = useState(null);
  const [changeWeekTimes, setChangeWeekTimes] = useState(0);
  const [returnToday, setReturnToday] = useState(false);

  useEffect(()=>{
    getThisWeek();
    setSelectDay(moment());
  },[])

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

  //选择日期切换时显示按钮
  useMemo(()=>{
    //修改redux内部时间范围；
    if(selectDay){
      dispatch(setStartDate(selectDay));
      dispatch(setEndDate(selectDay));
    }

    //修改是否显示【切换今天】的按钮；
    if(moment().isSame(selectDay, 'day')) {
      setReturnToday(false);
      return;
    }
    setReturnToday(true);
  },[selectDay])


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
    dispatch(setStartDate(selectDay));
    dispatch(setEndDate(selectDay));
  };

  return (
    <View style={styles.centerDateArea}>
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
            size={24}
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
            size={24}
            color='#999999'
          />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  centerDateArea: {
    height: 95, 
    backgroundColor: '#fff', 
    flexDirection: 'column',
    marginBottom: 10
  },
  topArea: {
    height: 40, 
    flexDirection: 'row'
  },
  bothArea: {
    flex: 2, 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  topBtn: {
    paddingHorizontal: 12, 
    backgroundColor: '#EEEEEE', 
    borderRadius: 2
  },
  topBtn_selected: {
    backgroundColor: '#D9ECFF'
  },
  topBtnText: {
    fontSize: 16, 
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
    fontSize: 20, 
    color: '#409EFF'
  },
  centerYearText_selected: {
    fontSize: 10, 
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
    width: 30, 
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
    fontWeight: 'bold', 
    color: '#666666',
    paddingBottom: 3
  },
  date: {
    fontSize: 12
  },
  date_selected: {
    color: '#fff',
    backgroundColor: '#409EFF', 
    borderRadius: 6, 
    paddingHorizontal: 3
  }
});

export default CenterSelectDate;