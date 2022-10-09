import React, {useState, useEffect, Children} from "react";
import { View, StyleSheet, Text, TouchableOpacity, TextInput } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Formik, Field } from 'formik';
import * as Yup from 'yup';
import { Shadow } from 'react-native-shadow-2';
import { TabView, TabBar } from 'react-native-tab-view';

import SingleInput from "../../../../../../../components/OrderForm/SingleInput";
import OrderRangeInput from "../../../../../../../components/OrderForm/OrderRangeInput";
import SingleSelect from "../../../../../../../components/OrderForm/SingleSelect";
import LittleSingleSelect from "../../../../../../../components/OrderForm/LittleSingleSelect";
import LittleSingleInput from "../../../../../../../components/OrderForm/LittleSingleInput";
import RadioSelect from "../../../../../../../components/OrderForm/RadioSelect";
import OrderRangeDate from "../../../../../../../components/OrderForm/OrderRangeDate";
import LittleSingleDate from "../../../../../../../components/OrderForm/LittleSingleDate";
import TabSelectItem from "../../../../../../../components/OrderForm/TabSelectItem";
import MyMembersApi from "../../../../../../../request/MyMembersApi";
import { SALARY_TYPE, FOOD_LIST, DORMITORY_LIST, WATER_FEE_LIST, MODE_LIST, MALE_OR_FEMALE, MEMBER_FEE_MODE, FEE_WAY_MODE } from "../../../../../../../utils/const";

const SettlementRules = ({
  values,
  initialValues,
  restForm,
  ...rest
}) => {
  const [index, setIndex] = useState(0);
  const [rulesList, setRulesList] = useState([{
    name: 1,
    age: 2
  }]);

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

    let newFieldValues = {};
    newFieldValues[`orderRangeDate${rulesList.length + 1}`] = {startDate: '', endDate: ''};
    newFieldValues[`mode${rulesList.length + 1}`] = [];
    newFieldValues[`wagesAndSalary${rulesList.length + 1}`] = {
      value: [{ label: '不区分男女', value: 'NOT_DISTINGUISH' }],
      children: {
        fee_mode: {
          value: [{ label: '纯', value: 'PURE' }],
          children: {
            pure: {
              mode: [{ label: '工价', value: 'WORK_FEE' }],
              value: ''
            },
            working: {
              time: '',
              mode1: {
                mode: [{ label: '工价', value: 'WORK_FEE' }],
                value: ''
              },
              mode2: {
                mode: [{ label: '工价', value: 'WORK_FEE' }],
                value: ''
              }
            },
            card_day: {
              value: '',
              mode1: {
                mode: [{ label: '工价', value: 'WORK_FEE' }],
                value: ''
              },
              mode2: {
                mode: [{ label: '工价', value: 'WORK_FEE' }],
                value: ''
              }
            },
            card_hour: {
              value: '',
              mode1: {
                mode: [{ label: '工价', value: 'WORK_FEE' }],
                value: ''
              },
              mode2: {
                mode: [{ label: '工价', value: 'WORK_FEE' }],
                value: ''
              }
            },
            working_day: {
              value: '',
              mode1: {
                mode: [{ label: '工价', value: 'WORK_FEE' }],
                value: ''
              },
              mode2: {
                mode: [{ label: '工价', value: 'WORK_FEE' }],
                value: ''
              }
            },
            working_hour: {
              value: '',
              mode1: {
                mode: [{ label: '工价', value: 'WORK_FEE' }],
                value: ''
              },
              mode2: {
                mode: [{ label: '工价', value: 'WORK_FEE' }],
                value: ''
              }
            }
          }
        }
      }
    };
    restForm.setValues({
      ...restForm.values,
      ...newFieldValues
    })
  };

  const renderLabel = ({ route, focused, color }) => (
    <Text style={[{fontSize: 26, color}, focused && {fontWeight: 'bold'}]}>
      {route.title}
    </Text>
  );

  const tabBar = props => (
    <TabBar
      pressColor="#fff"
      activeColor="#409EFF"
      inactiveColor="#999999"
      bounces={true}
      style={styles.tabBarStyle}
      indicatorStyle={styles.tabBarIndicatorStyle}
      renderLabel={renderLabel}
      {...props}
    />
  );

  const renderScene = ({route}) => {
    switch(route.key){
      case 'NOT_DISTINGUISH': 
        return <View style={{height: 100, borderWidth: 1, borderColor: 'red'}}>
          <Text>哇哈哈</Text>
        </View>
      case 'DISTINGUISH':
        return <View style={{height: 100, borderWidth: 1, borderColor: '#409EFF'}}></View>
    }
  };
  
  const renderRoute = [
    { key: 'NOT_DISTINGUISH', title: '不区分男女' },
    { key: 'DISTINGUISH', title: '区分男女' }
  ];

  console.log('rest', rest);
  
  return (
    <View style={{marginTop: 10}}>
      <Formik
        initialValues={initialValues}
        onSubmit={()=>console.log('提交了表单')}>
        {({handleSubmit, ...rest }) => {
          return (
            <>
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
                        name={`mode${ruleIndex + 1}`}
                        label="结算模式"
                        selectList={MODE_LIST}
                        component={SingleSelect}
                      />
                      <View style={{flex: 1}}>
                        <Text style={styles.labelText}>工价/底薪：</Text>
                        <View style={{minHeight: 500}}>
                          <TabView
                            renderTabBar={tabBar}
                            onIndexChange={setIndex}
                            renderScene={renderScene}
                            navigationState={{ index, routes: renderRoute }}
                          />
                        </View>

                        <View style={{flex: 1, borderWidth: 1, backgroundColor: '#ffffff', borderColor: '#999999', borderRadius: 10, minHeight: 200}}>
                          <Field  
                            name={`wagesAndSalary${ruleIndex + 1}.value`}
                            selectList={MALE_OR_FEMALE}
                            component={TabSelectItem}
                          />
                          {values[`wagesAndSalary${ruleIndex + 1}`].value[0].value === 'NOT_DISTINGUISH' && <View style={{flex: 1, padding: 20}}>
                            <Field  
                              name={`wagesAndSalary${ruleIndex + 1}.children.fee_mode.value`}
                              label="模式"
                              selectList={MEMBER_FEE_MODE}
                              labelStyle={{minWidth: 0}}
                              component={SingleSelect}
                            />
                            {/* 模式：纯 */}
                            {values[`wagesAndSalary${ruleIndex + 1}`].children.fee_mode.value[0].value === 'PURE' && <View style={{borderWidth: 1, flexDirection: 'row', padding: 20, borderRadius: 10, borderColor: '#999999'}}>
                              <Text style={{fontSize: 22, textAlignVertical: 'center', color: '#333333'}}>纯：</Text>
                              <View style={{width: 100, marginRight: 10}}>
                                <View style={{flex: 1}}>
                                  <Field  
                                    name={`wagesAndSalary${ruleIndex + 1}.children.fee_mode.children.pure.mode`}
                                    showLabel={false}
                                    selectList={FEE_WAY_MODE}
                                    component={LittleSingleSelect}
                                  />
                                </View>
                              </View>
                              <View style={{width: 180, height: 50}}>
                                <Field  
                                  name={`wagesAndSalary${ruleIndex + 1}.children.fee_mode.children.pure.value`}
                                  inputStyle={{maxHeight: 60}}
                                  inputRightComponent={<View style={{justifyContent: 'center', alignItems: 'center', backgroundColor: '#409EFF', borderRadius: 6, marginLeft: 10}}>
                                    <Text style={{fontSize: 22, color: '#fff', paddingHorizontal: 10}}>元/小时</Text>
                                  </View>}
                                  component={LittleSingleInput}
                                />
                              </View>
                            </View>}
                            {/* 模式：是否在职 */}
                            {values[`wagesAndSalary${ruleIndex + 1}`].children.fee_mode.value[0].value === 'WORKING' && <View style={{borderWidth: 1, flexDirection: 'row', padding: 20, borderRadius: 10, borderColor: '#999999'}}>
                              <View style={{flex: 1, justifyContent: 'center'}}>
                                <Field
                                  name={`wagesAndSalary${ruleIndex + 1}.children.fee_mode.children.working.time`}
                                  component={LittleSingleDate}
                                />
                              </View>
                              <View style={{width: 100}}>
                                <Text style={{flex: 1, fontSize: 22, textAlign: 'center', textAlignVertical: 'center', color: '#333333'}}>在职</Text>
                                <Text style={{flex: 1, fontSize: 22, textAlign: 'center', textAlignVertical: 'center', color: '#333333'}}>不在职</Text>
                              </View>
                              <View style={{width: 100, marginRight: 10}}>
                                <View style={{flex: 1}}>
                                  <Field  
                                    name={`wagesAndSalary${ruleIndex + 1}.children.fee_mode.children.working.mode1.mode`}
                                    showLabel={false}
                                    selectList={FEE_WAY_MODE}
                                    component={LittleSingleSelect}
                                  />
                                </View>
                                <View style={{height: 10}}></View>
                                <View style={{flex: 1}}>
                                  <Field  
                                    name={`wagesAndSalary${ruleIndex + 1}.children.fee_mode.children.working.mode2.mode`}
                                    showLabel={false}
                                    selectList={FEE_WAY_MODE}
                                    component={LittleSingleSelect}
                                  />
                                </View>
                              </View>
                              <View style={{flex: 1, justifyContent: 'center'}}>
                                <View style={{maxWidth: 180, height: 50}}>
                                  <Field  
                                    name={`wagesAndSalary${ruleIndex + 1}.children.fee_mode.children.working.mode1.value`}
                                    inputStyle={{maxHeight: 50}}
                                    inputRightComponent={<View style={{justifyContent: 'center', alignItems: 'center', backgroundColor: '#409EFF', borderRadius: 6, marginLeft: 10}}>
                                      <Text style={{fontSize: 22, color: '#fff', paddingHorizontal: 10}}>元/小时</Text>
                                    </View>}
                                    component={LittleSingleInput}
                                  />
                                </View>
                                <View style={{height: 10}}></View>
                                <View style={{maxWidth: 180, height: 50}}>
                                  <Field  
                                    name={`wagesAndSalary${ruleIndex + 1}.children.fee_mode.children.working.mode2.value`}
                                    inputStyle={{maxHeight: 50}}
                                    inputRightComponent={<View style={{justifyContent: 'center', alignItems: 'center', backgroundColor: '#409EFF', borderRadius: 6, marginLeft: 10}}>
                                      <Text style={{fontSize: 22, color: '#fff', paddingHorizontal: 10}}>元/小时</Text>
                                    </View>}
                                    component={LittleSingleInput}
                                  />
                                </View>
                              </View>
                            </View>}
                            {/* 模式：打卡是否满（单位：天） */}
                            {values[`wagesAndSalary${ruleIndex + 1}`].children.fee_mode.value[0].value === 'CARD_DAY' && <View style={{borderWidth: 1, flexDirection: 'row', padding: 20, borderRadius: 10, borderColor: '#999999'}}>
                              <>
                                <View style={{width: 120}}>
                                  <Text style={{flex: 1, fontSize: 22, textAlignVertical: 'center', color: '#333333'}}>打卡满：</Text>
                                  <Text style={{flex: 1, fontSize: 22, textAlignVertical: 'center', color: '#333333'}}>打卡不满：</Text>
                                </View>
                                <View style={{width: 120, justifyContent: 'center', marginRight: 10}}>
                                  <Field  
                                    name={`wagesAndSalary${ruleIndex + 1}.children.fee_mode.children.card_day.value`}
                                    showLabel={false}
                                    inputStyle={{maxHeight: 50}}
                                    inputRightComponent={<View style={{justifyContent: 'center', alignItems: 'center', backgroundColor: '#409EFF', borderRadius: 6, marginLeft: 5}}>
                                      <Text style={{fontSize: 22, color: '#fff', paddingHorizontal: 10}}>天</Text>
                                    </View>}
                                    component={LittleSingleInput}
                                  />
                                </View>
                                <View style={{width: 100, marginRight: 10}}>
                                  <View style={{flex: 1}}>
                                    <Field  
                                      name={`wagesAndSalary${ruleIndex + 1}.children.fee_mode.children.card_day.mode1.mode`}
                                      showLabel={false}
                                      selectList={FEE_WAY_MODE}
                                      component={LittleSingleSelect}
                                    />
                                  </View>
                                  <View style={{height: 10}}></View>
                                  <View style={{flex: 1}}>
                                    <Field  
                                      name={`wagesAndSalary${ruleIndex + 1}.children.fee_mode.children.card_day.mode2.mode`}
                                      showLabel={false}
                                      selectList={FEE_WAY_MODE}
                                      component={LittleSingleSelect}
                                    />
                                  </View>
                                </View>
                                <View style={{flex: 1, justifyContent: 'center'}}>
                                  <View style={{maxWidth: 180, height: 50}}>
                                    <Field  
                                      name={`wagesAndSalary${ruleIndex + 1}.children.fee_mode.children.card_day.mode1.value`}
                                      inputStyle={{maxHeight: 50}}
                                      inputRightComponent={<View style={{justifyContent: 'center', alignItems: 'center', backgroundColor: '#409EFF', borderRadius: 6, marginLeft: 10}}>
                                        <Text style={{fontSize: 22, color: '#fff', paddingHorizontal: 10}}>元/小时</Text>
                                      </View>}
                                      component={LittleSingleInput}
                                    />
                                  </View>
                                  <View style={{height: 10}}></View>
                                  <View style={{maxWidth: 180, height: 50}}>
                                    <Field  
                                      name={`wagesAndSalary${ruleIndex + 1}.children.fee_mode.children.card_day.mode2.value`}
                                      inputStyle={{maxHeight: 50}}
                                      inputRightComponent={<View style={{justifyContent: 'center', alignItems: 'center', backgroundColor: '#409EFF', borderRadius: 6, marginLeft: 10}}>
                                        <Text style={{fontSize: 22, color: '#fff', paddingHorizontal: 10}}>元/小时</Text>
                                      </View>}
                                      component={LittleSingleInput}
                                    />
                                  </View>
                                </View>
                              </>
                            </View>}
                            {/* 模式：打卡是否满（单位：时） */}
                            {values[`wagesAndSalary${ruleIndex + 1}`].children.fee_mode.value[0].value === 'CARD_HOUR' && <View style={{borderWidth: 1, flexDirection: 'row', padding: 20, borderRadius: 10, borderColor: '#999999'}}>
                              <>
                                <View style={{width: 120}}>
                                  <Text style={{flex: 1, fontSize: 22, textAlignVertical: 'center', color: '#333333'}}>打卡满：</Text>
                                  <Text style={{flex: 1, fontSize: 22, textAlignVertical: 'center', color: '#333333'}}>打卡不满：</Text>
                                </View>
                                <View style={{width: 120, justifyContent: 'center', marginRight: 10}}>
                                  <Field  
                                    name={`wagesAndSalary${ruleIndex + 1}.children.fee_mode.children.card_hour.value`}
                                    showLabel={false}
                                    inputStyle={{maxHeight: 50}}
                                    inputRightComponent={<View style={{justifyContent: 'center', alignItems: 'center', backgroundColor: '#409EFF', borderRadius: 6, marginLeft: 5}}>
                                      <Text style={{fontSize: 22, color: '#fff', paddingHorizontal: 10}}>时</Text>
                                    </View>}
                                    component={LittleSingleInput}
                                  />
                                </View>
                                <View style={{width: 100, marginRight: 10}}>
                                  <View style={{flex: 1}}>
                                    <Field  
                                      name={`wagesAndSalary${ruleIndex + 1}.children.fee_mode.children.card_hour.mode1.mode`}
                                      showLabel={false}
                                      selectList={FEE_WAY_MODE}
                                      component={LittleSingleSelect}
                                    />
                                  </View>
                                  <View style={{height: 10}}></View>
                                  <View style={{flex: 1}}>
                                    <Field  
                                      name={`wagesAndSalary${ruleIndex + 1}.children.fee_mode.children.card_hour.mode2.mode`}
                                      showLabel={false}
                                      selectList={FEE_WAY_MODE}
                                      component={LittleSingleSelect}
                                    />
                                  </View>
                                </View>
                                <View style={{flex: 1, justifyContent: 'center'}}>
                                  <View style={{maxWidth: 180, height: 50}}>
                                    <Field  
                                      name={`wagesAndSalary${ruleIndex + 1}.children.fee_mode.children.card_hour.mode1.value`}
                                      inputStyle={{maxHeight: 50}}
                                      inputRightComponent={<View style={{justifyContent: 'center', alignItems: 'center', backgroundColor: '#409EFF', borderRadius: 6, marginLeft: 10}}>
                                        <Text style={{fontSize: 22, color: '#fff', paddingHorizontal: 10}}>元/小时</Text>
                                      </View>}
                                      component={LittleSingleInput}
                                    />
                                  </View>
                                  <View style={{height: 10}}></View>
                                  <View style={{maxWidth: 180, height: 50}}>
                                    <Field  
                                      name={`wagesAndSalary${ruleIndex + 1}.children.fee_mode.children.card_hour.mode2.value`}
                                      inputStyle={{maxHeight: 50}}
                                      inputRightComponent={<View style={{justifyContent: 'center', alignItems: 'center', backgroundColor: '#409EFF', borderRadius: 6, marginLeft: 10}}>
                                        <Text style={{fontSize: 22, color: '#fff', paddingHorizontal: 10}}>元/小时</Text>
                                      </View>}
                                      component={LittleSingleInput}
                                    />
                                  </View>
                                </View>
                              </>
                            </View>}
                            {/* 模式：在职是否满（单位：天） */}
                            {values[`wagesAndSalary${ruleIndex + 1}`].children.fee_mode.value[0].value === 'WORKING_DAY' && <View style={{borderWidth: 1, flexDirection: 'row', padding: 20, borderRadius: 10, borderColor: '#999999'}}>
                              <>
                                <View style={{width: 120}}>
                                  <Text style={{flex: 1, fontSize: 22, textAlignVertical: 'center', color: '#333333'}}>在职满：</Text>
                                  <Text style={{flex: 1, fontSize: 22, textAlignVertical: 'center', color: '#333333'}}>在职不满：</Text>
                                </View>
                                <View style={{width: 120, justifyContent: 'center', marginRight: 10}}>
                                  <Field  
                                    name={`wagesAndSalary${ruleIndex + 1}.children.fee_mode.children.working_day.value`}
                                    showLabel={false}
                                    inputStyle={{maxHeight: 50}}
                                    inputRightComponent={<View style={{justifyContent: 'center', alignItems: 'center', backgroundColor: '#409EFF', borderRadius: 6, marginLeft: 5}}>
                                      <Text style={{fontSize: 22, color: '#fff', paddingHorizontal: 10}}>天</Text>
                                    </View>}
                                    component={LittleSingleInput}
                                  />
                                </View>
                                <View style={{width: 100, marginRight: 10}}>
                                  <View style={{flex: 1}}>
                                    <Field  
                                      name={`wagesAndSalary${ruleIndex + 1}.children.fee_mode.children.working_day.mode1.mode`}
                                      showLabel={false}
                                      selectList={FEE_WAY_MODE}
                                      component={LittleSingleSelect}
                                    />
                                  </View>
                                  <View style={{height: 10}}></View>
                                  <View style={{flex: 1}}>
                                    <Field  
                                      name={`wagesAndSalary${ruleIndex + 1}.children.fee_mode.children.working_day.mode2.mode`}
                                      showLabel={false}
                                      selectList={FEE_WAY_MODE}
                                      component={LittleSingleSelect}
                                    />
                                  </View>
                                </View>
                                <View style={{flex: 1, justifyContent: 'center'}}>
                                  <View style={{maxWidth: 180, height: 50}}>
                                    <Field  
                                      name={`wagesAndSalary${ruleIndex + 1}.children.fee_mode.children.working_day.mode1.value`}
                                      inputStyle={{maxHeight: 50}}
                                      inputRightComponent={<View style={{justifyContent: 'center', alignItems: 'center', backgroundColor: '#409EFF', borderRadius: 6, marginLeft: 10}}>
                                        <Text style={{fontSize: 22, color: '#fff', paddingHorizontal: 10}}>元/小时</Text>
                                      </View>}
                                      component={LittleSingleInput}
                                    />
                                  </View>
                                  <View style={{height: 10}}></View>
                                  <View style={{maxWidth: 180, height: 50}}>
                                    <Field  
                                      name={`wagesAndSalary${ruleIndex + 1}.children.fee_mode.children.working_day.mode2.value`}
                                      inputStyle={{maxHeight: 50}}
                                      inputRightComponent={<View style={{justifyContent: 'center', alignItems: 'center', backgroundColor: '#409EFF', borderRadius: 6, marginLeft: 10}}>
                                        <Text style={{fontSize: 22, color: '#fff', paddingHorizontal: 10}}>元/小时</Text>
                                      </View>}
                                      component={LittleSingleInput}
                                    />
                                  </View>
                                </View>
                              </>
                            </View>}
                            {/* 模式：在职是否满（单位：时） */}
                            {values[`wagesAndSalary${ruleIndex + 1}`].children.fee_mode.value[0].value === 'WORKING_HOUR' && <View style={{borderWidth: 1, flexDirection: 'row', padding: 20, borderRadius: 10, borderColor: '#999999'}}>
                              <>
                                <View style={{width: 120}}>
                                  <Text style={{flex: 1, fontSize: 22, textAlignVertical: 'center', color: '#333333'}}>在职满：</Text>
                                  <Text style={{flex: 1, fontSize: 22, textAlignVertical: 'center', color: '#333333'}}>在职不满：</Text>
                                </View>
                                <View style={{width: 120, justifyContent: 'center', marginRight: 10}}>
                                  <Field  
                                    name={`wagesAndSalary${ruleIndex + 1}.children.fee_mode.children.working_hour.value`}
                                    showLabel={false}
                                    inputStyle={{maxHeight: 50}}
                                    inputRightComponent={<View style={{justifyContent: 'center', alignItems: 'center', backgroundColor: '#409EFF', borderRadius: 6, marginLeft: 5}}>
                                      <Text style={{fontSize: 22, color: '#fff', paddingHorizontal: 10}}>时</Text>
                                    </View>}
                                    component={LittleSingleInput}
                                  />
                                </View>
                                <View style={{width: 100, marginRight: 10}}>
                                  <View style={{flex: 1}}>
                                    <Field  
                                      name={`wagesAndSalary${ruleIndex + 1}.children.fee_mode.children.working_hour.mode1.mode`}
                                      showLabel={false}
                                      selectList={FEE_WAY_MODE}
                                      component={LittleSingleSelect}
                                    />
                                  </View>
                                  <View style={{height: 10}}></View>
                                  <View style={{flex: 1}}>
                                    <Field  
                                      name={`wagesAndSalary${ruleIndex + 1}.children.fee_mode.children.working_hour.mode2.mode`}
                                      showLabel={false}
                                      selectList={FEE_WAY_MODE}
                                      component={LittleSingleSelect}
                                    />
                                  </View>
                                </View>
                                <View style={{flex: 1, justifyContent: 'center'}}>
                                  <View style={{maxWidth: 180, height: 50}}>
                                    <Field  
                                      name={`wagesAndSalary${ruleIndex + 1}.children.fee_mode.children.working_hour.mode1.value`}
                                      inputStyle={{maxHeight: 50}}
                                      inputRightComponent={<View style={{justifyContent: 'center', alignItems: 'center', backgroundColor: '#409EFF', borderRadius: 6, marginLeft: 10}}>
                                        <Text style={{fontSize: 22, color: '#fff', paddingHorizontal: 10}}>元/小时</Text>
                                      </View>}
                                      component={LittleSingleInput}
                                    />
                                  </View>
                                  <View style={{height: 10}}></View>
                                  <View style={{maxWidth: 180, height: 50}}>
                                    <Field  
                                      name={`wagesAndSalary${ruleIndex + 1}.children.fee_mode.children.working_hour.mode2.value`}
                                      inputStyle={{maxHeight: 50}}
                                      inputRightComponent={<View style={{justifyContent: 'center', alignItems: 'center', backgroundColor: '#409EFF', borderRadius: 6, marginLeft: 10}}>
                                        <Text style={{fontSize: 22, color: '#fff', paddingHorizontal: 10}}>元/小时</Text>
                                      </View>}
                                      component={LittleSingleInput}
                                    />
                                  </View>
                                </View>
                              </>
                            </View>}
                          </View>}
                          {values[`wagesAndSalary${ruleIndex + 1}`].value[0].value === 'DISTINGUISH' && <View style={{flex: 1, padding: 20, paddingBottom: 0}}>
                            <View style={{minHeight: 200, marginBottom: 20}}>
                              <View style={{borderWidth: 1}}>
                                <Text style={{fontSize: 26, fontWeight: 'bold', textAlign: 'center'}}>男</Text>
                              </View>
                              <View style={{flex: 1, borderWidth: 1}}>

                              </View>
                            </View>
                            <View style={{minHeight: 200, marginBottom: 20}}>
                              <View style={{borderWidth: 1}}>
                                <Text style={{fontSize: 26, fontWeight: 'bold', textAlign: 'center'}}>女</Text>
                              </View>
                              <View style={{flex: 1, borderWidth: 1}}>

                              </View>
                            </View>
                          </View>}
                        </View>
                      </View>
                    </View>
                  </Shadow>
                )})}
            </>
          )
        }}
      </Formik>
    </View>
  )
};

const styles = StyleSheet.create({
  labelText: {
    height: 60,
    textAlignVertical: 'center',
    minWidth: 150,
    fontSize: 26,
    color: '#333333'
  },
});

export default SettlementRules;