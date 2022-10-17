import React from "react";
import { View, StyleSheet, Text } from 'react-native';
import { Field } from 'formik';

import SingleSelect from "../../../../../../../../components/OrderForm/SingleSelect";
import LittleSingleSelect from "../../../../../../../../components/OrderForm/LittleSingleSelect";
import LittleSingleInput from "../../../../../../../../components/OrderForm/LittleSingleInput";
import LittleSingleDate from "../../../../../../../../components/OrderForm/LittleSingleDate";
import { MEMBER_FEE_MODE, FEE_WAY_MODE, FEE_WAY_NAME } from "../../../../../../../../utils/const";

const Unit = ({value}) => {
  const unitValue = value.length ? value[0].value : 'WAGE';
  return (
    <View style={styles.unitArea}>
      <Text style={styles.unitArea_text}>{FEE_WAY_NAME[unitValue]}</Text>
    </View>
  )
};

const RightUnit = ({value}) => {
  return (
    <View style={styles.rightUnitArea}>
      <Text style={styles.rightUnitArea_text}>{value}</Text>
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
          canSearch={false}
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
              selectList={FEE_WAY_MODE[type]}
              component={LittleSingleSelect}
            />
          </View>
        </View>
        <View style={{width: 90, height: 50}}>
          <Field  
            name={`${fieldName}.pure.value`}
            inputStyle={{maxHeight: 60}}
            inputLength={selectPayMode.pure.mode}
            component={LittleSingleInput}
          />
        </View>
        <Unit value={selectPayMode.pure.mode} />
      </View>}
      {/* 模式：是否在职 */}
      {selectedMode === 'WORKING' && <View style={styles.itemArea}>
        <View style={styles.input}>
          <Field
            name={`${fieldName}.working.time`}
            component={LittleSingleDate}
          />
        </View>
        <View style={{width: 100}}>
          <Text style={styles.isWorkingTitle}>在职</Text>
          <Text style={styles.isWorkingTitle}>不在职</Text>
        </View>
        <View style={{width: 100, marginRight: 10}}>
          <View style={{flex: 1}}>
            <Field  
              name={`${fieldName}.working.mode1.mode`}
              showLabel={false}
              selectList={FEE_WAY_MODE[type]}
              component={LittleSingleSelect}
            />
          </View>
          <View style={{height: 10}}></View>
          <View style={{flex: 1}}>
            <Field  
              name={`${fieldName}.working.mode2.mode`}
              showLabel={false}
              selectList={FEE_WAY_MODE[type]}
              component={LittleSingleSelect}
            />
          </View>
        </View>
        <View style={styles.input}>
          <View style={styles.inputArea}>
            <Field  
              name={`${fieldName}.working.mode1.value`}
              inputStyle={{maxHeight: 50}}
              inputLength={selectPayMode.working.mode1.mode}
              component={LittleSingleInput}
            />
            <Unit value={selectPayMode.working.mode1.mode} />
          </View>
          <View style={{height: 10}}></View>
          <View style={styles.inputArea}>
            <Field  
              name={`${fieldName}.working.mode2.value`}
              inputStyle={{maxHeight: 50}}
              inputLength={selectPayMode.working.mode2.mode}
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
          <View style={styles.singleInput}>
            <Field  
              name={`${fieldName}.card_day.value`}
              showLabel={false}
              inputStyle={{maxHeight: 50}}
              inputRightComponent={<RightUnit value="天"/>}
              maxLength={3}
              component={LittleSingleInput}
            />
          </View>
          <View style={{width: 100, marginRight: 10}}>
            <View style={{flex: 1}}>
              <Field  
                name={`${fieldName}.card_day.mode1.mode`}
                showLabel={false}
                selectList={FEE_WAY_MODE[type]}
                component={LittleSingleSelect}
              />
            </View>
            <View style={{height: 10}}></View>
            <View style={{flex: 1}}>
              <Field  
                name={`${fieldName}.card_day.mode2.mode`}
                showLabel={false}
                selectList={FEE_WAY_MODE[type]}
                component={LittleSingleSelect}
              />
            </View>
          </View>
          <View style={styles.input}>
            <View style={styles.inputArea}>
              <Field  
                name={`${fieldName}.card_day.mode1.value`}
                inputStyle={{maxHeight: 50}}
                inputLength={selectPayMode.card_day.mode1.mode}
                component={LittleSingleInput}
              />
              <Unit value={selectPayMode.card_day.mode1.mode} />
            </View>
            <View style={{height: 10}}></View>
            <View style={styles.inputArea}>
              <Field  
                name={`${fieldName}.card_day.mode2.value`}
                inputStyle={{maxHeight: 50}}
                inputLength={selectPayMode.card_day.mode2.mode}
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
          <View style={styles.singleInput}>
            <Field  
              name={`${fieldName}.card_hour.value`}
              showLabel={false}
              inputStyle={{maxHeight: 50}}
              inputRightComponent={<RightUnit value="时"/>}
              maxLength={3}
              component={LittleSingleInput}
            />
          </View>
          <View style={{width: 100, marginRight: 10}}>
            <View style={{flex: 1}}>
              <Field  
                name={`${fieldName}.card_hour.mode1.mode`}
                showLabel={false}
                selectList={FEE_WAY_MODE[type]}
                component={LittleSingleSelect}
              />
            </View>
            <View style={{height: 10}}></View>
            <View style={{flex: 1}}>
              <Field  
                name={`${fieldName}.card_hour.mode2.mode`}
                showLabel={false}
                selectList={FEE_WAY_MODE[type]}
                component={LittleSingleSelect}
              />
            </View>
          </View>
          <View style={styles.input}>
            <View style={styles.inputArea}>
              <Field  
                name={`${fieldName}.card_hour.mode1.value`}
                inputStyle={{maxHeight: 50}}
                inputLength={selectPayMode.card_hour.mode1.mode}
                component={LittleSingleInput}
              />
              <Unit value={selectPayMode.card_hour.mode1.mode} />
            </View>
            <View style={{height: 10}}></View>
            <View style={styles.inputArea}>
              <Field  
                name={`${fieldName}.card_hour.mode2.value`}
                inputStyle={{maxHeight: 50}}
                inputLength={selectPayMode.card_hour.mode2.mode}
                component={LittleSingleInput}
              />
              <Unit value={selectPayMode.card_hour.mode2.mode} />
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
          <View style={styles.singleInput}>
            <Field  
              name={`${fieldName}.working_day.value`}
              showLabel={false}
              inputStyle={{maxHeight: 50}}
              inputRightComponent={<RightUnit value="天"/>}
              maxLength={3}
              component={LittleSingleInput}
            />
          </View>
          <View style={{width: 100, marginRight: 10}}>
            <View style={{flex: 1}}>
              <Field  
                name={`${fieldName}.working_day.mode1.mode`}
                showLabel={false}
                selectList={FEE_WAY_MODE[type]}
                component={LittleSingleSelect}
              />
            </View>
            <View style={{height: 10}}></View>
            <View style={{flex: 1}}>
              <Field  
                name={`${fieldName}.working_day.mode2.mode`}
                showLabel={false}
                selectList={FEE_WAY_MODE[type]}
                component={LittleSingleSelect}
              />
            </View>
          </View>
          <View style={styles.input}>
            <View style={styles.inputArea}>
              <Field  
                name={`${fieldName}.working_day.mode1.value`}
                inputStyle={{maxHeight: 50}}
                inputLength={selectPayMode.working_day.mode1.mode}
                component={LittleSingleInput}
              />
              <Unit value={selectPayMode.working_day.mode1.mode} />
            </View>
            <View style={{height: 10}}></View>
            <View style={styles.inputArea}>
              <Field  
                name={`${fieldName}.working_day.mode2.value`}
                inputStyle={{maxHeight: 50}}
                inputLength={selectPayMode.working_day.mode2.mode}
                component={LittleSingleInput}
              />
              <Unit value={selectPayMode.working_day.mode2.mode} />
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
          <View style={styles.singleInput}>
            <Field  
              name={`${fieldName}.working_hour.value`}
              showLabel={false}
              inputStyle={{maxHeight: 50}}
              inputRightComponent={<RightUnit value="时"/>}
              maxLength={3}
              component={LittleSingleInput}
            />
          </View>
          <View style={{width: 100, marginRight: 10}}>
            <View style={{flex: 1}}>
              <Field  
                name={`${fieldName}.working_hour.mode1.mode`}
                showLabel={false}
                selectList={FEE_WAY_MODE[type]}
                component={LittleSingleSelect}
              />
            </View>
            <View style={{height: 10}}></View>
            <View style={{flex: 1}}>
              <Field  
                name={`${fieldName}.working_hour.mode2.mode`}
                showLabel={false}
                selectList={FEE_WAY_MODE[type]}
                component={LittleSingleSelect}
              />
            </View>
          </View>
          <View style={styles.input}>
            <View style={styles.inputArea}>
              <Field  
                name={`${fieldName}.working_hour.mode1.value`}
                inputStyle={{maxHeight: 50}}
                inputLength={selectPayMode.working_hour.mode1.mode}
                component={LittleSingleInput}
              />
              <Unit value={selectPayMode.working_hour.mode1.mode} />
            </View>
            <View style={{height: 10}}></View>
            <View style={styles.inputArea}>
              <Field  
                name={`${fieldName}.working_hour.mode2.value`}
                inputStyle={{maxHeight: 50}}
                inputLength={selectPayMode.working_hour.mode2.mode}
                component={LittleSingleInput}
              />
              <Unit value={selectPayMode.working_hour.mode2.mode} />
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
  },
  isWorkingTitle: {
    flex: 1, 
    fontSize: 22, 
    textAlign: 'center', 
    textAlignVertical: 'center', 
    color: '#333333'
  },
  singleInput: {
    width: 120, 
    justifyContent: 'center', 
    marginRight: 10
  },
  input: {
    flex: 1, 
    justifyContent: 'center'
  },
  inputArea: {
    flexDirection: 'row', 
    maxWidth: 180, 
    height: 50
  },
  rightUnitArea: {
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#409EFF', 
    borderRadius: 6, 
    marginLeft: 5
  },
  rightUnitArea_text: {
    fontSize: 22, 
    color: '#fff', 
    paddingHorizontal: 10
  },
  unitArea: {
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#409EFF', 
    borderRadius: 6, 
    marginLeft: 10
  },
  unitArea_text: {
    fontSize: 22, 
    color: '#fff', 
    paddingHorizontal: 10
  }
});

export default NotDistinguish;