import React, {useState, useEffect} from "react";
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Shadow } from 'react-native-shadow-2';
import Entypo from 'react-native-vector-icons/Entypo';
import { useDispatch } from 'react-redux';

import { HIRE_OVERVIEW_TAG_LIST, THIS_WEEK_START, THIS_WEEK_END, THIS_MONTH_START, THIS_MONTH_END, TODAY } from "../../../../../utils/const";
// import { openDialog } from "../../../../../redux/features/HireReport/HireReportDialog";
import { openDialog, setTitle } from "../../../../../redux/features/PageDialog";

import Tag from "./Tag";
import FilterMoreOfOverview from "./FilterMoreOfOverview";

const today = {startDate: TODAY, endDate: TODAY};
const thisWeek = {startDate: THIS_WEEK_START, endDate: THIS_WEEK_END};
const thisMonth = {startDate: THIS_MONTH_START, endDate: THIS_MONTH_END};

const DataOverview = ({
  data, //获取概览数据
  getData, //获取概览数据函数
  loading
}) => {
  const dispatch = useDispatch();

  const [rangeDate, setRangeDate] = useState(today);
  const [searchOther, setSearchOther] = useState(false);

  useEffect(() => {
    getData(rangeDate);
  }, [rangeDate])

  const setTime = (range) => {
    setSearchOther(false);
    switch(range.value){
      case 'today': 
        setRangeDate(today);
        break;
      case 'thisWeek':
        setRangeDate(thisWeek);
        break;
      case 'thisMonth':
        setRangeDate(thisMonth);
        break;
    }
  };

  const confirm = (search) => {
    const {rangeTime: {startTime, endTime}} = search;
    if(startTime !== rangeDate.startDate || endTime !== rangeDate.endDate){
      setSearchOther(true);
    }else{
      setSearchOther(false);
    }
    setRangeDate({startDate: startTime, endDate: endTime});
  };

  const filterMore = () => {
    // dispatch(openDialog(<FilterMoreOfOverview confirm={confirm} rangeDate={rangeDate} />));
    dispatch(setTitle('温馨提示'));
    dispatch(openDialog(<FilterMoreOfOverview confirm={confirm} rangeDate={rangeDate} />));
  };

  const compareText = () => {
    const {startDate, endDate} = rangeDate;
    if(startDate === TODAY && endDate === TODAY){
      return '较昨日';
    }else if(startDate === THIS_WEEK_START && endDate === THIS_WEEK_END){
      return '较上周';
    }else if(startDate === THIS_MONTH_START && endDate === THIS_MONTH_END){
      return '较上月';
    }else{
      return '较上周期';
    }
  };

  return (
    <View style={styles.totalArea}>
      <View style={styles.titleArea}>
        <View style={styles.titleLine}></View>
        <Text style={styles.title}>数据概览</Text>
      </View>
      <View style={styles.bottomArea}>
        <Tag tagAreaStyle={{paddingHorizontal: 20}} lastButton tagList={HIRE_OVERVIEW_TAG_LIST} filterMore={filterMore} setTime={setTime} rangeDate={rangeDate} searchOther={searchOther}/>
        <View style={styles.dataArea}>
          {!loading ? <>
            {data.map((data, dataIndex) => {
              return (
                <View key={dataIndex} style={styles.data}>
                  <Shadow distance={15} startColor={'#f5f8fa'} endColor={'#fff'}>
                    <View style={styles.dataBox}>
                      <View style={styles.dataBox_top}>
                        <Text style={styles.dataBox_top_text}>{data.title}</Text>
                      </View>
                      <View style={styles.dataBox_center}>
                        <Text style={styles.dataBox_center_text}>{data.num}{data.type.includes('Rate') && '%'}</Text>
                      </View>
                      <View style={styles.dataBox_bottom}>
                        <Text style={styles.dataBox_bottom_text}>{`${compareText()}${data.trendNumber > 0 ? `+${data.trendNumber}` : `${data.trendNumber}`}`}{data.type.includes('Rate') && '%'}</Text>
                        <Entypo 
                          size={30} 
                          name={data.trendNumber === 0 ? 'minus' : data.trendNumber > 0 ? 'arrow-up' : 'arrow-down'}
                          color={data.trendNumber === 0 ? '#999999' : data.trendNumber > 0 ? '#FF4040' : '#409EFF'}
                        />
                      </View>
                    </View>
                  </Shadow>
                </View>
              )
            })}
          </>: <View style={styles.loadingArea}>
            <ActivityIndicator size={48} color="#409EFF"/>
          </View>}
        </View>
      </View>
    </View>
  )
};

const styles = StyleSheet.create({
  totalArea: {
    alignSelf: 'center',
    width: 686,
    marginBottom: 30, 
    backgroundColor: '#409EFF', 
    borderRadius: 10, 
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
    backgroundColor: '#fff', 
    marginRight: 9, 
    borderTopRightRadius: 5, 
    borderBottomLeftRadius: 5
  },
  title: {
    fontSize: 36, 
    color: '#fff', 
    fontWeight: 'bold'
  },
  bottomArea: {
    flex: 1, 
    backgroundColor: '#fff', 
    borderRadius: 10
  },
  dataArea: {
    flex: 1, 
    flexDirection: 'row', 
    flexWrap: 'wrap'
  },
  data: {
    width: '33.33%', 
    height: 200,
    justifyContent: 'center', 
    alignItems: 'center'
  },
  dataBox: {
    minWidth: 160, 
    height: 160, 
    borderRadius: 6
  },
  dataBox_top: {
    flex: 1, 
    justifyContent: 'center'
  },
  dataBox_top_text: {
    fontSize: 24, 
    color: '#000', 
    textAlign: 'center'
  },
  dataBox_center: {
    flex: 1 
  },
  dataBox_center_text: {
    textAlign: 'center', 
    fontSize: 40, 
    fontWeight: 'bold',
    color: '#000'
  },
  dataBox_bottom: {
    flex: 1, 
    alignItems: 'center',
    justifyContent: 'center', 
    flexDirection: 'row'
  },
  dataBox_bottom_text: {
    paddingLeft: 5,
    textAlign: 'center', 
    fontSize: 22, 
    color: '#000'
  },
  loadingArea: {
    flex: 1, 
    justifyContent: 'center'
  }
});

export default DataOverview;