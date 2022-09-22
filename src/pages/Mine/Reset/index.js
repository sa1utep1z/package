import React, {useState, useEffect} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {Formik, Field} from 'formik';
import {Button, Text} from '@rneui/themed';
import * as Yup from 'yup';
import { useToast } from 'react-native-toast-notifications';
import { useNavigation, CommonActions } from '@react-navigation/native';
import md5 from 'md5';

import FormItem from '../../../components/Form/FormItem';
import AccountApi from '../../../request/AccountApi';
import { SUCCESS_CODE } from '../../../utils/const';
import NAVIGATION_KEYS from '../../../navigator/key';

const LoginSchema = Yup.object().shape({
  newPassword: Yup.string().min(6, '至少输入6个字符').required('请输入新密码'),
  verificationCode: Yup.string().min(6, '请输入正确的验证码').required('请输入验证码')
});

const initialValues = {
  newPassword: '',
  verificationCode: ''
};
let timer;

const Reset = ({route: {params}}) => {
  const toast = useToast();
  const navigation = useNavigation();

  const [time, setTime] = useState(0);
  const [btnDisabled, setBtnDisabled] = useState(false);
  const [btnContent, setBtnContent] = useState('获取验证码');
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    console.log('params.startCounting', params.startCounting);
    if(params.startCounting){
      setBtnDisabled(true);
      setTime(60);
    }
  }, [params.startCounting])

  const onSubmit = values => resetPassword(values);

  const getVerificationCode = async() => {
    try {
      const res = await AccountApi.SendCodeOfReset(params.mobile);
      if(res?.code !== SUCCESS_CODE){
        toast.show(`${res?.msg}`, {type: 'danger'});
        return;
      }
      toast.show('验证码发送成功，请注意查收', {type: 'success'});
      setTime(60);
    } catch (error) {
      console.log('error', error);
      toast.show(`出现了意料之外的问题，请联系系统管理员处理`, { type: 'danger' });
    }
  };

  const resetPassword = async(values) => {
    setLoading(true);
    const parameters = {
      account: params.mobile,
      password: md5(values.newPassword),
      smsValidCode: values.verificationCode
    };
    try {
      const res = await AccountApi.ResetPassword(parameters);
      console.log('res', res)
      if (res.code !== SUCCESS_CODE) {
        toast.show(`${res.msg}`, {type: 'danger'});
        return;
      }
      toast.show('密码修改成功，请重新登录', {type: 'success'});
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{
            name: NAVIGATION_KEYS.LOGIN,
            params: 'reset'
          }],
        })
      );
    } catch (error) {
      console.log('error', error);
      toast.show('出现了意料之外的问题，请联系系统管理员处理', {type: 'danger'});
    } finally{
      setLoading(false);
    }
  };

  return (
    <View style={styles.screen}>
      <Formik
        initialValues={initialValues}
        validationSchema={LoginSchema}
        onSubmit={onSubmit}>
          {({handleSubmit, ...rest}) => {
            return (
              <>
                <View style={{flex: 1, paddingTop: 32}}>
                  {params.startCounting ? <Text selectable style={{color: 'grey', fontSize: 32, paddingHorizontal: 32, paddingBottom: 32}}>已向您绑定的 <Text selectable style={{color: '#409EFF'}}>{params.mobile}</Text> 的手机发送验证码，请及时查收！</Text> : <Text style={{color: 'grey', fontSize: 32, paddingHorizontal: 32, paddingBottom: 32}}>请点击下方按钮获取验证码。</Text>}
                  <View style={styles.formArea}>
                    <Field
                      name="newPassword"
                      placeholder="设置新密码（6~20位字符）"
                      title="新密码"
                      labelAreaStyle={styles.labelAreaStyle}
                      errInputStyle={{textAlign: 'left', paddingLeft: 28}}
                      maxLength={20}
                      validate={value => setBtnDisabled(!value.length)}
                      component={FormItem}
                    />
                    <Field
                      name="verificationCode"
                      placeholder="请输入验证码"
                      title="验证码"
                      maxLength={6}
                      keyboardType="numeric"
                      labelAreaStyle={styles.labelAreaStyle}
                      containerStyle={{borderBottomWidth: 0}}
                      errInputStyle={{textAlign: 'left', paddingLeft: 28}}
                      component={FormItem}
                      rightIcon={
                        <TouchableOpacity activeOpacity={btnDisabled ? 1 : 0.2} onPress={!btnDisabled ? () => getVerificationCode() : () => console.log('禁止点击')} style={[styles.btnArea, btnDisabled && styles.btnArea_disabled]}>
                          <Text style={[styles.btnText, btnDisabled && styles.btnText_disabled]}>{btnContent}</Text>
                        </TouchableOpacity>
                      }
                    />
                  </View>
                </View>
                <Button
                  title="提 交"
                  loading={loading}
                  onPress={handleSubmit}
                  buttonStyle={styles.buttonStyle}
                  containerStyle={styles.buttonContainerStyle}
                  titleStyle={styles.titleStyle}
                />
              </>
            )}}
      </Formik>
    </View>
)};

const styles = StyleSheet.create({
  screen: {
    flex: 1
  },
  formArea: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginHorizontal: 32
  },
  labelAreaStyle: {
    justifyContent: 'center',
    marginRight: 0
  },
  buttonStyle: {
    height: 90,
    backgroundColor: '#409EFF',
    borderColor: 'transparent',
    borderWidth: 0,
    borderRadius: 50
  },
  buttonContainerStyle: {
    marginHorizontal: 32,
    marginBottom: 32
  },
  titleStyle: {
    fontSize: 36,
    fontWeight: 'bold'
  },
  btnArea: {
    backgroundColor: '#409EFF', 
    paddingHorizontal: 10,
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

export default Reset;
