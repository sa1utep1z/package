import React, {useState, useEffect} from "react";
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Formik, Field } from 'formik';
import * as Yup from 'yup';

import SingleInput from "../../../../../../components/OrderForm/SingleInput";
import SingleSelect from "../../../../../../components/OrderForm/SingleSelect";
import RadioSelect from "../../../../../../components/OrderForm/RadioSelect";
import OrderRangeDate from "../../../../../../components/OrderForm/OrderRangeDate";
import OrderSingleDate from "../../../../../../components/OrderForm/OrderSingleDate";
import MyMembersApi from "../../../../../../request/MyMembersApi";
import { SUCCESS_CODE, CREATE_ORDER_JOB_ORDER, CREATE_ORDER_JOB_TYPE } from "../../../../../../utils/const";

const validationSchema = Yup.object().shape({
  orderName: Yup.string().required('请输入订单名称'),
  factory: Yup.array().min(1, '请选择用工企业'),
  job: Yup.array().min(1, '请选择岗位'),
  jobType: Yup.array().min(1, '请选择工种'),
  orderRangeDate: Yup.object({
    startDate: Yup.string().required('请选择订单开始日期'),
    endDate: Yup.string().required('请选择订单结束日期')
  }),
  orderDuration: Yup.string().required('请选择订单工期'),
});

const initialValues = {
  orderName: '',
  factory: [],
  job: [],
  jobType: [],
  orderRangeDate: {
    startDate: '',
    endDate: ''
  },
  orderDuration: ''
};

const OrderInfo = () => {
  const [showDetail, setShowDetail] = useState(true);
  const [companyList, setCompanyList] = useState([]);

  useEffect(() => {
    getFactoryList();
  }, [])

  const getFactoryList = async() => {
    try {
      const res = await MyMembersApi.CompaniesList();
      console.log('res', res)
      if(res.code !== SUCCESS_CODE){
        toast.show(`获取企业列表失败，${res.msg}`, { type: 'danger' });
        return;
      }
      setCompanyList(res.data);
    } catch (error) {
      console.log('error', error);
    }
  };

  const detailOnPress = () => setShowDetail(!showDetail);

  const onSubmit = async (values) => {
    console.log('提交表单', values)
  };

  return (
    <View style={{marginTop: 20}}>
      <TouchableOpacity style={styles.touchArea} onPress={detailOnPress}>
        <Text style={[styles.title, showDetail && styles.boldText]}>订单基本信息</Text>
        <AntDesign
          name={showDetail ? 'down' : 'up'}
          size={36}
          color={showDetail ? '#000000' : '#999999'}
        />
      </TouchableOpacity>
      {showDetail && <View style={{minHeight: 400, backgroundColor: '#ffffff'}}>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        handleChange={(e) => console.log('e', e)}
        onSubmit={onSubmit}>
        {({ handleSubmit, ...rest }) => {
          console.log('rest', rest);
          return (
            <View style={{ flex: 1, paddingHorizontal: 28}}>
              <Field
                name="orderName"
                label="订单名称"
                component={SingleInput}
                rightButton={
                  <TouchableOpacity style={{backgroundColor: '#409EFF', height: 50, paddingHorizontal: 18, justifyContent: 'center', marginLeft: 20, borderRadius: 6}} onPress={handleSubmit}>
                    <Text style={{fontSize: 28, color: '#fff', fontWeight: 'bold'}}>保存</Text>
                  </TouchableOpacity>
                }
              />
              <Field
                name="factory"
                label="用工企业"
                selectList={companyList}
                component={SingleSelect}
              />
              <Field
                name="job"
                label="岗位"
                radioList={CREATE_ORDER_JOB_ORDER}
                component={RadioSelect}
              />
              <Field
                name="jobType"
                label="工种"
                radioList={CREATE_ORDER_JOB_TYPE}
                component={RadioSelect}
              />
              <Field
                name="orderRangeDate"
                label="订单日期"
                component={OrderRangeDate}
              />
              <Field
                name="orderDuration"
                label="订单工期"
                component={OrderSingleDate}
              />
            </View>
          )
        }}
      </Formik>
      </View>}
    </View>
  )
};

const styles = StyleSheet.create({
  touchArea: {
    height: 94, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    backgroundColor: '#ffffff', 
    paddingHorizontal: 30, 
    alignItems: 'center'
  },
  title: {
    fontSize: 32, 
    color: '#000000'
  },
  boldText: {
    fontWeight: 'bold'
  }
});

export default OrderInfo;