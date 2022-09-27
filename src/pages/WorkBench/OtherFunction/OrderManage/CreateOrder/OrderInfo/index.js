import React, {useState, useEffect} from "react";
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Formik, Field } from 'formik';
import * as Yup from 'yup';

import SingleInput from "../../../../../../components/OrderForm/SingleInput";
import SingleSelect from "../../../../../../components/OrderForm/SingleSelect";
import MyMembersApi from "../../../../../../request/MyMembersApi";
import { SUCCESS_CODE } from "../../../../../../utils/const";

const validationSchema = Yup.object().shape({
  orderName: Yup.string().required('请输入订单名称'),
  job: Yup.string().required('请输入订单名称'),
});

const initialValues = {
  orderName: '',
  job: []
};

const OrderInfo = () => {
  const [showDetail, setShowDetail] = useState(false);
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
                name="job"
                label="岗位"
                selectList={companyList}
                component={SingleSelect}
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