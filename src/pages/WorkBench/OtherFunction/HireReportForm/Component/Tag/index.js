import React, {useState, useEffect, useMemo} from "react";
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";

import {setStartDate, setEndDate} from '../../../../../../redux/features/HireReport/RangeDateOfTrend';

const Tag = ({
  lastButton = false,
  tagList = [],
  tagAreaStyle,
  filterMore
}) => {
  const dispatch = useDispatch();
  const thisWeekStart = moment().weekday(0).format('YYYY-MM-DD');
  const thisWeekEnd = moment().weekday(6).format('YYYY-MM-DD');
  const lastWeekStart = moment().weekday(-7).format('YYYY-MM-DD');
  const lastWeekEnd = moment().weekday(-1).format('YYYY-MM-DD');
  const thisMonthStart = moment().startOf('month').format('YYYY-MM-DD');
  const thisMonthEnd = moment().endOf('month').format('YYYY-MM-DD');

  const rangeDate = useSelector(state => state.RangeDateOfTrend);

  const [selectTag, setSelectTag] = useState('');

  useEffect(()=>{
    // setSelectedTag();
  },[rangeDate])

  //设置不同页面的
  const setSelectedTag = () => {
    const startDate = rangeDate.startDate;
    const endDate = rangeDate.endDate;
    if(startDate === thisWeekStart && endDate === thisWeekEnd){
      setSelectTag('thisWeek');
      return;
    }else if (startDate === lastWeekStart && endDate === lastWeekEnd){
      setSelectTag('lastWeek');
      return;
    }else if (startDate === thisMonthStart && endDate === thisMonthEnd){
      setSelectTag('thisMonth');
      return;
    }else{
      setSelectTag('');
    }
  };

  const chooseTag = (tag) => {
    setSelectTag(tag.value);
    switch (tag.value) {
      case 'thisWeek':
        dispatch(setStartDate(thisWeekStart));
        dispatch(setEndDate(thisWeekEnd));
        break;
      case 'lastWeek':
        dispatch(setStartDate(lastWeekStart));
        dispatch(setEndDate(lastWeekEnd));
        break;
      case 'thisMonth':
        dispatch(setStartDate(thisMonthStart));
        dispatch(setEndDate(thisMonthEnd));
        break;
    }
  };

  return (
    <>
      <View style={[styles.tagsArea, tagAreaStyle]}>
        <View style={{flexDirection: 'row'}}>
          {tagList.map((tag, tagIndex) => {
            const isSelected = selectTag === tag.value;
            return (
              <TouchableOpacity key={tagIndex} style={[styles.tag, isSelected && styles.selectedTag]} onPress={() => chooseTag(tag)}>
                <Text style={[styles.tagText, isSelected && styles.selectedTagText]}>{tag.title}</Text>
              </TouchableOpacity>
          )})}
        </View>
        {lastButton && (
          <TouchableOpacity style={styles.lastButtonStyle} onPress={filterMore}>
            <Text style={styles.lastButtonText}>筛选更多</Text>
          </TouchableOpacity>
        )}
      </View>
    </>
  )
};

const styles = StyleSheet.create({
  tagsArea: {
    height: 70, 
    flexDirection: 'row', 
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  tag: {
    height: 40,
    paddingHorizontal: 10,
    marginRight: 30, 
    borderRadius: 5, 
    justifyContent: 'center', 
    borderWidth: 2, 
    borderColor: '#E5E5E5'
  },
  selectedTag: {
    backgroundColor: '#409EFF', 
    borderWidth: 0
  },
  tagText: {
    fontSize: 26, 
    textAlign: 'center', 
    color: '#999999'
  },
  selectedTagText: {
    color: '#fff'
  },
  lastButtonStyle: {
    height: 40, 
    width: 160, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#409EFF', 
    borderRadius: 5
  },
  lastButtonText: {
    fontSize: 26, 
    color: '#fff'
  }
});

export default Tag;