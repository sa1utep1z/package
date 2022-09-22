import React, {useState, useEffect} from "react";
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity} from 'react-native';
import { Shadow } from 'react-native-shadow-2';
import { useDispatch } from 'react-redux';

import { COLOR_LIST, HIRE_DATA_BOX_TAG_LIST, THIS_WEEK_START, THIS_WEEK_END, LAST_WEEK_START, LAST_WEEK_END, THIS_MONTH_START, THIS_MONTH_END, ORIGIN_SELECTED_STATUS_LIST } from "../../../../../utils/const";
import { openDialog } from "../../../../../redux/features/HireReport/HireReportDialog";

import Tag from "./Tag";
import TrendForm from "./TrendForm";
import FilterMoreOfTrend from "./FilterMoreOfTrend";

const thisWeek = {startDate: THIS_WEEK_START, endDate: THIS_WEEK_END};
const lastWeek = {startDate: LAST_WEEK_START, endDate: LAST_WEEK_END};
const thisMonth = {startDate: THIS_MONTH_START, endDate: THIS_MONTH_END};

const DataTrend = ({
  data,
  loading,
  getData
}) => {
  const dispatch = useDispatch();

  const [rangeDate, setRangeDate] = useState(thisWeek);
  const [searchOther, setSearchOther] = useState(false);
  const [searchContent, setSearchContent] = useState({
    ...thisWeek
  });
  const [selectedState, setSelectedState] = useState(ORIGIN_SELECTED_STATUS_LIST); //状态
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
    if(searchContent.companyId || searchContent.recruiterId || searchContent.signUpType || searchContent.storeId || searchContent.supplierId){
      setSearchOther(true);
    }else{
      setSearchOther(false);
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
    setSelectedState(selectState);

    //选择来源渠道
    const signUpType = selectWay.value;
    setSelectedWay(selectWay);

    //选择企业
    const companyId = selectEnterprise.value;
    setSelectedEnterprise(selectEnterprise);

    //选择门店
    const storeId = selectStore.storeId;
    setSelectedStore(selectStore);

    //选择招聘员
    const recruiterId = selectRecruiter.value;
    setSelectedRecruiter(selectRecruiter);

    //选择供应商
    const supplierId = selectSupplier.value;
    setSelectedSupplier(selectSupplier);

    //调接口
    setSearchContent({
      startDate, 
      endDate, 
      signUpType, 
      companyId, 
      storeId, 
      recruiterId, 
      supplierId
    })
  };

  const clearSearch = () => {
    setSearchOther(false);
    setSelectedWay({});
    setSelectedEnterprise({});
    setSelectedStore({});
    setSelectedRecruiter({});
    setSelectedSupplier({});
    setSearchContent({
      ...searchContent,
      signUpType: '',
      companyId: '', 
      storeId: '', 
      recruiterId: '', 
      supplierId: ''
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
        <TrendForm 
          data={data} 
          loading={loading} 
          selectedState={selectedState}
        />
        <View style={styles.bottomColorList}>
          {!!selectedState.length && selectedState.map((status, statusIndex) => {
            return (
              <View style={styles.colorArea}>
                <View style={[styles.circle, {backgroundColor: `${COLOR_LIST[statusIndex]}`}]}></View>
                <Text style={{fontSize: 22, color: `${COLOR_LIST[statusIndex]}`}}>{status.title}</Text>
              </View>
          )})}
        </View>
        <View style={styles.bottomMoreSearchArea}>
          <View style={styles.moreSearchArea}>
            <Text style={styles.moreSearchTitle}>已选时间：</Text>
            <Text style={styles.moreSearchText}>{`${rangeDate.startDate.replace(/\-/g,"/")} ~ ${rangeDate.endDate.replace(/\-/g,"/")}`}</Text>
          </View>
          {!!selectedState.length && <View style={styles.moreSearchArea}>
            <Text style={styles.moreSearchTitle}>已选状态：</Text>
            <Text style={styles.moreSearchText}>{selectedState.map(item => item.title).join('、')}</Text>
          </View>}
          {selectedWay.value && <View style={styles.moreSearchArea}>
            <Text style={styles.moreSearchTitle}>已选来源渠道：</Text>
            <Text style={styles.moreSearchText}>{selectedWay.title}</Text>
          </View>}
          {selectedStore.storeId && <View style={styles.moreSearchArea}>
            <Text style={styles.moreSearchTitle}>已选门店：</Text>
            <Text style={styles.moreSearchText}>{selectedStore.storeName}</Text>
          </View>}
          {selectedRecruiter.value && <View style={styles.moreSearchArea}>
            <Text style={styles.moreSearchTitle}>已选招聘员：</Text>
            <Text style={styles.moreSearchText}>{selectedRecruiter.label}</Text>
          </View>}
          {selectedSupplier.value && <View style={styles.moreSearchArea}>
            <Text style={styles.moreSearchTitle}>已选供应商：</Text>
            <Text style={styles.moreSearchText}>{selectedSupplier.label}</Text>
          </View>}
          {selectedEnterprise.value && <View style={styles.moreSearchArea}>
            <Text style={styles.moreSearchTitle}>已选企业：</Text>
            <Text style={styles.moreSearchText}>{selectedEnterprise.label}</Text>
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
  }
});

export default DataTrend;