import React, {useState, useEffect, forwardRef, useImperativeHandle} from "react";
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import {useToast} from 'react-native-toast-notifications';
import {Formik, Field} from 'formik';
import {CommonActions, useNavigation} from '@react-navigation/native';
import * as Yup from 'yup';
import AntDesign from 'react-native-vector-icons/AntDesign';

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
  mobile: Yup.string().required('请输入手机号')
});

const VerificationLoginRoute = ({props}, ref) => {
  const toast = useToast();
  const navigation = useNavigation();

  const [time, setTime] = useState(0);
  const [btnDisabled, setBtnDisabled] = useState(false);
  const [btnContent, setBtnContent] = useState('获取验证码');

  useEffect(()=>{
    getUserMsg();
  },[])

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
    
  const getUserMsg = async () => {
    try {
      const userMsg = await storage.load({key: 'userMsg'});
      if (userMsg) {
        const {setFieldValue} = restForm;
        const {account} = userMsg;
        setFieldValue('mobile', account);
      }
    } catch (err) {
      console.log('getUserMsg_err -->Not Found Account&&Password', err);
    }
  };

  const login = async(values) => {
    if(!values.verifyCode){
      toast.show('请输入验证码！', {type: 'danger'});
      return;
    }else if(values.verifyCode.length !== 6){
      toast.show('请输入正确的验证码！', {type: 'danger'});
      return;
    }
    const params = {
      loginType: 'sms',
      account: values.mobile,
      smsValidCode: values.verifyCode
    };
    try {
      const res = await httpRequest.post('admin/login/app', params);
      console.log('login->res', res);
      if (res.code !== SUCCESS_CODE) {
        toast.show(`${res.msg}，请重新输入`, {type: 'danger'});
        restForm.setFieldValue('verifyCode', '');
        return;
      }

      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [
            {
              name: NAVIGATION_KEYS.TABBAR,
            },
          ],
        }),
      );

      //保存token
      storage.save({
        key: 'token',
        data: res.data,
        expires: null,
      });
    } catch (err) {
      console.log('err', err);
      toast.show(`请确认网络是否开启，或稍后重试。`, { type: 'danger' });
      return;
    }
  };

  const onSubmit = values => login(values);

  const getVerificationCode = async() => {
    const {mobile} = restForm.values;
    try{
      const res = await httpRequest.get(`sms/sendSmsCode/login/${mobile}`);
      if (res.code !== SUCCESS_CODE) {
        toast.show(`${res.msg}`, {type: 'danger'});
        return;
      }
      toast.show('验证码短信已发送，请注意查收！',{type: 'success'});
      setTime(60);
    }catch(err){
      console.log('code->err', err);
      toast.show('验证码短信发送失败，请联系管理员处理',{type: 'danger'});
    }
  };

  const clearMobile = () => restForm.setFieldValue('mobile', '');

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
              validate={(value)=>setBtnDisabled(value.length !== 11)}
              rightIcon={
                <View style={{flexDirection: 'row'}}>
                  {!!restForm.values.mobile.length &&<TouchableOpacity onPress={clearMobile} style={styles.clearIcon}>
                    <AntDesign
                      name='closecircle'
                      size={30}
                      color='#999999'
                    />
                  </TouchableOpacity>}
                  <TouchableOpacity activeOpacity={btnDisabled ? 1 : 0.2} onPress={!btnDisabled ? () => getVerificationCode() : () => console.log('禁止点击')} style={[styles.btnArea, btnDisabled && styles.btnArea_disabled]}>
                    <Text style={[styles.btnText, btnDisabled && styles.btnText_disabled]}>{btnContent}</Text>
                  </TouchableOpacity>
                </View>
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
  clearIcon: {
    justifyContent: 'center', 
    marginTop: 10, 
    paddingRight: 10
  },
  btnArea: {
    marginTop: 10, 
    backgroundColor: '#409EFF', 
    padding: 10, 
    borderRadius: 6
  },
  btnArea_disabled: {
    backgroundColor: '#E3E3E3'
  },
  btnText: {
    fontSize: 26, 
    color: '#ffffff',
    fontWeight: 'bold'
  },
  btnText_disabled: {
    color: '#999999', 
    fontWeight: 'normal'
  }
});

export default forwardRef(VerificationLoginRoute);