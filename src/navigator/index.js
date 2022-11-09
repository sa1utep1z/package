import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { navigationRef } from './RootNavigation';
import NAVIGATION_KEYS from './key'; //组件名称
import NAVIGATION_PAGES from '../pages'; //组件列表
import Tabbar from './Tabbar'; //进入首页后的Tab栏
import header from './header';

const Stack = createNativeStackNavigator();

export default Navigator = () => {

  //登录
  const login = (
    <>
      <Stack.Screen
        name={NAVIGATION_KEYS.LOGIN}
        component={NAVIGATION_PAGES.LOGIN}
        options={{ header: () => null }}
      />
      <Stack.Screen
        name={NAVIGATION_KEYS.FORGET_PSW}
        component={NAVIGATION_PAGES.FORGET_PSW}
        options={{
          headerTitle: '忘记密码'
        }}
      />
      <Stack.Screen
        name={NAVIGATION_KEYS.USER_AGREEMENT}
        component={NAVIGATION_PAGES.USER_AGREEMENT}
        options={{
          headerTitle: '用户协议'
        }}
      />
      <Stack.Screen
        name={NAVIGATION_KEYS.PRIVACY_POLICY}
        component={NAVIGATION_PAGES.PRIVACY_POLICY}
        options={{
          headerTitle: '隐私政策'
        }}
      />
    </>
  );

  //首页
  const home = (
    <>
      <Stack.Screen
        name={NAVIGATION_KEYS.COMPANY_DETAIL}
        component={NAVIGATION_PAGES.COMPANY_DETAIL}
        options={{
          headerTitle: '企业详情'
        }}
      />
      <Stack.Screen
        name={NAVIGATION_KEYS.SIGN_UP}
        component={NAVIGATION_PAGES.SIGN_UP}
        options={{
          headerTitle: '帮会员报名'
        }}
      />
    </>
  );

  //工作台（商务管理）
  const business = (
    <>
      <Stack.Screen
        name={NAVIGATION_KEYS.BUSINESS_MANAGE}
        component={NAVIGATION_PAGES.BUSINESS_MANAGE}
        options={{
          headerTitle: '企业管理'
        }}
      />
      <Stack.Screen
        name={NAVIGATION_KEYS.BUSINESS_ADD}
        component={NAVIGATION_PAGES.BUSINESS_ADD}
        options={{
          headerTitle: '新增企业'
        }}
      />
      <Stack.Screen
        name={NAVIGATION_KEYS.BUSINESS_EDIT}
        component={NAVIGATION_PAGES.BUSINESS_EDIT}
        options={{
          headerTitle: '编辑企业'
        }}
      />
      <Stack.Screen
        name={NAVIGATION_KEYS.ORDER_MANAGE}
        component={NAVIGATION_PAGES.ORDER_MANAGE}
        options={{
          headerTitle: '订单管理'
        }}
      />
      <Stack.Screen
        name={NAVIGATION_KEYS.CERATE_ORDER}
        component={NAVIGATION_PAGES.CERATE_ORDER}
        options={{
          headerTitle: '新建订单'
        }}
      />
    </>
  );

  //工作台（名单合集）
  const list = (
    <>
      <Stack.Screen
        name={NAVIGATION_KEYS.SIGN_UP_LIST}
        component={NAVIGATION_PAGES.SIGN_UP_LIST}
        options={{
          headerTitle: '报名名单'
        }}
      />
      <Stack.Screen
        name={NAVIGATION_KEYS.INTERVIEW_LIST}
        component={NAVIGATION_PAGES.INTERVIEW_LIST}
        options={{
          headerTitle: '面试名单'
        }}
      />
      <Stack.Screen
        name={NAVIGATION_KEYS.WAIT_TO_ENTRY_LIST}
        component={NAVIGATION_PAGES.WAIT_TO_ENTRY_LIST}
        options={{
          headerTitle: '待入职名单'
        }}
      />
      <Stack.Screen
        name={NAVIGATION_KEYS.LEAVING_LIST}
        component={NAVIGATION_PAGES.LEAVING_LIST}
        options={{
          headerTitle: '在离职名单'
        }}
      />
      <Stack.Screen
        name={NAVIGATION_KEYS.NEWEST_STATE}
        component={NAVIGATION_PAGES.NEWEST_STATE}
        options={{
          headerTitle: '最新状态'
        }}
      />
      <Stack.Screen
        name={NAVIGATION_KEYS.INTERNATIONAL_SEA}
        component={NAVIGATION_PAGES.INTERNATIONAL_SEA}
        options={{
          headerTitle: '公海'
        }}
      />
      <Stack.Screen
        name={NAVIGATION_KEYS.MY_MEMBERS}
        component={NAVIGATION_PAGES.MY_MEMBERS}
        options={{
          headerTitle: '我的会员'
        }}
      />
      <Stack.Screen
        name={NAVIGATION_KEYS.EDIT_RETURN_VISIT}
        component={NAVIGATION_PAGES.EDIT_RETURN_VISIT}
        options={{
          headerTitle: '新增回访记录'
        }}
      />
      <Stack.Screen
        name={NAVIGATION_KEYS.EDIT_MEMBER_DETAIL}
        component={NAVIGATION_PAGES.EDIT_MEMBER_DETAIL}
        options={{
          headerTitle: '编辑会员信息'
        }}
      />
      <Stack.Screen
        name={NAVIGATION_KEYS.JOIN_IN_SIGN_UP}
        component={NAVIGATION_PAGES.JOIN_IN_SIGN_UP}
        options={{
          headerTitle: '加入报名'
        }}
      />
      <Stack.Screen
        name={NAVIGATION_KEYS.EDIT_MEMBER}
        component={NAVIGATION_PAGES.EDIT_MEMBER}
        options={{
          headerTitle: '编辑会员信息'
        }}
      />
      <Stack.Screen
        name={NAVIGATION_KEYS.TRANSFER_FACTORY}
        component={NAVIGATION_PAGES.TRANSFER_FACTORY}
        options={{
          headerTitle: '转厂信息'
        }}
      />
      <Stack.Screen
        name={NAVIGATION_KEYS.BATCH_OPERATE_LIST}
        component={NAVIGATION_PAGES.BATCH_OPERATE_LIST}
        options={{
          headerTitle: '批量处理状态'
        }}
      />
      <Stack.Screen
        name={NAVIGATION_KEYS.RECORD_OF_WORKING}
        component={NAVIGATION_PAGES.RECORD_OF_WORKING}
        options={{
          headerTitle: '员工考勤信息'
        }}
      />
      <Stack.Screen
        name={NAVIGATION_KEYS.COMPLETE_MEMBER}
        component={NAVIGATION_PAGES.COMPLETE_MEMBER}
        options={{
          headerTitle: '完善会员信息'
        }}
      />
    </>
  );

  //工作台（会员服务）
  const service = (
    <>
      <Stack.Screen
        name={NAVIGATION_KEYS.LEAVING_MANAGE}
        component={NAVIGATION_PAGES.LEAVING_MANAGE}
        options={{
          headerTitle: '离职审核'
        }}
      />
      <Stack.Screen
        name={NAVIGATION_KEYS.COMPLAINT_FEEDBACK}
        component={NAVIGATION_PAGES.COMPLAINT_FEEDBACK}
        options={{
          headerTitle: '投诉反馈'
        }}
      />
      <Stack.Screen
        name={NAVIGATION_KEYS.COMPLAINT_ADD}
        component={NAVIGATION_PAGES.COMPLAINT_ADD}
        options={{
          headerTitle: '新建投诉'
        }}
      />
      <Stack.Screen
        name={NAVIGATION_KEYS.COMPLAINT_EDIT}
        component={NAVIGATION_PAGES.COMPLAINT_EDIT}
        options={{
          headerTitle: '编辑投诉'
        }}
      />
      <Stack.Screen
        name={NAVIGATION_KEYS.ADVANCE_MANAGE}
        component={NAVIGATION_PAGES.ADVANCE_MANAGE}
        options={{
          headerTitle: '预支审核'
        }}
      />
      <Stack.Screen
        name={NAVIGATION_KEYS.ADVANCE_AUDIT}
        component={NAVIGATION_PAGES.ADVANCE_AUDIT}
        options={{
          headerTitle: '预支审核详情'
        }}
      />
    </>
  );

  //工作台（宿舍管理）
  const dormitory = (
    <>
      <Stack.Screen
        name={NAVIGATION_KEYS.DORMITORY_LIST}
        component={NAVIGATION_PAGES.DORMITORY_LIST}
        options={{
          headerTitle: '在离宿名单'
        }}
      />
      <Stack.Screen
        name={NAVIGATION_KEYS.CREATE_DORMITORY}
        component={NAVIGATION_PAGES.CREATE_DORMITORY}
        options={{
          headerTitle: '新增住宿'
        }}
      />
      <Stack.Screen
        name={NAVIGATION_KEYS.BATCH_OPERATE_DORMITORY}
        component={NAVIGATION_PAGES.BATCH_OPERATE_DORMITORY}
        options={{
          headerTitle: '批量操作'
        }}
      />
      <Stack.Screen
        name={NAVIGATION_KEYS.DORMITORY_CHECK}
        component={NAVIGATION_PAGES.DORMITORY_CHECK}
        options={{
          headerTitle: '宿舍点检'
        }}
      />
      <Stack.Screen
        name={NAVIGATION_KEYS.DORMITORY_RECORD}
        component={NAVIGATION_PAGES.DORMITORY_RECORD}
        options={{
          headerTitle: '宿舍抄表'
        }}
      />
      <Stack.Screen
        name={NAVIGATION_KEYS.DORMITORY_VIOLATION}
        component={NAVIGATION_PAGES.DORMITORY_VIOLATION}
        options={{
          headerTitle: '宿舍违纪'
        }}
      />
    </>
  );

  //工作台（数据看板）
  const data = (
    <>
      <Stack.Screen
        name={NAVIGATION_KEYS.DATA_STATISTICS}
        component={NAVIGATION_PAGES.DATA_STATISTICS}
        options={{
          headerTitle: '数据统计'
        }}
      />
      <Stack.Screen
        name={NAVIGATION_KEYS.HIRE_REPORT_FORM}
        component={NAVIGATION_PAGES.HIRE_REPORT_FORM}
        options={{
          headerTitle: '招聘看板'
        }}
      />
    </>
  );

  //工作台（待开发）
  const workbench = (
    <>
      <Stack.Screen
        name={NAVIGATION_KEYS.AGREEMENT_MANAGEMENT}
        component={NAVIGATION_PAGES.AGREEMENT_MANAGEMENT}
        options={{
          headerTitle: '合同管理'
        }}
      />
      <Stack.Screen
        name={NAVIGATION_KEYS.APPLY_DORMITORY}
        component={NAVIGATION_PAGES.APPLY_DORMITORY}
        options={{
          headerTitle: '宿舍申请'
        }}
      />
      <Stack.Screen
        name={NAVIGATION_KEYS.COMPLAINT_PLATE}
        component={NAVIGATION_PAGES.COMPLAINT_PLATE}
        options={{
          headerTitle: '投诉看板'
        }}
      />
      <Stack.Screen
        name={NAVIGATION_KEYS.LEAVE_EXAMINE}
        component={NAVIGATION_PAGES.LEAVE_EXAMINE}
        options={{
          headerTitle: '离职管理'
        }}
      />
      <Stack.Screen
        name={NAVIGATION_KEYS.MEMBER_REVIEW}
        component={NAVIGATION_PAGES.MEMBER_REVIEW}
        options={{
          headerTitle: '裂变回访'
        }}
      />
      <Stack.Screen
        name={NAVIGATION_KEYS.MY_COMMISSION}
        component={NAVIGATION_PAGES.MY_COMMISSION}
        options={{
          headerTitle: '我的提成'
        }}
      />

      <Stack.Screen
        name={NAVIGATION_KEYS.PAY_MANAGEMENT}
        component={NAVIGATION_PAGES.PAY_MANAGEMENT}
        options={{
          headerTitle: '借支管理'
        }}
      />
    </>
  );

  //我的
  const mine = (
    <>
      <Stack.Screen
        name={NAVIGATION_KEYS.PERSONAL_CARD}
        component={NAVIGATION_PAGES.PERSONAL_CARD}
        options={{
          headerTitle: '对外名片'
        }}
      />
      <Stack.Screen
        name={NAVIGATION_KEYS.RESET}
        component={NAVIGATION_PAGES.RESET}
        options={{
          headerTitle: '重置密码'
        }}
      />
    </>
  );

  // 消息
  const message = (
    <>
      <Stack.Screen
        name={NAVIGATION_KEYS.RESIGNATION_MESSAGE}
        component={NAVIGATION_PAGES.RESIGNATION_MESSAGE}
        options={{
          headerTitle: '离职提醒'
        }}
      />
      <Stack.Screen
        name={NAVIGATION_KEYS.REVISIT_MESSAGE}
        component={NAVIGATION_PAGES.REVISIT_MESSAGE}
        options={{
          headerTitle: '回访提醒'
        }}
      />
      <Stack.Screen
        name={NAVIGATION_KEYS.SYSTEM_MESSAGE}
        component={NAVIGATION_PAGES.SYSTEM_MESSAGE}
        options={{
          headerTitle: '系统信息'
        }}
      />
      <Stack.Screen
        name={NAVIGATION_KEYS.NOTICE_MESSAGE}
        component={NAVIGATION_PAGES.NOTICE_MESSAGE}
        options={{
          headerTitle: '公告信息'
        }}
      />
      <Stack.Screen
        name={NAVIGATION_KEYS.ADVISE_MESSAGE}
        component={NAVIGATION_PAGES.ADVISE_MESSAGE}
        options={{
          headerTitle: '通知信息'
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
          statusBarAnimation: 'fade',
          animation: 'fade_from_bottom',
          header
        }}>
        {login}
        {home}
        {business}
        {list}
        {service}
        {dormitory}
        {data}
        {workbench}
        {mine}
        {message}
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
