import React, {useState} from 'react';
import {StyleSheet, ScrollView, View, Text} from 'react-native';
import {Button} from '@rneui/themed';
import {Formik, Field} from 'formik';
import * as Yup from 'yup';
import { useNavigation } from '@react-navigation/native';

import FormItem from '../../../../../components/Form/FormItem';
import SelectItem from '../../../../../components/Form/SelectItem';
import LongTextArea from '../../../../../components/Form/LongTextArea';
import SelectDate from '../../../../../components/Form/SelectDate';
import SelectTags from '../../../../../components/Form/SelectTags';
import {IDCard, phone} from '../../../../../utils/validate';
import TwoRadio from '../../../../../components/Form/TwoRadio';
import MyMembersApi from '../../../../../request/MyMembersApi';
import { SUCCESS_CODE } from '../../../../../utils/const';
import { useEffect } from 'react';
import SelectItemInPage from '../../../../../components/Form/SelectItemInPage';
import NAVIGATION_KEYS from '../../../../../navigator/key';

let setFieldValue;

const SignUpValidationSchema = Yup.object().shape({
  memberName: Yup.string().max(5, '姓名不能超过5个字符').required('请输入姓名'),
  memberPhone: Yup.string().required('请输入会员手机号').matches(phone, '请输入正确的手机号'),
  intendSignUpDate: Yup.string().required('请选择意向报名日期'),
  nextTimeReviewDate: Yup.string().required('请选择下次回访日期')
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
  recordHistory: '这里是历史回访记录这里是历史回访记录这里是历史回访记录这里是历史回访记录这里是历史回访记录这里是历史回访记录这里是历史回访记录这里是历史回访记录这里是历史回访记录这里是历史回访记录这里是历史回访记录这里是历史回访记录'
};

const EditReturnView = (props) => {
  const navigation = useNavigation();
  const {route: {params}} = props;

  const [companyList, setCompanyList] = useState([]);

  const onSubmit = (values) => {
    console.log('提交了表单哇呜',values);
  };

  useEffect(()=>{
    getCompanyList();
  },[])

  const getCompanyList = async() => {
    try{
      const res = await MyMembersApi.CompanyList();
      if(res.code !== SUCCESS_CODE){
        console.log('接口出错了！');
      }
      console.log('res', res);
      setCompanyList(res.data);
    }catch(err){
      console.log('获取企业列表的接口出错了',res);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={SignUpValidationSchema}
      onSubmit={onSubmit}>
        {({handleSubmit, values, setFieldValue, ...rest}) => {
          console.log('rest', rest);
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
                  labelAreaStyle={{width: 100}}
                  component={FormItem}
                />
                <Field
                  name="memberPhone"
                  title="会员手机号"
                  maxLength={11}
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
                          setFieldValue('intendCompany', list[0]);
                          navigation.goBack();
                        }
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
                  labelAreaStyle={{width: 100}}
                  component={LongTextArea}
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
  }
});

export default EditReturnView;