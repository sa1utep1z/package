import React, {useState, useEffect} from "react";
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity} from 'react-native';
import { Shadow } from 'react-native-shadow-2';
import { useDispatch } from 'react-redux';

import { HIRE_DATA_TREND_TAB_LIST, HIRE_DATA_BOX_TAG_LIST, THIS_WEEK_START, THIS_WEEK_END, LAST_WEEK_START, LAST_WEEK_END, THIS_MONTH_START, THIS_MONTH_END } from "../../../../../utils/const";
import { openDialog } from "../../../../../redux/features/HireReport/HireReportDialog";

import Tag from "./Tag";
import TrendForm from "./TrendForm";
import FilterMoreOfTrend from "./FilterMoreOfTrend";

let timer;
const thisWeek = {startDate: THIS_WEEK_START, endDate: THIS_WEEK_END};
const lastWeek = {startDate: LAST_WEEK_START, endDate: LAST_WEEK_END};
const thisMonth = {startDate: THIS_MONTH_START, endDate: THIS_MONTH_END};

const DataTrend = () => {
  const dispatch = useDispatch();

  const [selectedTab, setSelectedTab] = useState('company');
  const [loading, setLoading] = useState(true);
  const [rangeDate, setRangeDate] = useState(thisWeek);
  const [searchOther, setSearchOther] = useState(false);
  
  useEffect(() => {
    timer = setTimeout(()=>{
      setLoading(false);
    },250)
    return () => timer && clearTimeout(timer);
  }, [])

  const tabOnPress = (tab) => {
    setSelectedTab(tab.key);
  };

  const confirm = (search) => {
    const {rangeTime: {startTime, endTime}} = search;
    if(startTime !== rangeDate.startDate || endTime !== rangeDate.endDate){
      setSearchOther(true);
    }else{
      setSearchOther(false);
    }
    const changeRange = {startDate: startTime, endDate: endTime};
    setRangeDate(changeRange);
  };

  const filterMore = () => {
    dispatch(openDialog(<FilterMoreOfTrend confirm={confirm} rangeDate={rangeDate} showType={selectedTab} />));
  };

  const setTime = (range) => {
    setSearchOther(false);
    switch(range.value){
      case 'thisWeek': 
        setRangeDate(thisWeek);
        break;
      case 'lastWeek':
        setRangeDate(lastWeek);
        break;
      case 'thisMonth':
        setRangeDate(thisMonth);
        break;
    }
  };
  
  return (
    <Shadow>
      <View style={styles.totalArea}>
        <View style={styles.titleArea}>
          <View style={styles.titleLine}></View>
          <Text style={styles.title}>数据趋势</Text>
        </View>
        <View style={{height: 60, flexDirection: 'row'}}>
          {HIRE_DATA_TREND_TAB_LIST.map(tab => {
            const isSelected = tab.key === selectedTab;
            return (
              <TouchableOpacity activeOpacity={1} key={tab.key} style={[styles.touchArea, isSelected && {borderBottomColor: '#409EFF'}]} onPress={() => tabOnPress(tab)}>
                <Text style={[styles.touchArea_text, isSelected && {color: '#409EFF'}]}>{tab.title}</Text>
              </TouchableOpacity>
            )
          })}
        </View>
        <Tag tagList={HIRE_DATA_BOX_TAG_LIST} lastButton filterMore={filterMore} setTime={setTime} rangeDate={rangeDate} searchOther={searchOther} />
        {!loading ? <TrendForm /> : 
          <View style={{flex: 1, justifyContent: 'center'}}>
            <ActivityIndicator size={48} color="#409EFF" />
          </View>}
      </View>
    </Shadow>
  )
};

const styles = StyleSheet.create({
  totalArea: {
    height: 655,
    width: 686,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 32,
    padding: 30
  },
  titleArea: {
    marginBottom: 20, 
    flexDirection: 'row', 
    alignItems: 'center'
  },
  titleLine: {
    width: 6,
    height: 32, 
    backgroundColor: '#409EFF', 
    marginRight: 9, 
    borderTopRightRadius: 5, 
    borderBottomLeftRadius: 5
  },
  title: {
    fontSize: 36, 
    color: '#000', 
    fontWeight: 'bold'
  },
  touchArea: {
    flex: 1, 
    justifyContent: 'center',
    borderBottomWidth: 2,
    borderColor: '#EEEEEE'
  },
  touchArea_text: {
    textAlign: 'center', 
    fontSize: 28
  }
});

export default DataTrend;