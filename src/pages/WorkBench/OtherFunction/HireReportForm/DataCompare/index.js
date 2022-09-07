import React, {useState, useEffect} from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Shadow } from 'react-native-shadow-2';
import { useDispatch } from 'react-redux';

import { HIRE_DATA_TREND_TAB_LIST, HIRE_DATA_COMPARE_TAB_LIST, THIS_WEEK_START, THIS_WEEK_END, LAST_WEEK_START, LAST_WEEK_END, THIS_MONTH_START, THIS_MONTH_END, LAST_MONTH_START, LAST_MONTH_END } from "../../../../../utils/const";
import { openDialog } from "../../../../../redux/features/HireReport/HireReportDialog";

import Tag from "./Tag";
import CompareForm from "./CompareForm";
import FilterMoreOfCompare from "./FilterMoreOfCompare";

let timer;
const thisWeekVSlastWeek = {
  thisRange: {
    startDate: THIS_WEEK_START, 
    endDate: THIS_WEEK_END
  }, 
  lastRange: {
    startDate: LAST_WEEK_START, 
    endDate: LAST_WEEK_END
  }
};
const thisMonthVSlastMonth = {
  thisRange: {
    startDate: THIS_MONTH_START, 
    endDate: THIS_MONTH_END
  },
  lastRange: {
    startDate: LAST_MONTH_START, 
    endDate: LAST_MONTH_END
  }
};

const DataCompare = () => {
  const dispatch = useDispatch();

  const [selectedTab, setSelectedTab] = useState('company');
  const [loading, setLoading] = useState(true);
  const [rangeDate, setRangeDate] = useState(thisWeekVSlastWeek);
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
    if(search.rangeTime.thisRange && search.rangeTime.lastRange){
      const newThisRange = search.rangeTime.thisRange;
      const newLastRange = search.rangeTime.lastRange
      const nowThisRange = rangeDate.thisRange;
      const nowLastRange = rangeDate.lastRange;
      //判断是否修改了时间
      if(newThisRange.startDate !== nowThisRange.startDate || newThisRange.endDate !== nowThisRange.endDate || newLastRange.startDate !== nowLastRange.startDate || newLastRange.endDate !== nowLastRange.endDate){
        setSearchOther(true);
        setRangeDate(search.rangeTime);
      }else{
        setSearchOther(false);
      }
    }
  };

  const filterMore = () => {
    dispatch(openDialog(<FilterMoreOfCompare confirm={confirm} rangeDate={rangeDate} showType={selectedTab} />));
  };

  const setTime = (range) => {
    setSearchOther(false);
    switch(range.value){
      case 'thisWeekVSlastWeek': 
        setRangeDate(thisWeekVSlastWeek);
        break;
      case 'thisMonthVSlastMonth':
        setRangeDate(thisMonthVSlastMonth);
        break;
    }
  };
  
  return (
    <Shadow>
      <View style={styles.totalArea}>
        <View style={styles.titleArea}>
          <View style={styles.titleLine}></View>
          <Text style={styles.title}>数据对比</Text>
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
        <Tag tagList={HIRE_DATA_COMPARE_TAB_LIST} lastButton filterMore={filterMore} setTime={setTime} rangeDate={rangeDate} searchOther={searchOther} />
        {!loading ? <CompareForm /> : 
        <View style={{flex: 1, justifyContent: 'center'}}>
          <ActivityIndicator size={48} color="#409EFF" />
        </View>}
      </View>
    </Shadow>
  )
}

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

export default DataCompare;