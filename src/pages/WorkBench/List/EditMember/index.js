import React, {useEffect} from 'react';
import {StyleSheet, ScrollView, View} from 'react-native';
import {Button} from '@rneui/themed';
import {Formik, Field} from 'formik';
import * as Yup from 'yup';
import moment from 'moment';
import { useToast } from "react-native-toast-notifications";
import { useNavigation } from '@react-navigation/native';

import FormItem from '../../../../components/Form/FormItem';
import {IDCard, phone} from '../../../../utils/validate';
import { CHANEL_SOURCE_LIST, MEMBERS_STATUS, WAY_TO_GO, SUCCESS_CODE } from '../../../../utils/const';
import ListApi from '../../../../request/ListApi';

const SignUpValidationSchema = Yup.object().shape({
  name: Yup.string().max(5, '姓名不能超过5个字符').required('请输入姓名'),
  idNo: Yup.string().required('请输入身份证').matches(IDCard, '请输入正确的身份证号'),
  mobile: Yup.string().required('请输入会员手机号').matches(phone, '请输入正确的手机号')
});

let restForm, initialValues = {
  name: '',
  idNo: '',
  mobile: '',
  orderName: '',
  signUpType: '',
  recruitName: '',
  storeName: '',
  status: '',
  arrivalMode: '',
  signUpTime: ''
};

const EditMember = (props) => {
  const {route: {params}} = props;
  const toast = useToast();
  const navigation = useNavigation();

  useEffect(()=>{
    for(let key in params.fieldList){
      switch(key){
        case 'signUpType':
          initialValues[key] = CHANEL_SOURCE_LIST.find(name => name.value === params.fieldList[key]).title;
          break;
        case 'status':
          initialValues[key] = MEMBERS_STATUS[params.fieldList[key]];
          break;
        case 'arrivalMode':
          initialValues[key] = WAY_TO_GO.find(name => name.value === params.fieldList[key]).label;
          break;
        case 'signUpTime':
          initialValues[key] = moment(params.fieldList[key]).format('YYYY-MM-DD');
          break;
        default: 
          initialValues[key] = params.fieldList[key];
          break;
      }
    }
    restForm.setValues(initialValues);
  }, [])
  
  const onSubmit = async(values) => {
    const flowId = params.fieldList.flowId;
    const par = {
      name: values.name,
      mobile: values.mobile,
      idNo: values.idNo
    };
    try{
      const res = await ListApi.CompleteInfo(flowId, par);
      if(res?.code !== SUCCESS_CODE){
        toast.show(`请求失败，请稍后重试。${res.data?.msg}`, {type: 'danger'});
        return;
      }
      toast.show(`修改成功`, {type: 'success'});
      navigation.goBack();
    }catch(err){
      toast.show(`出现了意料之外的问题，请联系系统管理员处理`, { type: 'danger' });
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={SignUpValidationSchema}
      onSubmit={onSubmit}>
        {({handleSubmit, ...rest}) => {
          restForm = rest;
          return (
          <View style={{flex: 1}}>
            <ScrollView style={styles.scrollArea}>
              <View style={styles.cardArea}>
                <Field
                  name="name"
                  title="姓名"
                  component={FormItem}
                />
                <Field
                  name="idNo"
                  title="身份证"
                  component={FormItem}
                />
                <Field
                  name="mobile"
                  title="手机号"
                  maxLength={11}
                  component={FormItem}
                />
                <Field
                  name="orderName"
                  title="职位名称"
                  disabled
                  component={FormItem}
                />
                <Field
                  name="signUpType"
                  title="职位来源"
                  disabled
                  component={FormItem}
                />
                <Field
                  name="recruitName"
                  title="经纪人"
                  disabled
                  component={FormItem}
                />
                <Field
                  name="storeName"
                  title="归属门店"
                  disabled
                  component={FormItem}
                />
                <Field
                  name="status"
                  title="报名状态"
                  disabled
                  component={FormItem}
                />
                <Field
                  name="arrivalMode" 
                  title="到厂方式"
                  disabled
                  component={FormItem}
                />
                <Field
                  name="signUpTime"
                  title="录入时间"
                  disabled
                  component={FormItem}
                />
              </View>
            </ScrollView>
            <View style={styles.btnArea}>
              <Button
                title="保 存"
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
};

const styles = StyleSheet.create({
  scrollArea: {
    flex: 1
  },
  buttonStyle: {
    height: 45,
    backgroundColor: '#409EFF',
    borderColor: 'transparent',
    borderWidth: 0,
    borderRadius: 30
  },
  buttonContainerStyle: {
    marginHorizontal: 8
  },
  titleStyle: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  theWayToGo: {
    color: '#000', 
    fontSize: 15, 
    fontWeight: 'bold', 
    marginLeft: 10,
    marginBottom: 10
  },
  cardArea: {
    backgroundColor: '#fff', 
    borderRadius: 8,
    marginBottom: 10,
    marginHorizontal: 32,
    marginTop: 32
  },
  btnArea: {
    justifyContent: 'center',
    marginBottom: 20
  },
  buttonStyle: {
    height: 88,
    backgroundColor: '#409EFF',
    borderColor: 'transparent',
    borderWidth: 0,
    borderRadius: 44
  },
  buttonContainerStyle: {
    marginHorizontal: 32
  },
  titleStyle: {
    fontSize: 35
  },
})

export default EditMember;