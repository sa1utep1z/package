import React, {useState} from "react";
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Field } from 'formik';
import { Shadow } from 'react-native-shadow-2';
import { TabView, TabBar } from 'react-native-tab-view';

import SingleSelect from "../../../../../../../components/OrderForm/SingleSelect";
import OrderRangeDate from "../../../../../../../components/OrderForm/OrderRangeDate";
import { MODE_LIST, MALE_OR_FEMALE } from "../../../../../../../utils/const";
import { deepCopy } from "../../../../../../../utils";
import { originRule } from "./const";

import NotDistinguish from "./NotDistinguish";
import Distinguish from "./Distinguish";

const SettlementRules = ({
  values,
  restForm
}) => {
  const [rulesList, setRulesList] = useState([{
    ruleLocation: 1
  }]);

  const deleteRule = (rule) => {
    const copyList = deepCopy(rulesList);
    const findRuleIndex = rulesList.findIndex(item => item.ruleLocation === rule.ruleLocation);
    copyList.splice(findRuleIndex, 1);
    setRulesList(copyList);
  };

  const addRule = () => {
    const copyList = deepCopy(rulesList);
    copyList.push({ruleLocation: rulesList.length + 1});
    setRulesList(copyList);

    let newFieldValues = {};
    newFieldValues[`orderRangeDate${rulesList.length + 1}`] = originRule.orderRangeDate1;
    newFieldValues[`mode${rulesList.length + 1}`] = originRule.mode1;
    newFieldValues[`wagesAndSalary${rulesList.length + 1}`] = originRule.wagesAndSalary1;
    newFieldValues[`differenceAndReturnMoney${rulesList.length + 1}`] = originRule.differenceAndReturnMoney1;
    restForm.setValues({
      ...restForm.values,
      ...newFieldValues
    })
  };

  const onIndexChange = (index, ruleIndex, type) => {
    restForm.setFieldValue(`${type}${ruleIndex + 1}.value`, [MALE_OR_FEMALE[index]]);
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

  const renderScene = ({route}, ruleIndex, type ) => {
    switch(route.key){
      case 'NOT_DISTINGUISH': 
        return (
          <NotDistinguish 
            type={type}
            values={values} 
            ruleIndex={ruleIndex} 
          />
        )
      case 'DISTINGUISH':
        return (
          <Distinguish 
            type={type}
            values={values} 
            ruleIndex={ruleIndex} 
          />
        )
    }
  };
  
  const renderRoute = [
    { key: 'NOT_DISTINGUISH', title: '不区分男女' },
    { key: 'DISTINGUISH', title: '区分男女' }
  ];

  const statusSwitch = (type, ruleIndex) => {
    restForm.setFieldValue(`${type}${ruleIndex + 1}.status`, !values[`${type}${ruleIndex + 1}`].status);
  };

  return (
    <View>
      <Text style={styles.labelText}>会员结算规则：</Text>
      <View style={{marginTop: 10}}>
        <>
          {rulesList.map((rule, ruleIndex) => {
            return (
              <Shadow key={ruleIndex} style={styles.shadow}>
                <View style={styles.topTitleArea}>
                  {rulesList.length !== 1 && <TouchableOpacity style={[styles.deleteArea, {left: 0}]} onPress={()=>deleteRule(rule)}>
                    <AntDesign
                      name='delete'
                      size={36}
                      color='#ff6666'
                    />
                  </TouchableOpacity>}
                  <Text style={styles.topTitleText}>{`规则${rule.ruleLocation}`}</Text>
                  {rulesList.length !== 5 && <TouchableOpacity style={[styles.deleteArea, {right: 0}]} onPress={addRule}>
                    <AntDesign
                      name='pluscircleo'
                      size={36}
                      color='#409EFF'
                    />
                  </TouchableOpacity>}
                </View>
                <View style={styles.fieldArea}>
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
                    {['wagesAndSalary', 'differenceAndReturnMoney'].map((type, typeIndex) => {
                      const isShowSwitchTitle = !!values[`${type}${ruleIndex + 1}`].status; //是否打开title栏；
                      const nowSelectIndex = MALE_OR_FEMALE.findIndex(item => item.value === values[`${type}${ruleIndex + 1}`].value[0].value); //目前所在的TabIndex；
                      const isPureIn0 = values[`${type}${ruleIndex + 1}`].not_distinguish.fee_mode.value[0].value === 'PURE'; //在不区分男女tab栏中模式是否为【纯】；
                      const isPureOfMaleIn1 = values[`${type}${ruleIndex + 1}`].distinguish.male.fee_mode.value[0].value === 'PURE'; //在区分男女tab栏中【男】模式为【纯】；
                      const isPureOfFemaleIn1 = values[`${type}${ruleIndex + 1}`].distinguish.female.fee_mode.value[0].value === 'PURE'; //在区分男女tab栏中【女】模式为【纯】；
                      const title = typeIndex === 0 ? '工价/底薪': '差价/返费';
                      return(
                        <View key={typeIndex} style={typeIndex === 1 && {marginTop: 20}}>
                          <TouchableOpacity style={[
                            isShowSwitchTitle && styles.openSwitchTitle,
                            !isShowSwitchTitle && styles.closeSwitchTitle
                            ]} onPress={() =>statusSwitch(type, ruleIndex)}>
                            <Text style={[styles.labelText, {textAlign: 'center', color: isShowSwitchTitle ?'#ffffff' : '#333333'}]}>{title}</Text>
                          </TouchableOpacity>
                          {!!values[`${type}${ruleIndex + 1}`].status && <View style={[
                            styles.tabContent,
                            nowSelectIndex === 0 && {height: isPureIn0 ? 280 : 340}, 
                            nowSelectIndex === 1 && {height: isPureOfMaleIn1 && isPureOfFemaleIn1 ? 550 : (!isPureOfMaleIn1 && isPureOfFemaleIn1) || (isPureOfMaleIn1 && !isPureOfFemaleIn1 !== 'PURE') ? 610 : 670}
                          ]}>
                            <TabView
                              renderTabBar={tabBar}
                              onIndexChange={(props) => onIndexChange(props, ruleIndex, type)}
                              renderScene={(props) => renderScene(props, ruleIndex, type)}
                              navigationState={{ index: nowSelectIndex, routes: renderRoute }}
                            />
                          </View>}
                        </View>
                      )
                    })}
                  </View>
                </View>
              </Shadow>
            )})}
        </>
      </View>
    </View>
  )
};

const styles = StyleSheet.create({
  shadow: {
    width: '100%', 
    marginBottom: 30, 
    borderRadius: 10
  },
  topTitleArea: {
    height: 60, 
    backgroundColor: '#EFEFEF', 
    justifyContent: 'center', 
    borderTopRightRadius: 10, 
    borderTopLeftRadius: 10
  },
  topTitleText: {
    fontSize: 28, 
    fontWeight: 'bold',
    textAlign: 'center'
  },
  fieldArea: {
    backgroundColor: '#fff', 
    minHeight: 200, 
    borderBottomLeftRadius: 10, 
    borderBottomRightRadius: 10, 
    padding: 20
  },
  deleteArea: {
    width: 60, 
    height: 60, 
    position: 'absolute', 
    zIndex: 999, 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  labelText: {
    height: 60,
    textAlignVertical: 'center',
    minWidth: 150,
    fontSize: 26,
    color: '#333333'
  },
  tabBarStyle: {
    height: 60,
    backgroundColor: '#ffffff'
  },
  tabBarIndicatorStyle: {
    height: 0,
  },
  openSwitchTitle: {
    height: 60,
    backgroundColor: '#409EFF',
    borderWidth: 0,
    borderColor: '#ffffff',
    borderRadius: 0,
    borderTopLeftRadius: 10, 
    borderTopRightRadius: 10
  },
  closeSwitchTitle: {
    height: 60,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#409EFF',
    borderRadius: 10
  },
  tabContent: {
    borderWidth: 1, 
    borderColor: '#409EFF'
  }
});

export default SettlementRules;