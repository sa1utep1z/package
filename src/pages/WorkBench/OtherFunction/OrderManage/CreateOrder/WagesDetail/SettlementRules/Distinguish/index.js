import React, {useState, useEffect, Children} from "react";
import { View, StyleSheet, Text, TouchableOpacity, TextInput } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Formik, Field } from 'formik';
import * as Yup from 'yup';
import { Shadow } from 'react-native-shadow-2';
import { TabView, TabBar } from 'react-native-tab-view';

import SingleInput from "../../../../../../../../components/OrderForm/SingleInput";
import OrderRangeInput from "../../../../../../../../components/OrderForm/OrderRangeInput";
import SingleSelect from "../../../../../../../../components/OrderForm/SingleSelect";
import LittleSingleSelect from "../../../../../../../../components/OrderForm/LittleSingleSelect";
import LittleSingleInput from "../../../../../../../../components/OrderForm/LittleSingleInput";
import RadioSelect from "../../../../../../../../components/OrderForm/RadioSelect";
import OrderRangeDate from "../../../../../../../../components/OrderForm/OrderRangeDate";
import LittleSingleDate from "../../../../../../../../components/OrderForm/LittleSingleDate";
import TabSelectItem from "../../../../../../../../components/OrderForm/TabSelectItem";
import MyMembersApi from "../../../../../../../../request/MyMembersApi";
import { SALARY_TYPE, FOOD_LIST, DORMITORY_LIST, WATER_FEE_LIST, MODE_LIST, MALE_OR_FEMALE, MEMBER_FEE_MODE, FEE_WAY_MODE } from "../../../../../../../../utils/const";

const Distinguish = ({
  type,
  values,
  ruleIndex,
  ...rest
}) => {

  return (
    <View style={{flex: 1, padding: 20, paddingBottom: 0}}>
      {/* 男 */}
      <View style={{flexDirection: 'row', minHeight: 200, marginBottom: 20}}>
        <Text style={{fontSize: 26, fontWeight: 'bold', textAlign: 'center', textAlignVertical: 'center', backgroundColor: '#409EFF', color: '#ffffff', paddingHorizontal: 5, borderTopLeftRadius: 6, borderBottomLeftRadius: 6}}>男</Text>
        <View style={{flex: 1, borderWidth: 1, borderLeftWidth: 0, borderTopRightRadius: 6, borderBottomRightRadius: 6, borderColor: '#999999', padding: 20}}>
          <View style={{height: 60, marginBottom: 20}}>
            <Field  
              name={`${type}${ruleIndex + 1}.distinguish.male.fee_mode.value`}
              label="模式"
              selectList={MEMBER_FEE_MODE}
              labelStyle={{minWidth: 0}}
              component={SingleSelect}
            />
          </View>
          {/* 模式：纯 */}
          {values[`${type}${ruleIndex + 1}`].distinguish.male.fee_mode.value[0].value === 'PURE' && <View style={{borderWidth: 1, flexDirection: 'row', padding: 20, borderRadius: 10, borderColor: '#999999'}}>
            <Text style={{fontSize: 22, textAlignVertical: 'center', color: '#333333'}}>纯：</Text>
            <View style={{width: 100, marginRight: 10}}>
              <View style={{flex: 1}}>
                <Field  
                  name={`${type}${ruleIndex + 1}.distinguish.male.fee_mode.children.pure.mode`}
                  showLabel={false}
                  selectList={FEE_WAY_MODE}
                  component={LittleSingleSelect}
                />
              </View>
            </View>
            <View style={{width: 180, height: 50}}>
              <Field  
                name={`${type}${ruleIndex + 1}.distinguish.male.fee_mode.children.pure.value`}
                inputStyle={{maxHeight: 60}}
                inputRightComponent={<View style={{justifyContent: 'center', alignItems: 'center', backgroundColor: '#409EFF', borderRadius: 6, marginLeft: 10}}>
                  <Text style={{fontSize: 22, color: '#fff', paddingHorizontal: 10}}>元/小时</Text>
                </View>}
                component={LittleSingleInput}
              />
            </View>
          </View>}
          {/* 模式：是否在职 */}
          {values[`${type}${ruleIndex + 1}`].distinguish.male.fee_mode.value[0].value === 'WORKING' && <View style={{borderWidth: 1, flexDirection: 'row', padding: 20, borderRadius: 10, borderColor: '#999999'}}>
            <View style={{flex: 1, justifyContent: 'center'}}>
              <Field
                name={`${type}${ruleIndex + 1}.distinguish.male.fee_mode.children.working.time`}
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
                  name={`${type}${ruleIndex + 1}.distinguish.male.fee_mode.children.working.mode1.mode`}
                  showLabel={false}
                  selectList={FEE_WAY_MODE}
                  component={LittleSingleSelect}
                />
              </View>
              <View style={{height: 10}}></View>
              <View style={{flex: 1}}>
                <Field  
                  name={`${type}${ruleIndex + 1}.distinguish.male.fee_mode.children.working.mode2.mode`}
                  showLabel={false}
                  selectList={FEE_WAY_MODE}
                  component={LittleSingleSelect}
                />
              </View>
            </View>
            <View style={{flex: 1, justifyContent: 'center'}}>
              <View style={{maxWidth: 180, height: 50}}>
                <Field  
                  name={`${type}${ruleIndex + 1}.distinguish.male.fee_mode.children.working.mode1.value`}
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
                  name={`${type}${ruleIndex + 1}.distinguish.male.fee_mode.children.working.mode2.value`}
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
          {values[`${type}${ruleIndex + 1}`].distinguish.male.fee_mode.value[0].value === 'CARD_DAY' && <View style={{borderWidth: 1, flexDirection: 'row', padding: 20, borderRadius: 10, borderColor: '#999999'}}>
            <>
              <View style={{width: 120}}>
                <Text style={{flex: 1, fontSize: 22, textAlignVertical: 'center', color: '#333333'}}>打卡满：</Text>
                <Text style={{flex: 1, fontSize: 22, textAlignVertical: 'center', color: '#333333'}}>打卡不满：</Text>
              </View>
              <View style={{width: 120, justifyContent: 'center', marginRight: 10}}>
                <Field  
                  name={`${type}${ruleIndex + 1}.distinguish.male.fee_mode.children.card_day.value`}
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
                    name={`${type}${ruleIndex + 1}.distinguish.male.fee_mode.children.card_day.mode1.mode`}
                    showLabel={false}
                    selectList={FEE_WAY_MODE}
                    component={LittleSingleSelect}
                  />
                </View>
                <View style={{height: 10}}></View>
                <View style={{flex: 1}}>
                  <Field  
                    name={`${type}${ruleIndex + 1}.distinguish.male.fee_mode.children.card_day.mode2.mode`}
                    showLabel={false}
                    selectList={FEE_WAY_MODE}
                    component={LittleSingleSelect}
                  />
                </View>
              </View>
              <View style={{flex: 1, justifyContent: 'center'}}>
                <View style={{maxWidth: 180, height: 50}}>
                  <Field  
                    name={`${type}${ruleIndex + 1}.distinguish.male.fee_mode.children.card_day.mode1.value`}
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
                    name={`${type}${ruleIndex + 1}.distinguish.male.fee_mode.children.card_day.mode2.value`}
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
          {values[`${type}${ruleIndex + 1}`].distinguish.male.fee_mode.value[0].value === 'CARD_HOUR' && <View style={{borderWidth: 1, flexDirection: 'row', padding: 20, borderRadius: 10, borderColor: '#999999'}}>
            <>
              <View style={{width: 120}}>
                <Text style={{flex: 1, fontSize: 22, textAlignVertical: 'center', color: '#333333'}}>打卡满：</Text>
                <Text style={{flex: 1, fontSize: 22, textAlignVertical: 'center', color: '#333333'}}>打卡不满：</Text>
              </View>
              <View style={{width: 120, justifyContent: 'center', marginRight: 10}}>
                <Field  
                  name={`${type}${ruleIndex + 1}.distinguish.male.fee_mode.children.card_hour.value`}
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
                    name={`${type}${ruleIndex + 1}.distinguish.male.fee_mode.children.card_hour.mode1.mode`}
                    showLabel={false}
                    selectList={FEE_WAY_MODE}
                    component={LittleSingleSelect}
                  />
                </View>
                <View style={{height: 10}}></View>
                <View style={{flex: 1}}>
                  <Field  
                    name={`${type}${ruleIndex + 1}.distinguish.male.fee_mode.children.card_hour.mode2.mode`}
                    showLabel={false}
                    selectList={FEE_WAY_MODE}
                    component={LittleSingleSelect}
                  />
                </View>
              </View>
              <View style={{flex: 1, justifyContent: 'center'}}>
                <View style={{maxWidth: 180, height: 50}}>
                  <Field  
                    name={`${type}${ruleIndex + 1}.distinguish.male.fee_mode.children.card_hour.mode1.value`}
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
                    name={`${type}${ruleIndex + 1}.distinguish.male.fee_mode.children.card_hour.mode2.value`}
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
          {values[`${type}${ruleIndex + 1}`].distinguish.male.fee_mode.value[0].value === 'WORKING_DAY' && <View style={{borderWidth: 1, flexDirection: 'row', padding: 20, borderRadius: 10, borderColor: '#999999'}}>
            <>
              <View style={{width: 120}}>
                <Text style={{flex: 1, fontSize: 22, textAlignVertical: 'center', color: '#333333'}}>在职满：</Text>
                <Text style={{flex: 1, fontSize: 22, textAlignVertical: 'center', color: '#333333'}}>在职不满：</Text>
              </View>
              <View style={{width: 120, justifyContent: 'center', marginRight: 10}}>
                <Field  
                  name={`${type}${ruleIndex + 1}.distinguish.male.fee_mode.children.working_day.value`}
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
                    name={`${type}${ruleIndex + 1}.distinguish.male.fee_mode.children.working_day.mode1.mode`}
                    showLabel={false}
                    selectList={FEE_WAY_MODE}
                    component={LittleSingleSelect}
                  />
                </View>
                <View style={{height: 10}}></View>
                <View style={{flex: 1}}>
                  <Field  
                    name={`${type}${ruleIndex + 1}.distinguish.male.fee_mode.children.working_day.mode2.mode`}
                    showLabel={false}
                    selectList={FEE_WAY_MODE}
                    component={LittleSingleSelect}
                  />
                </View>
              </View>
              <View style={{flex: 1, justifyContent: 'center'}}>
                <View style={{maxWidth: 180, height: 50}}>
                  <Field  
                    name={`${type}${ruleIndex + 1}.distinguish.male.fee_mode.children.working_day.mode1.value`}
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
                    name={`${type}${ruleIndex + 1}.distinguish.male.fee_mode.children.working_day.mode2.value`}
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
          {values[`${type}${ruleIndex + 1}`].distinguish.male.fee_mode.value[0].value === 'WORKING_HOUR' && <View style={{borderWidth: 1, flexDirection: 'row', padding: 20, borderRadius: 10, borderColor: '#999999'}}>
            <>
              <View style={{width: 120}}>
                <Text style={{flex: 1, fontSize: 22, textAlignVertical: 'center', color: '#333333'}}>在职满：</Text>
                <Text style={{flex: 1, fontSize: 22, textAlignVertical: 'center', color: '#333333'}}>在职不满：</Text>
              </View>
              <View style={{width: 120, justifyContent: 'center', marginRight: 10}}>
                <Field  
                  name={`${type}${ruleIndex + 1}.distinguish.male.fee_mode.children.working_hour.value`}
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
                    name={`${type}${ruleIndex + 1}.distinguish.male.fee_mode.children.working_hour.mode1.mode`}
                    showLabel={false}
                    selectList={FEE_WAY_MODE}
                    component={LittleSingleSelect}
                  />
                </View>
                <View style={{height: 10}}></View>
                <View style={{flex: 1}}>
                  <Field  
                    name={`${type}${ruleIndex + 1}.distinguish.male.fee_mode.children.working_hour.mode2.mode`}
                    showLabel={false}
                    selectList={FEE_WAY_MODE}
                    component={LittleSingleSelect}
                  />
                </View>
              </View>
              <View style={{flex: 1, justifyContent: 'center'}}>
                <View style={{maxWidth: 180, height: 50}}>
                  <Field  
                    name={`${type}${ruleIndex + 1}.distinguish.male.fee_mode.children.working_hour.mode1.value`}
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
                    name={`${type}${ruleIndex + 1}.distinguish.male.fee_mode.children.working_hour.mode2.value`}
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
        </View>
      </View>
      {/* 女 */}
      <View style={{flexDirection: 'row', minHeight: 200, marginBottom: 20}}>
        <Text style={{fontSize: 26, fontWeight: 'bold', textAlign: 'center', textAlignVertical: 'center', backgroundColor: '#409EFF', color: '#ffffff', paddingHorizontal: 5, borderTopLeftRadius: 6, borderBottomLeftRadius: 6}}>女</Text>
        <View style={{flex: 1, borderWidth: 1, borderLeftWidth: 0, borderTopRightRadius: 6, borderBottomRightRadius: 6, borderColor: '#999999', padding: 20}}>
          <View style={{height: 60, marginBottom: 20}}>
            <Field  
              name={`${type}${ruleIndex + 1}.distinguish.female.fee_mode.value`}
              label="模式"
              selectList={MEMBER_FEE_MODE}
              labelStyle={{minWidth: 0}}
              component={SingleSelect}
            />
          </View>
          {/* 模式：纯 */}
          {values[`${type}${ruleIndex + 1}`].distinguish.female.fee_mode.value[0].value === 'PURE' && <View style={{borderWidth: 1, flexDirection: 'row', padding: 20, borderRadius: 10, borderColor: '#999999'}}>
            <Text style={{fontSize: 22, textAlignVertical: 'center', color: '#333333'}}>纯：</Text>
            <View style={{width: 100, marginRight: 10}}>
              <View style={{flex: 1}}>
                <Field  
                  name={`${type}${ruleIndex + 1}.distinguish.female.fee_mode.children.pure.mode`}
                  showLabel={false}
                  selectList={FEE_WAY_MODE}
                  component={LittleSingleSelect}
                />
              </View>
            </View>
            <View style={{width: 180, height: 50}}>
              <Field  
                name={`${type}${ruleIndex + 1}.distinguish.female.fee_mode.children.pure.value`}
                inputStyle={{maxHeight: 60}}
                inputRightComponent={<View style={{justifyContent: 'center', alignItems: 'center', backgroundColor: '#409EFF', borderRadius: 6, marginLeft: 10}}>
                  <Text style={{fontSize: 22, color: '#fff', paddingHorizontal: 10}}>元/小时</Text>
                </View>}
                component={LittleSingleInput}
              />
            </View>
          </View>}
          {/* 模式：是否在职 */}
          {values[`${type}${ruleIndex + 1}`].distinguish.female.fee_mode.value[0].value === 'WORKING' && <View style={{borderWidth: 1, flexDirection: 'row', padding: 20, borderRadius: 10, borderColor: '#999999'}}>
            <View style={{flex: 1, justifyContent: 'center'}}>
              <Field
                name={`${type}${ruleIndex + 1}.distinguish.female.fee_mode.children.working.time`}
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
                  name={`${type}${ruleIndex + 1}.distinguish.female.fee_mode.children.working.mode1.mode`}
                  showLabel={false}
                  selectList={FEE_WAY_MODE}
                  component={LittleSingleSelect}
                />
              </View>
              <View style={{height: 10}}></View>
              <View style={{flex: 1}}>
                <Field  
                  name={`${type}${ruleIndex + 1}.distinguish.female.fee_mode.children.working.mode2.mode`}
                  showLabel={false}
                  selectList={FEE_WAY_MODE}
                  component={LittleSingleSelect}
                />
              </View>
            </View>
            <View style={{flex: 1, justifyContent: 'center'}}>
              <View style={{maxWidth: 180, height: 50}}>
                <Field  
                  name={`${type}${ruleIndex + 1}.distinguish.female.fee_mode.children.working.mode1.value`}
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
                  name={`${type}${ruleIndex + 1}.distinguish.female.fee_mode.children.working.mode2.value`}
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
          {values[`${type}${ruleIndex + 1}`].distinguish.female.fee_mode.value[0].value === 'CARD_DAY' && <View style={{borderWidth: 1, flexDirection: 'row', padding: 20, borderRadius: 10, borderColor: '#999999'}}>
            <>
              <View style={{width: 120}}>
                <Text style={{flex: 1, fontSize: 22, textAlignVertical: 'center', color: '#333333'}}>打卡满：</Text>
                <Text style={{flex: 1, fontSize: 22, textAlignVertical: 'center', color: '#333333'}}>打卡不满：</Text>
              </View>
              <View style={{width: 120, justifyContent: 'center', marginRight: 10}}>
                <Field  
                  name={`${type}${ruleIndex + 1}.distinguish.female.fee_mode.children.card_day.value`}
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
                    name={`${type}${ruleIndex + 1}.distinguish.female.fee_mode.children.card_day.mode1.mode`}
                    showLabel={false}
                    selectList={FEE_WAY_MODE}
                    component={LittleSingleSelect}
                  />
                </View>
                <View style={{height: 10}}></View>
                <View style={{flex: 1}}>
                  <Field  
                    name={`${type}${ruleIndex + 1}.distinguish.female.fee_mode.children.card_day.mode2.mode`}
                    showLabel={false}
                    selectList={FEE_WAY_MODE}
                    component={LittleSingleSelect}
                  />
                </View>
              </View>
              <View style={{flex: 1, justifyContent: 'center'}}>
                <View style={{maxWidth: 180, height: 50}}>
                  <Field  
                    name={`${type}${ruleIndex + 1}.distinguish.female.fee_mode.children.card_day.mode1.value`}
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
                    name={`${type}${ruleIndex + 1}.distinguish.female.fee_mode.children.card_day.mode2.value`}
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
          {values[`${type}${ruleIndex + 1}`].distinguish.female.fee_mode.value[0].value === 'CARD_HOUR' && <View style={{borderWidth: 1, flexDirection: 'row', padding: 20, borderRadius: 10, borderColor: '#999999'}}>
            <>
              <View style={{width: 120}}>
                <Text style={{flex: 1, fontSize: 22, textAlignVertical: 'center', color: '#333333'}}>打卡满：</Text>
                <Text style={{flex: 1, fontSize: 22, textAlignVertical: 'center', color: '#333333'}}>打卡不满：</Text>
              </View>
              <View style={{width: 120, justifyContent: 'center', marginRight: 10}}>
                <Field  
                  name={`${type}${ruleIndex + 1}.distinguish.female.fee_mode.children.card_hour.value`}
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
                    name={`${type}${ruleIndex + 1}.distinguish.female.fee_mode.children.card_hour.mode1.mode`}
                    showLabel={false}
                    selectList={FEE_WAY_MODE}
                    component={LittleSingleSelect}
                  />
                </View>
                <View style={{height: 10}}></View>
                <View style={{flex: 1}}>
                  <Field  
                    name={`${type}${ruleIndex + 1}.distinguish.female.fee_mode.children.card_hour.mode2.mode`}
                    showLabel={false}
                    selectList={FEE_WAY_MODE}
                    component={LittleSingleSelect}
                  />
                </View>
              </View>
              <View style={{flex: 1, justifyContent: 'center'}}>
                <View style={{maxWidth: 180, height: 50}}>
                  <Field  
                    name={`${type}${ruleIndex + 1}.distinguish.female.fee_mode.children.card_hour.mode1.value`}
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
                    name={`${type}${ruleIndex + 1}.distinguish.female.fee_mode.children.card_hour.mode2.value`}
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
          {values[`${type}${ruleIndex + 1}`].distinguish.female.fee_mode.value[0].value === 'WORKING_DAY' && <View style={{borderWidth: 1, flexDirection: 'row', padding: 20, borderRadius: 10, borderColor: '#999999'}}>
            <>
              <View style={{width: 120}}>
                <Text style={{flex: 1, fontSize: 22, textAlignVertical: 'center', color: '#333333'}}>在职满：</Text>
                <Text style={{flex: 1, fontSize: 22, textAlignVertical: 'center', color: '#333333'}}>在职不满：</Text>
              </View>
              <View style={{width: 120, justifyContent: 'center', marginRight: 10}}>
                <Field  
                  name={`${type}${ruleIndex + 1}.distinguish.female.fee_mode.children.working_day.value`}
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
                    name={`${type}${ruleIndex + 1}.distinguish.female.fee_mode.children.working_day.mode1.mode`}
                    showLabel={false}
                    selectList={FEE_WAY_MODE}
                    component={LittleSingleSelect}
                  />
                </View>
                <View style={{height: 10}}></View>
                <View style={{flex: 1}}>
                  <Field  
                    name={`${type}${ruleIndex + 1}.distinguish.female.fee_mode.children.working_day.mode2.mode`}
                    showLabel={false}
                    selectList={FEE_WAY_MODE}
                    component={LittleSingleSelect}
                  />
                </View>
              </View>
              <View style={{flex: 1, justifyContent: 'center'}}>
                <View style={{maxWidth: 180, height: 50}}>
                  <Field  
                    name={`${type}${ruleIndex + 1}.distinguish.female.fee_mode.children.working_day.mode1.value`}
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
                    name={`${type}${ruleIndex + 1}.distinguish.female.fee_mode.children.working_day.mode2.value`}
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
          {values[`${type}${ruleIndex + 1}`].distinguish.female.fee_mode.value[0].value === 'WORKING_HOUR' && <View style={{borderWidth: 1, flexDirection: 'row', padding: 20, borderRadius: 10, borderColor: '#999999'}}>
            <>
              <View style={{width: 120}}>
                <Text style={{flex: 1, fontSize: 22, textAlignVertical: 'center', color: '#333333'}}>在职满：</Text>
                <Text style={{flex: 1, fontSize: 22, textAlignVertical: 'center', color: '#333333'}}>在职不满：</Text>
              </View>
              <View style={{width: 120, justifyContent: 'center', marginRight: 10}}>
                <Field  
                  name={`${type}${ruleIndex + 1}.distinguish.female.fee_mode.children.working_hour.value`}
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
                    name={`${type}${ruleIndex + 1}.distinguish.female.fee_mode.children.working_hour.mode1.mode`}
                    showLabel={false}
                    selectList={FEE_WAY_MODE}
                    component={LittleSingleSelect}
                  />
                </View>
                <View style={{height: 10}}></View>
                <View style={{flex: 1}}>
                  <Field  
                    name={`${type}${ruleIndex + 1}.distinguish.female.fee_mode.children.working_hour.mode2.mode`}
                    showLabel={false}
                    selectList={FEE_WAY_MODE}
                    component={LittleSingleSelect}
                  />
                </View>
              </View>
              <View style={{flex: 1, justifyContent: 'center'}}>
                <View style={{maxWidth: 180, height: 50}}>
                  <Field  
                    name={`${type}${ruleIndex + 1}.distinguish.female.fee_mode.children.working_hour.mode1.value`}
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
                    name={`${type}${ruleIndex + 1}.distinguish.female.fee_mode.children.working_hour.mode2.value`}
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
        </View>
      </View>
    </View>
  )
};

const styles = StyleSheet.create({

});

export default Distinguish;