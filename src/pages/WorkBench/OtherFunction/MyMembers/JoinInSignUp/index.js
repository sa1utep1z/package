import React, {useState, useEffect, useMemo} from 'react';
import {StyleSheet, ScrollView, View, Text, TouchableOpacity} from 'react-native';
import {Button} from '@rneui/themed';
import {Formik, Field} from 'formik';
import * as Yup from 'yup';
import { useNavigation } from '@react-navigation/native';
import { useToast } from "react-native-toast-notifications";

import FormItem from '../../../../../components/Form/FormItem';
import SelectItem from '../../../../../components/Form/SelectItem';
import LongTextArea from '../../../../../components/Form/LongTextArea';
import SelectDate from '../../../../../components/Form/SelectDate';
import SelectTags from '../../../../../components/Form/SelectTags';
import {IDCard, phone} from '../../../../../utils/validate';
import TwoRadio from '../../../../../components/Form/TwoRadio';
import MyMembersApi from '../../../../../request/MyMembersApi';
import { SUCCESS_CODE, ARRIVE_WAY, CHANEL_SOURCE_LIST } from '../../../../../utils/const';

let restForm;

const SignUpValidationSchema = Yup.object().shape({
  
});

const initialValues = {
  memberName: '',
  memberPhone: '',
  memberIdCard: '',
  from: [],
  way: [],
  store: [],
  staff: [],
  orderId: [],
  company: [],
  orderName: '',
  orderTime: '',
};

const JoinInSignUp = (props) => {
  const navigation = useNavigation();
  const {route: {params: {msg}}} = props;
  const toast = useToast();

  const [storeList, setStoreList] = useState([]);
  const [companyList, setCompanyList] = useState([]);
  const [orderList, setOrderList] = useState([]);

  const onSubmit = async(values) => {
    console.log('values', values) 
    if(!values.orderId.length){
      toast.show('请选择订单编号！', {type: 'danger'});
    }
    const params = {
      userName: msg.userName,
      mobile: msg.mobile,
      signUpType: values.from[0].value,
      arrivalMode: values.way[0].value,
      orderId: values.orderId[0].orderId,
      storeId: values.store[0].storeId,
      recruiterId: values.staff[0].value
    };
    try{  
      const res = await MyMembersApi.CompaniesList(msg.poolId, params);
      if(res.code !== SUCCESS_CODE){
        toast.show(`加入报名失败，${res.msg}`, { type: 'danger' });
        return;
      }
      toast.show(`加入报名成功！`, { type: 'success' });
      navigation.goBack();
    }catch(err){
      console.log('err', err);
      toast.show(`加入报名失败，请稍后重试`, { type: 'danger' });
    }
  };

  useMemo(()=>{
    console.log('orderList',orderList);
  },[orderList])

  useEffect(()=>{
    setFieldValue();
    getStoreList();
    getCompaniesList();
  },[])
  
  const getCompaniesList = async() => {
    try{  
      const res = await MyMembersApi.CompaniesList();
      if(res.code !== SUCCESS_CODE){
        toast.show(`获取企业列表失败，${res.msg}`, { type: 'danger' });
        return;
      }
      if(res.data.length){
        res.data.forEach((item,index) => {
          item.title = item.label;
          item.id = index + 1;
        });
        setCompanyList(res.data);
      }
    }catch(err){
      console.log('err', err);
      toast.show(`获取企业列表失败，请稍后重试`, { type: 'danger' });
    }
  };

  const getStoreList = async() => {
    try{  
      const res = await MyMembersApi.StoreList();
      if(res.code !== SUCCESS_CODE){
        toast.show(`获取门店列表失败，${res.msg}`, { type: 'danger' });
        return;
      }
      if(res.data.length){
        res.data.forEach((item,index) => {
          item.title = item.storeName;
          item.id = index + 1;
        });
        console.log('获取到的门店res.data.', res.data);
        setStoreList(res.data);
      }
    }catch(err){
      console.log('err', err);
      toast.show(`获取门店列表失败`, { type: 'danger' });
    }
  };

  const filter = async() => {
    const companyId =restForm.values.company.length ? restForm.values.company[0].value : '';
    const orderDate = restForm.values.orderTime;
    const orderName = restForm.values.orderName;
    const params = {companyId, orderDate, orderName};
    if(!companyId.length && !orderName.length && !orderDate.length){
      toast.show('请先填入筛选项！', {type: 'warning'});
      return;
    }
    try{  
      const res = await MyMembersApi.getOrderMessage(params);
      if(res.code !== SUCCESS_CODE){
        toast.show(`获取订单信息失败，${res.msg}`, { type: 'danger' });
        return;
      }
      if(res.data.length){
        res.data.forEach((item,index) => {
          item.title = item.orderNo;
          item.id = index + 1;
        });
        setOrderList(res.data);
      }
      toast.show(`筛选成功，共${res.data.length}条订单`, {type: 'success'});
    }catch(err){
      console.log('err', err);
      toast.show(`获取订单信息失败，请稍后重试`, { type: 'danger' });
    }
  };

  const setFieldValue = () => {
    if(msg){
      restForm.setFieldValue('memberName', msg.userName);
      restForm.setFieldValue('memberPhone', msg.mobile);
      //TODO这里字段还要修改（身份证的还没给）
      restForm.setFieldValue('memberIdCard', '233333333333333333');
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={SignUpValidationSchema}
      onSubmit={onSubmit}>
        {({handleSubmit, ...rest}) => {
          restForm = rest;
          const selectStoreList = rest.values.store.length ? rest.values.store[0].members : [];
          if(selectStoreList.length){
            selectStoreList.map((item, index) => {
              item.title = item.label;
              item.id = index + 1;
            })
          }
          return (
          <View style={{flex: 1}}>
            <ScrollView style={styles.scrollArea}>
              <View style={[styles.cardArea, {marginTop: 10}]}>
                <Field
                  name="memberName"
                  title="会员姓名"
                  editable={false}
                  inputStyle={{color: '#CCCCCC'}}
                  component={FormItem}
                />
                <Field
                  name="memberPhone"
                  title="会员手机号"
                  maxLength={11}
                  editable={false}
                  inputStyle={{color: '#CCCCCC'}}
                  component={FormItem}
                />
                <Field
                  name="memberIdCard"
                  title="身份证号"
                  maxLength={11}
                  editable={false}
                  inputStyle={{color: '#CCCCCC'}}
                  component={FormItem}
                />
                <Field
                  name="from"
                  title="渠道来源"
                  noBorder
                  bottomButton
                  inPageField
                  singleSelect
                  validate={value=>{
                    let errorMsg;
                    if(value.length === 0) {
                      errorMsg = '请选择渠道来源';
                    }
                    return errorMsg;
                  }}
                  selectList={CHANEL_SOURCE_LIST}
                  component={SelectItem}
                />
                <Field
                  name="way"
                  title="到厂方式"
                  noBorder
                  bottomButton
                  singleSelect
                  inPageField
                  validate={value=>{
                    let errorMsg;
                    if(value.length === 0) {
                      errorMsg = '请选择到厂方式';
                    }
                    return errorMsg;
                  }}
                  selectList={ARRIVE_WAY}
                  component={SelectItem}
                />
                <Field
                  name="store"
                  title="所属门店"
                  noBorder
                  bottomButton
                  singleSelect
                  inPageField
                  canSearch
                  validate={value=>{
                    let errorMsg;
                    if(value.length === 0) {
                      errorMsg = '请选择所属门店';
                    }
                    return errorMsg;
                  }}
                  selectList={storeList}
                  component={SelectItem}
                />
                <Field
                  name="staff"
                  title="归属招聘员"
                  noBorder
                  bottomButton
                  singleSelect
                  inPageField
                  validate={value=>{
                    let errorMsg;
                    if(value.length === 0) {
                      errorMsg = '请选择归属招聘员';
                    }
                    return errorMsg;
                  }}
                  selectList={selectStoreList}
                  component={SelectItem}
                />
                <View style={{paddingBottom: 20}}>
                  <Text style={{paddingLeft: 30, fontSize: 26, marginTop: 5}}>筛选</Text>
                  <View style={{borderWidth: 1, marginHorizontal: 20, borderRadius: 8, borderColor: '#CCCCCC', flexDirection: 'row'}}>
                    <View style={{flex: 1, borderRightWidth: 1, borderColor: '#CCCCCC'}}>
                      <Field
                        name="company"
                        title="意向报名企业"
                        noBorder
                        bottomButton
                        singleSelect
                        canSearch
                        inPageField
                        selectList={companyList}
                        component={SelectItem}
                      />
                      <Field
                        name="orderTime"
                        title="订单日期"
                        component={SelectDate}
                      />
                      <Field
                        name="orderName"
                        title="订单名称"
                        bottomButton
                        singleSelect
                        canSearch
                        component={FormItem}
                      />
                    </View>
                    <TouchableOpacity style={{width: 80, justifyContent: 'center', alignItems: 'center', margin: 5, borderRadius: 5, backgroundColor: '#409EFF'}} onPress={filter}>
                      <Text style={{color: '#fff', fontSize: 26}}>筛选</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                  <Field
                    name="orderId"
                    title="订单编号"
                    noBorder
                    bottomButton
                    singleSelect
                    canSearch
                    inPageField
                    validate={value=>{
                      let errorMsg;
                      if(value.length === 0) {
                        errorMsg = '请选择订单编号';
                      }
                      return errorMsg;
                    }}
                    selectContainerStyle={{paddingHorizontal: 28}}
                    selectList={orderList}
                    component={SelectItem}
                  />
              </View>
            </ScrollView>
            <View style={styles.btnArea}>
              <Button
                title="保存"
                onPress={handleSubmit}
                buttonStyle={styles.buttonStyle}
                containerStyle={styles.buttonContainerStyle}
                titleStyle={styles.titleStyle}
              />
            </View>
          </View>
        )}}
    </Formik>
  )
}

const styles = StyleSheet.create({
  scrollArea: {
    flex: 1, 
    paddingHorizontal: 10
  },
  buttonStyle: {
    height: 88,
    backgroundColor: '#409EFF',
    borderColor: 'transparent',
    borderWidth: 0,
    borderRadius: 44
  },
  buttonContainerStyle: {
    marginHorizontal: 8
  },
  titleStyle: {
    fontSize: 28,
    fontWeight: 'bold'
  },
  theWayToGo: {
    color: '#000', 
    fontSize: 15, 
    fontWeight: 'bold', 
    marginLeft: 10,
    marginBottom: 10
  },
  btnArea: {
    justifyContent: 'center',
    paddingHorizontal: 28,
    marginBottom: 20
  },
  cardArea: {
    backgroundColor: '#fff', 
    borderRadius: 8,
    marginBottom: 10
  }
});

export default JoinInSignUp;