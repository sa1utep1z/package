import React, {useState, useEffect} from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useToast } from "react-native-toast-notifications";

import DataOverview from "./DataOverview";
import DataTrend from "./DataTrend";
import DataCompare from "./DataCompare";
import DataPercent from "./DataPercent";

import MyMembersApi from "../../../../request/MyMembersApi";
import { SUCCESS_CODE } from "../../../../utils/const";

const HireReportForm = () => {
  const toast = useToast();

  const [companiesList, setCompaniesList] = useState([]);

  useEffect(() => {
    getCompaniesList();
  }, [])

  const getCompaniesList = async() => {
    try{  
      const res = await MyMembersApi.CompaniesList();
      if(res.code !== SUCCESS_CODE){
        toast.show(`获取企业列表失败，${res.msg}`, { type: 'danger' });
        return;
      }
      setCompaniesList(res.data);
    }catch(err){
      toast.show(`获取企业列表失败，请稍后重试`, { type: 'danger' });
    }
  };

  return (
    <ScrollView style={styles.screen}>
      <View style={{flex: 1, flexDirection: 'column', alignItems: 'center', paddingTop: 32}}>
        <DataOverview />
        <DataTrend />
        <DataCompare />
        <DataPercent />
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1
  }
});

export default HireReportForm;