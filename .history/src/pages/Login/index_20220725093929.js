import React, {useState, useRef, useEffect} from 'react';
import {View, StyleSheet, TouchableOpacity, KeyboardAvoidingView} from 'react-native';
import { useToast } from "react-native-toast-notifications";
import { CommonActions } from '@react-navigation/native';
import {Text, Button, CheckBox} from '@rneui/themed';
import {Formik, Field} from 'formik';
import * as Yup from 'yup';
import md5 from 'md5';

import httpRequest from '../../utils/httpRequest';
import storage from '../../utils/storage';
import NAVIGATION_KEYS from '../../navigator/key';
import Toast from '../../components/Toast';
import LoginInput from '../../components/LoginInput';
import { SUCCESS_CODE } from '../../utils/const';

let restForm;

const LoginSchema = Yup.object().shape({
  user: Yup.string().max(20, '输入账号过长').required('请输入账号'),
  password: Yup.string().min(6, '至少输入6个字符').required('请输入密码')
});

const initialValues = {
  user: '',
  password: ''
};

const Login = (props) => {
  const {navigation} = props;
  const toast = useToast();

  const toastRef = useRef(null);

  const [radio, setRadio] = useState(false);
  const [remember, setRemember] = useState(false);

  useEffect(()=> {
    getUserMsg();
  },[])

  const getUserMsg = async() => {
    try{
      const userMsg = await storage.load({key: 'userMsg'});
      if(userMsg){
        setRemember(true);
        const {setFieldValue} = restForm;
        const {account, password} = userMsg;
        setFieldValue('user', account);
        setFieldValue('password', password);
      }
    }catch(err) {
      console.log('userMsg->notFound', err);
    }
  };

  const login = async(values) => {
    const params = {
      loginType: 'pwd',
      account: values.user,
      password: md5(values.password)
    };

    const res = await httpRequest.post('admin/login/app', params);
    console.log('login->res',res);
    if(res.code !== SUCCESS_CODE){
      toast.show(`${res.msg}`, {
        type: 'danger'
      });
      return;
    }
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{
            name: NAVIGATION_KEYS.TABBAR,
        }]
      })
    );

    //保存token
    storage.save({
      key: 'token',
      data: res.data,
      expires: null
    });

    //保存账号密码
    if(remember){
      storage.save({
        key: 'userMsg',
        data: {
          account: values.user,
          password: values.password
        },
        expires: 30 * 1000 * 3600 * 24 //30天保存
      })
    }else{
      storage.remove({ key: 'userMsg' });
    }
  };

  const onSubmit = values => {
    const {current: {info}} = toastRef;
    if(!radio) {
      info("请勾选下方按钮");
      return;
    }
    login(values);
  };

  const rememberOnPress = () => setRemember(!remember);

  return (
    <View style={styles.totalArea}>
      <View style={styles.topArea}>
        <View style={styles.titleArea}>
          <Text style={styles.title}>登录</Text>
          <Text style={styles.text}>登录注册以后使用更多服务</Text>
        </View>
        <TouchableOpacity style={styles.registerArea} onPress={()=>navigation.navigate(NAVIGATION_KEYS.REGISTER)}>
          <Text style={styles.registerArea_text}>注册</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.centerArea}>
        <Formik
          initialValues={initialValues}
          validationSchema={LoginSchema}
          onSubmit={onSubmit}>
            {({handleSubmit, ...rest}) => {
              restForm = rest;
              return (
                <View style={styles.formArea}>
                  <Field
                    name="user"
                    label="账号"
                    component={LoginInput}
                  />
                  <Field
                    name="password"
                    label="密码"
                    maxLength={20}
                    password
                    component={LoginInput}
                  />
                  <CheckBox
                    right
                    title="记住密码"
                    checked={remember}
                    onPress={rememberOnPress}
                    containerStyle={styles.checkBox_fieldContainerStyle}
                  />
                  <Button
                    title="登 录"
                    onPress={handleSubmit}
                    buttonStyle={styles.buttonStyle}
                    containerStyle={styles.buttonContainerStyle}
                  />
                </View>
            )}}
        </Formik>
        <View style={styles.underButtonArea}>
          <TouchableOpacity onPress={()=>navigation.navigate(NAVIGATION_KEYS.VERIFICATION_LOGIN)}>
            <Text>验证码登录</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>navigation.navigate(NAVIGATION_KEYS.FORGET_PSW)}>
            <Text>忘记密码？</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.bottomArea}>
        <CheckBox
          center
          checked={radio}
          onPress={() => setRadio(!radio)}
          containerStyle={styles.checkBox_containerStyle}
          checkedIcon={<Text style={styles.checkBox_icon}>{'\ue669'}</Text>}
          uncheckedIcon={<Text style={styles.checkBox_icon}>{'\ue68d'}</Text>}
        />
        <Toast ref={toastRef}/>
        <View style={styles.bottomArea_textArea}>
          <TouchableOpacity activeOpacity={1} onPress={() => setRadio(!radio)}>
            <Text style={styles.bottomArea_text}>请先阅读并同意</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>navigation.navigate(NAVIGATION_KEYS.USER_AGREEMENT)}>
            <Text style={styles.bottomArea_btnText}>《用户协议》</Text>
          </TouchableOpacity>
          <Text style={styles.bottomArea_text}>和</Text>
          <TouchableOpacity onPress={()=>navigation.navigate(NAVIGATION_KEYS.PRIVACY_POLICY)}>
            <Text style={styles.bottomArea_btnText}>《隐私政策》</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )};

const styles = StyleSheet.create({
  totalArea: {
    flex: 1, 
    backgroundColor: '#f5f8fa'
  },
  topArea: {
    height: 180,
    flexDirection: 'row'
  },
  titleArea: {
    flex: 1, 
    justifyContent: 'center', 
    paddingLeft: 12
  },
  registerArea: {
    width: 60, 
    height: 50, 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  registerArea_text: {
    color: '#409EFF', 
    fontSize: 18
  },
  title: {
    width: 118,
    fontWeight: 'bold',
    fontSize: 35,
    fontFamily: 'PingFang SC'
  },
  text: {
    color: '#999999',
    fontSize: 13,
    fontWeight: '600',
    paddingLeft: 2
  },
  centerArea: {
    flex: 1,
    paddingHorizontal: 5
  },
  formArea: {
    paddingTop: 30
  },
  checkBox_fieldContainerStyle: {
    backgroundColor: 'rgba(0,0,0,0)', 
    padding: 0
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
    marginTop: 40,
    marginBottom: 10
  },
  underButtonArea: {
    height: 20, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    paddingHorizontal: 8
  },
  bottomArea: {
    height: 80, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center',
    position: 'absolute',
    bottom: 0,
    borderWidth: 1
  },
  checkBox_containerStyle: {
    height: 20,
    margin: 0,
    padding: 0,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0)'
  },
  checkBox_icon: {
    fontFamily: "iconfont", 
    color: '#DDDDDD', 
    fontSize: 20
  },
  bottomArea_textArea: {
    flexDirection: 'row'
  },
  bottomArea_text: {
    color: '#DDDDDD'
  },
  bottomArea_btnText: {
    fontSize: 14
  }
})

export default Login;