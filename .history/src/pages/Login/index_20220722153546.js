import React, {useState, useRef} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {Text, Button, CheckBox} from '@rneui/themed';
import {Formik, Field} from 'formik';
import * as Yup from 'yup';

import NAVIGATION_KEYS from '../../navigator/key';
import Toast from '../../components/Toast';
import LoginInput from '../../components/LoginInput';

const LoginSchema = Yup.object().shape({
  user: Yup.string().max(20, '输入账号过长').required('请输入账号'),
  password: Yup.string().min(6, '至少输入6个字符').required('请输入密码')
});

const Login = (props) => {
  const {navigation} = props;

  const [radio, setRadio] = useState(false);
  const toastRef = useRef(null);

  console.log('header', Headers)

  const initialValues = {
    user: '123456',
    password: '123456'
  };

  const onSubmit = values => {
    const {current: {info}} = toastRef;
    console.log('点击了登录的按钮');
    if(!radio) {
      console.log('进来了？')
      info("请先勾选下方按钮", 0.5)
      return;
    }
    navigation.navigate(NAVIGATION_KEYS.TABBAR);
  };

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
            {({handleSubmit}) => (
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
                  component={LoginInput}
                />
                <Button
                  title="登 录"
                  onPress={handleSubmit}
                  buttonStyle={styles.buttonStyle}
                  containerStyle={styles.buttonContainerStyle}
                />
              </View>
            )}
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
    justifyContent: 'center'
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