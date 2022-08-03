import React, {useState} from 'react';
import {StyleSheet, ScrollView, View, Text} from 'react-native';
import {Button} from '@rneui/themed';
import {Formik, Field} from 'formik';
import * as Yup from 'yup';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import { useToast } from "react-native-toast-notifications";

import FormItem from '../../../../../components/Form/FormItem';
import LongTextArea from '../../../../../components/Form/LongTextArea';
import SelectDate from '../../../../../components/Form/SelectDate';
import SelectTags from '../../../../../components/Form/SelectTags';
import TwoRadio from '../../../../../components/Form/TwoRadio';
import MyMembersApi from '../../../../../request/MyMembersApi';
import { SUCCESS_CODE } from '../../../../../utils/const';
import { useEffect } from 'react';
import SelectItemInPage from '../../../../../components/Form/SelectItemInPage';
import NAVIGATION_KEYS from '../../../../../navigator/key';

const SignUpValidationSchema = Yup.object().shape({
  thisTimeReviewRecord: Yup.string().required('请填写本次回访记录')
});

const initialValues = {
  memberTags: '',
  memberName: '',
  memberPhone: '',
  memberDecision: true,
  intendCompany: '',
  intendSignUpDate: '',
  thisTimeReviewRecord: '',
  nextTimeReviewDate: '',
  recordHistory: ''
};

let restForm;

const EditReturnView = (props) => {
  const toast = useToast();

  const navigation = useNavigation();
  const {route: {params}} = props;

  const [companyList, setCompanyList] = useState([]);
  const [otherComponent, setOtherComponent] = useState();

  useEffect(()=>{
    getCompanyList();
    setFieldValue();
  },[])

  const setFieldValue = () => {
    const {formList: {userName, mobile}, historyList} = params;
    restForm.setFieldValue('memberName', userName);
    restForm.setFieldValue('memberPhone', mobile);
    const otherComponent = historyList.map((item, index)=> {
      if(index < 3){
        return (
          <View key={index} style={[styles.historyList, index === 2 && {borderBottomWidth: 0}]}>
            <Text style={{width: 60}}>{item.lastModifiedByName}</Text>
            <Text style={{width: 80}}>{moment(item.lastModifiedDate).format('YYYY-MM-DD')}</Text>
            <Text style={{flex: 2}}>{item.content}</Text>
          </View>
        )
      }
    })
    setOtherComponent(otherComponent);
  };

  const getCompanyList = async() => {
    try{
      const res = await MyMembersApi.CompanyList();
      if(res.code !== SUCCESS_CODE){
        toast.show(`请求失败，请稍后重试。${res.msg}`, {type: 'danger'});
      }
      setCompanyList(res.data);
    }catch(err){
      toast.show(`出现了意料之外的问题，请联系系统管理员处理`, { type: 'danger' });
    }
  };

  const onSubmit = async(values) => {
    const {params: {formList: {poolId}}} = props.route;
    const params = {
      returnVisitResult: values.memberDecision ? 'HAVE_WILL' : 'NO_WILL',
      tags: values.memberTags,
      nextReturnVisitDate: values.nextTimeReviewDate,
      willSignUpCompanyId: values.intendCompany.value,
      willSignUpDate: values.intendSignUpDate,
      content: values.thisTimeReviewRecord
    };
    try{
      const res = await MyMembersApi.IncreaseReviewRecord(poolId, params);
      if(res.code !== SUCCESS_CODE){
        toast.show(`新增回访记录失败，${res.msg}`, { type: 'danger' });
        return;
      }
      toast.show('新增回访记录成功！',{type: 'success'});
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
        {({handleSubmit, values, ...rest}) => {
          restForm = rest;
          return (
          <View style={{flex: 1}}>
            <ScrollView style={styles.scrollArea}>
              <View style={[styles.cardArea, {marginTop: 10}]}>
                <Field
                  name="memberTags"
                  title="会员标签"
                  labelAreaStyle={{width: 100}}
                  component={SelectTags}
                />
                <Field
                  name="memberName"
                  title="会员姓名"
                  editable={false}
                  inputStyle={{color: '#CCCCCC'}}
                  labelAreaStyle={{width: 100}}
                  component={FormItem}
                />
                <Field
                  name="memberPhone"
                  title="会员手机号"
                  maxLength={11}
                  editable={false}
                  inputStyle={{color: '#CCCCCC'}}
                  labelAreaStyle={{width: 100}}
                  component={FormItem}
                />
                <Field
                  name="memberDecision"
                  title="会员意愿"
                  labelAreaStyle={{width: 100}}
                  component={TwoRadio}
                />
                {values.memberDecision && 
                  <>
                    <Field
                      name="intendCompany"
                      title="意向报名企业"
                      showTitle
                      noBorder
                      bottomButton
                      selectList={[]}
                      pageOnPress={()=>navigation.navigate(NAVIGATION_KEYS.TRANSFER_FACTORY, {
                        list: companyList,
                        confirm: (list) => {
                          rest.setFieldValue('intendCompany', list[0]);
                          navigation.goBack();
                        },
                        pageTitle: '选择意向报名企业'
                      })}
                      labelAreaStyle={{width: 100}}
                      component={SelectItemInPage}
                    />
                    <Field
                      name="intendSignUpDate"
                      title="意向报名日期"
                      labelAreaStyle={{width: 100}}
                      component={SelectDate}
                    />
                  </>
                }
                <Field
                  name="thisTimeReviewRecord"
                  title="本次回访记录"
                  labelAreaStyle={{width: 100}}
                  component={FormItem}
                />
                <Field
                  name="nextTimeReviewDate"
                  title="下次回访日期"
                  labelAreaStyle={{width: 100}}
                  component={SelectDate}
                />
                <Field
                  name="recordHistory"
                  title="历史回访记录"
                  noBorder
                  disabled
                  otherComponent={otherComponent}
                  labelAreaStyle={{width: 100}}
                  component={LongTextArea}
                />
              </View>
            </ScrollView>
            <View style={styles.btnArea}>
              <Button
                title="新 增"
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
  btnArea: {
    height: 70, 
    justifyContent: 'center'
  },
  cardArea: {
    backgroundColor: '#fff', 
    borderRadius: 8,
    marginBottom: 10
  },
  historyList: {
    flexDirection: 'row', 
    alignItems: 'center', 
    borderBottomWidth: 1, 
    borderColor: '#999999'
  }
});

export default EditReturnView;