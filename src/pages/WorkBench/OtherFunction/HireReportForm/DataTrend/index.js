import React, {useState, useEffect} from "react";
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity} from 'react-native';
import { Shadow } from 'react-native-shadow-2';
import { useDispatch } from 'react-redux';
import { useToast } from "react-native-toast-notifications";

import { 
  SUCCESS_CODE,
  COLOR_LIST,
  HIRE_DATA_TREND_TAB_LIST, 
  CHANEL_SOURCE_LIST, 
  HIRE_DATA_BOX_TAG_LIST, 
  THIS_WEEK_START, 
  THIS_WEEK_END, 
  LAST_WEEK_START, 
  LAST_WEEK_END, 
  THIS_MONTH_START, 
  THIS_MONTH_END, 
  ORIGIN_COMPARE_STATUS_LIST
} from "../../../../../utils/const";
import { openDialog } from "../../../../../redux/features/HireReport/HireReportDialog";
import HireReportFormApi from "../../../../../request/HireReportFormApi";

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
  companyList,
  storeList,
  recruiterList,
  supplierList
}) => {
  const dispatch = useDispatch();
  const toast = useToast();

  const [rangeDate, setRangeDate] = useState(thisWeek);
  const [selectedTab, setSelectedTab] = useState('company');
  const [searchOther, setSearchOther] = useState(false);
  const [searchContent, setSearchContent] = useState(originSearchContent);
  const [selectedState, setSelectedState] = useState(ORIGIN_COMPARE_STATUS_LIST); //状态
  const [selectedWay, setSelectedWay] = useState([]); //来源渠道
  const [selectedEnterprise, setSelectedEnterprise] = useState([]); //企业
  const [selectedStore, setSelectedStore] = useState([]); //门店
  const [selectedRecruiter, setSelectedRecruiter] = useState([]); //招聘员
  const [selectedSupplier, setSelectedSupplier] = useState([]); //供应商

  const [trendLoading, setTrendLoading] = useState(false);
  const [trendData, setTrendData] = useState([]);

  useEffect(() => {
    getTrendData(searchContent);
    //设置是否点亮筛选更多按钮；
    checkSearchOther();
  }, [searchContent])

  useEffect(() => {
    clearSearch();
  }, [selectedTab])

  useEffect(() => {
    console.log('trendData', trendData);
  }, [trendData])

  const checkSearchOther = () => {
    if(searchContent.companyIds.length || searchContent.recruiterIds.length || searchContent.signUpTypes.length || searchContent.storeIds.length || searchContent.supplierIds.length){
      setSearchOther(true);
    }else{
      setSearchOther(false);
    }
  };

  const getTrendData = async(search) => {
    setTrendLoading(true);
    console.log('getTrendData --> params', search)
    let res;
    try{
      switch(selectedTab){
        case 'company': 
          res = await HireReportFormApi.CompanyTrend(search);
          if(res.code !== SUCCESS_CODE){
            toast.show(`${res.msg}`, { type: 'danger' });
            return;
          }
          if(res.data.length){
            res.data.map(item => {
              item.label = companyList.filter(company => company.value === item.id)[0].label;
            });
          }
          break;
        case 'store':
          res = await HireReportFormApi.StoreTrend(search);
          if(res.code !== SUCCESS_CODE){
            toast.show(`${res.msg}`, { type: 'danger' });
            return;
          }
          if(res.data.length){
            res.data.map(item => {
              item.label = storeList.filter(store => store.storeId === item.id)[0].storeName;
            });
          }
          break;
        case 'recruiter':
          res = await HireReportFormApi.RecruiterTrend(search);
          if(res.code !== SUCCESS_CODE){
            toast.show(`${res.msg}`, { type: 'danger' });
            return;
          }
          if(res.data.length){
            res.data.map(item => {
              item.label = recruiterList.filter(recruiter => recruiter.value === item.id)[0].label;
            });
          }
          break;
        case 'supplier':
          res = await HireReportFormApi.SupplierTrend(search);
          if(res.code !== SUCCESS_CODE){
            toast.show(`${res.msg}`, { type: 'danger' });
            return;
          }
          if(res.data.length){
            res.data.map(item => {
              item.label = supplierList.filter(supplier => supplier.value === item.id)[0].label;
            });
          }
          break;
        case 'way':
          res = await HireReportFormApi.SignUpTypeTrend(search);
          if(res.code !== SUCCESS_CODE){
            toast.show(`${res.msg}`, { type: 'danger' });
            return;
          }
          if(res.data.length){
            res.data.map(item => {
              item.label = CHANEL_SOURCE_LIST.filter(chanel => chanel.value === item.id)[0].title;
            });
          }
          break;
      }
      setTrendData(res.data);
    }catch(error){
      console.log('error', error);
      toast.show(`出现预料之外的错误，请联系管理员处理`, { type: 'danger' });
    }finally{
      setTrendLoading(false);
    }
  };

  const confirm = (search) => {
    const {
      rangeTime: {startTime, endTime}, 
      selectState,
      selectWay,
      selectEnterprise,
      selectStore,
      selectRecruiter,
      selectSupplier
    } = search;

    //选择时间
    const changeRange = {startDate: startTime, endDate: endTime};
    const startDate = startTime;
    const endDate = endTime;
    setRangeDate(changeRange);

    //选择状态
    const status = selectState[0].value;
    setSelectedState(selectState);

    //选择来源渠道
    const signUpTypes = selectWay.map(item => item.value);
    setSelectedWay(selectWay);

    //选择企业
    const companyIds = selectEnterprise.map(item => item.value);
    setSelectedEnterprise(selectEnterprise);

    //选择门店
    const storeIds = selectStore.map(item => item.storeId);
    setSelectedStore(selectStore);

    //选择招聘员
    const recruiterIds = selectRecruiter.map(item => item.value);
    setSelectedRecruiter(selectRecruiter);

    //选择供应商
    const supplierIds = selectSupplier.map(item => item.value);
    setSelectedSupplier(selectSupplier);

    //调接口
    setSearchContent({
      startDate, 
      endDate, 
      status,
      signUpTypes, 
      companyIds, 
      storeIds, 
      recruiterIds, 
      supplierIds
    })
  };

  const tabOnPress = (tab) => setSelectedTab(tab.key);

  const clearSearch = () => {
    setSearchOther(false);
    setSelectedWay([]);
    setSelectedEnterprise([]);
    setSelectedStore([]);
    setSelectedRecruiter([]);
    setSelectedSupplier([]);
    setSearchContent({
      ...searchContent,
      signUpTypes: [],
      companyIds: [], 
      storeIds: [], 
      recruiterIds: [], 
      supplierIds: []
    });
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
    dispatch(openDialog(
      <FilterMoreOfTrend 
        confirm={confirm} 
        showType={selectedTab}
        rangeDate={rangeDate} 
        selectedState={selectedState}
        selectedWay={selectedWay}
        selectedEnterprise={selectedEnterprise}
        selectedStore={selectedStore}
        selectedRecruiter={selectedRecruiter}
        selectedSupplier={selectedSupplier}
      />
    ));
  };
  
  return (
    <Shadow style={{marginBottom: 32}}>
      <View style={styles.totalArea}>
        <View style={styles.titleArea}>
          <View style={styles.titleLine}></View>
          <Text style={styles.title}>招聘数据趋势</Text>
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
        <Tag 
          tagList={HIRE_DATA_BOX_TAG_LIST} 
          lastButton 
          filterMore={filterMore} 
          setTime={setTime} 
          rangeDate={rangeDate} 
          searchOther={searchOther} 
          clearSearch={clearSearch} 
        />
        <TrendForm 
          data={trendData} 
          loading={trendLoading} 
          selectedState={selectedState}
        />
        <View style={styles.bottomColorList}>
          {!!trendData.length && trendData.map((data, dataIndex) => (
            <View style={styles.colorArea}>
              <View style={[styles.circle, {backgroundColor: `${COLOR_LIST[dataIndex]}`}]}></View>
              <Text style={{fontSize: 22, color: `${COLOR_LIST[dataIndex]}`}}>{`${data.label}(${data.total})`}</Text>
            </View>
          ))}
        </View>
        <View style={styles.bottomMoreSearchArea}>
          {!!selectedState.length && <View style={styles.moreSearchArea}>
            <Text style={styles.moreSearchTitle}>已选状态：</Text>
            <Text style={styles.moreSearchText}>{selectedState[0].title}</Text>
          </View>}
          <View style={styles.moreSearchArea}>
            <Text style={styles.moreSearchTitle}>已选时间：</Text>
            <Text style={styles.moreSearchText}>{`${rangeDate.startDate.replace(/\-/g,"/")} ~ ${rangeDate.endDate.replace(/\-/g,"/")}`}</Text>
          </View>
          {!!selectedWay.length && <View style={styles.moreSearchArea}>
            <Text style={styles.moreSearchTitle}>已选来源渠道：</Text>
            <Text style={styles.moreSearchText}>{selectedWay.map(item => item.title).join('、')}</Text>
          </View>}
          {!!selectedStore.length && <View style={styles.moreSearchArea}>
            <Text style={styles.moreSearchTitle}>已选门店：</Text>
            <Text style={styles.moreSearchText}>{selectedStore.map(item => item.storeName).join('、')}</Text>
          </View>}
          {!!selectedRecruiter.length && <View style={styles.moreSearchArea}>
            <Text style={styles.moreSearchTitle}>已选招聘员：</Text>
            <Text style={styles.moreSearchText}>{selectedRecruiter.map(item => item.label).join('、')}</Text>
          </View>}
          {!!selectedSupplier.length && <View style={styles.moreSearchArea}>
            <Text style={styles.moreSearchTitle}>已选供应商：</Text>
            <Text style={styles.moreSearchText}>{selectedSupplier.map(item => item.label).join('、')}</Text>
          </View>}
          {!!selectedEnterprise.length && <View style={styles.moreSearchArea}>
            <Text style={styles.moreSearchTitle}>已选企业：</Text>
            <Text style={styles.moreSearchText}>{selectedEnterprise.map(item => item.label).join('、')}</Text>
          </View>}
        </View>
      </View>
    </Shadow>
  )
};

const styles = StyleSheet.create({
  totalArea: {
    width: 686,
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