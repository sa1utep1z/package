import React, {useState} from 'react';
import {StyleSheet, ScrollView, View, Text} from 'react-native';
import {Button} from '@rneui/themed';
import {Formik, Field} from 'formik';
import * as Yup from 'yup';

import FormItem from '../../../../components/Form/FormItem';
import SelectItem from '../../../../components/Form/SelectItem';
import {IDCard, phone} from '../../../../utils/validate';
import { HANDLE_STATE } from '../../../../utils/const';

const SignUpValidationSchema = Yup.object().shape({
  name: Yup.string().max(5, '姓名不能超过5个字符').required('请输入姓名'),
  IDCard: Yup.string().required('请输入身份证').matches(IDCard, '请输入正确的身份证号'),
  phone: Yup.string().required('请输入会员手机号').matches(phone, '请输入正确的手机号')
});

const EditMember = (props) => {
  const {route: {params}} = props;
  const initialValues = {
    name: '',
    IDCard: '',
    phone: '',
    jobName: '',
    jobFrom: '',
    belongOfPeople: '',
    belongOfStore: '',
    signUpState: '',
    theWayToArrive: '',
    handleTime: '',
    remark: '',
    isStay: '',
  };
  
  for(let index of params){
    initialValues[index.type] = index.value;
  }

  const onSubmit = (values) => {
    console.log('提交了表单哇呜',values);
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={SignUpValidationSchema}
      onSubmit={onSubmit}>
        {({handleSubmit}) => (
          <View style={{flex: 1}}>
            <ScrollView style={styles.scrollArea}>
              <View style={[styles.cardArea, {marginTop: 10}]}>
                <Field
                  name="name"
                  title="姓名"
                  component={FormItem}
                />
                <Field
                  name="IDCard"
                  title="身份证"
                  component={FormItem}
                />
                <Field
                  name="phone"
                  title="手机号"
                  maxLength={11}
                  component={FormItem}
                />
                <Field
                  name="remark"
                  title="备注"
                  component={FormItem}
                />
                <Field
                  name="signUpState"
                  title="报名状态"
                  showTitle
                  noBorder
                  selectList={HANDLE_STATE}
                  component={SelectItem}
                />
                <Field
                  name="jobName"
                  title="职位名称"
                  disabled
                  component={FormItem}
                />
                <Field
                  name="jobFrom"
                  title="职位来源"
                  disabled
                  component={FormItem}
                />
                <Field
                  name="belongOfPeople"
                  title="经纪人"
                  disabled
                  component={FormItem}
                />
                <Field
                  name="belongOfStore"
                  title="归属门店"
                  disabled
                  component={FormItem}
                />
                
                <Field
                  name="theWayToArrive" 
                  title="到厂方式"
                  disabled
                  component={FormItem}
                />
                <Field
                  name="handleTime"
                  title="处理时间"
                  disabled
                  component={FormItem}
                />
                <Field
                  name="isStay"
                  title="是否住宿"
                  disabled
                  noBorder
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

export default EditMember;