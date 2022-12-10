import React, {useState, useRef} from "react";
import { View, Text, StyleSheet, ScrollView } from 'react-native';

import { DORMITORY_BED_OVERVIEW_LIST } from "../../../../utils/const";

import DataCompare from "./DataCompare";
import DataOverview from "./DataOverview";

const DormitoryBedPanel = () => {
  const scrollViewRef = useRef(null);

  const [overViewData, setOverViewData] = useState(DORMITORY_BED_OVERVIEW_LIST);
  const [overViewLoading, setOverViewLoading] = useState(false);

  const [compareData, setCompareData] = useState([]);
  const [compareLoading, setCompareLoading] = useState(false);

  const [showDataTrend, setShowDataTrend] = useState(false); //数据趋势
  const [showDataCompare, setShowDataCompare] = useState(false); //数据对比
  const [showBuildingCompare, setShowBuildingCompare] = useState(false); //楼栋住宿对比
  const [showCompanyCompare, setShowCompanyCompare] = useState(false); //企业住宿对比

  const getOverViewData = async() => {
    setOverViewLoading(true);
    try {
      console.log('执行了getOverView这个函数');
    } catch (error) {
      toast.show(`出现预料之外的错误，请联系管理员处理`, { type: 'danger' });
    }finally{
      getCompareData();
      setOverViewLoading(false);
    }
  };

  const getCompareData = async() => {
    setCompareLoading(true);
    try {
      console.log('执行了getCompareData这个函数');
    } catch (error) {
      toast.show(`出现预料之外的错误，请联系管理员处理`, { type: 'danger' });
    }finally{
      setCompareLoading(false);
    }
  };

  return (
    <ScrollView ref={scrollViewRef} style={styles.screen}>
      <DataOverview
        data={overViewData} 
        loading={overViewLoading}
        getData={getOverViewData} 
      />
      <DataCompare 
        data={compareData}
        loading={compareLoading}
        getData={getCompareData}
      />
    </ScrollView>
  )
};

const styles = StyleSheet.create({
  screen: {
    flex: 1
  }
});

export default DormitoryBedPanel;