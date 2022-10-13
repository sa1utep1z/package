import React, {useState} from "react";
import { View, StyleSheet, Text, TouchableOpacity, TextInput } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Formik, Field } from 'formik';
import * as Yup from 'yup';
import moment from "moment";

import SingleInput from "../../../../../../components/OrderForm/SingleInput";
import SingleSelect from "../../../../../../components/OrderForm/SingleSelect";
import RadioSelect from "../../../../../../components/OrderForm/RadioSelect";
import { SALARY_TYPE, FOOD_LIST, DORMITORY_LIST, WATER_FEE_LIST } from "../../../../../../utils/const";
import SettlementRules from "./SettlementRules";
import {originRule} from './SettlementRules/const';
import { deepCopy } from "../../../../../../utils";

let restForm;
const oneYearBefore = moment().subtract(1, 'years').format('YYYY-MM-DD');
const oneYearLater = moment().add(1, 'years').format('YYYY-MM-DD');

const validationSchema = Yup.object().shape({
  explain: Yup.string().required('请输入工价详情文本')
});

const initialValues = {
  debtType: [],
  explain: '',
  debtAmount: '',
  eat: [],
  stay: [],
  waterElectricity: [],
  commercial: '',
  socialSecurity: '',
  leaveSalary: '',
  memberAward: '',
  remark: ''
};

// 会员工价详情
const WagesDetail = ({
  scrollRef
}) => {
  const [showDetail, setShowDetail] = useState(true);
  const [rulesList, setRulesList] = useState([]);

  const detailOnPress = () => setShowDetail(!showDetail);

  const deleteRule = (rule) => {
    const copyList = deepCopy(rulesList);
    const findRuleIndex = rulesList.findIndex(item => item.ruleLocation === rule.ruleLocation);
    copyList.splice(findRuleIndex, 1);
    setRulesList(copyList);

    const formValues = deepCopy(restForm.values);
    delete formValues[`differenceAndReturnMoney${rule.ruleLocation}`];
    delete formValues[`mode${rule.ruleLocation}`];
    delete formValues[`orderRangeDate${rule.ruleLocation}`];
    delete formValues[`wagesAndSalary${rule.ruleLocation}`];
    restForm.setValues(formValues);
  };

  const addRule = () => {
    scrollRef?.current?.scrollToEnd({animated: true, duration: 1000});

    if(!rulesList.length){
      setRulesList([{ruleLocation: 1, startDateLimit: oneYearBefore, endDateLimit: oneYearLater}]);
      restForm.setValues({
        ...restForm.values,
        ...originRule
      })
      return;
    }

    const lastRuleEndDate = restForm.values[`orderRangeDate${rulesList.length}`].endDate;
    const newDate = moment(lastRuleEndDate).add(1, 'days').format('YYYY-MM-DD');
    const oneYearLaterOfEnd = moment(newDate).add(1, 'years').format('YYYY-MM-DD'); //目前时间范围一年后；

    const copyList = deepCopy(rulesList);
    copyList.push({ruleLocation: rulesList.length + 1, startDateLimit: newDate, endDateLimit: oneYearLaterOfEnd});
    setRulesList(copyList);

    let newFieldValues = {};
    newFieldValues[`orderRangeDate${rulesList.length + 1}`] = {startDate: newDate, endDate: newDate};
    newFieldValues[`mode${rulesList.length + 1}`] = originRule.mode1;
    newFieldValues[`wagesAndSalary${rulesList.length + 1}`] = originRule.wagesAndSalary1;
    newFieldValues[`differenceAndReturnMoney${rulesList.length + 1}`] = originRule.differenceAndReturnMoney1;
    restForm.setValues({
      ...restForm.values,
      ...newFieldValues
    })
  };

  const onSubmit = async (values) => {
    console.log('origin-values', values);
    const newObject = {
      explain: values.explain, //工价详情
      debtType: values.debtType.length ? values.debtType[0].value : '', //借支类型
      debtAmount: values.debtAmount, //借支金额
      eat: values.eat.length ? values.eat[0].value : '', //就餐
      stay: values.stay.length ? values.stay[0].value : '', //住宿
      waterElectricity: values.waterElectricity.length ? values.waterElectricity[0].value : '', //水电费
      commercial: values.commercial, //购买商保
      socialSecurity: values.socialSecurity, //购买社保
      leaveSalary: values.leaveSalary, //自离薪资
      memberAward: values.memberAward, //会员入职奖
      remark: values.remark //备注说明
    };
    console.log('transform-newObject', newObject);
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
            return (
              <View style={{ flex: 1, paddingHorizontal: 28}}>
                <View style={{flex: 1, flexDirection: 'row'}}>
                  <Field
                    name="explain"
                    label="工价详情"
                    placeholder="请输入工价详情文本"
                    maxLength={200}
                    multiline
                    lengthLimit
                    isRequire
                    inputContainerStyle={{minHeight: 120, alignItems: 'flex-start'}}
                    component={SingleInput}
                  />
                  <TouchableOpacity style={{backgroundColor: '#409EFF', height: 60, paddingHorizontal: 18, justifyContent: 'center', marginLeft: 20, borderRadius: 6}} onPress={handleSubmit}>
                    <Text style={{fontSize: 28, color: '#fff', fontWeight: 'bold'}}>保存</Text>
                  </TouchableOpacity>
                </View>
                <Field
                  name="debtType"
                  label="借支类型"
                  radioList={SALARY_TYPE}
                  component={RadioSelect}
                />
                {values.debtType.length && values.debtType[0].value !== 'NoDEBIT' ? <Field
                  name="debtAmount"
                  label="借支金额"
                  selectTextOnFocus
                  keyboardType="numeric"
                  maxLength={4}
                  component={SingleInput}
                  inputRightComponent={<Text style={{height: 60, textAlignVertical: 'center', fontSize: 26, color: '#333333'}}>{values.debtType[0].value === 'DAILY' ? '元/天' : values.debtType[0].value === 'WEEKLY' ? '周/天' : '月/天'}</Text>}
                /> : <></>}
                <Field  
                  name='eat'
                  label="就餐"
                  selectList={FOOD_LIST}
                  canSearch={false}
                  component={SingleSelect}
                />
                <Field  
                  name='stay'
                  label="住宿"
                  selectList={DORMITORY_LIST}
                  canSearch={false}
                  component={SingleSelect}
                />
                <Field  
                  name='waterElectricity'
                  label="水电费"
                  selectList={WATER_FEE_LIST}
                  canSearch={false}
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
                  name="socialSecurity"
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
                  name="leaveSalary"
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
                  name="memberAward"
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
                  scrollRef={scrollRef}
                  values={values}
                  restForm={restForm}
                  initialValues={initialValues}
                  rulesList={rulesList}
                  addRule={addRule}
                  deleteRule={deleteRule}
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