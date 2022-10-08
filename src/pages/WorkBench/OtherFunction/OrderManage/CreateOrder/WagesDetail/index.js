import React, {useState, useEffect} from "react";
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Formik, Field } from 'formik';
import * as Yup from 'yup';
import { Shadow } from 'react-native-shadow-2';

import SingleInput from "../../../../../../components/OrderForm/SingleInput";
import OrderRangeInput from "../../../../../../components/OrderForm/OrderRangeInput";
import SingleSelect from "../../../../../../components/OrderForm/SingleSelect";
import LittleSingleSelect from "../../../../../../components/OrderForm/LittleSingleSelect";
import RadioSelect from "../../../../../../components/OrderForm/RadioSelect";
import OrderRangeDate from "../../../../../../components/OrderForm/OrderRangeDate";
import SelectPhotos from "../../../../../../components/OrderForm/SelectPhotos";
import OrderSingleDate from "../../../../../../components/OrderForm/OrderSingleDate";
import TabSelectItem from "../../../../../../components/OrderForm/TabSelectItem";
import MyMembersApi from "../../../../../../request/MyMembersApi";
import { SALARY_TYPE, FOOD_LIST, DORMITORY_LIST, WATER_FEE_LIST, MODE_LIST, MALE_OR_FEMALE, MEMBER_FEE_MODE, FEE_WAY_MODE } from "../../../../../../utils/const";
import { deepCopy } from "../../../../../../utils";

const validationSchema = Yup.object().shape({
  orderName: Yup.string().required('请输入订单名称'),
  factory: Yup.array().min(1, '请选择用工企业'),
  job: Yup.array().min(1, '请选择岗位'),
  jobType: Yup.array().min(1, '请选择工种'),
  orderRangeDate: Yup.object({
    startDate: Yup.string().required('请选择订单开始日期'),
    endDate: Yup.string().required('请选择订单结束日期')
  }),
  orderDuration: Yup.string().required('请选择订单工期'),
  jobOrder: Yup.string().required('请输入职位顺序'),
  complexSalary: Yup.object({
    start: Yup.string().required('请输入起始薪资'),
    end: Yup.string().required('请输入结束薪资')
  }),
  pictureList: Yup.array().min(1, '请选择职位展示图片'),
  littleProgramTitle: Yup.string().required('请输入小程序职位标题'),
  littleProgramSalaryDetail: Yup.string().required('请输入小程序薪资详情文本'),
});

const initialValues = {
  orderName: '',
  factory: [],
  jobOrder: '',
  job: [],
  jobType: [],
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
  littleProgramTitle: '',
  littleProgramSalaryDetail: '',
  food: [],
  dormitory: [],
  water_fee: [],
  commercial: '',
  social: '',
  leave_self: '',
  induction: '',
  remark: '',
  orderRangeDate1: {
    startDate: '',
    endDate: ''
  },
  mode: [],
  female_or_not1: [{ label: '不区分男女', value: 'NOT_DISTINGUISH' }],
  fee_mode: [{ label: '纯', value: 'PURE' }],
  fee_way_mode: [{ label: '工价', value: 'WORK_FEE' }]
};

const WagesDetail = () => {
  const [showDetail, setShowDetail] = useState(true);
  const [rulesList, setRulesList] = useState([{
    name: 1,
    age: 2
  }]);

  const detailOnPress = () => setShowDetail(!showDetail);

  const deleteRule = (rule) => {
    const copyList = deepCopy(rulesList);
    const findRuleIndex = rulesList.findIndex(item => item.name === rule.name);
    copyList.splice(findRuleIndex, 1);
    setRulesList(copyList);
  };

  const addRule = () => {
    const copyList = deepCopy(rulesList);
    copyList.push({
      name: rulesList.length + 1,
      age: rulesList.length + 2
    });
    setRulesList(copyList);
  };

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
          handleChange={(e) => console.log('e', e)}
          onSubmit={onSubmit}>
          {({values, handleSubmit, ...rest }) => {
            console.log('rest', rest);
            return (
              <View style={{ flex: 1, paddingHorizontal: 28}}>
                <View style={{flex: 1, flexDirection: 'row'}}>
                  <Field
                    name="littleProgramSalaryDetail"
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
                  name="job"
                  label="借支类型"
                  radioList={SALARY_TYPE}
                  component={RadioSelect}
                />
                {values.job.length && values.job[0].value !== 'NoDEBIT' ? <Field
                  name="requireNumber"
                  label="借支金额"
                  selectTextOnFocus
                  keyboardType="numeric"
                  maxLength={4}
                  component={SingleInput}
                  inputRightComponent={<Text style={{height: 60, textAlignVertical: 'center', fontSize: 26, color: '#333333'}}>{values.job[0].value === 'DAILY' ? '元/天' : values.job[0].value === 'WEEKLY' ? '周/天' : '月/天'}</Text>}
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
                  inputContainerStyle={{minHeight: 100, alignItems: 'flex-start'}}
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
                  inputContainerStyle={{minHeight: 100, alignItems: 'flex-start'}}
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
                  inputContainerStyle={{minHeight: 100, alignItems: 'flex-start'}}
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
                  inputContainerStyle={{minHeight: 100, alignItems: 'flex-start'}}
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
                  inputContainerStyle={{minHeight: 100, alignItems: 'flex-start'}}
                  labelStyle={{width: 170}}
                  component={SingleInput}
                />
                <Text style={{fontSize: 22, color: 'red', textAlign: 'center'}}>请注意月初和月底跨月招聘时，适用日期要合理设置，避免工价异常！</Text>
                <View>
                  <Text style={styles.labelText}>会员结算规则：</Text>
                  <View style={{marginTop: 10}}>
                    {rulesList.map((rule, ruleIndex) => {
                      return (
                        <Shadow key={ruleIndex} style={{width: '100%', marginBottom: 30, borderRadius: 10}}>
                          <View style={{height: 60, backgroundColor: '#EFEFEF', justifyContent: 'center', borderTopRightRadius: 10, borderTopLeftRadius: 10}}>
                            {rulesList.length !== 1 && <TouchableOpacity style={{width: 60, height: 60, position: 'absolute', zIndex: 999, justifyContent: 'center', alignItems: 'center'}} onPress={()=>deleteRule(rule)}>
                              <AntDesign
                                name='delete'
                                size={36}
                                color='#ff6666'
                              />
                            </TouchableOpacity>}
                            <Text style={{fontSize: 28, fontWeight: 'bold', textAlign: 'center'}}>{`规则${ruleIndex + 1}`}</Text>
                            {rulesList.length !== 5 && <TouchableOpacity style={{width: 60, height: 60, position: 'absolute', zIndex: 999, right: 0, justifyContent: 'center', alignItems: 'center'}} onPress={addRule}>
                              <AntDesign
                                name='pluscircleo'
                                size={36}
                                color='#409EFF'
                              />
                            </TouchableOpacity>}
                          </View>
                          <View style={{backgroundColor: '#fff', minHeight: 200, borderBottomLeftRadius: 10, borderBottomRightRadius: 10, padding: 20}}>
                            <Field
                              name={`orderRangeDate${ruleIndex + 1}`}
                              label="适用日期"
                              component={OrderRangeDate}
                            />
                            <Field  
                              name='mode'
                              label="结算模式"
                              selectList={MODE_LIST}
                              component={SingleSelect}
                            />
                            <View style={{flex: 1}}>
                              <Text style={styles.labelText}>工价/底薪：</Text>
                              <View style={{flex: 1, borderWidth: 1, backgroundColor: '#ffffff', borderColor: '#999999', borderRadius: 10, minHeight: 200}}>
                                <Field  
                                  name='female_or_not1'
                                  selectList={MALE_OR_FEMALE}
                                  component={TabSelectItem}
                                />
                                <View style={{flex: 1, padding: 20}}>
                                  <Field  
                                    name='fee_mode'
                                    label="模式"
                                    selectList={MEMBER_FEE_MODE}
                                    labelStyle={{minWidth: 0}}
                                    component={SingleSelect}
                                  />
                                  {values.fee_mode[0].value === 'PURE' && <View>
                                    <Text>纯</Text>
                                  </View>}
                                  {values.fee_mode[0].value === 'WORKING' && <View>
                                    <Text>在职/不在职</Text>
                                  </View>}
                                  {values.fee_mode[0].value === 'CARD_DAY' && <View style={{borderWidth: 1, flexDirection: 'row', minHeight: 100}}>
                                    <View style={{flex: 1}}>
                                      <Text style={{flex: 1, fontSize: 22, textAlignVertical: 'center', color: '#333333'}}>打卡满：</Text>
                                      <Text style={{flex: 1, fontSize: 22, textAlignVertical: 'center', color: '#333333'}}>打卡不满：</Text>
                                    </View>
                                    <View style={{flex: 1, borderWidth: 1}}>

                                    </View>
                                    <View style={{flex: 1, borderWidth: 1}}>
                                      <View style={{flex: 1}}>
                                        <Field  
                                          name='fee_way_mode'
                                          showLabel={false}
                                          selectList={FEE_WAY_MODE}
                                          component={LittleSingleSelect}
                                        />
                                      </View>
                                      <View style={{flex: 1}}>
                                        <Field  
                                          name='fee_way_mode'
                                          showLabel={false}
                                          selectList={FEE_WAY_MODE}
                                          component={LittleSingleSelect}
                                        />
                                      </View>
                                    </View>
                                    <View style={{flex: 1, borderWidth: 1}}>

                                    </View>
                                    <View style={{flex: 1, borderWidth: 1}}>

                                    </View>
                                  </View>}
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

export default WagesDetail;