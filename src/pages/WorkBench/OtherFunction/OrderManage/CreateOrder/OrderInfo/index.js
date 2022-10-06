import React, {useState, useEffect} from "react";
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Formik, Field } from 'formik';
import * as Yup from 'yup';

import SingleInput from "../../../../../../components/OrderForm/SingleInput";
import OrderRangeInput from "../../../../../../components/OrderForm/OrderRangeInput";
import SingleSelect from "../../../../../../components/OrderForm/SingleSelect";
import RadioSelect from "../../../../../../components/OrderForm/RadioSelect";
import OrderRangeDate from "../../../../../../components/OrderForm/OrderRangeDate";
import SelectPhotos from "../../../../../../components/OrderForm/SelectPhotos";
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
  jobOrder: Yup.string().required('请输入职位顺序'),
  complexSalary: Yup.object({
    start: Yup.string().required('请输入起始薪资'),
    end: Yup.string().required('请输入结束薪资')
  }),
  pictureList: Yup.array().min(1, '请选择职位展示图片'),
  littleProgramTitle: Yup.string().required('请输入小程序职位标题'),
  littleProgramSalaryDetail: Yup.string().required('请输入小程序薪资详情文本'),
});

const initialValues = {
  orderName: '',
  factory: [],
  jobOrder: '',
  job: [],
  jobType: [],
  orderRangeDate: {
    startDate: '',
    endDate: ''
  },
  orderDuration: '',
  complexSalary: {
    start: '',
    end: ''
  },
  pictureList: [],
  littleProgramTitle: '',
  littleProgramSalaryDetail: ''
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
      {showDetail && <View style={{backgroundColor: '#ffffff', borderTopWidth: 1, borderTopColor: '#999999', paddingTop: 20}}>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          handleChange={(e) => console.log('e', e)}
          onSubmit={onSubmit}>
          {({ handleSubmit, ...rest }) => {
            console.log('rest', rest);
            return (
              <View style={{ flex: 1, paddingHorizontal: 28}}>
                <View style={{flex: 1, flexDirection: 'row'}}>
                  <Field
                    name="orderName"
                    label="订单名称"
                    component={SingleInput}
                    inputStyle={{flex: 1}}
                    selectTextOnFocus
                  />
                  <TouchableOpacity style={{backgroundColor: '#409EFF', height: 60, paddingHorizontal: 18, justifyContent: 'center', marginLeft: 20, borderRadius: 6}} onPress={handleSubmit}>
                    <Text style={{fontSize: 28, color: '#fff', fontWeight: 'bold'}}>保存</Text>
                  </TouchableOpacity>
                </View>
                <View style={{flex: 1, flexDirection: 'row'}}>
                  <Field
                    name="factory"
                    label="用工企业"
                    selectList={companyList}
                    component={SingleSelect}
                  />
                  <Field
                    name="jobOrder"
                    label="职位顺序"
                    placeholder="输入"
                    keyboardType="numeric"
                    multiline={false}
                    numberOfLines={1}
                    maxLength={2}
                    inputStyle={{maxWidth: 260, marginLeft: 20}}
                    component={SingleInput}
                  />
                </View>
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
                <Field
                  name="complexSalary"
                  label="综合薪资"
                  keyboardType="numeric"
                  inputRightComponent={<Text style={{height: 60, textAlignVertical: 'center', fontSize: 26, color: '#333333'}}>¥</Text>}
                  component={OrderRangeInput}
                />
                <Field
                  name="pictureList"
                  label="职位展示图片"
                  component={SelectPhotos}
                />
                <Field
                  name="littleProgramTitle"
                  label="小程序职位标题"
                  selectTextOnFocus
                  component={SingleInput}
                />
                <Field
                  name="littleProgramSalaryDetail"
                  label="小程序薪资详情"
                  placeholder="请输入小程序薪资详情文本"
                  maxLength={200}
                  multiline
                  lengthLimit
                  inputContainerStyle={{minHeight: 120, alignItems: 'flex-start'}}
                  component={SingleInput}
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