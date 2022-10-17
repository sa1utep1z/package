import React, {useState, useEffect, useImperativeHandle, forwardRef} from "react";
import { View, StyleSheet, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Formik, Field } from 'formik';
import * as Yup from 'yup';
import { useToast } from "react-native-toast-notifications";

import SingleInput from "../../../../../../components/OrderForm/SingleInput";
import SelectPhotos from "../../../../../../components/OrderForm/SelectPhotos";
import CreateOrderApi from '../../../../../../request/CreateOrderApi';
import { SUCCESS_CODE } from "../../../../../../utils/const";

let restForm;
const validationSchema = Yup.object().shape({
  applyPolicyRemark: Yup.string().required('请输入接单政策文本')
});

const initialValues = {
  applyPolicyImage: [],
  applyPolicyRemark: ''
};

const Policy = ({
  orderId = '',
  refresh
}, ref) => {
  const toast = useToast();

  useImperativeHandle(ref, () => {
    return { PolicyForm: restForm };
  }, []);

  const [showDetail, setShowDetail] = useState(true);
  const [loading, setLoading] = useState(false);
  const [policyButtonLoading, setPolicyButtonLoading] = useState(false);

  useEffect(()=>{
    if(orderId){
      getPolicyOrder(orderId);
    }
  },[orderId])

  const detailOnPress = () => setShowDetail(!showDetail);

  const getPolicyOrder = async(orderId) => {
    setLoading(true);
    try {
      const res = await CreateOrderApi.getPolicyOrder(orderId);
      if(res?.code !== SUCCESS_CODE){
        toast.show(`${res?.msg}`, {type: 'danger'});
        return;
      }
      const formValues = {
        applyPolicyImage: res.data.applyPolicyImage,
        applyPolicyRemark: res.data.applyPolicyRemark || '无'
      };
      restForm.setValues(formValues);
    }catch(error){
      console.log('CreateOrderInfo->error', error);
    }finally{
      setLoading(false);
    }
  };

  //接单政策说明
  const CreatePolicyInfo = async(params) => {
    setPolicyButtonLoading(true);
    if(!orderId){
      toast.show('请先创建订单基本信息！', {type: 'danger'});
      return;
    }
    try {
      const res = await CreateOrderApi.PolicyRequirement(params);
      console.log('res', res);
      if(res?.code !== SUCCESS_CODE){
        toast.show(`${res?.msg}`, {type: 'danger'});
        return;
      }
      toast.show('保存接单政策成功！', {type: 'success'});
      refresh && refresh();
    }catch(error){
      console.log('CreatePolicyInfo->error', error);
      setPolicyButtonLoading(false);
    }finally{
      setPolicyButtonLoading(false);
    }
  };

  const onSubmit = async (values) => {
    console.log('origin-values', values);
    const newObject = {
      applyPolicyImage: values.applyPolicyImage,
      applyPolicyRemark: values.applyPolicyRemark,
      orderId
    };
    CreatePolicyInfo(newObject);
  };

  return (
    <View style={{marginTop: 20}}>
      <TouchableOpacity style={styles.touchArea} onPress={detailOnPress}>
        <Text style={[styles.title, showDetail && styles.boldText]}>接单政策说明</Text>
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
          handleChange={(e) => console.log('e', e)}
          onSubmit={onSubmit}>
          {({ handleSubmit, ...rest }) => {
            restForm = rest;
            return (
              <View style={{ flex: 1, paddingHorizontal: 28}}>
                <View style={{flex: 1, flexDirection: 'row'}}>
                  <View style={{flex: 1}}>
                    <Field
                      name="applyPolicyImage"
                      label="接单政策照片"
                      component={SelectPhotos}
                    />
                  </View>
                  {!policyButtonLoading ? <TouchableOpacity style={{backgroundColor: '#409EFF', height: 60, paddingHorizontal: 18, justifyContent: 'center', marginLeft: 20, borderRadius: 6}} onPress={handleSubmit}>
                    <Text style={{fontSize: 28, color: '#fff', fontWeight: 'bold'}}>保存</Text>
                  </TouchableOpacity> : <View style={{backgroundColor: '#999999', height: 60, paddingHorizontal: 18, justifyContent: 'center', marginLeft: 20, borderRadius: 6}}>
                    <ActivityIndicator size={36} color="#ffffff"/>
                  </View>}
                </View>
                <Field
                  name="applyPolicyRemark"
                  label="接单政策文字说明"
                  placeholder="请输入接单政策文本"
                  multiline
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

export default forwardRef(Policy);