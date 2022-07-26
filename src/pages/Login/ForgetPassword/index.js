import React, {useState, useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import {Formik, Field} from 'formik';
import {Button} from '@rneui/themed';
import * as Yup from 'yup';

import LoginInput from '../../../components/LoginInput';

const ForgetPassword = () => {
  let timer;
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

  const initialValues = {
    user: '',
    verificationCode: '',
    newPassword: ''
  };

  const LoginSchema = Yup.object().shape({
    user: Yup.string().required('请输入手机号').matches(/^1[3456789]\d{9}$/, '请输入合法的电话号码'),
    verificationCode: Yup.string().required('请输入验证码'),
    newPassword: Yup.string().min(6, '至少输入6个字符').required('请输入新密码')
  });

  const onSubmit = values => console.log('onSubmit',values);

  const getVerificationCode = () => setTime(5);

  return (
    <View style={styles.screen}>
      <Formik
        initialValues={initialValues}
        validationSchema={LoginSchema}
        onSubmit={onSubmit}>
          {({handleSubmit, ...rest}) => {
            return (
              <View style={styles.formArea}>
                <Field
                  name="user"
                  label="账号"
                  placeholder="请输入手机号"
                  maxLength={11}
                  component={LoginInput}
                />
                <Field
                  name="verificationCode"
                  label="验证码"
                  maxLength={6}
                  component={LoginInput}
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
                  name="newPassword"
                  label="新密码"
                  maxLength={20}
                  placeholder="设置登录密码（6~20位字符）"
                  component={LoginInput}
                />
                <Button
                  title="确 认"
                  onPress={handleSubmit}
                  buttonStyle={styles.buttonStyle}
                  containerStyle={styles.buttonContainerStyle}
                />
              </View>
            )}}
      </Formik>
    </View>
)};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 5
  },
  formArea: {
    marginTop: 60
  },
  buttonStyle: {
    height: 50,
    backgroundColor: '#409EFF',
    borderColor: 'transparent',
    borderWidth: 0,
    borderRadius: 30
  },
  buttonContainerStyle: {
    marginHorizontal: 8,
    marginTop: 50,
    marginBottom: 10
  },
  titleStyle: {
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

export default ForgetPassword;
