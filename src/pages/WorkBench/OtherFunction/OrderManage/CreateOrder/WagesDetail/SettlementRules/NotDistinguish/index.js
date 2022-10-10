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
import { MEMBER_FEE_MODE, FEE_WAY_MODE, FEE_WAY_NAME } from "../../../../../../../../utils/const";

const Unit = ({value}) => {
  const unitValue = value.length ? value[0].value : 'WORK_FEE';

  return (
    <View style={{justifyContent: 'center', alignItems: 'center', backgroundColor: '#409EFF', borderRadius: 6, marginLeft: 10}}>
      <Text style={{fontSize: 22, color: '#fff', paddingHorizontal: 10}}>{FEE_WAY_NAME[unitValue]}</Text>
    </View>
  )
};

const NotDistinguish = ({
  type,
  values,
  ruleIndex,
  ...rest
}) => {

  const selectedMode = values[`${type}${ruleIndex + 1}`].not_distinguish.fee_mode.value[0].value;
  const fieldName = `${type}${ruleIndex + 1}.not_distinguish.fee_mode.children`;
  const selectPayMode = values[`${type}${ruleIndex + 1}`].not_distinguish.fee_mode.children;

  return (
    <View style={{flex: 1, padding: 20}}>
      <View style={{height: 60, marginBottom: 20}}>
        <Field  
          name={`${type}${ruleIndex + 1}.not_distinguish.fee_mode.value`}
          label="模式"
          selectList={MEMBER_FEE_MODE}
          labelStyle={{minWidth: 0}}
          component={SingleSelect}
        />
      </View>
      {/* 模式：纯 */}
      {selectedMode === 'PURE' && <View style={styles.itemArea}>
        <Text style={{fontSize: 22, textAlignVertical: 'center', color: '#333333'}}>纯：</Text>
        <View style={{width: 100, marginRight: 10}}>
          <View style={{flex: 1}}>
            <Field  
              name={`${fieldName}.pure.mode`}
              showLabel={false}
              selectList={FEE_WAY_MODE}
              component={LittleSingleSelect}
            />
          </View>
        </View>
        <View style={{width: 90, height: 50}}>
          <Field  
            name={`${fieldName}.pure.value`}
            inputStyle={{maxHeight: 60}}
            component={LittleSingleInput}
          />
        </View>
        <Unit value={selectPayMode.pure.mode} />
      </View>}
      {/* 模式：是否在职 */}
      {selectedMode === 'WORKING' && <View style={styles.itemArea}>
        <View style={{flex: 1, justifyContent: 'center'}}>
          <Field
            name={`${fieldName}.working.time`}
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
              name={`${fieldName}.working.mode1.mode`}
              showLabel={false}
              selectList={FEE_WAY_MODE}
              component={LittleSingleSelect}
            />
          </View>
          <View style={{height: 10}}></View>
          <View style={{flex: 1}}>
            <Field  
              name={`${fieldName}.working.mode2.mode`}
              showLabel={false}
              selectList={FEE_WAY_MODE}
              component={LittleSingleSelect}
            />
          </View>
        </View>
        <View style={{flex: 1, justifyContent: 'center'}}>
          <View style={{flexDirection: 'row', maxWidth: 180, height: 50}}>
            <Field  
              name={`${fieldName}.working.mode1.value`}
              inputStyle={{maxHeight: 50}}
              component={LittleSingleInput}
            />
            <Unit value={selectPayMode.working.mode1.mode} />
          </View>
          <View style={{height: 10}}></View>
          <View style={{flexDirection: 'row', maxWidth: 180, height: 50}}>
            <Field  
              name={`${fieldName}.working.mode2.value`}
              inputStyle={{maxHeight: 50}}
              component={LittleSingleInput}
            />
            <Unit value={selectPayMode.working.mode2.mode} />
          </View>
        </View>
      </View>}
      {/* 模式：打卡是否满（单位：天） */}
      {selectedMode === 'CARD_DAY' && <View style={styles.itemArea}>
        <>
          <View style={{width: 120}}>
            <Text style={styles.modeTitle}>打卡满：</Text>
            <Text style={styles.modeTitle}>打卡不满：</Text>
          </View>
          <View style={{width: 120, justifyContent: 'center', marginRight: 10}}>
            <Field  
              name={`${fieldName}.card_day.value`}
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
                name={`${fieldName}.card_day.mode1.mode`}
                showLabel={false}
                selectList={FEE_WAY_MODE}
                component={LittleSingleSelect}
              />
            </View>
            <View style={{height: 10}}></View>
            <View style={{flex: 1}}>
              <Field  
                name={`${fieldName}.card_day.mode2.mode`}
                showLabel={false}
                selectList={FEE_WAY_MODE}
                component={LittleSingleSelect}
              />
            </View>
          </View>
          <View style={{flex: 1, justifyContent: 'center'}}>
            <View style={{flexDirection: 'row', maxWidth: 180, height: 50}}>
              <Field  
                name={`${fieldName}.card_day.mode1.value`}
                inputStyle={{maxHeight: 50}}
                component={LittleSingleInput}
              />
              <Unit value={selectPayMode.card_day.mode1.mode} />
            </View>
            <View style={{height: 10}}></View>
            <View style={{flexDirection: 'row', maxWidth: 180, height: 50}}>
              <Field  
                name={`${fieldName}.card_day.mode2.value`}
                inputStyle={{maxHeight: 50}}
                component={LittleSingleInput}
              />
              <Unit value={selectPayMode.card_day.mode2.mode} />
            </View>
          </View>
        </>
      </View>}
      {/* 模式：打卡是否满（单位：时） */}
      {selectedMode === 'CARD_HOUR' && <View style={styles.itemArea}>
        <>
          <View style={{width: 120}}>
            <Text style={styles.modeTitle}>打卡满：</Text>
            <Text style={styles.modeTitle}>打卡不满：</Text>
          </View>
          <View style={{width: 120, justifyContent: 'center', marginRight: 10}}>
            <Field  
              name={`${fieldName}.card_hour.value`}
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
                name={`${fieldName}.card_hour.mode1.mode`}
                showLabel={false}
                selectList={FEE_WAY_MODE}
                component={LittleSingleSelect}
              />
            </View>
            <View style={{height: 10}}></View>
            <View style={{flex: 1}}>
              <Field  
                name={`${fieldName}.card_hour.mode2.mode`}
                showLabel={false}
                selectList={FEE_WAY_MODE}
                component={LittleSingleSelect}
              />
            </View>
          </View>
          <View style={{flex: 1, justifyContent: 'center'}}>
            <View style={{maxWidth: 180, height: 50}}>
              <Field  
                name={`${fieldName}.card_hour.mode1.value`}
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
                name={`${fieldName}.card_hour.mode2.value`}
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
      {selectedMode === 'WORKING_DAY' && <View style={styles.itemArea}>
        <>
          <View style={{width: 120}}>
            <Text style={styles.modeTitle}>在职满：</Text>
            <Text style={styles.modeTitle}>在职不满：</Text>
          </View>
          <View style={{width: 120, justifyContent: 'center', marginRight: 10}}>
            <Field  
              name={`${fieldName}.working_day.value`}
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
                name={`${fieldName}.working_day.mode1.mode`}
                showLabel={false}
                selectList={FEE_WAY_MODE}
                component={LittleSingleSelect}
              />
            </View>
            <View style={{height: 10}}></View>
            <View style={{flex: 1}}>
              <Field  
                name={`${fieldName}.working_day.mode2.mode`}
                showLabel={false}
                selectList={FEE_WAY_MODE}
                component={LittleSingleSelect}
              />
            </View>
          </View>
          <View style={{flex: 1, justifyContent: 'center'}}>
            <View style={{maxWidth: 180, height: 50}}>
              <Field  
                name={`${fieldName}.working_day.mode1.value`}
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
                name={`${fieldName}.working_day.mode2.value`}
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
      {selectedMode === 'WORKING_HOUR' && <View style={styles.itemArea}>
        <>
          <View style={{width: 120}}>
            <Text style={styles.modeTitle}>在职满：</Text>
            <Text style={styles.modeTitle}>在职不满：</Text>
          </View>
          <View style={{width: 120, justifyContent: 'center', marginRight: 10}}>
            <Field  
              name={`${fieldName}.working_hour.value`}
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
                name={`${fieldName}.working_hour.mode1.mode`}
                showLabel={false}
                selectList={FEE_WAY_MODE}
                component={LittleSingleSelect}
              />
            </View>
            <View style={{height: 10}}></View>
            <View style={{flex: 1}}>
              <Field  
                name={`${fieldName}.working_hour.mode2.mode`}
                showLabel={false}
                selectList={FEE_WAY_MODE}
                component={LittleSingleSelect}
              />
            </View>
          </View>
          <View style={{flex: 1, justifyContent: 'center'}}>
            <View style={{maxWidth: 180, height: 50}}>
              <Field  
                name={`${fieldName}.working_hour.mode1.value`}
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
                name={`${fieldName}.working_hour.mode2.value`}
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
  )
};

const styles = StyleSheet.create({
  itemArea:{
    borderWidth: 1, 
    flexDirection: 'row', 
    padding: 20, 
    borderRadius: 10, 
    borderColor: '#999999'
  },
  modeTitle: {
    flex: 1, 
    fontSize: 22, 
    textAlignVertical: 'center', 
    color: '#333333'
  }
});

export default NotDistinguish;