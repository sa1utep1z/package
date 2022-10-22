import React from "react";
import { View, StyleSheet, Text } from 'react-native';
import { Field } from 'formik';

import SingleSelect from "../../../../../../../../components/OrderForm/SingleSelect";
import LittleSingleSelect from "../../../../../../../../components/OrderForm/LittleSingleSelect";
import LittleSingleInput from "../../../../../../../../components/OrderForm/LittleSingleInput";
import LittleSingleDate from "../../../../../../../../components/OrderForm/LittleSingleDate";
import { FEE_WAY_NAME, MEMBER_FEE_MODE, FEE_WAY_MODE } from "../../../../../../../../utils/const";

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

const Distinguish = ({
  type,
  values,
  ruleIndex,
  ...rest
}) => {

  const selectMode_male = values[`${type}${ruleIndex + 1}`].distinguish.male.fee_mode.value[0].value;
  const fieldName_male = `${type}${ruleIndex + 1}.distinguish.male.fee_mode.children`;
  const selectPayMode_male = values[`${type}${ruleIndex + 1}`].distinguish.male.fee_mode.children;

  const selectMode_female = values[`${type}${ruleIndex + 1}`].distinguish.female.fee_mode.value[0].value;
  const fieldName_female = `${type}${ruleIndex + 1}.distinguish.female.fee_mode.children`;
  const selectPayMode_female = values[`${type}${ruleIndex + 1}`].distinguish.female.fee_mode.children;

  return (
    <View style={styles.totalArea}>
      {/* 男 */}
      <View style={styles.titleArea}>
        <Text style={[styles.title_text, {backgroundColor: '#417eba'}]}>男</Text>
        <View style={[styles.title_content, {borderColor: '#417eba'}]}>
          <View style={{height: 60, marginBottom: 20}}>
            <Field  
              name={`${type}${ruleIndex + 1}.distinguish.male.fee_mode.value`}
              label="模式"
              canSearch={false}
              selectList={MEMBER_FEE_MODE}
              labelStyle={{minWidth: 0}}
              component={SingleSelect}
            />
          </View>
          {/* 模式：纯 */}
          {selectMode_male === 'PURE' && <View style={styles.mode_area}>
            <Text style={styles.mode_pure_title}>纯：</Text>
            <View style={{width: 100}}>
              <View style={{flex: 1}}>
                <Field  
                  name={`${fieldName_male}.pure.mode`}
                  showLabel={false}
                  selectList={FEE_WAY_MODE[type]}
                  component={LittleSingleSelect}
                />
              </View>
            </View>
            <View style={{flexDirection: 'row', width: 180, height: 50}}>
              <Field  
                name={`${fieldName_male}.pure.value`}
                inputStyle={{maxHeight: 60}}
                inputLength={selectPayMode_male.pure.mode}
                component={LittleSingleInput}
              />
              <Unit value={selectPayMode_male.pure.mode} />
            </View>
          </View>}
          {/* 模式：是否在职 */}
          {selectMode_male === 'WORKING' && <View style={styles.mode_area}>
            <View style={{width: 140, justifyContent: 'center'}}>
              <Field
                name={`${fieldName_male}.working.time`}
                type="distinguish"
                component={LittleSingleDate}
              />
            </View>
            <View style={{width: 80}}>
              <Text style={{flex: 1, fontSize: 22, textAlign: 'center', textAlignVertical: 'center', color: '#333333'}}>在职</Text>
              <Text style={{flex: 1, fontSize: 22, textAlign: 'center', textAlignVertical: 'center', color: '#333333'}}>不在职</Text>
            </View>
            <View style={{width: 100}}>
              <View style={{flex: 1}}>
                <Field  
                  name={`${fieldName_male}.working.mode1.mode`}
                  showLabel={false}
                  selectList={FEE_WAY_MODE[type]}
                  component={LittleSingleSelect}
                />
              </View>
              <View style={{height: 10}}></View>
              <View style={{flex: 1}}>
                <Field  
                  name={`${fieldName_male}.working.mode2.mode`}
                  showLabel={false}
                  selectList={FEE_WAY_MODE[type]}
                  component={LittleSingleSelect}
                />
              </View>
            </View>
            <View style={{flex: 1, justifyContent: 'center'}}>
              <View style={styles.inputArea}>
                <Field  
                  name={`${fieldName_male}.working.mode1.value`}
                  inputStyle={{maxHeight: 50}}
                  inputLength={selectPayMode_male.working.mode1.mode}
                  component={LittleSingleInput}
                />
                <Unit value={selectPayMode_male.working.mode1.mode} />
              </View>
              <View style={{height: 10}}></View>
              <View style={styles.inputArea}>
                <Field  
                  name={`${fieldName_male}.working.mode2.value`}
                  inputStyle={{maxHeight: 50}}
                  inputLength={selectPayMode_male.working.mode2.mode}
                  component={LittleSingleInput}
                />
                <Unit value={selectPayMode_male.working.mode2.mode} />
              </View>
            </View>
          </View>}
          {/* 模式：打卡是否满（单位：天） */}
          {selectMode_male === 'CARD_DAY' && <View style={styles.mode_area}>
            <>
              <View style={{width: 100}}>
                <Text style={{flex: 1, fontSize: 22, textAlignVertical: 'center', color: '#333333'}}>打卡满</Text>
                <Text style={{flex: 1, fontSize: 22, textAlignVertical: 'center', color: '#333333'}}>打卡不满</Text>
              </View>
              <View style={{width: 120, justifyContent: 'center', marginRight: 10}}>
                <Field  
                  name={`${fieldName_male}.card_day.value`}
                  showLabel={false}
                  inputStyle={{maxHeight: 50}}
                  inputRightComponent={<RightUnit value="天"/>}
                  maxLength={3}
                  component={LittleSingleInput}
                />
              </View>
              <View style={{width: 100}}>
                <View style={{flex: 1}}>
                  <Field  
                    name={`${fieldName_male}.card_day.mode1.mode`}
                    showLabel={false}
                    selectList={FEE_WAY_MODE[type]}
                    component={LittleSingleSelect}
                  />
                </View>
                <View style={{height: 10}}></View>
                <View style={{flex: 1}}>
                  <Field  
                    name={`${fieldName_male}.card_day.mode2.mode`}
                    showLabel={false}
                    selectList={FEE_WAY_MODE[type]}
                    component={LittleSingleSelect}
                  />
                </View>
              </View>
              <View style={{flex: 1, justifyContent: 'center'}}>
                <View style={styles.inputArea}>
                  <Field  
                    name={`${fieldName_male}.card_day.mode1.value`}
                    inputStyle={{maxHeight: 50}}
                    inputLength={selectPayMode_male.card_day.mode1.mode}
                    component={LittleSingleInput}
                  />
                  <Unit value={selectPayMode_male.card_day.mode1.mode} />
                </View>
                <View style={{height: 10}}></View>
                <View style={styles.inputArea}>
                  <Field  
                    name={`${fieldName_male}.card_day.mode2.value`}
                    inputStyle={{maxHeight: 50}}
                    inputLength={selectPayMode_male.card_day.mode2.mode}
                    component={LittleSingleInput}
                  />
                  <Unit value={selectPayMode_male.card_day.mode2.mode} />
                </View>
              </View>
            </>
          </View>}
          {/* 模式：打卡是否满（单位：时） */}
          {selectMode_male === 'CARD_HOUR' && <View style={styles.mode_area}>
            <>
              <View style={{width: 100}}>
                <Text style={{flex: 1, fontSize: 22, textAlignVertical: 'center', color: '#333333'}}>打卡满</Text>
                <Text style={{flex: 1, fontSize: 22, textAlignVertical: 'center', color: '#333333'}}>打卡不满</Text>
              </View>
              <View style={{width: 120, justifyContent: 'center', marginRight: 10}}>
                <Field  
                  name={`${fieldName_male}.card_hour.value`}
                  showLabel={false}
                  inputStyle={{maxHeight: 50}}
                  inputRightComponent={<RightUnit value="时"/>}
                  maxLength={3}
                  component={LittleSingleInput}
                />
              </View>
              <View style={{width: 100}}>
                <View style={{flex: 1}}>
                  <Field  
                    name={`${fieldName_male}.card_hour.mode1.mode`}
                    showLabel={false}
                    selectList={FEE_WAY_MODE[type]}
                    component={LittleSingleSelect}
                  />
                </View>
                <View style={{height: 10}}></View>
                <View style={{flex: 1}}>
                  <Field  
                    name={`${fieldName_male}.card_hour.mode2.mode`}
                    showLabel={false}
                    selectList={FEE_WAY_MODE[type]}
                    component={LittleSingleSelect}
                  />
                </View>
              </View>
              <View style={{flex: 1, justifyContent: 'center'}}>
                <View style={styles.inputArea}>
                  <Field  
                    name={`${fieldName_male}.card_hour.mode1.value`}
                    inputStyle={{maxHeight: 50}}
                    inputLength={selectPayMode_male.card_hour.mode1.mode}
                    component={LittleSingleInput}
                  />
                  <Unit value={selectPayMode_male.card_hour.mode1.mode} />
                </View>
                <View style={{height: 10}}></View>
                <View style={styles.inputArea}>
                  <Field  
                    name={`${fieldName_male}.card_hour.mode2.value`}
                    inputStyle={{maxHeight: 50}}
                    inputLength={selectPayMode_male.card_hour.mode2.mode}
                    component={LittleSingleInput}
                  />
                  <Unit value={selectPayMode_male.card_hour.mode2.mode} />
                </View>
              </View>
            </>
          </View>}
          {/* 模式：在职是否满（单位：天） */}
          {selectMode_male === 'WORKING_DAY' && <View style={styles.mode_area}>
            <>
              <View style={{width: 100}}>
                <Text style={{flex: 1, fontSize: 22, textAlignVertical: 'center', color: '#333333'}}>在职满</Text>
                <Text style={{flex: 1, fontSize: 22, textAlignVertical: 'center', color: '#333333'}}>在职不满</Text>
              </View>
              <View style={{width: 120, justifyContent: 'center', marginRight: 10}}>
                <Field  
                  name={`${fieldName_male}.working_day.value`}
                  showLabel={false}
                  inputStyle={{maxHeight: 50}}
                  inputRightComponent={<RightUnit value="天"/>}
                  maxLength={3}
                  component={LittleSingleInput}
                />
              </View>
              <View style={{width: 100}}>
                <View style={{flex: 1}}>
                  <Field  
                    name={`${fieldName_male}.working_day.mode1.mode`}
                    showLabel={false}
                    selectList={FEE_WAY_MODE[type]}
                    component={LittleSingleSelect}
                  />
                </View>
                <View style={{height: 10}}></View>
                <View style={{flex: 1}}>
                  <Field  
                    name={`${fieldName_male}.working_day.mode2.mode`}
                    showLabel={false}
                    selectList={FEE_WAY_MODE[type]}
                    component={LittleSingleSelect}
                  />
                </View>
              </View>
              <View style={{flex: 1, justifyContent: 'center'}}>
                <View style={styles.inputArea}>
                  <Field  
                    name={`${fieldName_male}.working_day.mode1.value`}
                    inputStyle={{maxHeight: 50}}
                    inputLength={selectPayMode_male.working_day.mode1.mode}
                    component={LittleSingleInput}
                  />
                  <Unit value={selectPayMode_male.working_day.mode1.mode} />
                </View>
                <View style={{height: 10}}></View>
                <View style={styles.inputArea}>
                  <Field  
                    name={`${fieldName_male}.working_day.mode2.value`}
                    inputStyle={{maxHeight: 50}}
                    inputLength={selectPayMode_male.working_day.mode2.mode}
                    component={LittleSingleInput}
                  />
                  <Unit value={selectPayMode_male.working_day.mode2.mode} />
                </View>
              </View>
            </>
          </View>}
          {/* 模式：在职是否满（单位：时） */}
          {selectMode_male === 'WORKING_HOUR' && <View style={styles.mode_area}>
            <>
              <View style={{width: 100}}>
                <Text style={{flex: 1, fontSize: 22, textAlignVertical: 'center', color: '#333333'}}>在职满</Text>
                <Text style={{flex: 1, fontSize: 22, textAlignVertical: 'center', color: '#333333'}}>在职不满</Text>
              </View>
              <View style={{width: 120, justifyContent: 'center', marginRight: 10}}>
                <Field  
                  name={`${fieldName_male}.working_hour.value`}
                  showLabel={false}
                  inputStyle={{maxHeight: 50}}
                  inputRightComponent={<RightUnit value="时"/>}
                  maxLength={3}
                  component={LittleSingleInput}
                />
              </View>
              <View style={{width: 100}}>
                <View style={{flex: 1}}>
                  <Field  
                    name={`${fieldName_male}.working_hour.mode1.mode`}
                    showLabel={false}
                    selectList={FEE_WAY_MODE[type]}
                    component={LittleSingleSelect}
                  />
                </View>
                <View style={{height: 10}}></View>
                <View style={{flex: 1}}>
                  <Field  
                    name={`${fieldName_male}.working_hour.mode2.mode`}
                    showLabel={false}
                    selectList={FEE_WAY_MODE[type]}
                    component={LittleSingleSelect}
                  />
                </View>
              </View>
              <View style={{flex: 1, justifyContent: 'center'}}>
                <View style={styles.inputArea}>
                  <Field  
                    name={`${fieldName_male}.working_hour.mode1.value`}
                    inputStyle={{maxHeight: 50}}
                    inputLength={selectPayMode_male.working_hour.mode1.mode}
                    component={LittleSingleInput}
                  />
                  <Unit value={selectPayMode_male.working_hour.mode1.mode} />
                </View>
                <View style={{height: 10}}></View>
                <View style={styles.inputArea}>
                  <Field  
                    name={`${fieldName_male}.working_hour.mode2.value`}
                    inputStyle={{maxHeight: 50}}
                    inputLength={selectPayMode_male.working_hour.mode2.mode}
                    component={LittleSingleInput}
                  />
                  <Unit value={selectPayMode_male.working_hour.mode2.mode} />
                </View>
              </View>
            </>
          </View>}
        </View>
      </View>
      {/* 女 */}
      <View style={styles.titleArea}>
        <Text style={[styles.title_text, {backgroundColor: '#ed4996'}]}>女</Text>
        <View style={[styles.title_content, {borderColor: '#ed4996'}]}>
          <View style={{height: 60, marginBottom: 20}}>
            <Field  
              name={`${type}${ruleIndex + 1}.distinguish.female.fee_mode.value`}
              label="模式"
              canSearch={false}
              selectList={MEMBER_FEE_MODE}
              labelStyle={{minWidth: 0}}
              component={SingleSelect}
            />
          </View>
          {/* 模式：纯 */}
          {selectMode_female === 'PURE' && <View style={styles.mode_area}>
            <Text style={styles.mode_pure_title}>纯：</Text>
            <View style={{width: 100}}>
              <View style={{flex: 1}}>
                <Field  
                  name={`${fieldName_female}.pure.mode`}
                  showLabel={false}
                  selectList={FEE_WAY_MODE[type]}
                  component={LittleSingleSelect}
                />
              </View>
            </View>
            <View style={{flexDirection: 'row', width: 180, height: 50}}>
              <Field  
                name={`${fieldName_female}.pure.value`}
                inputStyle={{maxHeight: 60}}
                inputLength={selectPayMode_female.pure.mode}
                component={LittleSingleInput}
              />
              <Unit value={selectPayMode_female.pure.mode} />
            </View>
          </View>}
          {/* 模式：是否在职 */}
          {selectMode_female === 'WORKING' && <View style={styles.mode_area}>
            <View style={{width: 140, justifyContent: 'center'}}>
              <Field
                name={`${fieldName_female}.working.time`}
                type="distinguish"
                component={LittleSingleDate}
              />
            </View>
            <View style={{width: 80}}>
              <Text style={{flex: 1, fontSize: 22, textAlign: 'center', textAlignVertical: 'center', color: '#333333'}}>在职</Text>
              <Text style={{flex: 1, fontSize: 22, textAlign: 'center', textAlignVertical: 'center', color: '#333333'}}>不在职</Text>
            </View>
            <View style={{width: 100}}>
              <View style={{flex: 1}}>
                <Field  
                  name={`${fieldName_female}.working.mode1.mode`}
                  showLabel={false}
                  selectList={FEE_WAY_MODE[type]}
                  component={LittleSingleSelect}
                />
              </View>
              <View style={{height: 10}}></View>
              <View style={{flex: 1}}>
                <Field  
                  name={`${fieldName_female}.working.mode2.mode`}
                  showLabel={false}
                  selectList={FEE_WAY_MODE[type]}
                  component={LittleSingleSelect}
                />
              </View>
            </View>
            <View style={{flex: 1, justifyContent: 'center'}}>
              <View style={styles.inputArea}>
                <Field  
                  name={`${fieldName_female}.working.mode1.value`}
                  inputStyle={{maxHeight: 50}}
                  inputLength={selectPayMode_male.working.mode1.mode}
                  component={LittleSingleInput}
                />
                <Unit value={selectPayMode_female.working.mode1.mode} />
              </View>
              <View style={{height: 10}}></View>
              <View style={styles.inputArea}>
                <Field  
                  name={`${fieldName_female}.working.mode2.value`}
                  inputStyle={{maxHeight: 50}}
                  inputLength={selectPayMode_male.working.mode2.mode}
                  component={LittleSingleInput}
                />
                <Unit value={selectPayMode_female.working.mode2.mode} />
              </View>
            </View>
          </View>}
          {/* 模式：打卡是否满（单位：天） */}
          {selectMode_female === 'CARD_DAY' && <View style={styles.mode_area}>
            <>
              <View style={{width: 100}}>
                <Text style={{flex: 1, fontSize: 22, textAlignVertical: 'center', color: '#333333'}}>打卡满</Text>
                <Text style={{flex: 1, fontSize: 22, textAlignVertical: 'center', color: '#333333'}}>打卡不满</Text>
              </View>
              <View style={{width: 120, justifyContent: 'center', marginRight: 10}}>
                <Field  
                  name={`${fieldName_female}.card_day.value`}
                  showLabel={false}
                  inputStyle={{maxHeight: 50}}
                  inputRightComponent={<RightUnit value="天"/>}
                  maxLength={3}
                  component={LittleSingleInput}
                />
              </View>
              <View style={{width: 100}}>
                <View style={{flex: 1}}>
                  <Field  
                    name={`${fieldName_female}.card_day.mode1.mode`}
                    showLabel={false}
                    selectList={FEE_WAY_MODE[type]}
                    component={LittleSingleSelect}
                  />
                </View>
                <View style={{height: 10}}></View>
                <View style={{flex: 1}}>
                  <Field  
                    name={`${fieldName_female}.card_day.mode2.mode`}
                    showLabel={false}
                    selectList={FEE_WAY_MODE[type]}
                    component={LittleSingleSelect}
                  />
                </View>
              </View>
              <View style={{flex: 1, justifyContent: 'center'}}>
                <View style={styles.inputArea}>
                  <Field  
                    name={`${fieldName_female}.card_day.mode1.value`}
                    inputStyle={{maxHeight: 50}}
                    inputLength={selectPayMode_male.card_day.mode1.mode}
                    component={LittleSingleInput}
                  />
                  <Unit value={selectPayMode_female.card_day.mode1.mode} />
                </View>
                <View style={{height: 10}}></View>
                <View style={styles.inputArea}>
                  <Field  
                    name={`${fieldName_female}.card_day.mode2.value`}
                    inputStyle={{maxHeight: 50}}
                    inputLength={selectPayMode_male.card_day.mode2.mode}
                    component={LittleSingleInput}
                  />
                  <Unit value={selectPayMode_female.card_day.mode2.mode} />
                </View>
              </View>
            </>
          </View>}
          {/* 模式：打卡是否满（单位：时） */}
          {selectMode_female === 'CARD_HOUR' && <View style={styles.mode_area}>
            <>
              <View style={{width: 100}}>
                <Text style={{flex: 1, fontSize: 22, textAlignVertical: 'center', color: '#333333'}}>打卡满</Text>
                <Text style={{flex: 1, fontSize: 22, textAlignVertical: 'center', color: '#333333'}}>打卡不满</Text>
              </View>
              <View style={{width: 120, justifyContent: 'center', marginRight: 10}}>
                <Field  
                  name={`${fieldName_female}.card_hour.value`}
                  showLabel={false}
                  inputStyle={{maxHeight: 50}}
                  inputRightComponent={<RightUnit value="时"/>}
                  maxLength={3}
                  component={LittleSingleInput}
                />
              </View>
              <View style={{width: 100}}>
                <View style={{flex: 1}}>
                  <Field  
                    name={`${fieldName_female}.card_hour.mode1.mode`}
                    showLabel={false}
                    selectList={FEE_WAY_MODE[type]}
                    component={LittleSingleSelect}
                  />
                </View>
                <View style={{height: 10}}></View>
                <View style={{flex: 1}}>
                  <Field  
                    name={`${fieldName_female}.card_hour.mode2.mode`}
                    showLabel={false}
                    selectList={FEE_WAY_MODE[type]}
                    component={LittleSingleSelect}
                  />
                </View>
              </View>
              <View style={{flex: 1, justifyContent: 'center'}}>
                <View style={styles.inputArea}>
                  <Field  
                    name={`${fieldName_female}.card_hour.mode1.value`}
                    inputStyle={{maxHeight: 50}}
                    inputLength={selectPayMode_male.card_hour.mode1.mode}
                    component={LittleSingleInput}
                  />
                  <Unit value={selectPayMode_female.card_hour.mode1.mode} />
                </View>
                <View style={{height: 10}}></View>
                <View style={styles.inputArea}>
                  <Field  
                    name={`${fieldName_female}.card_hour.mode2.value`}
                    inputStyle={{maxHeight: 50}}
                    inputLength={selectPayMode_male.card_hour.mode2.mode}
                    component={LittleSingleInput}
                  />
                  <Unit value={selectPayMode_female.card_hour.mode2.mode} />
                </View>
              </View>
            </>
          </View>}
          {/* 模式：在职是否满（单位：天） */}
          {selectMode_female === 'WORKING_DAY' && <View style={styles.mode_area}>
            <>
              <View style={{width: 100}}>
                <Text style={{flex: 1, fontSize: 22, textAlignVertical: 'center', color: '#333333'}}>在职满</Text>
                <Text style={{flex: 1, fontSize: 22, textAlignVertical: 'center', color: '#333333'}}>在职不满</Text>
              </View>
              <View style={{width: 120, justifyContent: 'center', marginRight: 10}}>
                <Field  
                  name={`${fieldName_female}.working_day.value`}
                  showLabel={false}
                  inputStyle={{maxHeight: 50}}
                  inputRightComponent={<RightUnit value="天"/>}
                  maxLength={3}
                  component={LittleSingleInput}
                />
              </View>
              <View style={{width: 100}}>
                <View style={{flex: 1}}>
                  <Field  
                    name={`${fieldName_female}.working_day.mode1.mode`}
                    showLabel={false}
                    selectList={FEE_WAY_MODE[type]}
                    component={LittleSingleSelect}
                  />
                </View>
                <View style={{height: 10}}></View>
                <View style={{flex: 1}}>
                  <Field  
                    name={`${fieldName_female}.working_day.mode2.mode`}
                    showLabel={false}
                    selectList={FEE_WAY_MODE[type]}
                    component={LittleSingleSelect}
                  />
                </View>
              </View>
              <View style={{flex: 1, justifyContent: 'center'}}>
                <View style={styles.inputArea}>
                  <Field  
                    name={`${fieldName_female}.working_day.mode1.value`}
                    inputStyle={{maxHeight: 50}}
                    inputLength={selectPayMode_male.working_day.mode1.mode}
                    component={LittleSingleInput}
                  />
                  <Unit value={selectPayMode_female.working_day.mode1.mode} />
                </View>
                <View style={{height: 10}}></View>
                <View style={styles.inputArea}>
                  <Field  
                    name={`${fieldName_female}.working_day.mode2.value`}
                    inputStyle={{maxHeight: 50}}
                    inputLength={selectPayMode_male.working_day.mode2.mode}
                    component={LittleSingleInput}
                  />
                  <Unit value={selectPayMode_female.working_day.mode2.mode} />
                </View>
              </View>
            </>
          </View>}
          {/* 模式：在职是否满（单位：时） */}
          {selectMode_female === 'WORKING_HOUR' && <View style={styles.mode_area}>
            <>
              <View style={{width: 100}}>
                <Text style={{flex: 1, fontSize: 22, textAlignVertical: 'center', color: '#333333'}}>在职满</Text>
                <Text style={{flex: 1, fontSize: 22, textAlignVertical: 'center', color: '#333333'}}>在职不满</Text>
              </View>
              <View style={{width: 120, justifyContent: 'center', marginRight: 10}}>
                <Field  
                  name={`${fieldName_female}.working_hour.value`}
                  showLabel={false}
                  inputStyle={{maxHeight: 50}}
                  inputRightComponent={<RightUnit value="时"/>}
                  maxLength={3}
                  component={LittleSingleInput}
                />
              </View>
              <View style={{width: 100}}>
                <View style={{flex: 1}}>
                  <Field  
                    name={`${fieldName_female}.working_hour.mode1.mode`}
                    showLabel={false}
                    selectList={FEE_WAY_MODE[type]}
                    component={LittleSingleSelect}
                  />
                </View>
                <View style={{height: 10}}></View>
                <View style={{flex: 1}}>
                  <Field  
                    name={`${fieldName_female}.working_hour.mode2.mode`}
                    showLabel={false}
                    selectList={FEE_WAY_MODE[type]}
                    component={LittleSingleSelect}
                  />
                </View>
              </View>
              <View style={{flex: 1, justifyContent: 'center'}}>
                <View style={styles.inputArea}>
                  <Field  
                    name={`${fieldName_female}.working_hour.mode1.value`}
                    inputStyle={{maxHeight: 50}}
                    inputLength={selectPayMode_male.working_hour.mode1.mode}
                    component={LittleSingleInput}
                  />
                  <Unit value={selectPayMode_female.working_hour.mode1.mode} />
                </View>
                <View style={{height: 10}}></View>
                <View style={styles.inputArea}>
                  <Field  
                    name={`${fieldName_female}.working_hour.mode2.value`}
                    inputStyle={{maxHeight: 50}}
                    inputLength={selectPayMode_male.working_hour.mode2.mode}
                    component={LittleSingleInput}
                  />
                  <Unit value={selectPayMode_female.working_hour.mode2.mode} />
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
  totalArea: {
    flex: 1, 
    padding: 20, 
    paddingBottom: 0
  },
  titleArea: {
    flexDirection: 'row', 
    minHeight: 200, 
    marginBottom: 20
  },
  title_text: {
    fontSize: 26, 
    fontWeight: 'bold', 
    textAlign: 'center', 
    textAlignVertical: 'center', 
    backgroundColor: '#409EFF', 
    color: '#ffffff', 
    paddingHorizontal: 5, 
    borderTopLeftRadius: 6, 
    borderBottomLeftRadius: 6
  },
  title_content: {
    flex: 1, 
    borderWidth: 1, 
    borderLeftWidth: 0, 
    borderTopRightRadius: 6, 
    borderBottomRightRadius: 6, 
    borderColor: '#999999', 
    padding: 20
  },
  mode_area: {
    borderWidth: 1, 
    flexDirection: 'row', 
    padding: 20, 
    borderRadius: 10, 
    borderColor: '#999999'
  },
  mode_pure_title: {
    fontSize: 22, 
    textAlignVertical: 'center', 
    color: '#333333'
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
  },
  inputArea: {
    flexDirection: 'row', 
    maxWidth: 180, 
    height: 50
  }
});

export default Distinguish;