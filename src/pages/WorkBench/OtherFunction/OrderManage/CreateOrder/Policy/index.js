import React, {useState, useEffect, useImperativeHandle, forwardRef} from "react";
import { View, StyleSheet, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Formik, Field } from 'formik';
import * as Yup from 'yup';
import Clipboard from '@react-native-clipboard/clipboard';
import { useToast } from "react-native-toast-notifications";

import SingleInput from "../../../../../../components/OrderForm/SingleInput";
import SelectPhotos from "../../../../../../components/OrderForm/SelectPhotos";
import CreateOrderApi from '../../../../../../request/CreateOrderApi';
import SingleSelect from "../../../../../../components/OrderForm/SingleSelect";
import RadioSelect from "../../../../../../components/OrderForm/RadioSelect";
import { SUCCESS_CODE, SETTLEMENT_MODE, SETTLEMENT_RANGE_MODE, SETTLEMENT_RANGE_MONTH, SETTLEMENT_RANGE_WEEK, RETURN_WAY_LIST, SHORT_LINE_STANDARDS_MODE } from "../../../../../../utils/const";

let restForm;
const validationSchema = Yup.object().shape({
  applyPolicyRemark: Yup.string().required('请输入接单政策文本')
});

const initialValues = {
  applyPolicyImage: [],
  applyPolicyRemark: '',
  settlement_mode: [], //接单费用结算周期；
  settlement_range_mode: [], //接单费用结算周期；
  settlement_range_date: [], //接单费用结算周期；
  order_expense_standards: [], //接单费用标准；
  longLine_standards: '', //长线标准；
  shortLine_standards_mode: [], //短线标准的模式；
  return_way: [], //回款方式；
  settlement_people: [], //结算收款财务人；
  settlement_returnMsg_mode: [], //在离职名单回传频率；
  settlement_returnMsg_date: [], //在离职名单回传频率；
};

const Policy = ({
  orderId = ''
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
      console.log('getPolicyOrder->error', error);
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
      console.log('CreatePolicyInfo->res', res);
      if(res?.code !== SUCCESS_CODE){
        toast.show(`${res?.msg}`, {type: 'danger'});
        return;
      }
      toast.show('保存接单政策成功！', {type: 'success'});
    }catch(error){
      console.log('CreatePolicyInfo->error', error);
      setPolicyButtonLoading(false);
    }finally{
      setPolicyButtonLoading(false);
    }
  };

  const onSubmit = async (values) => {
    const newObject = {
      applyPolicyImage: values.applyPolicyImage,
      applyPolicyRemark: values.applyPolicyRemark,
      orderId
    };
    CreatePolicyInfo(newObject);
  };

  const otherRadioPress = (fieldName) => {
    if(fieldName === 'settlement_range_mode'){
      restForm.setFieldValue('settlement_range_date', []);
    }
    if(fieldName === 'settlement_returnMsg_mode'){
      restForm.setFieldValue('settlement_returnMsg_date', []);
    }
  };

  const otherSelectPress = (fieldName) => {
    if(fieldName === 'settlement_range_date' && !restForm.values.settlement_range_mode.length){
      toast.show('请先选择日期选项！', {type: 'warning'});
    }
    if(fieldName === 'settlement_returnMsg_date' && !restForm.values.settlement_returnMsg_mode.length){
      toast.show('请先选择日期选项！', {type: 'warning'});
    }
  };

  const clipboardText = async() => {
    if(!restForm.values.return_way.length){
      toast.show('请选择回款方式！', {type: 'warning'});
      return;
    }
    const commonText = `名称：深圳市众鼎劳务派遣有限公司
纳税人识别号：91440300051530634L
电话：0755-36633079
开户行：中国建设银行股份有限公司深圳龙华支行
银行账号：44201555400052526338
名称：深圳市众鼎劳务派遣有限公司`;
    const personalText = `开户行：中国招商银行深圳龙华支行
银行卡号：6214857803889361
姓名：唐平`;
    Clipboard.setString(restForm.values.return_way[0].value === 'common' ? commonText : personalText);
    try {
      Clipboard.getString();
      toast.show('复制成功', {type: 'success'});
    } catch (error) {
      console.log('error', error);
      toast.show('复制失败，请联系管理员', {type: 'error'});
    }
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
                  {!policyButtonLoading ? <TouchableOpacity style={styles.saveBtn} onPress={handleSubmit}>
                    <Text style={styles.btnText}>保存</Text>
                  </TouchableOpacity> : <View style={styles.loadingArea}>
                    <ActivityIndicator size={36} color="#ffffff"/>
                  </View>}
                </View>
                <Field
                  name="applyPolicyRemark"
                  label="接单政策文字说明"
                  placeholder="请输入接单政策文本"
                  longText
                  multiline
                  isRequire
                  inputContainerStyle={{minHeight: 120, alignItems: 'flex-start'}}
                  component={SingleInput}
                />
                <View style={{borderWidth: 1, borderColor: '#EFEFEF', paddingTop: 20, marginBottom: 20, borderRadius: 6}}>
                  <Text style={{fontSize: 26, color: '#333333', marginBottom: 20, paddingLeft: 20}}>接单费用结算周期：</Text>
                  <View style={{flexDirection: 'row', borderBottomWidth: 1, borderColor: '#EFEFEF', paddingHorizontal: 20}}>
                    <Field
                      name="settlement_mode"
                      isRequire
                      showLabel={false}
                      AreaStyle={{width: 240, marginRight: 15}}
                      radioList={SETTLEMENT_MODE}
                      component={RadioSelect}
                    />
                    <Field
                      name="settlement_range_mode"
                      isRequire
                      showLabel={false}
                      AreaStyle={{width: 240, marginRight: 15}}
                      radioList={SETTLEMENT_RANGE_MODE}
                      otherRadioPress={otherRadioPress}
                      component={RadioSelect}
                    />
                    <Field
                      name="settlement_range_date"
                      label="日期"
                      placeholder={rest.values.settlement_range_mode.length ? rest.values.settlement_range_mode[0].value === 'month' ? '日期' : '每周' : '选择'}
                      showLabel={false}
                      canSearch={false}
                      touchAreaStyle={{borderWidth: 0}}
                      touchStyle={{borderWidth: 2, borderColor: '#E5E5E5', borderRadius: 6}}
                      selectList={rest.values.settlement_range_mode.length ? rest.values.settlement_range_mode[0].value === 'month' ? SETTLEMENT_RANGE_MONTH : SETTLEMENT_RANGE_WEEK : []}
                      otherSelectPress={otherSelectPress}
                      component={SingleSelect}
                    />
                  </View>
                  <View style={{padding: 20, paddingBottom: 0, borderBottomWidth: 1, borderColor: '#EFEFEF'}}>
                    <View style={{flexDirection: 'row'}}>
                      <Field
                        name="order_expense_standards"
                        label="接单费用标准"
                        radioList={SETTLEMENT_MODE}
                        AreaStyle={{width: 450, marginRight: 15}}
                        otherRadioPress={otherRadioPress}
                        component={RadioSelect}
                      />
                    </View>
                    {rest.values.order_expense_standards.length && rest.values.order_expense_standards[0].value === 'long' ? <Field
                      name="longLine_standards"
                      isRequire
                      placeholder="输入"
                      showLabel={false}
                      selectTextOnFocus
                      inputStyle={{width: 220}}
                      inputRightComponent={<View style={{height: 40, backgroundColor: '#409EFF', marginLeft: 20, justifyContent: 'center', borderRadius: 6, alignSelf: 'center', marginRight: 10}}>
                        <Text style={{fontSize: 22, color: '#FFFFFF', marginHorizontal: 10}}>元/小时</Text>
                      </View>}
                      component={SingleInput}
                    /> : <></>}
                    {rest.values.order_expense_standards.length && rest.values.order_expense_standards[0].value === 'short' ? <View style={{ flexDirection: 'row'}}>
                      <View style={{flex: 1, flexDirection: 'row'}}>
                        <Field
                          name="shortLine_standards_mode"
                          label="短线模式"
                          showLabel={false}
                          canSearch={false}
                          placeholder='选择模式'
                          selectList={SHORT_LINE_STANDARDS_MODE}
                          component={SingleSelect}
                        />
                      </View>
                      <View style={{width: 170, marginLeft: 10}}>
                        <Field
                          name="longLine_standards"
                          isRequire
                          placeholder="输入"
                          showLabel={false}
                          selectTextOnFocus
                          inputRightComponent={rest.values.shortLine_standards_mode.length ? <View style={{height: 40, backgroundColor: '#409EFF', marginLeft: 20, justifyContent: 'center', borderRadius: 6, alignSelf: 'center', marginRight: 10}}>
                            <Text style={{fontSize: 20, color: '#FFFFFF', marginHorizontal: 10}}>{rest.values.shortLine_standards_mode[0].value.includes('hour') ? '小时' : '天'}</Text>
                          </View> : <></>}
                          component={SingleInput}
                        />
                      </View>
                      <View style={{width: 150, marginLeft: 10}}>
                        <Field
                          name="longLine_standards"
                          isRequire
                          placeholder="输入"
                          showLabel={false}
                          selectTextOnFocus
                          inputRightComponent={<View style={{height: 40, backgroundColor: '#409EFF', marginLeft: 15, justifyContent: 'center', borderRadius: 6, alignSelf: 'center', marginRight: 10}}>
                            <Text style={{fontSize: 20, color: '#FFFFFF', marginHorizontal: 10}}>元</Text>
                          </View>}
                          component={SingleInput}
                        />
                      </View>
                    </View> : <></>}
                  </View>
                  <View style={{paddingHorizontal: 20, paddingTop: 20}}>
                    <View style={{flexDirection: 'row'}}>
                      <View style={{flex: 1}}>
                        <Field
                          name="return_way"
                          label="回款方式"
                          AreaStyle={{width: 400, marginRight: 20}}
                          radioList={RETURN_WAY_LIST}
                          component={RadioSelect}
                        />
                      </View>
                      <TouchableOpacity style={[{width: 100, height: 60, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ecf5ff', borderColor: '#409EFF', borderWidth: 2, borderRadius: 10}, !rest.values.return_way.length && {borderColor: '#999999', backgroundColor: '#ededed'}]} onPress={clipboardText}>
                        <Text style={[{fontSize: 26, fontWeight: 'bold', color: '#409EFF'}, !rest.values.return_way.length && {color: '#999999'}]}>复制</Text>
                      </TouchableOpacity>
                    </View>
                    {rest.values.return_way.length ? <View style={{marginBottom: 20}}>
                      {rest.values.return_way[0].value === 'common' ? <>
                        <View style={{flexDirection: 'row'}}>
                          <Text style={{width: 180, fontSize: 24, color: '#333333', textAlign: 'center', textAlignVertical: 'center', borderTopWidth: 1, borderRightWidth: 1, borderLeftWidth: 1}}>名称</Text>
                          <Text style={{ flex: 1, fontSize: 24, color: '#333333', textAlign: 'center', textAlignVertical: 'center', borderTopWidth: 1, borderRightWidth: 1, paddingVertical: 10}}>深圳市众鼎劳务派遣有限公司</Text>
                        </View>
                        <View style={{flexDirection: 'row'}}>
                          <Text style={{width: 180, fontSize: 24, color: '#333333', textAlign: 'center', textAlignVertical: 'center', borderTopWidth: 1, borderRightWidth: 1, borderLeftWidth: 1}}>纳税人识别号</Text>
                          <Text style={{ flex: 1, fontSize: 24, color: '#333333', textAlign: 'center', textAlignVertical: 'center', borderTopWidth: 1, borderRightWidth: 1, paddingVertical: 10}}>91440300051530634L</Text>
                        </View>
                        <View style={{flexDirection: 'row'}}>
                          <Text style={{width: 180, fontSize: 24, color: '#333333', textAlign: 'center', textAlignVertical: 'center', borderTopWidth: 1, borderRightWidth: 1, borderLeftWidth: 1}}>电话</Text>
                          <Text style={{ flex: 1, fontSize: 24, color: '#333333', textAlign: 'center', textAlignVertical: 'center', borderTopWidth: 1, borderRightWidth: 1, paddingVertical: 10}}>0755-36633079</Text>
                        </View>
                        <View style={{flexDirection: 'row'}}>
                          <Text style={{width: 180, fontSize: 24, color: '#333333', textAlign: 'center', textAlignVertical: 'center', borderTopWidth: 1, borderRightWidth: 1, borderLeftWidth: 1}}>开户行</Text>
                          <Text style={{ flex: 1, fontSize: 24, color: '#333333', textAlign: 'center', textAlignVertical: 'center', borderTopWidth: 1, borderRightWidth: 1, paddingVertical: 10}}>中国建设银行股份有限公司深圳龙华支行</Text>
                        </View>
                        <View style={{flexDirection: 'row'}}>
                          <Text style={{width: 180, fontSize: 24, color: '#333333', textAlign: 'center', textAlignVertical: 'center', borderTopWidth: 1, borderRightWidth: 1, borderLeftWidth: 1}}>银行账号</Text>
                          <Text style={{ flex: 1, fontSize: 24, color: '#333333', textAlign: 'center', textAlignVertical: 'center', borderTopWidth: 1, borderRightWidth: 1, paddingVertical: 10}}>44201555400052526338</Text>
                        </View>
                        <View style={{flexDirection: 'row'}}>
                          <Text style={{width: 180, fontSize: 24, color: '#333333', textAlign: 'center', textAlignVertical: 'center', borderTopWidth: 1, borderRightWidth: 1, borderLeftWidth: 1, borderBottomWidth: 1}}>名称</Text>
                          <Text style={{ flex: 1, fontSize: 24, color: '#333333', textAlign: 'center', textAlignVertical: 'center', borderTopWidth: 1, borderRightWidth: 1, paddingVertical: 10, borderBottomWidth: 1}}>深圳市众鼎劳务派遣有限公司</Text>
                        </View>
                      </> : <>
                        <View style={{flexDirection: 'row'}}>
                          <Text style={{width: 180, fontSize: 24, color: '#333333', textAlign: 'center', textAlignVertical: 'center', borderTopWidth: 1, borderRightWidth: 1, borderLeftWidth: 1}}>开户行</Text>
                          <Text style={{ flex: 1, fontSize: 24, color: '#333333', textAlign: 'center', textAlignVertical: 'center', borderTopWidth: 1, borderRightWidth: 1, paddingVertical: 10}}>中国招商银行深圳龙华支行</Text>
                        </View>
                        <View style={{flexDirection: 'row'}}>
                          <Text style={{width: 180, fontSize: 24, color: '#333333', textAlign: 'center', textAlignVertical: 'center', borderTopWidth: 1, borderRightWidth: 1, borderLeftWidth: 1}}>银行卡号</Text>
                          <Text style={{ flex: 1, fontSize: 24, color: '#333333', textAlign: 'center', textAlignVertical: 'center', borderTopWidth: 1, borderRightWidth: 1, paddingVertical: 10}}>6214857803889361</Text>
                        </View>
                        <View style={{flexDirection: 'row'}}>
                          <Text style={{width: 180, fontSize: 24, color: '#333333', textAlign: 'center', textAlignVertical: 'center', borderTopWidth: 1, borderRightWidth: 1, borderLeftWidth: 1 ,borderBottomWidth: 1}}>姓名</Text>
                          <Text style={{ flex: 1, fontSize: 24, color: '#333333', textAlign: 'center', textAlignVertical: 'center', borderTopWidth: 1, borderRightWidth: 1, borderBottomWidth: 1, paddingVertical: 10}}>唐平</Text>
                        </View>
                      </>}
                    </View> : <></>}
                    <Field
                      name="settlement_people"
                      label="结算收款财务人"
                      type="recruiter"
                      component={SingleSelect}
                    />
                    <View style={{flexDirection: 'row'}}>
                      <Field
                        name="settlement_returnMsg_mode"
                        label="在离职名单回传频率"
                        radioList={SETTLEMENT_RANGE_MODE}
                        AreaStyle={{width: 510, marginRight: 10}}
                        otherRadioPress={otherRadioPress}
                        component={RadioSelect}
                      />
                      <Field
                        name="settlement_returnMsg_date"
                        label="日期"
                        placeholder={rest.values.settlement_returnMsg_mode.length ? rest.values.settlement_returnMsg_mode[0].value === 'month' ? '日期' : '每周' : '选择'}
                        showLabel={false}
                        canSearch={false}
                        touchAreaStyle={{borderWidth: 0}}
                        touchStyle={{borderWidth: 2, borderColor: '#E5E5E5', borderRadius: 6}}
                        selectList={rest.values.settlement_returnMsg_mode.length ? rest.values.settlement_returnMsg_mode[0].value === 'month' ? SETTLEMENT_RANGE_MONTH : SETTLEMENT_RANGE_WEEK : []}
                        otherSelectPress={otherSelectPress}
                        component={SingleSelect}
                      />
                    </View>
                  </View>
                </View>
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
  },
  saveBtn: {
    height: 60, 
    backgroundColor: '#409EFF', 
    paddingHorizontal: 18, 
    justifyContent: 'center', 
    marginLeft: 20, 
    borderRadius: 6
  },
  btnText: {
    fontSize: 28, 
    color: '#fff', 
    fontWeight: 'bold'
  },
  loadingArea: {
    height: 60,
    backgroundColor: '#999999',
    paddingHorizontal: 18, 
    justifyContent: 'center', 
    marginLeft: 20, 
    borderRadius: 6
  }
});

export default forwardRef(Policy);