import React, {useState, useEffect, createContext, useRef} from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useToast } from "react-native-toast-notifications";
import { useSelector } from 'react-redux';

import DataOverview from "./DataOverview";
import DataTrend from "./DataTrend";
import DataCompare from "./DataCompare";
import DataPercent from "./DataPercent";

import MyMembersApi from "../../../../request/MyMembersApi";
import { SUCCESS_CODE } from "../../../../utils/const";
import HireReportDialog from "../../../../components/HireReportDialog";

export const DataList = createContext({});

const HireReportForm = () => {
  const toast = useToast();
  const dialogRef = useRef(null);

  const [dataList, setDataList] = useState([]);
  const [dialogContent, setDialogContent] = useState({});

  //招聘看板中的筛选框开关

  useEffect(() => {
    // getDataList();
  }, [])

  const getDataList = async() => {
    try{  
      const companyRes = await MyMembersApi.CompaniesList();
      const storeRes = await MyMembersApi.StoreList();
      console.log('storeRes', storeRes);
      if(companyRes.code !== SUCCESS_CODE){
        toast.show(`获取企业列表失败，${res.msg}`, { type: 'danger' });
        return;
      }
      const resList = {
        companyList: companyRes.data,
        storeList: storeRes.data,
        dialogRef,
        setDialogContent
      }
      setDataList(resList);
    }catch(err){
      console.log('err', err);
      toast.show(`获取企业列表失败，请稍后重试`, { type: 'danger' });
    }
  };

  return (
    <>
      <ScrollView style={styles.screen}>
        <View style={{flex: 1, flexDirection: 'column', alignItems: 'center', paddingTop: 32}}>
          <DataOverview />
          <DataList.Provider value={dataList}>
            <DataTrend />
          </DataList.Provider>
          {/* <DataCompare />
          <DataPercent /> */}
        </View>
      </ScrollView>
      <HireReportDialog/>
    </>
  )
};

const styles = StyleSheet.create({
  screen: {
    flex: 1
  }
});

export default HireReportForm;