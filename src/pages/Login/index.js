import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  ScrollView,
  KeyboardAvoidingView,
  ToastAndroid,
} from 'react-native';
import {useToast} from 'react-native-toast-notifications';
import {CommonActions, useNavigation} from '@react-navigation/native';
import {Text, Button, CheckBox} from '@rneui/themed';
import {Formik, Field} from 'formik';
import { TabView, TabBar } from 'react-native-tab-view';
import md5 from 'md5';
import { SceneMap } from 'react-native-tab-view';

import httpRequest from '../../utils/httpRequest';
import storage from '../../utils/storage';
import NAVIGATION_KEYS from '../../navigator/key';
import Toast from '../../components/Toast';
import LoginInput from '../../components/LoginInput';
import {SUCCESS_CODE} from '../../utils/const';
import AccountLoginRoute from './AccountLoginRoute';
import VerificationLoginRoute from './VerificationLoginRoute';

let restForm;

// const verificationLoginRoute = () => {
//   const toast = useToast();

//   const onSubmit = values => {
//     toast.show('敬请期待...', {type: 'warning'});
//     console.log('执行的是验证码登录', values);
//   };

//   return (
//     <View style={{minHeight: 370, justifyContent: 'center'}}>
//       <Text style={{textAlign: 'center', textAlignVertical: 'center', fontSize: 28}}>敬请期待...</Text>
//       {/* <Formik
//         initialValues={initialValues}
//         validationSchema={LoginSchema}
//         onSubmit={onSubmit}>
//         {({handleSubmit, ...rest}) => {
//           restForm = rest;
//           return (
//             <View style={{paddingTop: 20}}>
//               <Field name="mobile" label="手机号" component={LoginInput} />
//               <Field
//                 name="verifyCode"
//                 label="验证码"
//                 maxLength={6}
//                 component={LoginInput}
//               />
//             </View>
//           );
//         }}
//       </Formik> */}
//     </View>
//   )
// };

const Login = props => {
  const {navigation} = props;

  const toast = useToast();

  const AccountLoginRef = useRef(null);
  const VerificationLoginRef = useRef(null);
  
  const [index, setIndex] = useState(0);
  const [radio, setRadio] = useState(true);
  const [loading, setLoading] = useState(false);

  const renderLabel = ({ route, focused, color }) => (
    <Text style={[{fontSize: 36, color}, focused && {fontWeight: 'bold'}]}>
      {route.title}
    </Text>
  );

  const tabBar = props => (
    <TabBar
      pressColor="#fff"
      activeColor="#409EFF"
      inactiveColor="#999999"
      bounces={true}
      style={styles.tabBarStyle}
      indicatorStyle={styles.tabBarIndicatorStyle}
      renderLabel={renderLabel}
      {...props}
    />
  );

  const renderScene = ({route}) => {
    switch(route.key){
      case 'accountLogin': 
        return <AccountLoginRoute ref={AccountLoginRef} props={props} />
      case 'verificationLogin':
        return <VerificationLoginRoute ref={VerificationLoginRef} props={props} />
    }
  };

  const renderRoute = [
    { key: 'accountLogin', title: '密码登录' },
    { key: 'verificationLogin', title: '验证码登录' },
  ];

  const submit = () => {
    if(!radio){
      toast.show('请勾选下方按钮', {type: 'warning'});
      return;
    }
    if(index === 0){
      const {current: {restForm}} = AccountLoginRef;
      restForm.submitForm();
    }
    if(index === 1){
      toast.show('敬请期待...', {type: 'warning'});
      const {current: {restForm}} = VerificationLoginRef;
      restForm.submitForm();
      return;
    }
  };

  return (
    <ImageBackground style={styles.totalArea} source={require('../../assets/images/Login.jpg')}>
      <View style={{flex: 4}}></View>
      <View style={{flex: 6}}>
        <View style={{paddingHorizontal: 92, minHeight: 500}}>
          <TabView
            renderTabBar={tabBar}
            onIndexChange={setIndex}
            renderScene={renderScene}
            navigationState={{ index, routes: renderRoute }}
          />
        </View>
        <Button
          title="登录"
          loading={false}
          onPress={submit}
          titleStyle={{fontSize: 48}}
          buttonStyle={[
            styles.buttonStyle,
            // loading && {backgroundColor: '#CCCCCC'}
          ]}
          containerStyle={styles.buttonContainerStyle}
        />
      </View>
        
      {/* <View style={styles.underButtonArea}>
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
      </View> */}
      <View style={styles.bottomArea}>
        <CheckBox
          center
          checked={radio}
          onPress={() => setRadio(!radio)}
          size={40}
          containerStyle={styles.checkBox_containerStyle}
          checkedIcon="dot-circle-o"
          uncheckedIcon="circle-o"
        />
        <View style={styles.bottomArea_textArea}>
          <TouchableOpacity
            activeOpacity={1}
            style={{height: '100%', justifyContent: 'center'}}
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
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  totalArea: {
    flex: 1,
    justifyContent: 'center',
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
  checkBox_fieldContainerStyle: {
    backgroundColor: 'rgba(0,0,0,0)',
    padding: 0,
    justifyContent: 'center',
    paddingTop:10
  },
  buttonStyle: {
    height: 100,
    backgroundColor: '#409EFF',
    borderColor: 'transparent',
    borderWidth: 0,
    borderRadius: 50,
  },
  buttonContainerStyle: {
    paddingHorizontal: 32
  },
  underButtonArea: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 33,
  },
  bottomArea: {
    height: 140,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 0
  },
  checkBox_containerStyle: {
    margin: 0,
    padding: 0,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0)'
  },
  bottomArea_textArea: {
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%'
  },
  bottomArea_text: {
    color: '#000',
    fontSize: 24
  },
  bottomArea_btnText: {
    fontSize: 24,
    color: '#409EFF'
  },
  tabBarStyle: {
    height: 80,
    backgroundColor: '#fff'
  },
  tabBarIndicatorStyle: {
    backgroundColor: '#409EFF' 
  }
});

export default Login;
