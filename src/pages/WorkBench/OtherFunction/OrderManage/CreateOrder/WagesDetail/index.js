import React, {useState} from "react";
import { View, StyleSheet, Text, TouchableOpacity, TextInput } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Formik, Field } from 'formik';
import * as Yup from 'yup';

import SingleInput from "../../../../../../components/OrderForm/SingleInput";
import SingleSelect from "../../../../../../components/OrderForm/SingleSelect";
import RadioSelect from "../../../../../../components/OrderForm/RadioSelect";
import { SALARY_TYPE, FOOD_LIST, DORMITORY_LIST, WATER_FEE_LIST } from "../../../../../../utils/const";
import SettlementRules from "./SettlementRules";
import {originRule} from './SettlementRules/const';

let restForm;
const validationSchema = Yup.object().shape({
  payType: Yup.array().min(1, '请选择借支类型'),
  wageDetail: Yup.string().required('请输入工价详情文本'),
  food: Yup.array().min(1, '请选择就餐'),
  dormitory: Yup.array().min(1, '请选择住宿'),
  water_fee: Yup.array().min(1, '请选择水电费'),
  commercial: Yup.string().required('请输入需要购买商保的文本内容'),
  social: Yup.string().required('请输入需要购买商保的文本内容'),
  leave_self: Yup.string().required('请输入需要购买商保的文本内容'),
  induction: Yup.string().required('请输入需要购买商保的文本内容'),
  remark: Yup.string().required('请输入需要购买商保的文本内容')
});

const initialValues = {
  payType: [],
  wageDetail: '',
  food: [],
  dormitory: [],
  water_fee: [],
  commercial: '',
  social: '',
  leave_self: '',
  induction: '',
  remark: '',
  ...originRule
};

// 会员工价详情
const WagesDetail = () => {
  const [showDetail, setShowDetail] = useState(true);

  const detailOnPress = () => setShowDetail(!showDetail);

  const onSubmit = async (values) => {
    console.log('提交表单', values)
  };

  return (
    <View style={{marginTop: 20}}>
      <TouchableOpacity style={styles.touchArea} onPress={detailOnPress}>
        <Text style={[styles.title, showDetail && styles.boldText]}>会员工价详情</Text>
        <AntDesign
          name={showDetail ? 'down' : 'up'}
          size={36}
          color={showDetail ? '#000000' : '#999999'}
        />
      </TouchableOpacity>
      {showDetail && <View style={{backgroundColor: '#ffffff', borderTopWidth: 1, borderTopColor: '#999999', paddingTop: 20}}>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}>
          {({values, handleSubmit, ...rest }) => {
            restForm = rest;
            restForm.values = values;
            console.log('rest', rest);
            return (
              <View style={{ flex: 1, paddingHorizontal: 28}}>
                <View style={{flex: 1, flexDirection: 'row'}}>
                  <Field
                    name="wageDetail"
                    label="工价详情"
                    placeholder="请输入工价详情文本"
                    maxLength={200}
                    multiline
                    lengthLimit
                    inputContainerStyle={{minHeight: 120, alignItems: 'flex-start'}}
                    component={SingleInput}
                  />
                  <TouchableOpacity style={{backgroundColor: '#409EFF', height: 60, paddingHorizontal: 18, justifyContent: 'center', marginLeft: 20, borderRadius: 6}} onPress={handleSubmit}>
                    <Text style={{fontSize: 28, color: '#fff', fontWeight: 'bold'}}>保存</Text>
                  </TouchableOpacity>
                </View>
                <Field
                  name="payType"
                  label="借支类型"
                  radioList={SALARY_TYPE}
                  component={RadioSelect}
                />
                {values.payType.length && values.payType[0].value !== 'NoDEBIT' ? <Field
                  name="requireNumber"
                  label="借支金额"
                  selectTextOnFocus
                  keyboardType="numeric"
                  maxLength={4}
                  component={SingleInput}
                  inputRightComponent={<Text style={{height: 60, textAlignVertical: 'center', fontSize: 26, color: '#333333'}}>{values.payType[0].value === 'DAILY' ? '元/天' : values.payType[0].value === 'WEEKLY' ? '周/天' : '月/天'}</Text>}
                /> : <></>}
                <Field  
                  name='food'
                  label="就餐"
                  selectList={FOOD_LIST}
                  component={SingleSelect}
                />
                <Field  
                  name='dormitory'
                  label="住宿"
                  selectList={DORMITORY_LIST}
                  component={SingleSelect}
                />
                <Field  
                  name='water_fee'
                  label="水电费"
                  selectList={WATER_FEE_LIST}
                  component={SingleSelect}
                />
                <Field
                  name="commercial"
                  label="购买商保"
                  placeholder="请输入商保文本"
                  maxLength={200}
                  multiline
                  lengthLimit
                  selectTextOnFocus
                  inputContainerStyle={styles.inputContainerStyle}
                  labelStyle={{width: 170}}
                  component={SingleInput}
                />
                <Field
                  name="social"
                  label="购买社保"
                  placeholder="请输入社保文本"
                  maxLength={200}
                  multiline
                  lengthLimit
                  selectTextOnFocus
                  inputContainerStyle={styles.inputContainerStyle}
                  labelStyle={{width: 170}}
                  component={SingleInput}
                />
                <Field
                  name="leave_self"
                  label="自离薪资"
                  placeholder="请输入自离薪资文本"
                  maxLength={200}
                  multiline
                  lengthLimit
                  selectTextOnFocus
                  inputContainerStyle={styles.inputContainerStyle}
                  labelStyle={{width: 170}}
                  component={SingleInput}
                />
                <Field
                  name="induction"
                  label="会员入职奖"
                  placeholder="请输入会员入职奖文本"
                  maxLength={200}
                  multiline
                  lengthLimit
                  selectTextOnFocus
                  inputContainerStyle={styles.inputContainerStyle}
                  labelStyle={{width: 170}}
                  component={SingleInput}
                />
                <Field
                  name="remark"
                  label="备注说明"
                  placeholder="请输入备注说明文本"
                  maxLength={200}
                  multiline
                  lengthLimit
                  selectTextOnFocus
                  inputContainerStyle={styles.inputContainerStyle}
                  labelStyle={{width: 170}}
                  component={SingleInput}
                />
                <View style={styles.noticeArea}>
                  <AntDesign
                    name='star'
                    size={28}
                    color='red'
                  />
                  <Text style={styles.notice_text}>请注意月初和月底跨月招聘时，适用日期要合理设置，避免工价异常！</Text>
                </View>
                {/* 结算规则组件 */}
                <SettlementRules
                  values={values}
                  restForm={restForm}
                  initialValues={initialValues}
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
  },
  inputContainerStyle: {
    minHeight: 100, 
    alignItems: 'flex-start'
  },
  noticeArea: {
    flexDirection: 'row', 
    alignItems: 'center'
  },
  notice_text: {
    fontSize: 22, 
    color: 'red', 
    textAlign: 'center'
  }
});

export default WagesDetail;