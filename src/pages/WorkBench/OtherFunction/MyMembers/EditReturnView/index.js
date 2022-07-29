import React, {useState} from 'react';
import {StyleSheet, ScrollView, View, Text} from 'react-native';
import {Button} from '@rneui/themed';
import {Formik, Field} from 'formik';
import * as Yup from 'yup';

import FormItem from '../../../../../components/Form/FormItem';
import SelectItem from '../../../../../components/Form/SelectItem';
import LongTextArea from '../../../../../components/Form/LongTextArea';
import SelectDate from '../../../../../components/Form/SelectDate';
import {IDCard, phone} from '../../../../../utils/validate';
import { HANDLE_STATE } from '../../../../../utils/const';
import TwoRadio from '../../../../../components/Form/TwoRadio';

const SignUpValidationSchema = Yup.object().shape({
  memberName: Yup.string().max(5, '姓名不能超过5个字符').required('请输入姓名'),
  memberPhone: Yup.string().required('请输入会员手机号').matches(phone, '请输入正确的手机号'),
  intendSignUpDate: Yup.string().required('请选择意向报名日期'),
  nextTimeReviewDate: Yup.string().required('请选择下次回访日期')
});

const EditReturnView = (props) => {
  console.log('props', props)
  const {route: {params}} = props;
  const initialValues = {
    memberTags: '',
    memberName: '',
    memberPhone: '',
    memberDecision: true,
    intendCompany: [],
    intendSignUpDate: '',
    thisTimeReviewRecord: '',
    nextTimeReviewDate: '',
    recordHistory: '哇哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哇哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哇哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哇哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哇哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哇哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哇哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哇哈哈哈哈哈哈哈哈哈哈哈哈'
  };
  
  // for(let index of params){
  //   initialValues[index.type] = index.value;
  // }

  const onSubmit = (values) => {
    console.log('提交了表单哇呜',values);
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={SignUpValidationSchema}
      onSubmit={onSubmit}>
        {({handleSubmit, values, ...rest}) => {
          console.log('values', values)
          return (
          <View style={{flex: 1}}>
            <ScrollView style={styles.scrollArea}>
              <View style={[styles.cardArea, {marginTop: 10}]}>
                <Field
                  name="memberTags"
                  title="会员标签"
                  labelAreaStyle={{width: 100}}
                  component={FormItem}
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
                      selectList={HANDLE_STATE}
                      labelAreaStyle={{width: 100}}
                      component={SelectItem}
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