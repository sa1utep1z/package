import React, {useState} from "react";
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Field } from 'formik';
import { Shadow } from 'react-native-shadow-2';
import { TabView, TabBar } from 'react-native-tab-view';

import SingleSelect from "../../../../../../../components/OrderForm/SingleSelect";
import OrderRangeDate from "../../../../../../../components/OrderForm/OrderRangeDate";
import { MODE_LIST, MALE_OR_FEMALE } from "../../../../../../../utils/const";

import NotDistinguish from "./NotDistinguish";
import Distinguish from "./Distinguish";

const SettlementRules = ({
  values,
  restForm,
  rulesList,
  addRule,
  deleteRule
}) => {

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
      <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
        <Text style={styles.labelText}>{`会员结算规则：${!rulesList.length ? '暂无结算规则' : ''}`}</Text>
        {!rulesList.length && <TouchableOpacity style={{paddingHorizontal: 10, paddingVertical: 10, borderRadius: 6, flexDirection: 'row'}} onPress={addRule}>
          <AntDesign
            name='pluscircleo'
            size={32}
            color='#409EFF'
          />
        </TouchableOpacity>}
      </View>
      <View style={{height: 20}}></View>
      {!!rulesList.length && <>
        {rulesList.map((rule, ruleIndex) => {
          return (
            <Shadow key={ruleIndex} style={styles.shadow}>
              <View style={styles.topTitleArea}>
                <TouchableOpacity style={[styles.deleteArea, {left: 0}]} onPress={()=>deleteRule(rule)}>
                  <AntDesign
                    name='delete'
                    size={36}
                    color='#ff6666'
                  />
                </TouchableOpacity>
                <Text style={styles.topTitleText}>{`结算周期${rule.ruleLocation}`}</Text>
                {rulesList.length !== 20 && <TouchableOpacity style={[styles.deleteArea, {right: 0}]} onPress={addRule}>
                  <AntDesign
                    name='pluscircleo'
                    size={36}
                    color='#409EFF'
                  />
                </TouchableOpacity>}
              </View>
              <View style={styles.fieldArea}>
                <Field
                  name={`orderRangeDate${rule.ruleLocation}`}
                  label="适用日期"
                  limit={rule}
                  limitCrossDate
                  canSelect={ruleIndex === rulesList.length - 1}
                  component={OrderRangeDate}
                />
                <Field  
                  name={`mode${rule.ruleLocation}`}
                  label="结算模式"
                  selectList={MODE_LIST}
                  canSearch={false}
                  component={SingleSelect}
                />
                <View style={{flex: 1}}>
                  {['wagesAndSalary', 'differenceAndReturnMoney'].map((type, typeIndex) => {
                    const isShowSwitchTitle = !!values[`${type}${rule.ruleLocation}`].status; //是否打开title栏；
                    const nowSelectIndex = MALE_OR_FEMALE.findIndex(item => item.value === values[`${type}${rule.ruleLocation}`].value[0].value); //目前所在的TabIndex；
                    const isPureIn0 = values[`${type}${rule.ruleLocation}`].not_distinguish.fee_mode.value[0].value === 'PURE'; //在不区分男女tab栏中模式是否为【纯】；
                    const isPureOfMaleIn1 = values[`${type}${rule.ruleLocation}`].distinguish.male.fee_mode.value[0].value === 'PURE'; //在区分男女tab栏中【男】模式为【纯】；
                    const isPureOfFemaleIn1 = values[`${type}${rule.ruleLocation}`].distinguish.female.fee_mode.value[0].value === 'PURE'; //在区分男女tab栏中【女】模式为【纯】；
                    const title = typeIndex === 0 ? '工价/底薪': '差价/返费';
                    return(
                      <View key={typeIndex} style={typeIndex === 1 && {marginTop: 20}}>
                        <TouchableOpacity style={[
                          isShowSwitchTitle && styles.openSwitchTitle,
                          !isShowSwitchTitle && styles.closeSwitchTitle
                          ]} onPress={() =>statusSwitch(type, ruleIndex)}>
                          <Text style={[styles.labelText, {textAlign: 'center', color: isShowSwitchTitle ?'#ffffff' : '#333333'}]}>{title}</Text>
                        </TouchableOpacity>
                        {!!values[`${type}${rule.ruleLocation}`].status && <View style={[
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
      </>}
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