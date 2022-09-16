import React, {useState, useEffect, useMemo} from "react";
import { View, StyleSheet, ScrollView } from 'react-native';
import { useToast } from "react-native-toast-notifications";

import DataOverview from "./DataOverview";
import DataTrend from "./DataTrend";
import DataCompare from "./DataCompare";
import DataPercent from "./DataPercent";
import HireReportFormApi from "../../../../request/HireReportFormApi";

import HireReportDialog from "../../../../components/HireReportDialog";
import { SUCCESS_CODE, ORIGIN_HIRE_REPORT_OVERVIEW_LIST } from "../../../../utils/const";

const HireReportForm = () => {
  const toast = useToast();

  const [overViewData, setOverViewData] = useState(ORIGIN_HIRE_REPORT_OVERVIEW_LIST);
  const [loading, setLoading] = useState(false);
  const [trendData, setTrendData] = useState();
  const [trendLoading, setTrendLoading] = useState(false);

  const getOverView = async(range) => {
    setLoading(true);
    try {
      const res = await HireReportFormApi.Overview(range);
      if(res.code !== SUCCESS_CODE){
        toast.show(`${res.msg}`, { type: 'danger' });
        return;
      }
      const resData = [
        {
          title: '报名人数',
          type: 'SIGN_UP',
          num: res.data.signUpNum,
          trendNumber: res.data.signUpNumD
        },
        {
          title: '面试人数',
          type: 'INTERVIEW',
          num: res.data.interviewNum,
          trendNumber: res.data.interviewNumD
        },
        {
          title: '待入职人数',
          type: 'WAIT_TO_ENTRY',
          num: res.data.onBoardingNum,
          trendNumber: res.data.onBoardingNumD
        },
        {
          title: '入职人数',
          type: 'JOB_IN',
          num: res.data.jobNum,
          trendNumber: res.data.jobNumD
        },
        {
          title: '离职人数',
          type: 'LEAVING',
          num: res.data.resignNum,
          trendNumber: res.data.resignNumD
        },
        {
          title: '在职人数',
          type: 'NOW',
          num: res.data.jobOnNum,
          trendNumber: res.data.jobOnNumD
        }
      ];
      setOverViewData(resData);
    } catch (error) {
      toast.show(`出现预料之外的错误，请联系管理员处理`, { type: 'danger' });
    }finally{
      setLoading(false);
    }
  };

  const getTrendData = async(range) => {
    setTrendLoading(true);
    console.log('range', range);
    try{
      let res = await HireReportFormApi.LineData(range);
      if(res.code !== SUCCESS_CODE){
        toast.show(`${res.msg}`, { type: 'danger' });
        return;
      }
      setTrendData(res.data);
    }catch(error){
      console.log('error', error);
      toast.show(`出现预料之外的错误，请联系管理员处理`, { type: 'danger' });
    }finally{
      setTrendLoading(false);
    }
  };

  return (
    <ScrollView style={styles.screen}>
      <View style={styles.allComponents}>
        <DataOverview
          data={overViewData} 
          loading={loading}
          getData={getOverView} 
        />
        <DataTrend
          data={trendData} 
          loading={trendLoading}
          getData={getTrendData} 
        />
        <DataCompare />
        <DataPercent />
      </View>
      <HireReportDialog/>
    </ScrollView>
  )
};

const styles = StyleSheet.create({
  screen: {
    flex: 1
  },
  allComponents: {
    flexDirection: 'column', 
    alignItems: 'center', 
    paddingTop: 32
  }
});

export default HireReportForm;