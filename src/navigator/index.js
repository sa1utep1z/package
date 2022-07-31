import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AntDesign from 'react-native-vector-icons/AntDesign';

import { navigationRef } from './RootNavigation';
import NAVIGATION_KEYS from './key'; //组件名称
import NAVIGATION_PAGES from '../pages'; //组件列表
import Tabbar from './Tabbar'; //进入首页后的Tab栏

const Stack = createNativeStackNavigator();

export default Navigator = () => {
  const header = ({back, navigation, options, route}) => {
    const param = {back, navigation, options, route};
    const title = options?.headerTitle;
    const headerRight = options?.headerRight && options?.headerRight(param);
    const headerLeft = options?.headerLeft && options?.headerLeft(param);
    const headerCenterArea = options?.headerCenterArea && options?.headerCenterArea(param);
    const goBack = () => navigation.goBack();
    
    return (
      <View style={styles.headerArea}>
        <View style={styles.leftArea}>
          {headerLeft ? headerLeft : 
            <AntDesign
              size={28}
              name='left' 
              style={styles.icon}
              onPress={goBack}
            />
          }
        </View>
        {headerCenterArea ? headerCenterArea : <View style={styles.centerArea}>
          <Text style={styles.centerAreaText}>{title}</Text>
        </View>}
        <View style={styles.rightArea}>
          {headerRight}
        </View>
      </View>
    )
  };

  const login = (
    <>
      <Stack.Screen
        name={NAVIGATION_KEYS.LOGIN}
        component={NAVIGATION_PAGES.LOGIN}
        options={{header: () => null}}
      />
      <Stack.Screen
        name={NAVIGATION_KEYS.REGISTER}
        component={NAVIGATION_PAGES.REGISTER}
        options={{
          headerTitle: '注册',
        }}
      />
      <Stack.Screen
        name={NAVIGATION_KEYS.FORGET_PSW}
        component={NAVIGATION_PAGES.FORGET_PSW}
        options={{
          headerTitle: '忘记密码',
        }}
      />
      <Stack.Screen
        name={NAVIGATION_KEYS.VERIFICATION_LOGIN}
        component={NAVIGATION_PAGES.VERIFICATION_LOGIN}
        options={{
          headerTitle: '验证码登录',
        }}
      />
      <Stack.Screen
        name={NAVIGATION_KEYS.USER_AGREEMENT}
        component={NAVIGATION_PAGES.USER_AGREEMENT}
        options={{
          headerTitle: '用户协议',
        }}
      />
      <Stack.Screen
        name={NAVIGATION_KEYS.PRIVACY_POLICY}
        component={NAVIGATION_PAGES.PRIVACY_POLICY}
        options={{
          headerTitle: '隐私政策',
        }}
      />
    </>
  );

  const home = (
    <>
      <Stack.Screen
        name={NAVIGATION_KEYS.COMPANY_DETAIL}
        component={NAVIGATION_PAGES.COMPANY_DETAIL}
        options={{
          headerTitle: '企业详情',
        }}
      />
      <Stack.Screen
        name={NAVIGATION_KEYS.SIGN_UP}
        component={NAVIGATION_PAGES.SIGN_UP}
        options={{
          headerTitle: '帮会员报名',
        }}
      />
    </>
  );

  const list = (
    <>
      <Stack.Screen
        name={NAVIGATION_KEYS.INTERVIEW_LIST}
        component={NAVIGATION_PAGES.INTERVIEW_LIST}
        options={{
          headerTitle: '面试名单',
        }}
      />
      <Stack.Screen
        name={NAVIGATION_KEYS.LEAVING_LIST}
        component={NAVIGATION_PAGES.LEAVING_LIST}
        options={{
          headerTitle: '在离职名单',
        }}
      />
      <Stack.Screen
        name={NAVIGATION_KEYS.SIGN_UP_LIST}
        component={NAVIGATION_PAGES.SIGN_UP_LIST}
        options={{
          headerTitle: '报名名单',
        }}
      />
      <Stack.Screen
        name={NAVIGATION_KEYS.WAIT_TO_ENTRY_LIST}
        component={NAVIGATION_PAGES.WAIT_TO_ENTRY_LIST}
        options={{
          headerTitle: '待入职名单',
        }}
      />
      <Stack.Screen
        name={NAVIGATION_KEYS.NEWEST_STATE}
        component={NAVIGATION_PAGES.NEWEST_STATE}
        options={{
          headerTitle: '最新状态',
        }}
      />
      <Stack.Screen
        name={NAVIGATION_KEYS.TRANSFER_FACTORY}
        component={NAVIGATION_PAGES.TRANSFER_FACTORY}
        options={{
          headerTitle: '转厂信息',
        }}
      />
      <Stack.Screen
        name={NAVIGATION_KEYS.EDIT_MEMBER}
        component={NAVIGATION_PAGES.EDIT_MEMBER}
        options={{
          headerTitle: '编辑会员信息',
        }}
      />
      <Stack.Screen
        name={NAVIGATION_KEYS.BATCH_OPERATE_LIST}
        component={NAVIGATION_PAGES.BATCH_OPERATE_LIST}
        options={{
          headerTitle: '批量处理状态',
        }}
      />
      <Stack.Screen
        name={NAVIGATION_KEYS.RECORD_OF_WORKING}
        component={NAVIGATION_PAGES.RECORD_OF_WORKING}
        options={{
          headerTitle: '员工考勤信息',
        }}
      />
    </>
  )

  const workbench = (
    <>
      <Stack.Screen
        name={NAVIGATION_KEYS.AGREEMENT_MANAGEMENT}
        component={NAVIGATION_PAGES.AGREEMENT_MANAGEMENT}
        options={{
          headerTitle: '合同管理',
        }}
      />
      <Stack.Screen
        name={NAVIGATION_KEYS.APPLY_DORMITORY}
        component={NAVIGATION_PAGES.APPLY_DORMITORY}
        options={{
          headerTitle: '宿舍申请',
        }}
      />
      <Stack.Screen
        name={NAVIGATION_KEYS.COMPLAINT_PLATE}
        component={NAVIGATION_PAGES.COMPLAINT_PLATE}
        options={{
          headerTitle: '投诉看板',
        }}
      />
      <Stack.Screen
        name={NAVIGATION_KEYS.DATA_STATISTICS}
        component={NAVIGATION_PAGES.DATA_STATISTICS}
        options={{
          headerTitle: '数据统计',
        }}
      />
      <Stack.Screen
        name={NAVIGATION_KEYS.HIRE_REPORT_FORM}
        component={NAVIGATION_PAGES.HIRE_REPORT_FORM}
        options={{
          headerTitle: '招聘报表',
        }}
      />
      <Stack.Screen
        name={NAVIGATION_KEYS.INTERNATIONAL_SEA}
        component={NAVIGATION_PAGES.INTERNATIONAL_SEA}
        options={{
          headerTitle: '公海',
        }}
      />
      <Stack.Screen
        name={NAVIGATION_KEYS.LEAVE_EXAMINE}
        component={NAVIGATION_PAGES.LEAVE_EXAMINE}
        options={{
          headerTitle: '离职管理',
        }}
      />
      <Stack.Screen
        name={NAVIGATION_KEYS.MEMBER_REVIEW}
        component={NAVIGATION_PAGES.MEMBER_REVIEW}
        options={{
          headerTitle: '裂变回访',
        }}
      />
      <Stack.Screen
        name={NAVIGATION_KEYS.MY_COMMISSION}
        component={NAVIGATION_PAGES.MY_COMMISSION}
        options={{
          headerTitle: '我的提成',
        }}
      />
      <Stack.Screen
        name={NAVIGATION_KEYS.MY_MEMBERS}
        component={NAVIGATION_PAGES.MY_MEMBERS}
        options={{
          headerTitle: '我的会员',
        }}
      />
      <Stack.Screen
        name={NAVIGATION_KEYS.PAY_MANAGEMENT}
        component={NAVIGATION_PAGES.PAY_MANAGEMENT}
        options={{
          headerTitle: '借支管理',
        }}
      />
    </>
  );

  const myMembers = (
    <>
      <Stack.Screen
        name={NAVIGATION_KEYS.EDIT_RETURN_VISIT}
        component={NAVIGATION_PAGES.EDIT_RETURN_VISIT}
        options={{
          headerTitle: '编辑回访记录',
        }}
      />
      <Stack.Screen
        name={NAVIGATION_KEYS.JOIN_IN_SIGN_UP}
        component={NAVIGATION_PAGES.JOIN_IN_SIGN_UP}
        options={{
          headerTitle: '会员加入报名',
        }}
      />
    </>
  )

  const mine = (
    <>
      <Stack.Screen
        name={NAVIGATION_KEYS.PERSONAL_CARD}
        component={NAVIGATION_PAGES.PERSONAL_CARD}
        options={{
          headerTitle: '对外名片',
        }}
      />
      <Stack.Screen
        name={NAVIGATION_KEYS.RESET}
        component={NAVIGATION_PAGES.RESET}
        options={{
          headerTitle: '重置密码',
        }}
      />
    </>
  );

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator 
        initialRouteName={NAVIGATION_KEYS.LOGIN}
        screenOptions={{
          headerTitleAlign: 'center',
          header
        }}>
        {login}
        {home}
        {list}
        {workbench}
        {myMembers}
        {mine}
        <Stack.Screen
          name={NAVIGATION_KEYS.TABBAR}
          component={Tabbar}
          options={{
            header: () => null
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  headerArea: {
    height: 55, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    backgroundColor: '#fff'
  },
  leftArea: {
    flex: 1
  },
  icon:{ 
    width: 50, 
    height: '100%',
    textAlignVertical: 'center',
    paddingLeft: 5
  },
  centerArea: {
    height: '100%', 
    flexDirection: 'column', 
    alignItems: 'center', 
    justifyContent: 'center'
  },
  centerAreaText: {
    textAlign: 'center', 
    fontSize: 18, 
    color: '#000'
  },
  rightArea: {
    flex: 1, 
    height: '100%', 
    justifyContent: 'center', 
    alignItems: 'flex-end'
  }
});