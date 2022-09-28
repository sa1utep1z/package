import React, {useState, useEffect, useRef} from "react";
import { View, StyleSheet, ScrollView } from 'react-native';
import { useToast } from "react-native-toast-notifications";
import { useDispatch } from 'react-redux';

import DataOverview from "./DataOverview";
import DataTrend from "./DataTrend";
import DataCompare from "./DataCompare";
import DataPercent from "./DataPercent";

import HireReportFormApi from "../../../../request/HireReportFormApi";
import MyMembersApi from "../../../../request/MyMembersApi";
import HireReportDialog from "../../../../components/HireReportDialog";
import { closeDialog } from "../../../../redux/features/HireReport/HireReportDialog";
import { SUCCESS_CODE, ORIGIN_HIRE_REPORT_OVERVIEW_LIST } from "../../../../utils/const";

const HireReportForm = () => {
  const dispatch = useDispatch();
  const toast = useToast();

  const scrollViewRef = useRef(null);

  const [overViewData, setOverViewData] = useState(ORIGIN_HIRE_REPORT_OVERVIEW_LIST);
  const [overViewLoading, setOverViewLoading] = useState(false);

  
  const [compareData, setCompareData] = useState([]);
  const [compareLoading, setCompareLoading] = useState(false);

  const [percentData, setPercentData] = useState([]);
  const [percentLoading, setPercentLoading] = useState(false);

  const [companyList, setCompanyList] = useState([]);
  const [storeList, setStoreList] = useState([]);
  const [recruiterList, setRecruiterList] = useState([]);
  const [supplierList, setSupplierList] = useState([]);

  useEffect(() => {
    getCompanyList();
    getStoreList();
    getRecruiterList();
    getSupplierList();
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
    setPercentLoading(true);
    let res;
    try{
      switch(type){
        case 'company':
          res = await HireReportFormApi.Company(search);
          break;
        case 'store':
          res = await HireReportFormApi.Store(search);
          break;
        case 'recruiter':
          res = await HireReportFormApi.Recruiter(search);
          break;
        case 'supplier':
          res = await HireReportFormApi.Supplier(search);
          break;
        case 'supplier':
          res = await HireReportFormApi.Supplier(search);
          break;
        case 'way':
          res = await HireReportFormApi.SignUpType(search);
          break;
      }
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

  //获取企业列表
  const getCompanyList = async() => {
    try{  
      const res = await MyMembersApi.CompaniesList();
      console.log('getCompanyList -->res', res);
      if(res.code !== SUCCESS_CODE){
        toast.show(`获取企业列表失败，${res.msg}`, { type: 'danger' });
        return;
      }
      setCompanyList(res.data);
    }catch(err){
      toast.show(`获取企业列表失败，请稍后重试`, { type: 'danger' });
      console.log('getCompanyList --> err', err);
    }
  };

  //获取门店列表
  const getStoreList = async() => {
    try{  
      const res = await HireReportFormApi.StoreList();
      console.log('getStoreList --> res', res);
      if(res.code !== SUCCESS_CODE){
        toast.show(`获取门店列表失败，${res.msg}`, { type: 'danger' });
        return;
      }
      setStoreList(res.data);
    }catch(err){
      toast.show(`获取门店列表失败，请稍后重试`, { type: 'danger' });
      console.log('getStoreList --> err', err);
    }
  };

  //获取招聘员列表
  const getRecruiterList = async() => {
    try{  
      const res = await HireReportFormApi.RecruiterList();
      console.log('getRecruiterList --> res', res)
      if(res.code !== SUCCESS_CODE){
        toast.show(`获取招聘员列表失败，${res.msg}`, { type: 'danger' });
        return;
      }
      setRecruiterList(res.data);
    }catch(err){
      toast.show(`获取招聘员列表失败，请稍后重试`, { type: 'danger' });
      console.log('getRecruiterList --> err', err);
    }
  };

  //获取供应商列表
  const getSupplierList = async() => {
    try{  
      const res = await HireReportFormApi.SupplierList();
      console.log('getSupplierList --> res', res)
      if(res.code !== SUCCESS_CODE){
        toast.show(`获取供应商列表失败，${res.msg}`, { type: 'danger' });
        return;
      }
      setSupplierList(res.data);
    }catch(err){
      toast.show(`获取供应商列表失败，请稍后重试`, { type: 'danger' });
      console.log('getSupplierList --> err', err);
    }
  };

  return (
    <ScrollView ref={scrollViewRef} style={styles.screen}>
      <View style={styles.allComponents}>
        <DataOverview
          data={overViewData} 
          loading={overViewLoading}
          getData={getOverView} 
        />
        {companyList.length ? <DataTrend
          companyList={companyList}
          storeList={storeList}
          recruiterList={recruiterList}
          supplierList={supplierList}
        /> : <></>}
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