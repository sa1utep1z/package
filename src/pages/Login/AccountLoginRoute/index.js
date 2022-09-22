import React, {useState, useEffect, forwardRef, useImperativeHandle} from "react";
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import {useToast} from 'react-native-toast-notifications';
import {CheckBox} from '@rneui/themed';
import {Formik, Field} from 'formik';
import {CommonActions, useNavigation} from '@react-navigation/native';
import * as Yup from 'yup';
import md5 from 'md5';

import storage from '../../../utils/storage';
import httpRequest from '../../../utils/httpRequest';
import NAVIGATION_KEYS from '../../../navigator/key';
import LoginInput from '../../../components/LoginInput';
import {SUCCESS_CODE} from '../../../utils/const';

let restForm;

const initialValues = {
  user: '',
  password: ''
};

const LoginSchema = Yup.object().shape({
  user: Yup.string().max(20, '输入账号过长').required('请输入账号'),
  password: Yup.string().min(6, '至少输入6个字符').required('请输入密码'),
});

const AccountLoginRoute = ({props}, ref) => {
  const toast = useToast();
  const navigation = useNavigation();

  const [remember, setRemember] = useState(false);

  useEffect(() => {
    storage.remove({key: 'token'});
    getUserMsg();
  }, []);

  //将这个表单暴露给父组件
  useImperativeHandle(ref, () => {
    return { restForm };
  }, []);
  
  const getUserMsg = async () => {
    try {
      const userMsg = await storage.load({key: 'userMsg'});
      if (userMsg) {
        setRemember(true);
        const {setFieldValue} = restForm;
        const {account, password} = userMsg;
        setFieldValue('user', account);
        if(props.route.params === 'reset'){
          return;
        }
        setFieldValue('password', password);
        //防止多次弹窗
        if(window.handleUnauthorized){
          toast.show('登录信息失效', {type: 'danger'});
          return;
        }
        if(props.route.params === 'logout'){
          return;
        }
        restForm.submitForm();
      }
    } catch (err) {
      console.log('getUserMsg_err -->Not Found Account&&Password', err);
    }
  };

  const login = async values => {
    const params = {
      loginType: 'pwd',
      account: values.user,
      password: md5(values.password),
    };
    try {
      const res = await httpRequest.post('admin/login/app', params);
      console.log('login->res', res);
      if (res.code !== SUCCESS_CODE) {
        toast.show(`${res.msg}`, {type: 'danger'});
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

      //保存账号密码
      if (remember) {
        storage.save({
          key: 'userMsg',
          data: {
            account: values.user,
            password: values.password,
          },
          expires: 30 * 1000 * 3600 * 24, //30天保存
        });
      } else {
        storage.remove({key: 'userMsg'});
      }
    } catch (err) {
      console.log('err', err);
      toast.show(`请确认网络是否开启，或稍后重试。`, { type: 'danger' });
      return;
    }
  };

  const onSubmit = values => login(values);

  const rememberOnPress = () => setRemember(!remember);

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={LoginSchema}
      onSubmit={onSubmit}>
      {({handleSubmit, ...rest}) => {
        restForm = rest;
        return (
          <View style={{paddingTop: 20}}>
            <Field 
              name="user" 
              label="账号" 
              onSubmitEditing={()=>console.log('点击了确定')}
              component={LoginInput}
            />
            <Field
              name="password"
              label="密码"
              maxLength={20}
              password
              onSubmitEditing={handleSubmit}
              component={LoginInput}
            />
            <View style={styles.bottomArea}>
              {/* <TouchableOpacity onPress={() => navigation.navigate(NAVIGATION_KEYS.FORGET_PSW)}>
                <Text style={{fontSize: 28}}>忘记密码？</Text>
              </TouchableOpacity> */}
              <CheckBox
                title="记住密码"
                checked={remember}
                onPress={rememberOnPress}
                size={40}
                textStyle={{fontSize: 28, textAlignVertical: 'center'}}
                containerStyle={styles.checkBox_fieldContainerStyle}
              />
            </View>
          </View>
        );
      }}
    </Formik>
  )
};

const styles = StyleSheet.create({
  bottomArea: {
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'flex-end'
  },
  checkBox_fieldContainerStyle: {
    padding: 0
  }
});

export default forwardRef(AccountLoginRoute);