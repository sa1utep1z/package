import React, {useState, useEffect} from "react";
import { View, Text, StyleSheet } from 'react-native';
import { Shadow } from 'react-native-shadow-2';
import { useDispatch } from 'react-redux';

import { COLOR_LIST, HIRE_DATA_COMPARE_TAB_LIST, THIS_WEEK_START, THIS_WEEK_END, LAST_WEEK_START, LAST_WEEK_END, THIS_MONTH_START, THIS_MONTH_END, LAST_MONTH_START, LAST_MONTH_END, ORIGIN_COMPARE_STATUS_LIST } from "../../../../../utils/const";
import { openDialog, setTitle } from "../../../../../redux/features/PageDialog";

import Tag from "./Tag";
import CompareForm from "./CompareForm";
import FilterMoreOfCompare from "./FilterMoreOfCompare";

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

const DataCompare = ({
  data,
  loading,
  getData
}) => {
  const dispatch = useDispatch();

  const [rangeDate, setRangeDate] = useState(thisWeekVSlastWeek);
  const [rangeList, setRangeList] = useState(['', '']);
  const [searchOther, setSearchOther] = useState(false);
  const [searchContent, setSearchContent] = useState([
    {
      startDate: THIS_WEEK_START, 
      endDate: THIS_WEEK_END
    },
    {
      startDate: LAST_WEEK_START, 
      endDate: LAST_WEEK_END
    }
  ]);
  const [selectedState, setSelectedState] = useState(ORIGIN_COMPARE_STATUS_LIST); //状态
  const [selectedWay, setSelectedWay] = useState({}); //来源渠道
  const [selectedEnterprise, setSelectedEnterprise] = useState({}); //企业
  const [selectedStore, setSelectedStore] = useState({}); //门店
  const [selectedRecruiter, setSelectedRecruiter] = useState({}); //招聘员
  const [selectedSupplier, setSelectedSupplier] = useState({}); //供应商

  useEffect(() => {
    getData(searchContent);
    //设置是否点亮筛选更多按钮；
    checkSearchOther();
  }, [searchContent])

  const checkSearchOther = () => {
    if(searchContent[0].companyId || searchContent[0].recruiterId || searchContent[0].signUpType || searchContent[0].storeId || searchContent[0].supplierId){
      setSearchOther(true);
    }else{
      setSearchOther(false);
    }
  };
  
  const confirm = (search) => {
    console.log('search', search);
  };

  //父组件将获取到选择的时间范围收集起来再传给图表组件，用作展示
  const showRangeData = (timeRange) => {
    setRangeList(timeRange);
  };

  const clearSearch = () => {
    setSearchOther(false);
    setSelectedWay({});
    setSelectedEnterprise({});
    setSelectedStore({});
    setSelectedRecruiter({});
    setSelectedSupplier({});

    const otherSearch = {
      signUpType: '',
      companyId: '', 
      storeId: '', 
      recruiterId: '', 
      supplierId: ''
    };

    const newSearch = [
      {...rangeDate.lastRange, ...otherSearch},
      {...rangeDate.thisRange, ...otherSearch},
    ];

    setSearchContent(newSearch);
  };

  const setTime = (range) => {
    setSearchOther(false);
    switch(range.value){
      case 'thisWeekVSlastWeek': 
        setRangeDate(thisWeekVSlastWeek);
        setSearchContent([
          {...thisWeekVSlastWeek.thisRange},
          {...thisWeekVSlastWeek.lastRange}
        ]);
        break;
      case 'thisMonthVSlastMonth':
        setRangeDate(thisMonthVSlastMonth);
        setSearchContent([
          {...thisMonthVSlastMonth.thisRange},
          {...thisMonthVSlastMonth.lastRange}
        ]);
        break;
    }
  };

  //这里是弹框的组件；
  const filterMore = () => {
    dispatch(setTitle('筛选更多'));
    dispatch(openDialog(<FilterMoreOfCompare confirm={confirm} rangeDate={rangeDate}/>));
  };
  
  return (
    <View style={styles.totalArea}>
      <View style={styles.titleArea}>
        <View style={styles.titleLine}></View>
        <Text style={styles.title}>同期数据对比</Text>
      </View>
      <Tag 
        tagList={HIRE_DATA_COMPARE_TAB_LIST} 
        lastButton 
        filterMore={filterMore} 
        setTime={setTime} 
        rangeDate={rangeDate} 
        searchOther={searchOther}
        showRangeData={showRangeData}
        clearSearch={clearSearch} 
      />
      <CompareForm
        data={data}
        rangeList={rangeList}
        loading={loading}
        selectedState={selectedState}
      /> 
      <View style={styles.bottomColorList}>
        {rangeList.map((range, rangeNameIndex) => {
          const rangeName = range.length ? range : `${rangeNameIndex === 0 ? `${rangeDate.thisRange.startDate.substring(rangeDate.thisRange.startDate.length - 5)}~${rangeDate.thisRange.endDate.substring(rangeDate.thisRange.endDate.length - 5)}` : `${rangeDate.lastRange.startDate.substring(rangeDate.lastRange.startDate.length - 5)}~${rangeDate.lastRange.endDate.substring(rangeDate.lastRange.endDate.length - 5)}`}`;
          return (
            <View key={rangeNameIndex} style={styles.colorArea}>
              <View style={[styles.circle, {backgroundColor: `${COLOR_LIST[rangeNameIndex]}`}]}></View>
              <Text style={{fontSize: 22, color: `${COLOR_LIST[rangeNameIndex]}`}}>{rangeName}({data.length ? data[rangeNameIndex].total[selectedState[0].value] : 0})</Text> 
            </View>
        )})}
      </View>
      <View style={styles.bottomMoreSearchArea}>
        <View style={styles.moreSearchArea}>
          <Text style={styles.moreSearchTitle}>已选时间：</Text>
          <Text style={styles.moreSearchText}>{`${rangeDate.thisRange.startDate.substring(rangeDate.thisRange.startDate.length - 5).replace(/\-/g,"/")}~${rangeDate.thisRange.endDate.substring(rangeDate.thisRange.endDate.length - 5).replace(/\-/g,"/")} VS ${rangeDate.lastRange.startDate.substring(rangeDate.lastRange.startDate.length - 5).replace(/\-/g,"/")}~${rangeDate.lastRange.endDate.substring(rangeDate.lastRange.endDate.length - 5).replace(/\-/g,"/")}`}</Text>
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
  touchArea: {
    flex: 1, 
    justifyContent: 'center',
    borderBottomWidth: 2,
    borderColor: '#EEEEEE'
  },
  touchArea_text: {
    textAlign: 'center', 
    fontSize: 28
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
  }
});

export default DataCompare;