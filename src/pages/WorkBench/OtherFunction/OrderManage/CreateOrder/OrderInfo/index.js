import React, {useState, useEffect} from "react";
import { View, StyleSheet, Text, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Formik, Field } from 'formik';
import * as Yup from 'yup';
import { useToast } from "react-native-toast-notifications";

import SingleInput from "../../../../../../components/OrderForm/SingleInput";
import OrderRangeInput from "../../../../../../components/OrderForm/OrderRangeInput";
import SingleSelect from "../../../../../../components/OrderForm/SingleSelect";
import RadioSelect from "../../../../../../components/OrderForm/RadioSelect";
import OrderRangeDate from "../../../../../../components/OrderForm/OrderRangeDate";
import SelectPhotos from "../../../../../../components/OrderForm/SelectPhotos";
import OrderSingleDate from "../../../../../../components/OrderForm/OrderSingleDate";
import { CREATE_ORDER_JOB_ORDER, CREATE_ORDER_JOB_TYPE, SUCCESS_CODE } from "../../../../../../utils/const";
import CreateOrderApi from '../../../../../../request/CreateOrderApi';

let restForm;
const validationSchema = Yup.object().shape({
  orderName: Yup.string().required('请输入订单名称'),
  organizeId: Yup.array().min(1, '请选择用工企业'),
  post: Yup.array().min(1, '请选择岗位'),
  profession: Yup.array().min(1, '请选择工种'),
  orderRangeDate: Yup.object({
    startDate: Yup.string().required('请选择订单开始日期'),
    endDate: Yup.string().required('请选择订单结束日期')
  }),
  orderDuration: Yup.string().required('请选择订单工期'),
  postSequence: Yup.string().required('请输入职位顺序'),
  complexSalary: Yup.object({
    start: Yup.string().required('请输入起始薪资'),
    end: Yup.string().required('请输入结束薪资')
  }),
  pictureList: Yup.array().min(1, '请选择职位展示图片'),
  showTitle: Yup.string().required('请输入小程序职位标题'),
  salaryTitle: Yup.string().required('请输入小程序薪资详情文本'),
});

//默认的图片列表；
const normalImg = {
  name: 'default_Image_Of_Order_In_Mobile.jpg',
  fileKey: 'laborMgt/labor/normal.jpg.jpg',
  url: 'https://labor-prod.oss-cn-shenzhen.aliyuncs.com/laborMgt/labor/normal.jpg.jpg'
};

const initialValues = {
  orderName: '',
  organizeId: [],
  postSequence: '',
  post: [],
  profession: [],
  orderRangeDate: {
    startDate: '',
    endDate: ''
  },
  orderDuration: '',
  complexSalary: {
    start: '',
    end: ''
  },
  pictureList: [],
  showTitle: '',
  salaryTitle: ''
};

const OrderInfo = ({
  setOrderId,
  orderId
}) => {
  const toast = useToast();

  useEffect(()=>{
    if(orderId){
      getBasicOrder(orderId);
    }
  },[orderId])

  const [showDetail, setShowDetail] = useState(true);
  const [loading, setLoading] = useState(false);

  const detailOnPress = () => setShowDetail(!showDetail);

  const getBasicOrder = async(orderId) => {
    setLoading(true);
    try {
      const res = await CreateOrderApi.getBasicOrder(orderId);
      if(res?.code !== SUCCESS_CODE){
        toast.show(`${res?.msg}`, {type: 'danger'});
        return;
      }
      const formValues = {
        orderName: res.data.orderName,
        organizeId: res.data.organizeId,
        postSequence: String(res.data.postSequence),
        post: [CREATE_ORDER_JOB_ORDER.find(item => item.value === res.data.post)],
        profession: [CREATE_ORDER_JOB_TYPE.find(item => item.value === res.data.profession)],
        orderRangeDate: {
          startDate: res.data.recruitStart,
          endDate: res.data.recruitEnd
        },
        orderDuration: res.data.orderDuration,
        complexSalary: {
          start: String(res.data.salaryStart),
          end: String(res.data.salaryEnd)
        },
        pictureList: res.data.positionImages,
        showTitle: res.data.showTitle,
        salaryTitle: res.data.salaryTitle
      };
      restForm.setValues(formValues);
    }catch(error){
      console.log('getBasicOrder->error', error);
    }finally{
      setLoading(false);
    }
  };

  const CreateOrderInfo = async(params) => {
    setLoading(true);
    try {
      const res = await CreateOrderApi.CreateBasicOrder(params);
      if(res?.code !== SUCCESS_CODE){
        toast.show(`${res?.msg}`, {type: 'danger'});
        return;
      }
      toast.show('订单保存成功！', {type: 'success'});
      setOrderId(res.data);
    }catch(error){
      console.log('CreateOrderInfo->error', error);
    }finally{
      setLoading(false);
    }
  };

  const onSubmit = async (values) => {
    console.log('origin-values', values);
    const newObject = {
      salaryStart: Number(values.complexSalary.start), //综合薪资-开始
      salaryEnd: Number(values.complexSalary.end), //综合薪资-结束
      recruitStart: values.orderRangeDate.startDate, //订单日期-开始
      recruitEnd: values.orderRangeDate.endDate, //订单日期-结束
      organizeId: values.organizeId[0].value, //用工企业
      post: values.post[0].value, //岗位
      profession: values.profession[0].value, //工种
      salaryTitle: values.salaryTitle, //小程序薪资详情
      showTitle: values.showTitle, //小程序职位标题
      orderDuration: values.orderDuration, //订单工期
      orderName: values.orderName, //订单名称
      postSequence: Number(values.postSequence), //职位顺序
      positionImages: values.pictureList, //职位展示图片
      self: true, //自招（固定字段）
      orderId
    };
    CreateOrderInfo(newObject);
  };

  return (
    <View style={{marginTop: 20}}>
      <TouchableOpacity style={styles.touchArea} onPress={detailOnPress}>
        <Text style={[styles.title, showDetail && styles.boldText]}>订单基本信息</Text>
        {!loading ? <AntDesign
          name={showDetail ? 'down' : 'up'}
          size={36}
          color={showDetail ? '#000000' : '#999999'}
        />: <ActivityIndicator size={36} color="#409EFF"/>}
      </TouchableOpacity>
      {showDetail && <View style={{backgroundColor: '#ffffff', borderTopWidth: 1, borderTopColor: '#999999', paddingTop: 20}}>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}>
          {({ handleSubmit, ...rest }) => {
            restForm = rest;
            return (
              <View style={{ flex: 1, paddingHorizontal: 28}}>
                <View style={{flex: 1, flexDirection: 'row'}}>
                  <Field
                    name="orderName"
                    label="订单名称"
                    isRequire
                    component={SingleInput}
                    inputStyle={{flex: 1}}
                    selectTextOnFocus
                  />
                  <TouchableOpacity style={{backgroundColor: '#409EFF', height: 60, paddingHorizontal: 18, justifyContent: 'center', marginLeft: 20, borderRadius: 6}} onPress={handleSubmit}>
                    <Text style={{fontSize: 28, color: '#fff', fontWeight: 'bold'}}>保存</Text>
                  </TouchableOpacity>
                </View>
                <View style={{flex: 1, flexDirection: 'row'}}>
                  <Field
                    name="organizeId"
                    label="用工企业"
                    type="factory"
                    isRequire
                    component={SingleSelect}
                  />
                  <Field
                    name="postSequence"
                    label="职位顺序"
                    isRequire
                    placeholder="输入"
                    keyboardType="numeric"
                    multiline={false}
                    numberOfLines={1}
                    maxLength={3}
                    inputStyle={{maxWidth: 260, marginLeft: 20}}
                    component={SingleInput}
                  />
                </View>
                <Field
                  name="post"
                  label="岗位"
                  isRequire
                  radioList={CREATE_ORDER_JOB_ORDER}
                  component={RadioSelect}
                />
                <Field
                  name="profession"
                  label="工种"
                  isRequire
                  canSearch={false}
                  selectList={CREATE_ORDER_JOB_TYPE}
                  component={SingleSelect}
                />
                <Field
                  name="orderRangeDate"
                  label="订单日期"
                  isRequire
                  component={OrderRangeDate}
                />
                <Field
                  name="orderDuration"
                  label="订单工期"
                  isRequire
                  component={OrderSingleDate}
                />
                <Field
                  name="complexSalary"
                  label="综合薪资"
                  maxLength={5}
                  isRequire
                  keyboardType="numeric"
                  inputRightComponent={<Text style={{height: 60, textAlignVertical: 'center', fontSize: 26, color: '#333333'}}>¥</Text>}
                  component={OrderRangeInput}
                />
                <Field
                  name="pictureList"
                  label="职位展示图片"
                  isRequire
                  component={SelectPhotos}
                />
                <Field
                  name="showTitle"
                  label="小程序职位标题"
                  selectTextOnFocus
                  isRequire
                  component={SingleInput}
                />
                <Field
                  name="salaryTitle"
                  label="小程序薪资详情"
                  placeholder="请输入小程序薪资详情文本"
                  maxLength={200}
                  multiline
                  lengthLimit
                  isRequire
                  inputContainerStyle={{minHeight: 120, alignItems: 'flex-start'}}
                  component={SingleInput}
                />
              </View>
            )
          }}
        </Formik>
      </View>}
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth: 1
  },
  touchArea: {
    height: 94, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    backgroundColor: '#ffffff', 
    paddingHorizontal: 30, 
    alignItems: 'center'
  },
  title: {
    fontSize: 32, 
    color: '#000000'
  },
  boldText: {
    fontWeight: 'bold'
  }
});

export default OrderInfo;