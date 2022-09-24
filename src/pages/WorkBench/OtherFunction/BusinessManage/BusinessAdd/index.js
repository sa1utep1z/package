import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, View, Text, Modal, PermissionsAndroid, Platform, Alert, TouchableHighlight } from 'react-native';
import { Button, CheckBox } from '@rneui/themed';
import { Formik, Field } from 'formik';
import * as Yup from 'yup';
import moment from 'moment';
import { useToast } from "react-native-toast-notifications";
import FormItem from '../../../../../components/Form/FormItem';
import Radio from '../../../../../components/Form/Radio';
import RadioGroup from '../../../../../components/Form/RadioGroup';
import { SITSTAND, DRESS, COMPANY_SHIFT, MICROSCOPE, COMPANY_PHONE, COMPANY_LINE, COMPANY_IDCARD, COMPANY_ENGLISH, TATTOOSMOKE, RETURNFACTORY, STUDENTPROVE, BACKGROUND, COMPANYNATIONALITY } from '../../../../../utils/const';



let restForm;
const BusinessAdd = (props) => {
  const { navigation, route: { params } } = props;
  // const [orderId, setOrderId] = useState(params?.orderId); // 订单id
  const [modalVisible, setModalVisible] = useState(false); // 图库选择、拍照弹框
  const toast = useToast();
  const [orderTime, setOrderTime] = useState(new Date()); // 日期
  const [check1, setCheck1] = useState('all');

  const initialValues = {
    orderDate: orderTime,
    companyName: '',
    companyShortName: '',
    companyNo: '',
    companyType: '',
    companyScale: '',
    industry: '',
    address: '',
    region: '',
    position: '',
    idCardCopy: '',
    graduateCopy: '',
    photo: '',
    itineraryCode: '',
    nucleicAcid: '',
    vaccination: '',
    contactResidents: '',
    contactBusiness: '',
    arrivalMode: true,
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
    console.log('提交参数11：', values)
  }

  const pressCheck = () => {
    setCheck1('No')
    console.log('打印取值：', check1);
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
                  name="companyName"
                  title="企业全称"
                  isRequired
                  inputStyle={{ fontSize: 28 }}
                  component={FormItem}
                />
                <Field
                  name="companyShortName"
                  title="企业简称"
                  isRequired
                  inputStyle={{ fontSize: 28 }}
                  component={FormItem}
                />
                <Field
                  name="companyNo"
                  title="企业代号"
                  placeholder="请输入企业代号"
                  maxLength={18}
                  isRequired
                  inputStyle={{ fontSize: 28 }}
                  component={FormItem}
                />
                <Field
                  name="companyType"
                  title="企业类别"
                  placeholder="请输入企业类别"
                  maxLength={11}
                  isRequired
                  inputStyle={{ fontSize: 28 }}
                  component={FormItem}
                />
                <Field
                  name="companyScale"
                  title="人员规模"
                  placeholder="请输入人员"
                  isRequired
                  inputStyle={{ fontSize: 28 }}
                  component={FormItem}
                />
                <Field
                  name="industry"
                  title="所属行业"
                  placeholder="请输入所属行业"
                  isRequired
                  inputStyle={{ fontSize: 28 }}
                  component={FormItem}
                />
                <Field
                  name="region"
                  title="区域"
                  placeholder="请输入区域"
                  inputStyle={{ fontSize: 28 }}
                  component={FormItem}
                />
                <Field
                  name="address"
                  title="工厂位置"
                  placeholder="请输入工厂位置"
                  inputStyle={{ fontSize: 28 }}
                  component={FormItem}
                />
                <Field
                  name="position"
                  title="接人位置"
                  placeholder="请输入接人位置"
                  inputStyle={{ fontSize: 28 }}
                  component={FormItem}
                />
              </View>
              <>
                <View style={styles.cardArea}>
                  <View style={styles.title}>
                    <Text style={styles.text}>四、工作环境</Text>
                  </View>
                  <Field
                    name="shiftCategory"
                    title="班别"
                    noBorder
                    isRequired
                    arryDate={COMPANY_SHIFT}
                    component={RadioGroup}
                  />
                  <Field
                    name="sitStand"
                    title="站坐"
                    noBorder
                    isRequired
                    arryDate={SITSTAND}
                    component={RadioGroup}
                  />
                  <Field
                    name="dress"
                    title="着装"
                    noBorder
                    isRequired
                    arryDate={DRESS}
                    component={RadioGroup}
                  />
                  <Field
                    name="line"
                    title="产线"
                    noBorder
                    isRequired
                    arryDate={COMPANY_LINE}
                    component={RadioGroup}
                  />
                  <Field
                    name="dress"
                    title="显微镜"
                    noBorder
                    isRequired
                    arryDate={MICROSCOPE}
                    component={RadioGroup}
                  />
                  <Field
                    name="line"
                    title="车间带手机"
                    noBorder
                    isRequired
                    arryDate={COMPANY_PHONE}
                    component={RadioGroup}
                  />
                </View>
              </>
              <>
                <View style={styles.cardArea}>
                  <View style={styles.title}>
                    <Text style={styles.text}>五、录用条件</Text>
                  </View>
                  <Field
                    name="shiftCategory"
                    title="身份证"
                    noBorder
                    isRequired
                    arryDate={COMPANY_IDCARD}
                    component={RadioGroup}
                  />
                  <Field
                    name="sitStand"
                    title="英文字母"
                    noBorder
                    isRequired
                    arryDate={COMPANY_ENGLISH}
                    component={RadioGroup}
                  />
                  <Field
                    name="dress"
                    title="二次返厂"
                    noBorder
                    isRequired
                    arryDate={RETURNFACTORY}
                    component={RadioGroup}
                  />
                  <Field
                    name="line"
                    title="纹身烟疤"
                    noBorder
                    isRequired
                    arryDate={TATTOOSMOKE}
                    component={RadioGroup}
                  />
                  <Field
                    name="dress"
                    title="民族要求"
                    noBorder
                    isRequired
                    arryDate={COMPANYNATIONALITY}
                    component={RadioGroup}
                  />
                  <Field
                    name="line"
                    title="案底"
                    noBorder
                    isRequired
                    arryDate={BACKGROUND}
                    component={RadioGroup}
                  />
                  <Field
                    name="line"
                    title="学生证明"
                    noBorder
                    isRequired
                    arryDate={STUDENTPROVE}
                    component={RadioGroup}
                  />
                  <Field
                  name="position"
                  title="身高要求"
                  placeholder="请输入身高要求"
                  inputStyle={{ fontSize: 28 }}
                  component={FormItem}
                />
                <Field
                  name="position"
                  title="体检要求"
                  placeholder="请输入体检要求"
                  inputStyle={{ fontSize: 28 }}
                  component={FormItem}
                />
                </View>
              </>
              <>
                <View style={styles.cardArea}>
                  <View style={styles.title}>
                    <Text style={styles.text}>六、面试资料</Text>
                  </View>
                  <Field
                    name="idCardCopy"
                    title="身份证复印件"
                    placeholder="请输入身份证复印件要求"
                    inputStyle={{ fontSize: 28 }}
                    component={FormItem}
                  />
                  <Field
                    name="graduateCopy"
                    title="毕业证原件/复印件"
                    placeholder="请输入毕业证要求"
                    inputStyle={{ fontSize: 28 }}
                    component={FormItem}
                  />
                  <Field
                    name="photo"
                    title="照片"
                    placeholder="请输入照片要求"
                    noBorder
                    inputStyle={{ fontSize: 28 }}
                    component={FormItem}
                  />
                </View>
              </>
              <>
                <View style={styles.cardArea}>
                  <View style={styles.title}>
                    <Text style={styles.text}>七、防疫要求</Text>
                  </View>
                  <Field
                    name="itineraryCode"
                    title="行程码"
                    placeholder="请输入行程码要求"
                    inputStyle={{ fontSize: 28 }}
                    component={FormItem}
                  />
                  <Field
                    name="nucleicAcid"
                    title="核酸"
                    placeholder="请输入核酸要求"
                    inputStyle={{ fontSize: 28 }}
                    component={FormItem}
                  />
                  <Field
                    name="vaccination"
                    title="疫苗要求"
                    placeholder="请疫苗接种要求"
                    noBorder
                    inputStyle={{ fontSize: 28 }}
                    component={FormItem}
                  />
                </View>
              </>
              <>
                <View style={styles.cardArea}>
                  <View style={styles.title}>
                    <Text style={styles.text}>八、对接企业信息</Text>
                  </View>
                  <Field
                    name="contactResidents"
                    title="驻场信息"
                    placeholder="请输入"
                    inputStyle={{ fontSize: 28 }}
                    component={FormItem}
                  />
                  <Field
                    name="contactBusiness"
                    title="商务信息"
                    placeholder="请输入"
                    inputStyle={{ fontSize: 28 }}
                    component={FormItem}
                  />
                </View>
              </>
            </ScrollView>
            <Button
              title="保存提交"
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
  },
  title: {
    marginTop: 30,
    marginLeft: 30,
    fontSize: 36,
    color: '#000',
    fontWeight: 'bold',
  },
  text: {
    fontSize: 36,
    color: '#000',
    fontWeight: 'bold',
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

export default BusinessAdd;