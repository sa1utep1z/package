import React, {useState, useEffect, forwardRef, useImperativeHandle} from "react";
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import {useToast} from 'react-native-toast-notifications';
import {CheckBox, Button} from '@rneui/themed';
import {Formik, Field} from 'formik';
import {CommonActions, useNavigation} from '@react-navigation/native';
import * as Yup from 'yup';
import md5 from 'md5';

import storage from '../../../utils/storage';
import httpRequest from '../../../utils/httpRequest';
import NAVIGATION_KEYS from '../../../navigator/key';
import {SUCCESS_CODE} from '../../../utils/const';
import LoginInput from '../../../components/LoginInput';
import VerifyCode from "../../../components/Form/VerifyCode";

let restForm, timer;

const initialValues = {
  mobile: '',
  verifyCode: ''
};

const LoginSchema = Yup.object().shape({
  mobile: Yup.string().required('请输入手机号'),
  verifyCode: Yup.string().required('请输入验证码')
});

const VerificationLoginRoute = ({props}, ref) => {
  const toast = useToast();
  const navigation = useNavigation();

  const [time, setTime] = useState(0);
  const [btnDisabled, setBtnDisabled] = useState(false);
  const [btnContent, setBtnContent] = useState('获取验证码');

  useEffect(()=>{
    if(time <= 0) {
      setBtnDisabled(false);
      setBtnContent('获取验证码');
      timer && clearInterval(timer);
      return;
    }
    if(time > 0){
      setBtnDisabled(true); 
      setBtnContent(`${time}s后重发`);
    }
    timer = setInterval(() => {
      setTime(time -1);
      setBtnContent(`${time - 1}s后重发`)
    }, 1000);
    return () => timer && clearInterval(timer);
  },[time]);

  //将这个表单暴露给父组件
  useImperativeHandle(ref, () => {
    return { restForm };
  }, []);

  const login = values => {
    console.log('submit -> values', values);
  };

  const onSubmit = values => login(values);

  const getVerificationCode = () => setTime(5);

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={LoginSchema}
      onSubmit={onSubmit}>
      {({...rest}) => {
        restForm = rest;
        return (
          <View style={{paddingTop: 20}}>
            <Field 
              name="mobile" 
              label="手机号" 
              maxLength={11}
              keyboardType="number-pad"
              selectTextOnFocus={true}
              component={LoginInput} 
              validate={(value)=>setBtnDisabled(value.length !== 11 ? true : false)}
              rightIcon={
                <Button 
                  type="clear"
                  title={btnContent}
                  disabled={btnDisabled}
                  onPress={getVerificationCode}
                  titleStyle={[styles.titleStyle, btnDisabled && styles.disabledBorderBottomColor]}
                  disabledTitleStyle={styles.disabledTitleStyle}
                />
              }
            />
            <Field
              name="verifyCode"
              component={VerifyCode}
            />
          </View>
        );
      }}
    </Formik>
  )
};

const styles = StyleSheet.create({
  titleStyle: {
    fontSize: 28,
    borderBottomWidth: 1, 
    borderBottomColor: 'grey', 
    color: 'grey'
  },
  disabledTitleStyle : {
    color: '#E3E3E3'
  },
  disabledBorderBottomColor: {
    borderBottomColor: '#E3E3E3'
  }
});

export default forwardRef(VerificationLoginRoute);