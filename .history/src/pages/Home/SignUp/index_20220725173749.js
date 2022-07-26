import React, {useState} from 'react';
import {StyleSheet, ScrollView, View, Text, KeyboardAvoidingView} from 'react-native';
import {Button} from '@rneui/themed';
import {Formik, Field} from 'formik';
import * as Yup from 'yup';

import FormItem from '../../../components/Form/FormItem';
import TwoRadio from '../../../components/Form/TwoRadio';
import SelectItem from '../../../components/Form/SelectItem';
import {IDCard, phone} from '../../../utils/validate';
import { ARRIVE_WAY } from '../../../utils/const';

const SignUpValidationSchema = Yup.object().shape({
  name: Yup.string().max(5, '姓名不能超过5个字符').required('请输入姓名'),
  IDCard: Yup.string().required('请输入身份证').matches(IDCard, '请输入正确的身份证号'),
  phone: Yup.string().required('请输入会员手机号').matches(phone, '请输入正确的手机号')
});

const SignUp = (props) => {
  const {navigation, route: {params}} = props;

  const initialValues = {
    jobName: params.jobName,
    name: '',
    IDCard: '',
    phone: '',
    nation: '',
    address: '',
    authority: '',
    timeOfValidity: '',
    way: 'byHimself',
    remark: '',
    tip: true
  };

  const onSubmit = (values) => {
    console.log('提交了表单哇呜',values);
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={SignUpValidationSchema}
      handleChange={(e) => console.log('e',e)}
      onSubmit={onSubmit}>
        {({handleSubmit}) => (
          <View style={{flex: 1}}>
            <ScrollView style={styles.scrollArea}>
              <View style={[styles.cardArea, {marginTop: 10}]}>
                <Field
                  name="jobName"
                  title="岗位名称"
                  disabled
                  component={FormItem}
                />
                <Field
                  name="name"
                  title="姓名"
                  placeholder="请输入会员姓名"
                  OCR
                  autoFocus
                  isRequired
                  component={FormItem}
                />
                <Field
                  name="IDCard"
                  title="身份证"
                  placeholder="请输入会员身份证"
                  maxLength={18}
                  isRequired
                  component={FormItem}
                />
                <Field
                  name="phone"
                  title="手机号"
                  placeholder="请输入会员手机号"
                  maxLength={11}
                  isRequired
                  component={FormItem}
                />
                <Field
                  name="nation"
                  title="民族"
                  placeholder="请输入会员民族（选填）"
                  component={FormItem}
                />
                <Field
                  name="address"
                  title="户籍地址"
                  placeholder="请输入会员户籍地址（选填）"
                  noBorder
                  component={FormItem}
                />
              </View>
              <>
                <View style={styles.cardArea}>
                  <Field
                    name="authority"
                    title="签发机关"
                    placeholder="请输入签发机关（选填）"
                    OCR
                    component={FormItem}
                  />
                  <Field
                    name="timeOfValidity"
                    title="有效期限"
                    placeholder="请输入有效期限（选填）"
                    noBorder
                    component={FormItem}
                  />
                </View>
              </>
              <>
                <Text style={styles.theWayToGo}>到场方式</Text>
                <View style={styles.cardArea}>
                  <Field
                    name="way"
                    title="到场方式"
                    placeholder="到场方式"
                    noBorder
                    formalLabel={false}
                    selectList={ARRIVE_WAY}
                    component={SelectItem}
                  />
                  <Field
                    name="remark"
                    placeholder="请输入备注（选填）"
                    noBorder
                    component={FormItem}
                  />
                </View>
              </>
              <>
                <Text style={styles.theWayToGo}>是否住宿</Text>
                <Field
                    name="tip"
                    placeholder="请输入备注（选填）"
                    noBorder
                    component={TwoRadio}
                  />
              </>
            </ScrollView>
            <KeyboardAvoidingView style={styles.btnArea}>
              <Button
                title="帮 他 报 名"
                onPress={handleSubmit}
                buttonStyle={styles.buttonStyle}
                containerStyle={styles.buttonContainerStyle}
                titleStyle={styles.titleStyle}
              />
            </KeyboardAvoidingView>
          </View>
        )}
    </Formik>
  )
};

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
})

export default SignUp;