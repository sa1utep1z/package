import React, {useState, useEffect} from "react";
import { View, Text, StyleSheet } from 'react-native';
import { Shadow } from 'react-native-shadow-2';
import { useDispatch } from 'react-redux';
import { useToast } from "react-native-toast-notifications";

import { 
  SUCCESS_CODE,
  COLOR_LIST,
  HIRE_DATA_BOX_TAG_LIST, 
  THIS_WEEK_START, 
  THIS_WEEK_END, 
  LAST_WEEK_START, 
  LAST_WEEK_END, 
  THIS_MONTH_START, 
  THIS_MONTH_END, 
  ORIGIN_COMPARE_STATUS_LIST
} from "../../../../../utils/const";
import { openDialog, setTitle } from "../../../../../redux/features/PageDialog";

import Tag from "./Tag";
import TrendForm from "./TrendForm";
import FilterMoreOfTrend from "./FilterMoreOfTrend";

const thisWeek = {startDate: THIS_WEEK_START, endDate: THIS_WEEK_END};
const lastWeek = {startDate: LAST_WEEK_START, endDate: LAST_WEEK_END};
const thisMonth = {startDate: THIS_MONTH_START, endDate: THIS_MONTH_END};
const originSearchContent = {
  ...thisWeek,
  status: 'onBoardingPass',
  signUpTypes: [],
  companyIds: [], 
  storeIds: [], 
  recruiterIds: [], 
  supplierIds: []
};

const DataTrend = ({
}) => {
  const dispatch = useDispatch();
  const toast = useToast();

  const [rangeDate, setRangeDate] = useState(thisWeek);
  const [searchOther, setSearchOther] = useState(false);
  const [searchContent, setSearchContent] = useState(originSearchContent);
  const [selectedState, setSelectedState] = useState(ORIGIN_COMPARE_STATUS_LIST); //状态

  const [trendLoading, setTrendLoading] = useState(false);
  const [trendData, setTrendData] = useState([]);

  useEffect(() => {
    getTrendData(searchContent);
    //设置是否点亮筛选更多按钮；
    checkSearchOther();
  }, [searchContent])

  const checkSearchOther = () => {
    if(searchContent.companyIds.length || searchContent.recruiterIds.length || searchContent.signUpTypes.length || searchContent.storeIds.length || searchContent.supplierIds.length){
      setSearchOther(true);
    }else{
      setSearchOther(false);
    }
  };

  const getTrendData = async(search) => {
    try{
      setTrendLoading(true);
    }catch(error){
      console.log('error', error);
      toast.show(`出现预料之外的错误，请联系管理员处理`, { type: 'danger' });
    }finally{
      setTrendLoading(false);
    }
  };

  const confirm = (search) => {
    console.log('confirm', search);
  };

  const clearSearch = () => {
    console.log('执行清除');
  };

  const setTime = (range) => {
    setSearchOther(false);
    switch(range.value){
      case 'thisWeek': 
        setRangeDate(thisWeek);
        setSearchContent({...searchContent, ...thisWeek});
        break;
      case 'lastWeek':
        setRangeDate(lastWeek);
        setSearchContent({...searchContent, ...lastWeek});
        break;
      case 'thisMonth':
        setRangeDate(thisMonth);
        setSearchContent({...searchContent, ...thisMonth});
        break;
    }
  };

  const filterMore = () => {
    dispatch(setTitle('筛选更多'));
    dispatch(openDialog(<FilterMoreOfTrend confirm={confirm} rangeDate={rangeDate} />));
  };
  
  return (
    <View style={styles.totalArea}>
      <View style={styles.titleArea}>
        <View style={styles.titleLine}></View>
        <Text style={styles.title}>数据趋势</Text>
      </View>
      <Tag 
        tagList={HIRE_DATA_BOX_TAG_LIST} 
        lastButton 
        filterMore={filterMore} 
        setTime={setTime} 
        rangeDate={rangeDate} 
        searchOther={searchOther} 
        clearSearch={clearSearch} 
      />
      <TrendForm data={trendData} loading={trendLoading}/>
      <View style={styles.bottomColorList}>
        {!!trendData.length && trendData.map((data, dataIndex) => (
          <View style={styles.colorArea}>
            <View style={[styles.circle, {backgroundColor: `${COLOR_LIST[dataIndex]}`}]}></View>
            <Text style={{fontSize: 22, color: `${COLOR_LIST[dataIndex]}`}}>{`${data.label}(${data.total})`}</Text>
          </View>
        ))}
      </View>
      <View style={{borderWidth: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', marginBottom: 20}}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View style={[styles.circle, {backgroundColor: `#409EFF`}]}></View>
          <Text style={{fontSize: 22, color: `#409EFF`, marginRight: 20}}>常规住宿（20）</Text> 
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View style={[styles.circle, {backgroundColor: `#7640FF`}]}></View>
          <Text style={{fontSize: 22, color: `#7640FF`, marginRight: 20}}>离宿（30）</Text> 
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View style={[styles.circle, {backgroundColor: `#7640FF`}]}></View>
          <Text style={{fontSize: 22, color: `#7640FF`, marginRight: 20}}>离宿（40）</Text> 
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View style={[styles.circle, {backgroundColor: `#FF4348`}]}></View>
          <Text style={{fontSize: 22, color: `#FF4348`, marginRight: 20}}>空床位数（50）</Text> 
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View style={[styles.circle, {backgroundColor: `#FF4348`}]}></View>
          <Text style={{fontSize: 22, color: `#FF4348`, marginRight: 20}}>空床位数（60）</Text> 
        </View>
      </View>
      <View style={styles.bottomMoreSearchArea}>
        <View style={styles.moreSearchArea}>
          <Text style={styles.moreSearchTitle}>已选时间：</Text>
          <Text style={styles.moreSearchText}>{`${rangeDate.startDate.replace(/\-/g,"/")} ~ ${rangeDate.endDate.replace(/\-/g,"/")}`}</Text>
        </View>
      </View>
    </View>
  )
};

const styles = StyleSheet.create({
  totalArea: {
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 30
  },
  titleArea: {
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
  bottomColorList: {
    marginBottom: 40, 
    flexDirection: 'row'
  },
  colorArea: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  circle: {
    width: 15, 
    height: 15, 
    borderRadius: 50, 
    marginRight: 10,
  },
  bottomMoreSearchArea: {
    flexDirection: 'row', 
    flexWrap: 'wrap'
  },
  moreSearchArea: {
    flexDirection: 'row', 
    paddingRight: 20, 
    paddingBottom: 10
  },
  moreSearchTitle: {
    fontSize: 26, 
    color: '#000000'
  },
  moreSearchText: {
    fontSize: 26, 
    borderBottomWidth: 1, 
    borderColor: '#EFEFEF', 
    color: '#409EFF', 
    paddingLeft: 5
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