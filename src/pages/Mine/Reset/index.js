import React, {useState, useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import {Formik, Field} from 'formik';
import {Button, Text} from '@rneui/themed';
import * as Yup from 'yup';

import FormItem from '../../../components/Form/FormItem';

const LoginSchema = Yup.object().shape({
  newPassword: Yup.string().min(6, '至少输入6个字符').required('请输入新密码'),
  verificationCode: Yup.string().required('请输入验证码')
});

const initialValues = {
  newPassword: '',
  verificationCode: ''
};

const Reset = () => {
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

  const onSubmit = values => console.log('onSubmit',values);

  const getVerificationCode = () => setTime(5);

  return (
    <View style={styles.screen}>
      <Formik
        initialValues={initialValues}
        // validationSchema={LoginSchema}
        onSubmit={onSubmit}>
          {({handleSubmit, ...rest}) => {
            return (
              <>
                <View style={{flex: 1}}>
                  <Text style={{margin: 20, color: 'grey'}}>已向您绑定的176***9417的手机发送验证码，请及时查收！</Text>
                  <View style={styles.formArea}>
                    <Field
                      name="newPassword"
                      placeholder="设置新密码（6~20位字符）"
                      title="新密码"
                      labelArea={styles.labelArea}
                      maxLength={20}
                      component={FormItem}
                    />
                    <Field
                      name="verificationCode"
                      placeholder="请输入验证码"
                      title="验证码"
                      maxLength={6}
                      labelArea={styles.labelArea}
                      containerStyle={{borderBottomWidth: 0}}
                      component={FormItem}
                      rightIcon={
                        <Button 
                          type="clear"
                          title={btnContent}
                          disabled={btnDisabled}
                          onPress={getVerificationCode}
                          titleStyle={[styles.smallTitleStyle, btnDisabled && styles.disabledBorderBottomColor]}
                          disabledTitleStyle={styles.disabledTitleStyle}
                        />
                      }
                    />
                  </View>
                </View>
                <View style={styles.btnArea}>
                  <Button
                    title="提 交"
                    onPress={handleSubmit}
                    buttonStyle={styles.buttonStyle}
                    containerStyle={styles.buttonContainerStyle}
                    titleStyle={styles.titleStyle}
                  />
                </View>
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
    marginHorizontal: 10
  },
  smallTitleStyle: {
    borderBottomWidth: 1, 
    borderBottomColor: 'grey', 
    color: 'grey'
  },
  disabledTitleStyle : {
    color: '#E3E3E3'
  },
  disabledBorderBottomColor: {
    borderBottomColor: '#E3E3E3'
  },
  labelArea: {
    justifyContent: 'center',
    marginRight: 0
  },
  btnArea: {
    height: 70, 
    justifyContent: 'center'
  },
  buttonStyle: {
    height: 45,
    backgroundColor: '#409EFF',
    borderColor: 'transparent',
    borderWidth: 0,
    borderRadius: 30
  },
  buttonContainerStyle: {
    marginHorizontal: 8
  },
  titleStyle: {
    fontSize: 20,
    fontWeight: 'bold'
  },
});

export default Reset;
