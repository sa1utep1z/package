import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, Text, PermissionsAndroid, Platform, Alert } from 'react-native';
import { Button } from '@rneui/themed';
import { Formik, Field } from 'formik';
import * as Yup from 'yup';
import { useToast } from "react-native-toast-notifications";
import FormItem from '../../../components/Form/FormItem';
import TwoRadio from '../../../components/Form/TwoRadio';
import Radio from '../../../components/Form/Radio';
import SelectItem from '../../../components/Form/SelectItem';
import { IDCard, phone } from '../../../utils/validate';
import { ARRIVE_WAY, COMPANY_ENGLISH } from '../../../utils/const';
import HomeApi from "../../../request/HomeApi";
import ImagePicker from 'react-native-image-crop-picker';
import NAVIGATION_KEYS from '../../../navigator/key';


let restForm;
const SignUp = (props) => {
  const { navigation, route: { params } } = props;
  const [orderId, setOrderId] = useState(params?.orderId); // 订单id
  console.log('路由跳转的订单id：',params.orderId)
  const toast = useToast();
  const initialValues = {
    jobName: params.jobName,
    name: '',
    idNo: '',
    mobile: '',
    nation: '',
    address: '',
    authority: '',
    timeLimit: '',
    arrivalMode: 'STORE',
    remark: '',
    tip: true
  };

  // 提交报名表单
  const onSubmit = async (values) => {
    console.log('提交是否成功：', values)
    const prams = {
      ...values,
      arrivalMode: values.arrivalMode === true ? 'STORE' : 'FACTORY',
    }
    try {
      const res = await HomeApi.SignUp(orderId, prams);
      if (res.code === 0) {
        toast.show('提交成功');
        navigation && navigation.goBack();
        console.log('提交是否成功：', prams, orderId)
        return;
      } else {
        toast.show(`${res.msg}`, {
          duration: 10000,
          placement: 'center',
        });
      }
    } catch (error) {
      toast.show('报名失败，请稍后再试');
      console.log('打印异常：', error)
    }
  }

  // 上传图片
  const uploadImage = async (fileName, localFilePath) => {
    const data = new FormData();
    const file = {
      uri: localFilePath, type: 'multipart/form-data', name: fileName,
    };
    data.append('file', file);
    const res = await HomeApi.ocrReq(data)
    const newData = res.data;
    const formData = restForm.values;
    if (res.code == 0) {
      toast.show('识别成功')
      if (newData.timeLimit || newData.authority) {
        restForm.setValues({ ...restForm.values, jobName: params.jobName, timeLimit: newData.timeLimit, authority: newData.authority })
      } else {
        const prams = {
          ...res.data,
          timeLimit: formData.timeLimit ? formData.timeLimit : '',
          authority: formData.authority ? formData.authority : '',
          mobile: formData.mobile ? formData.mobile : '',
          jobName: params.jobName,
        }
        restForm.setValues(prams)
      }
    } else {
      toast.show('识别失败，请重新识别一次')
    }
  }

  //调用相机拍照
  const openCamera = async () => {
    const cameraImage = await ImagePicker.openCamera({
      cropperChooseText: '确定',
      cropperCancelText: '取消',
      cropping: false,
      multiple: false,
      compressImageQuality: 0.2,
    });
    console.log('相机拍照数据：', cameraImage);
    const fileName = `${cameraImage.modificationDate}${Math.round(Math.random() * 1000000000000) + '.jpg'}`;
    console.log('相机拍照文件名：', fileName);
    uploadImage(fileName, cameraImage.path);
  }

  // 获取权限
  const openPermission = async () => {
    let isOpen = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA)
    if (Platform.OS === 'android' && !isOpen) {
      let res = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA)
      if (res !== 'granted') {
        Alert.alert('相机权限没打开', '请在手机的“设置”选项中允许访问您的摄像头和麦克风')
      }
    }
    openCamera();
  }

  return (
    <Formik
      initialValues={initialValues}
      // validationSchema={SignUpValidationSchema}
      handleChange={(e) => console.log('e', e)}
      onSubmit={onSubmit}>
      {({ handleSubmit, ...rest }) => {
        restForm = rest;
        return (
          <View style={{ flex: 1 }}>
            <ScrollView style={styles.scrollArea}>
              <View style={[styles.cardArea, { marginTop: 28 }]}>
                <Field
                  name="jobName"
                  title="岗位名称"
                  disabled
                  component={FormItem}
                />
                <Field
                  name="name"
                  title="姓名"
                  placeholder="请输入会员姓名"
                  OCR
                  onPress={openPermission}
                  autoFocus
                  isRequired
                  component={FormItem}
                />
                <Field
                  name="idNo"
                  title="身份证"
                  placeholder="请输入会员身份证"
                  maxLength={18}
                  validate={value => {
                    let errorMsg;
                    if (!IDCard.test(value)) {
                      errorMsg = '请输入正确的身份证号';
                    }
                    return errorMsg
                  }}
                  isRequired
                  component={FormItem}
                />
                <Field
                  name="mobile"
                  title="手机号"
                  placeholder="请输入会员手机号"
                  maxLength={11}
                  validate={value => {
                    let errorMsg;
                    if (!phone.test(value)) {
                      errorMsg = '请输入正确的手机号';
                    }
                    return errorMsg
                  }}
                  isRequired
                  component={FormItem}
                />
                <Field
                  name="nation"
                  title="民族"
                  placeholder="请输入会员民族"
                  component={FormItem}
                />
                <Field
                  name="address"
                  title="户籍地址"
                  placeholder="请输入会员户籍地址"
                  noBorder
                  component={FormItem}
                />
              </View>
              <>
                <View style={styles.cardArea}>
                  <Field
                    name="authority"
                    title="签发机关"
                    placeholder="请输入签发机关"
                    OCR
                    onPress={openPermission}
                    component={FormItem}
                  />
                  <Field
                    name="timeLimit"
                    title="有效期限"
                    placeholder="请输入有效期限"
                    noBorder
                    component={FormItem}
                  />
                </View>
              </>
              <>
                {/* <Text style={styles.theWayToGo}>到场方式</Text> */}
                <View style={styles.cardArea}>
                  <Field
                    name="arrivalMode"
                    title="到场方式"
                    placeholder="到场方式"
                    noBorder
                    isRequired
                    component={Radio}
                  />
                </View>
              </>
              {/* <>
                <View style={styles.cardArea}>
                  <Field
                    name="tip"
                    title="是否住宿"
                    placeholder="是否住宿"
                    noBorder
                    isRequired
                    component={TwoRadio}
                  />
                </View>
              </> */}
            </ScrollView>
            <Button
              title="帮他报名"
              onPress={handleSubmit}
              buttonStyle={styles.buttonStyle}
              titleStyle={styles.titleStyle}
            />
          </View>
        )
      }}
    </Formik>
  )
};

const styles = StyleSheet.create({
  scrollArea: {
    flex: 1,
    paddingHorizontal: 28
  },
  btnArea: {
    justifyContent: 'center',
    borderWidth: 1
  },
  buttonStyle: {
    height: 80,
    backgroundColor: '#409EFF',
    borderColor: 'transparent',
    borderRadius: 50,
    marginBottom: 28,
    marginHorizontal: 28
  },
  titleStyle: {
    fontSize: 32,
    fontWeight: 'bold',
    letterSpacing: 10,
  },
  theWayToGo: {
    color: '#000',
    fontSize: 15,
    fontWeight: 'bold',
    marginLeft: 10,
    marginBottom: 10
  },
  cardArea: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 28,
    fontSize: 32
  }
})

export default SignUp;