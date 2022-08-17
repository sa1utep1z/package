import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { Button } from '@rneui/themed';
import { Formik, Field } from 'formik';
import * as Yup from 'yup';
import { useToast } from "react-native-toast-notifications";
import { useNavigation } from '@react-navigation/native';

import FormItem from '../../../../components/Form/FormItem';
import { IDCard, phone } from '../../../../utils/validate';
import { SUCCESS_CODE } from '../../../../utils/const';
import ListApi from '../../../../request/ListApi';

const SignUpValidationSchema = Yup.object().shape({
  name: Yup.string().max(5, '姓名不能超过5个字符').required('请输入姓名'),
  idNo: Yup.string().required('请输入身份证').matches(IDCard, '请输入正确的身份证号'),
  mobile: Yup.string().required('请输入手机号')
});

let restForm, initialValues = {
  name: '',
  idNo: '',
  mobile: ''
};

const EditMember = (props) => {
  const { route: { params } } = props;
  const toast = useToast();
  const navigation = useNavigation();

  useEffect(()=>{
    restForm.setValues({
      name: params.item.name || '',
      idNo: params.item.idNo || '',
      mobile: params.item.mobile || ''
    });
  },[])

  const onSubmit = async (values) => {
    const flowId = params.item.flowId;
    const par = {
      name: values.name,
      mobile: values.mobile,
      idNo: values.idNo
    };
    try {
      const res = await ListApi.CompleteInfo(flowId, par);
      if (res?.code !== SUCCESS_CODE) {
        toast.show(`${res.msg}`, { type: 'danger' });
        return;
      }
      toast.show(`完善会员信息成功`, { type: 'success' });
      navigation.goBack();
      params.refresh && params.refresh();
    } catch (err) {
      toast.show(`出现了意料之外的问题，请联系系统管理员处理`, { type: 'danger' });
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={SignUpValidationSchema}
      onSubmit={onSubmit}>
      {({ handleSubmit, values, ...rest }) => {
        restForm = rest;
        return (
          <View style={{ flex: 1 }}>
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
              </View>
            </ScrollView>
            <Button
              title="保 存"
              onPress={handleSubmit}
              buttonStyle={styles.buttonStyle}
              containerStyle={styles.buttonContainerStyle}
              titleStyle={styles.titleStyle}
            />
          </View>
        )
      }}
    </Formik>
  )
};

const styles = StyleSheet.create({
  scrollArea: {
    flex: 1
  },
  cardArea: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
    marginHorizontal: 32,
    marginTop: 32
  },
  buttonStyle: {
    height: 88,
    backgroundColor: '#409EFF',
    borderColor: 'transparent',
    borderWidth: 0,
    borderRadius: 44
  },
  buttonContainerStyle: {
    margin: 28
  },
  titleStyle: {
    fontSize: 35
  },
})

export default EditMember;