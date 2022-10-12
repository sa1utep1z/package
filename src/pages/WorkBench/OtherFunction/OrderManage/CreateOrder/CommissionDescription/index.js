import React, {useState, useEffect} from "react";
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Formik, Field } from 'formik';
import * as Yup from 'yup';
import { Shadow } from 'react-native-shadow-2';
import moment from "moment";

import SingleInput from "../../../../../../components/OrderForm/SingleInput";
import MultiSelect from "../../../../../../components/OrderForm/MultiSelect";
import RadioSelect from "../../../../../../components/OrderForm/RadioSelect";
import OrderRangeDate from "../../../../../../components/OrderForm/OrderRangeDate";
import { CONDITIONS_LIST, REWARD_MODE } from "../../../../../../utils/const";
import { deepCopy } from "../../../../../../utils";

let restForm;
const today = moment().format('YYYY-MM-DD');
const oneYearBefore = moment().subtract(1, 'years').format('YYYY-MM-DD');
const oneYearLater = moment().add(1, 'years').format('YYYY-MM-DD');

const originCommissionRule = {
  rule1: {
    orderRangeDate: {
      startDate: today,
      endDate: today
    },
    store: [],
    conditionsSetting: [],
    days: '',
    recruiter: '',
    groupLeader: '',
    storeLeader: ''
  }
};

const validationSchema = Yup.object().shape({
  rewardMode: Yup.array().min(1, '请选择提成模式'),
  // orderRangeDate: Yup.object({
  //   startDate: Yup.string().required('请选择订单开始日期'),
  //   endDate: Yup.string().required('请选择订单结束日期')
  // }),
  // store: Yup.array().min(1, '请选择适用门店'),
  // conditionsSetting: Yup.array().min(1, '请选择条件'),
  // days: Yup.string().required('请输入天数'),
  // recruiter: Yup.string().required('请输入招聘员的提成规则'),
  // groupLeader: Yup.string().required('请输入组长的提成规则'),
  // storeLeader: Yup.string().required('请输入店长的提成规则')
});

const initialValues = {
  rewardMode: [],
  ...originCommissionRule
};

// 招聘员提成说明
const CommissionDescription = () => {
  const [showDetail, setShowDetail] = useState(true);
  const [rulesList, setRulesList] = useState([
    {index: 1, startDateLimit: oneYearBefore, endDateLimit: oneYearLater}
  ]);

  const detailOnPress = () => setShowDetail(!showDetail);

  const deleteRule = (rule) => {
    const copyList = deepCopy(rulesList);
    const findRuleIndex = rulesList.findIndex(item => item.index === rule.index);
    copyList.splice(findRuleIndex, 1);
    setRulesList(copyList);
  };

  const addRule = () => {
    //获取当前规则列表中上一个列表的开始和结束时间；
    const lastRuleStartDate = restForm.values[`rule${rulesList.length}`].orderRangeDate.startDate;
    const lastRuleEndDate = restForm.values[`rule${rulesList.length}`].orderRangeDate.endDate;
    const newDate = moment(lastRuleEndDate).add(1, 'days').format('YYYY-MM-DD');
    const oneYearLaterOfEnd = moment(newDate).add(1, 'years').format('YYYY-MM-DD'); //目前时间范围一年后；

    const copyList = deepCopy(rulesList);
    copyList.push({index: rulesList.length + 1, startDateLimit: lastRuleStartDate, endDateLimit: oneYearLaterOfEnd});
    setRulesList(copyList);

    let newFieldValues = {};
    newFieldValues[`rule${rulesList.length + 1}`] = {...originCommissionRule.rule1};
    newFieldValues[`rule${rulesList.length + 1}`].orderRangeDate = {startDate: newDate, endDate: newDate};

    restForm.setValues({
      ...restForm.values,
      ...newFieldValues
    })
  };

  const onSubmit = async (values) => {
    console.log('提交表单', values)
  };

  return (
    <View style={{marginTop: 20}}>
      <TouchableOpacity style={styles.touchArea} onPress={detailOnPress}>
        <Text style={[styles.title, showDetail && styles.boldText]}>招聘员提成说明</Text>
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
          {({ handleSubmit, ...rest }) => {
            restForm = rest;
            return (
              <View style={{ flex: 1, paddingHorizontal: 28}}>
                <View style={{flex: 1, flexDirection: 'row'}}>
                  <View style={{flex: 1}}>
                    <Field
                      name="rewardMode"
                      label="提成模式"
                      radioList={REWARD_MODE}
                      component={RadioSelect}
                    />
                  </View>
                  <TouchableOpacity style={{backgroundColor: '#409EFF', height: 60, paddingHorizontal: 18, justifyContent: 'center', marginLeft: 20, borderRadius: 6}} onPress={handleSubmit}>
                    <Text style={{fontSize: 28, color: '#fff', fontWeight: 'bold'}}>保存</Text>
                  </TouchableOpacity>
                </View>
                <View>
                  <Text style={styles.labelText}>提成规则详情：</Text>
                  <View style={{marginTop: 10}}>
                    {rulesList.map((rule, ruleIndex) => {
                      return (
                        <Shadow key={ruleIndex} style={{width: '100%', marginBottom: 30}}>
                          <View style={{borderRadius: 10}}>
                            <View style={{height: 60, backgroundColor: '#EFEFEF', justifyContent: 'center', borderTopRightRadius: 10, borderTopLeftRadius: 10}}>
                              {rulesList.length !== 1 && <TouchableOpacity style={{width: 60, height: 60, position: 'absolute', zIndex: 999, justifyContent: 'center', alignItems: 'center'}} onPress={()=>deleteRule(rule)}>
                                <AntDesign
                                  name='delete'
                                  size={36}
                                  color='#ff6666'
                                />
                              </TouchableOpacity>}
                              <Text style={{fontSize: 28, fontWeight: 'bold', textAlign: 'center'}}>{`适用门店${rule.index}`}</Text>
                              {rulesList.length !== 20 && <TouchableOpacity style={{width: 60, height: 60, position: 'absolute', zIndex: 999, right: 0, justifyContent: 'center', alignItems: 'center'}} onPress={addRule}>
                                <AntDesign
                                  name='pluscircleo'
                                  size={36}
                                  color='#409EFF'
                                />
                              </TouchableOpacity>}
                            </View>
                            <View style={{flex: 1, padding: 20}}>
                              <Field
                                name={`rule${ruleIndex + 1}.orderRangeDate`}
                                label="订单日期"
                                limit={rule}
                                limitCrossDate
                                canSelect={ruleIndex === rulesList.length - 1}
                                component={OrderRangeDate}
                              />
                              <Field  
                                name={`rule${ruleIndex + 1}.store`}
                                type="store"
                                filterStore
                                label="适用门店"
                                component={MultiSelect}
                              />
                              <View style={{flex: 1, flexDirection: 'row'}}>
                                <View style={{flex: 1}}>
                                  <Field
                                    name={`rule${ruleIndex + 1}.conditionsSetting`}
                                    label="条件设置"
                                    radioList={CONDITIONS_LIST}
                                    radioItemsStyle={{height: 60}}
                                    component={RadioSelect}
                                  />
                                </View>
                                <View style={{width: 110, marginLeft: 10}}>
                                  <Field
                                    name={`rule${ruleIndex + 1}.days`}
                                    placeholder="天数"
                                    maxLength={3}
                                    showLabel={false}
                                    centerInput
                                    keyboardType="numeric"
                                    selectTextOnFocus
                                    component={SingleInput}
                                  />
                                </View>
                                <View style={{width: 40, height: 60, justifyContent: 'center', alignItems: 'center', backgroundColor: '#409EFF', borderRadius: 6, marginLeft: 10}}>
                                  <Text style={{fontSize: 28, color: '#ffffff'}}>天</Text>
                                </View>
                              </View>
                              <View style={{backgroundColor: '#FAFAFA', borderRadius: 10, padding: 20, paddingBottom: 0, borderWidth: 1, borderColor: '#999999'}}>
                                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                                  <Text style={styles.labelText}>提成规则</Text>
                                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <Text style={{fontSize: 26, color: '#ffffff', backgroundColor: '#409EFF', paddingHorizontal: 15, paddingVertical: 5, borderTopLeftRadius: 6, borderBottomLeftRadius: 6}}>单位</Text>
                                    <Text style={{fontSize: 26, color: '#ffffff', backgroundColor: '#E6A042', paddingHorizontal: 15, paddingVertical: 5, borderTopRightRadius: 6, borderBottomRightRadius: 6}}>{rest.values.rewardMode.length ? rest.values.rewardMode[0].value === 'STUB' ? '元/人' : '元/人/天' : '请选择提成模式'}</Text>
                                  </View>
                                </View>
                                <View style={{flexDirection: 'row', paddingTop: 20}}>
                                  <Text style={{fontSize: 26, color: '#333333', height: 60, textAlignVertical: 'center'}}>招聘员：</Text>
                                  <Field
                                    name={`rule${ruleIndex + 1}.recruiter`}
                                    showLabel={false}
                                    placeholder="输入"
                                    maxLength={3}
                                    centerInput
                                    keyboardType="numeric"
                                    selectTextOnFocus
                                    component={SingleInput}
                                  />
                                  <View style={{width: 20}}></View>
                                  <Text style={{fontSize: 26, color: '#333333', height: 60, textAlignVertical: 'center'}}>组长：</Text>
                                  <Field
                                    name={`rule${ruleIndex + 1}.groupLeader`}
                                    showLabel={false}
                                    placeholder="输入"
                                    maxLength={3}
                                    centerInput
                                    keyboardType="numeric"
                                    selectTextOnFocus
                                    component={SingleInput}
                                  />
                                  <View style={{width: 20}}></View>
                                  <Text style={{fontSize: 26, color: '#333333', height: 60, textAlignVertical: 'center'}}>店长：</Text>
                                  <Field
                                    name={`rule${ruleIndex + 1}.storeLeader`}
                                    showLabel={false}
                                    placeholder="输入"
                                    maxLength={3}
                                    centerInput
                                    keyboardType="numeric"
                                    selectTextOnFocus
                                    component={SingleInput}
                                  />
                                </View>
                              </View>
                            </View>
                          </View>
                        </Shadow>
                      )})}
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
  labelText: {
    height: 60,
    textAlignVertical: 'center',
    minWidth: 150,
    fontSize: 26,
    color: '#333333'
  }
});

export default CommissionDescription;