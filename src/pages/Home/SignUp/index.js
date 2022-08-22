import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, Text, Modal, PermissionsAndroid, Platform, Alert, TouchableHighlight } from 'react-native';
import { Button } from '@rneui/themed';
import { Formik, Field } from 'formik';
import * as Yup from 'yup';
import moment from 'moment';
import { useToast } from "react-native-toast-notifications";
import FormItem from '../../../components/Form/FormItem';
import Radio from '../../../components/Form/Radio';
import SignUpDate from '../signUpDate';
import { IDCard, phone } from '../../../utils/validate';
import HomeApi from "../../../request/HomeApi";
import ImagePicker from 'react-native-image-crop-picker';
import AntDesign from 'react-native-vector-icons/AntDesign';


let restForm;
const SignUp = (props) => {
  const { navigation, route: { params } } = props;
  const [orderId, setOrderId] = useState(params?.orderId); // 订单id
  const [modalVisible, setModalVisible] = useState(false); // 图库选择、拍照弹框
  const time = '23:59:00'
  const startDate = new Date(`${params.startDate} ${time}`); // 开始日期
  const endDate = new Date(`${params.endDate} ${time}`); // 结束日期
  const toast = useToast();
  var now = new Date();
  var nowTime = now.getTime();
  var year = now.getFullYear();
  var month = now.getMonth() + 1;//js从0开始取
  var date = now.getDate();
  var deadlineStr = year + "/" + month + "/" + date + " " + "16:00:00";
  var deadline = Date.parse(deadlineStr);

  // 当前日期加一
  var dateTime1 = new Date();
  dateTime1 = dateTime1.setDate(dateTime1.getDate() + 1);
  dateTime1 = new Date(dateTime1);

  const invalidVal = (nowTime > deadline) ? dateTime1 : new Date();
  const [orderTime, setOrderTime] = useState(invalidVal); // 日期
  const initialValues = {
    orderDate: orderTime,
    jobName: params.jobName,
    name: '',
    idNo: '',
    mobile: '',
    nation: '',
    address: '',
    authority: '',
    timeLimit: '',
    arrivalMode: 'FACTORY',
    remark: '',
    tip: true
  };

  // 打开OCR弹框选择
  const openSelect = () => {
    setModalVisible(true);
  }

  const clearIconPress = () => {
    setModalVisible(false);
  }

  // 提交报名表单
  const onSubmit = async (values) => {
    console.log('提交参数：', values)
    setOrderTime(values.orderDate)
    const prams = {
      ...values,
      arrivalMode: values.arrivalMode === true ? 'FACTORY' : 'STORE',
      orderDate: values.orderDate ? moment(values.orderDate).format('YYYY-MM-DD') : '',
    }
    try {
      const res = await HomeApi.SignUp(orderId, prams);
      if (res.code === 0) {
        toast.show('提交成功', { type: 'success' });
        navigation && navigation.goBack();
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
    try {
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
            orderDate: moment(orderTime).format('YYYY-MM-DD'),
          }
          restForm.setValues(prams)
          console.log('识别成功后的参数：', prams)
        }
      } else {
        toast.show('识别失败，请重新识别一次')
      }
    } catch (error) {
      toast.show('识别失败，出现异常请联系管理员处理')
    }

  }
  // console.log('参数：',restForm.getValues() )
  //从图库选择图片
  const openPick = async () => {
    const pickerImage = await ImagePicker.openPicker({
      cropperChooseText: '确定',
      cropperCancelText: '取消',
      width: 300,
      height: 400,
      cropping: true
    })
    setModalVisible(false);
    const fileName = `${pickerImage.modificationDate}${Math.round(Math.random() * 1000000000000) + '.jpg'}`;
    uploadImage(fileName, pickerImage.path);
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
    const fileName = `${cameraImage.modificationDate}${Math.round(Math.random() * 1000000000000) + '.jpg'}`;
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
    setModalVisible(false);
  }

  return (
    <Formik
      initialValues={initialValues}
      handleChange={(e) => console.log('e', e)}
      onSubmit={onSubmit}>
      {({ handleSubmit, ...rest }) => {
        restForm = rest;
        return (
          <View style={{ flex: 1 }}>
            <ScrollView style={styles.scrollArea}>
              <View style={[styles.cardArea, { marginTop: 28 }]}>
                <Field
                  name="orderDate"
                  title="订单日期"
                  disabled
                  startDate={startDate}
                  endDate={endDate}
                  component={SignUpDate}
                />
                <Field
                  name="jobName"
                  title="岗位名称"
                  disabled
                  inputStyle={{ fontSize: 28 }}
                  component={FormItem}
                />
                <Field
                  name="name"
                  title="姓名"
                  placeholder="请输入会员姓名"
                  OCR
                  onPress={openSelect}
                  autoFocus
                  inputStyle={{ fontSize: 28 }}
                  // isRequired
                  maxLength={5}
                  component={FormItem}
                />
                <Field
                  name="idNo"
                  title="身份证"
                  placeholder="请输入会员身份证"
                  maxLength={18}
                  // validate={value => {
                  //   let errorMsg;
                  //   if (!IDCard.test(value)) {
                  //     errorMsg = '请输入正确的身份证号';
                  //   }
                  //   return errorMsg
                  // }}
                  // isRequired
                  inputStyle={{ fontSize: 28 }}
                  component={FormItem}
                />
                <Field
                  name="mobile"
                  title="手机号"
                  placeholder="请输入会员手机号"
                  maxLength={11}
                  // validate={value => {
                  //   let errorMsg;
                  //   if (!phone.test(value)) {
                  //     errorMsg = '请输入正确的手机号';
                  //   }
                  //   return errorMsg
                  // }}
                  // isRequired
                  inputStyle={{ fontSize: 28 }}
                  component={FormItem}
                />
                <Field
                  name="nation"
                  title="民族"
                  placeholder="请输入会员民族"
                  inputStyle={{ fontSize: 28 }}
                  component={FormItem}
                />
                <Field
                  name="address"
                  title="户籍地址"
                  placeholder="请输入会员户籍地址"
                  noBorder
                  inputStyle={{ fontSize: 28 }}
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
                    inputStyle={{ fontSize: 28 }}
                    onPress={openSelect}
                    component={FormItem}
                  />
                  <Field
                    name="timeLimit"
                    title="有效期限"
                    placeholder="请输入有效期限"
                    noBorder
                    inputStyle={{ fontSize: 28 }}
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
            <View style={styles.centeredView}>
              <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                  Alert.alert("Modal has been closed.");
                  setModalVisible(!modalVisible);
                }}
              >
                <View style={styles.modalView}>
                  <Text style={styles.imageTitle}>请选择图片来源</Text>
                  <AntDesign
                    name='closecircle'
                    color='#A9A9A9'
                    size={25}
                    style={styles.close}
                    onPress={clearIconPress}
                  />
                  <TouchableHighlight
                    style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                    onPress={openPermission}
                  >
                    <Text style={styles.textStyle}>拍照上传</Text>
                  </TouchableHighlight>
                  <TouchableHighlight
                    style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                    onPress={openPick}
                  >
                    <Text style={styles.textStyle}>从相册选择</Text>
                  </TouchableHighlight>
                </View>
              </Modal>
            </View>
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
  },
  close: {
    position: 'absolute',
    top: 15,
    right: 30,
  },
  modalView: {
    margin: 20,
    marginTop: 150,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    paddingTop: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    // borderWidth: 1,
  },
  imageTitle: {
    fontSize: 18,
    // color: '#2196F3'
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
  openButton: {
    width: 300,
    // backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    // marginBottom: 15,
    marginTop: 25
  },
})

export default SignUp;