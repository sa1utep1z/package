import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  ToastAndroid,
} from 'react-native';
import {useToast} from 'react-native-toast-notifications';
import {CommonActions} from '@react-navigation/native';
import {Text, Button, CheckBox} from '@rneui/themed';
import {Formik, Field} from 'formik';
import * as Yup from 'yup';
import md5 from 'md5';

import httpRequest from '../../utils/httpRequest';
import storage from '../../utils/storage';
import NAVIGATION_KEYS from '../../navigator/key';
import Toast from '../../components/Toast';
import LoginInput from '../../components/LoginInput';
import {SUCCESS_CODE} from '../../utils/const';

let restForm;

const LoginSchema = Yup.object().shape({
  user: Yup.string().max(20, '输入账号过长').required('请输入账号'),
  password: Yup.string().min(6, '至少输入6个字符').required('请输入密码'),
});

const initialValues = {
  user: '',
  password: '',
};

const Login = props => {
  const {navigation} = props;
  const toast = useToast();

  const toastRef = useRef(null);

  const [radio, setRadio] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getUserMsg();
    storage.remove({key: 'token'});
  }, []);

  const getUserMsg = async () => {
    try {
      const userMsg = await storage.load({key: 'userMsg'});
      if (userMsg) {
        setRemember(true);
        const {setFieldValue} = restForm;
        const {account, password} = userMsg;
        setFieldValue('user', account);
        setFieldValue('password', password);
      }
    } catch (err) {
      console.log('userMsg->notFound', err);
    }
  };

  const login = async values => {
    console.log('你点击了');
    setLoading(true);
    const params = {
      loginType: 'pwd',
      account: values.user,
      password: md5(values.password),
    };
    console.log('params', params);
    try {
      const res = await httpRequest.post('admin/login/app', params);
      console.log('login->res', res);
      if (res.code !== SUCCESS_CODE) {
        toast.show(`${res.msg}`, {type: 'danger'});
        setLoading(false);
        return;
      }

      setLoading(false);
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
      toast.show(`请确认网络是否开启，或稍后重试。${err.response._response}`, { type: 'danger' });
      // navigation.navigate(NAVIGATION_KEYS.TABBAR);
      setLoading(false);
      return;
    }
  };

  const onSubmit = values => {
    const {
      current: {info},
    } = toastRef;
    if (!radio) {
      info('请勾选下方按钮');
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
        {/* <TouchableOpacity
          style={styles.registerArea}
          onPress={() => navigation.navigate(NAVIGATION_KEYS.REGISTER)}>
          <Text style={styles.registerArea_text}>注册</Text>
        </TouchableOpacity> */}
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
                <Field name="user" label="账号" component={LoginInput} />
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
                  size={40}
                  textStyle={{fontSize: 28, textAlignVertical: 'center'}}
                  containerStyle={styles.checkBox_fieldContainerStyle}
                />
                <Button
                  title="登录"
                  loading={loading}
                  onPress={handleSubmit}
                  titleStyle={{fontSize: 36}}
                  buttonStyle={[
                    styles.buttonStyle,
                    loading && {backgroundColor: '#CCCCCC'},
                  ]}
                  containerStyle={styles.buttonContainerStyle}
                />
              </View>
            );
          }}
        </Formik>
        <View style={styles.underButtonArea}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate(NAVIGATION_KEYS.VERIFICATION_LOGIN)
            }>
            <Text style={{fontSize: 30}}>验证码登录</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate(NAVIGATION_KEYS.FORGET_PSW)}>
            <Text style={{fontSize: 30}}>忘记密码？</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.bottomArea}>
          <CheckBox
            center
            checked={radio}
            onPress={() => setRadio(!radio)}
            size={40}
            containerStyle={styles.checkBox_containerStyle}
            checkedIcon="dot-circle-o"
            un="circle-o"
          />
          <Toast ref={toastRef} />
          <View style={styles.bottomArea_textArea}>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => setRadio(!radio)}>
              <Text style={styles.bottomArea_text}>请先阅读并同意</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate(NAVIGATION_KEYS.USER_AGREEMENT)
              }>
              <Text style={styles.bottomArea_btnText}>《用户协议》</Text>
            </TouchableOpacity>
            <Text style={styles.bottomArea_text}>和</Text>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate(NAVIGATION_KEYS.PRIVACY_POLICY)
              }>
              <Text style={styles.bottomArea_btnText}>《隐私政策》</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  totalArea: {
    flex: 1,
    backgroundColor: '#f5f8fa',
    paddingTop: 99
  },
  topArea: {
    flexDirection: 'row',
  },
  titleArea: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 31
  },
  registerArea: {
    width: 60,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerArea_text: {
    color: '#409EFF',
    fontSize: 18,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 60,
    fontFamily: 'PingFang SC',
    marginBottom: 29
  },
  text: {
    color: '#999999',
    fontSize: 24,
    fontWeight: '600',
    paddingLeft: 2,
  },
  centerArea: {
    flex: 1
  },
  formArea: {
    marginTop: 119
  },
  checkBox_fieldContainerStyle: {
    backgroundColor: 'rgba(0,0,0,0)',
    padding: 0,
    justifyContent: 'center'
  },
  buttonStyle: {
    height: 100,
    backgroundColor: '#409EFF',
    borderColor: 'transparent',
    borderWidth: 0,
    borderRadius: 50,
    marginHorizontal: 32
  },
  buttonContainerStyle: {
    marginTop: 120,
    marginBottom: 30
  },
  underButtonArea: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 33
  },
  bottomArea: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 0,
    marginBottom: 68
  },
  checkBox_containerStyle: {
    margin: 0,
    padding: 0,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0)',
  },
  bottomArea_textArea: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  bottomArea_text: {
    color: '#DDDDDD',
    fontSize: 24
  },
  bottomArea_btnText: {
    fontSize: 24
  },
});

export default Login;
