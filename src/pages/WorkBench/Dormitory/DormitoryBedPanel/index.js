import React, {useState, useRef} from "react";
import { View, Text, StyleSheet, ScrollView } from 'react-native';

import { DORMITORY_BED_OVERVIEW_LIST } from "../../../../utils/const";
import DataOverview from "./DataOverview";

const DormitoryBedPanel = () => {
  const scrollViewRef = useRef(null);

  const [overViewData, setOverViewData] = useState(DORMITORY_BED_OVERVIEW_LIST);
  const [overViewLoading, setOverViewLoading] = useState(false);

  const getOverViewData = async() => {
    setOverViewLoading(true);
    try {
      console.log('执行了getOverView这个函数');
    } catch (error) {
      toast.show(`出现预料之外的错误，请联系管理员处理`, { type: 'danger' });
    }finally{
      setOverViewLoading(false);
    }
  };

  return (
    <ScrollView ref={scrollViewRef} style={styles.screen}>
      <DataOverview
        data={overViewData} 
        loading={overViewLoading}
        getData={getOverViewData} 
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