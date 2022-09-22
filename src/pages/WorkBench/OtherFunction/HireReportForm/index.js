import React, {useState, useEffect, useRef} from "react";
import { View, StyleSheet, ScrollView } from 'react-native';
import { useToast } from "react-native-toast-notifications";
import { useDispatch } from 'react-redux';

import DataOverview from "./DataOverview";
import DataTrend from "./DataTrend";
import DataCompare from "./DataCompare";
import DataPercent from "./DataPercent";

import HireReportFormApi from "../../../../request/HireReportFormApi";
import HireReportDialog from "../../../../components/HireReportDialog";
import { closeDialog } from "../../../../redux/features/HireReport/HireReportDialog";
import { SUCCESS_CODE, ORIGIN_HIRE_REPORT_OVERVIEW_LIST } from "../../../../utils/const";

const HireReportForm = () => {
  const dispatch = useDispatch();
  const toast = useToast();

  const scrollViewRef = useRef(null);

  const [overViewData, setOverViewData] = useState(ORIGIN_HIRE_REPORT_OVERVIEW_LIST);
  const [overViewLoading, setOverViewLoading] = useState(false);

  const [trendData, setTrendData] = useState({});
  const [trendLoading, setTrendLoading] = useState(false);
  
  const [compareData, setCompareData] = useState([]);
  const [compareLoading, setCompareLoading] = useState(false);

  const [percentData, setPercentData] = useState([]);
  const [percentLoading, setPercentLoading] = useState(false);

  useEffect(() => {
    return () => dispatch(closeDialog());
  }, [])

  const getOverView = async(range) => {
    setOverViewLoading(true);
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
      setOverViewLoading(false);
    }
  };

  const getTrendData = async(search) => {
    setTrendLoading(true);
    try{
      let res = await HireReportFormApi.LineData(search);
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

  const getCompareData = async(search) => {
    setCompareLoading(true);
    const range1 = search[0];
    const range2 = search[1];
    try{
      let res1 = await HireReportFormApi.LineData(range1);
      let res2 = await HireReportFormApi.LineData(range2);
      if(res1.code !== SUCCESS_CODE || res2.code !== SUCCESS_CODE){
        toast.show(`${res1.msg}`, { type: 'danger' });
        return;
      }
      setCompareData([res1.data, res2.data]);
    }catch(error){
      console.log('error', error);
      toast.show(`出现预料之外的错误，请联系管理员处理`, { type: 'danger' });
    }finally{
      setCompareLoading(false);
    }
  };

  const getPercentData = async(type, search) => {
    console.log('search', search);
    let res;
    setPercentLoading(true);
    try{
      switch(type){
        case 'company':
          res = await HireReportFormApi.Company(search);
          break;
        case 'store':
          res = await HireReportFormApi.Store(search);
          break;
        case 'recruiter':
          console.log('招聘员')
          res = await HireReportFormApi.Recruiter(search);
          break;
        case 'supplier':
          console.log('供应商')
          res = await HireReportFormApi.Supplier(search);
          break;
      }
      console.log('res', res);
      if(res.code !== SUCCESS_CODE){
        toast.show(`${res.msg}`, { type: 'danger' });
        return;
      }
      setPercentData(res.data);
    }catch(error){
      console.log('error', error);
      toast.show(`出现预料之外的错误，请联系管理员处理`, { type: 'danger' });
    }finally{
      setPercentLoading(false);
    }
  }

  return (
    <ScrollView ref={scrollViewRef} style={styles.screen}>
      <View style={styles.allComponents}>
        <DataOverview
          data={overViewData} 
          loading={overViewLoading}
          getData={getOverView} 
        />
        <DataTrend
          data={trendData} 
          loading={trendLoading}
          getData={getTrendData} 
        />
        <DataCompare 
          data={compareData}
          loading={compareLoading}
          getData={getCompareData}
        />
        <DataPercent 
          data={percentData}
          loading={percentLoading}
          getData={getPercentData}
          scrollViewRef={scrollViewRef}
        />
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