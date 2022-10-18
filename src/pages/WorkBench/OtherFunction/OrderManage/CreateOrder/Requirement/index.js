import React, {useState, useEffect, useImperativeHandle, forwardRef} from "react";
import { View, StyleSheet, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Formik, Field } from 'formik';
import * as Yup from 'yup';
import { useToast } from "react-native-toast-notifications";

import SingleInput from "../../../../../../components/OrderForm/SingleInput";
import OrderRangeInput from "../../../../../../components/OrderForm/OrderRangeInput";
import RadioSelect from "../../../../../../components/OrderForm/RadioSelect";
import { FEMALE_LIMIT, SUCCESS_CODE } from "../../../../../../utils/const";
import CreateOrderApi from '../../../../../../request/CreateOrderApi';

let restForm;
const validationSchema = Yup.object().shape({
  needNumber: Yup.string().required('请输入需求人数'),
  sexGroup: Yup.array().min(1, '请选择性别'),
  male_age_limit: Yup.object({
    start: Yup.string().required('请输入起始年龄（男）'),
    end: Yup.string().required('请输入结束年龄（男）')
  }),
  female_age_limit: Yup.object({
    start: Yup.string().required('请输入起始年龄（女）'),
    end: Yup.string().required('请输入结束年龄（女）')
  })
});

const initialValues = {
  needNumber: '',
  sexGroup: [],
  male: '',
  female: '',
  male_age_limit: {
    start: '',
    end: ''
  },
  female_age_limit: {
    start: '',
    end: ''
  }
};

const Requirement = ({
  orderId = ''
}, ref) => {
  const toast = useToast();
  
  useImperativeHandle(ref, () => {
    return { RequirementForm: restForm };
  }, []);

  useEffect(()=>{
    if(orderId){
      getRequirementOrder(orderId);
    }
  },[orderId])

  const [showDetail, setShowDetail] = useState(true);
  const [loading, setLoading] = useState(false);
  const [requirementButtonLoading, setRequirementButtonLoading] = useState(false);

  const detailOnPress = () => setShowDetail(!showDetail);

  const getRequirementOrder = async(orderId) => {
    setLoading(true);
    try {
      const res = await CreateOrderApi.getRequirementOrder(orderId);
      if(res?.code !== SUCCESS_CODE){
        toast.show(`${res?.msg}`, {type: 'danger'});
        return;
      }
      const formValues = {
        needNumber: String(res.data.needNumber),
        sexGroup: [FEMALE_LIMIT.find(item => item.value === res.data.sexGroup)],
        male: res.data.male ? String(res.data.male) : '',
        female: res.data.female ? String(res.data.female) : '',
        male_age_limit: {
          start: res.data.maleAgeStart ? String(res.data.maleAgeStart) : '',
          end: res.data.maleAgeEnd ? String(res.data.maleAgeEnd) : ''
        },
        female_age_limit: {
          start: res.data.femaleAgeStart ? String(res.data.femaleAgeStart) : '',
          end: res.data.femaleAgeEnd ? String(res.data.femaleAgeEnd) : ''
        }
      };
      restForm.setValues(formValues);
    }catch(error){
      console.log('CreateOrderInfo->error', error);
    }finally{
      setLoading(false);
    }
  };

  //录用要求
  const CreateRequirementInfo = async(params) => {
    setRequirementButtonLoading(true);
    if(!orderId){
      toast.show('请先创建订单基本信息！', {type: 'danger'});
      return;
    }
    try {
      const res = await CreateOrderApi.RequirementOrder(params);
      console.log('CreateRequirementInfo->res', res);
      if(res?.code !== SUCCESS_CODE){
        toast.show(`${res?.msg}`, {type: 'danger'});
        return;
      }
      toast.show('保存录用要求成功！', {type: 'success'});
    }catch(error){
      console.log('CreateRequirementInfo->error', error);
      setRequirementButtonLoading(false);
    }finally{
      setRequirementButtonLoading(false);
    }
  };

  const onSubmit = (values) => {
    console.log('origin-values', values);
    if(!orderId){
      toast.show('请先创建订单基本信息！', {type: 'danger'});
      return;
    }
    const newObject = {
      needNumber: values.needNumber, //需求人数
      sexGroup: values.sexGroup[0].value, //性别
      maleAgeStart: values.male_age_limit.start, //男-年龄-起始
      maleAgeEnd: values.male_age_limit.end, //男-年龄-结束
      femaleAgeStart: values.female_age_limit.start, //女-年龄-起始
      femaleAgeEnd: values.female_age_limit.end, //女-年龄-结束
      orderId
    };
    if(newObject.sexGroup === 'LIMIT'){
      newObject.male = values.male;
      newObject.female = values.female;
    }
    CreateRequirementInfo(newObject);
  };

  return (
    <View style={{marginTop: 20}}>
      <TouchableOpacity style={styles.touchArea} onPress={detailOnPress}>
        <Text style={[styles.title, showDetail && styles.boldText]}>录用要求</Text>
        {!loading ? <AntDesign
          name={showDetail ? 'down' : 'up'}
          size={36}
          color={showDetail ? '#000000' : '#999999'}
        /> : <ActivityIndicator size={36} color="#409EFF"/>}
      </TouchableOpacity>
      {showDetail && <View style={{backgroundColor: '#ffffff', borderTopWidth: 1, borderTopColor: '#999999', paddingTop: 20}}>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}>
          {({values, handleSubmit, ...rest }) => {
            restForm = rest;
            return (
              <View style={{ flex: 1, paddingHorizontal: 28}}>
                <View style={{flex: 1, flexDirection: 'row'}}>
                  <Field
                    name="needNumber"
                    label="需求人数"
                    maxLength={4}
                    isRequire
                    component={SingleInput}
                    inputRightComponent={<Text style={{height: 60, textAlignVertical: 'center', fontSize: 26, color: '#333333'}}>人</Text>}
                    selectTextOnFocus
                  />
                  {!requirementButtonLoading ? <TouchableOpacity style={{backgroundColor: '#409EFF', height: 60, paddingHorizontal: 18, justifyContent: 'center', marginLeft: 20, borderRadius: 6}} onPress={handleSubmit}>
                    <Text style={{fontSize: 28, color: '#fff', fontWeight: 'bold'}}>保存</Text>
                  </TouchableOpacity> : <View style={{backgroundColor: '#999999', height: 60, paddingHorizontal: 18, justifyContent: 'center', marginLeft: 20, borderRadius: 6}}>
                    <ActivityIndicator size={36} color="#ffffff"/>
                  </View>}
                </View>
                <Field
                  name="sexGroup"
                  label="性别"
                  isRequire
                  radioList={FEMALE_LIMIT}
                  validate={value => {
                    let errMsg = '';
                    if(value.length){
                      if(value[0].value === 'LIMIT' && values.needNumber.length === 0){
                        return errMsg = '请先输入需求人数';
                      }
                    }
                    return errMsg;
                  }}
                  component={RadioSelect}
                />
                {values.sexGroup.length && values.sexGroup[0].value === 'LIMIT' ? <View style={{flex: 1, flexDirection: 'row'}}>
                  <Field
                    name="male"
                    label="比例（男）"
                    keyboardType="numeric"
                    placeholder="输入比例"
                    isRequire
                    selectTextOnFocus
                    multiline={false}
                    numberOfLines={1}
                    validate={value => {
                      let errMsg = '';
                      if(Number(value) > Number(values.needNumber)){
                        return errMsg = '不能大于需求人数';
                      }
                      if(Number(value) + Number(values.female) !== Number(values.needNumber)){
                        return errMsg = '男女比例不等于需求人数';
                      }
                      if(values.sexGroup[0].value === 'LIMIT' && !value.length){
                        return errMsg = '请输入比例（男）';
                      }
                      return errMsg;
                    }}
                    component={SingleInput}
                  />
                  <View style={{width: 20}}></View>
                  <Field
                    name="female"
                    label="比例（女）"
                    keyboardType="numeric"
                    placeholder="输入比例"
                    isRequire
                    selectTextOnFocus
                    multiline={false}
                    numberOfLines={1}
                    validate={value => {
                      let errMsg = '';
                      if(Number(value) > Number(values.needNumber)){
                        return errMsg = '不能大于需求人数';
                      }
                      if(Number(value) + Number(values.male) !== Number(values.needNumber)){
                        return errMsg = '男女比例不等于需求人数';
                      }
                      if(values.sexGroup[0].value === 'LIMIT' && !value.length){
                        return errMsg = '请输入比例（女）';
                      }
                      return errMsg;
                    }}
                    component={SingleInput}
                  />
                </View> : <></>}
                <Field
                  name="male_age_limit"
                  label="年龄（男）"
                  keyboardType="numeric"
                  maxLength={2}
                  isRequire
                  selectTextOnFocus
                  inputRightComponent={<Text style={{height: 60, textAlignVertical: 'center', fontSize: 26, color: '#333333'}}>岁</Text>}
                  component={OrderRangeInput}
                  placeholder={{
                    start: '起始年龄',
                    end: '结束年龄'
                  }}
                />
                <Field
                  name="female_age_limit"
                  label="年龄（女）"
                  keyboardType="numeric"
                  maxLength={2}
                  isRequire
                  selectTextOnFocus
                  inputRightComponent={<Text style={{height: 60, textAlignVertical: 'center', fontSize: 26, color: '#333333'}}>岁</Text>}
                  component={OrderRangeInput}
                  placeholder={{
                    start: '起始年龄',
                    end: '结束年龄'
                  }}
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

export default forwardRef(Requirement);