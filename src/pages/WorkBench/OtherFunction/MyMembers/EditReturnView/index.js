import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, Text, TouchableOpacity, Linking } from 'react-native';
import { Button } from '@rneui/themed';
import { Formik, Field } from 'formik';
import * as Yup from 'yup';
import { useNavigation } from '@react-navigation/native';
import Entypo from 'react-native-vector-icons/Entypo';
import moment from 'moment';
import { useToast } from "react-native-toast-notifications";

import FormItem from '../../../../../components/Form/FormItem';
import LongTextArea from '../../../../../components/Form/LongTextArea';
import SelectDate from '../../../../../components/Form/SelectDate';
import SelectTags from '../../../../../components/Form/SelectTags';
import TwoRadio from '../../../../../components/Form/TwoRadio';
import MyMembersApi from '../../../../../request/MyMembersApi';
import { SUCCESS_CODE } from '../../../../../utils/const';
import { useEffect } from 'react';
import SelectItemInPage from '../../../../../components/Form/SelectItemInPage';
import NAVIGATION_KEYS from '../../../../../navigator/key';

const SignUpValidationSchema = Yup.object().shape({
  thisTimeReviewRecord: Yup.string().required('请填写本次回访记录')
});

const initialValues = {
  memberTags: '',
  memberName: '',
  memberPhone: '',
  memberDecision: true,
  intendCompany: '',
  intendSignUpDate: '',
  thisTimeReviewRecord: '',
  nextTimeReviewDate: '',
};

let restForm;

const EditReturnView = (props) => {
  const { route: { params } } = props;
  const toast = useToast();
  const navigation = useNavigation();

  const [companyList, setCompanyList] = useState([]);
  const [messageInfo, setMessageInfo] = useState({});

  useEffect(() => {
    getCompanyList();
    setFieldValue();
  }, [])

  useEffect(()=>{
    //从回访消息那跳转过来
    if(params.fromMessage){
      getReviewInfo(params?.findPoolId?.param.memberPoolId);
    }else {
      setFieldValue();
    }
    getCompanyList();
  },[])

  const getReviewInfo = async(poolId) => {
    if(!poolId) return;
    try{
      const res = await MyMembersApi.GetRevisitInfo(poolId);
      console.log('res!!!', res)
      if(res.code !== SUCCESS_CODE){
        toast.show(`请求失败，请稍后重试。${res.msg}`, {type: 'danger'});
      }
      restForm.setFieldValue('memberName', res.data.userName);
      restForm.setFieldValue('memberPhone', res.data.mobile);
      restForm.setFieldValue('memberTags', res.data.tags);
      setMessageInfo(res.data);
    }catch(err){
      toast.show(`出现了意料之外的问题，请联系系统管理员处理`, { type: 'danger' });
    }
  };

  const setFieldValue = () => {
    const { formList: { userName, mobile, tags } } = params;
    restForm.setFieldValue('memberName', userName);
    restForm.setFieldValue('memberPhone', mobile);
    restForm.setFieldValue('memberTags', tags);
  };

  const getCompanyList = async () => {
    try {
      const res = await MyMembersApi.CompanyList();
      if (res.code !== SUCCESS_CODE) {
        toast.show(`请求失败，请稍后重试。${res.msg}`, { type: 'danger' });
      }
      setCompanyList(res.data);
    } catch (err) {
      toast.show(`出现了意料之外的问题，请联系系统管理员处理`, { type: 'danger' });
    }
  };

  const onSubmit = async(values) => {
    let poolId;
    if(params.fromMessage){
      poolId = params?.findPoolId?.param.memberPoolId;
    }else{
      poolId = props.route.params.formList.poolId;
    }
    const parameters = {
      returnVisitResult: values.memberDecision ? 'HAVE_WILL' : 'NO_WILL',
      tags: values.memberTags,
      nextReturnVisitDate: values.nextTimeReviewDate,
      willSignUpCompanyId: values.intendCompany.value,
      willSignUpDate: values.intendSignUpDate,
      content: values.thisTimeReviewRecord
    };

    try{
      const res = await MyMembersApi.IncreaseReviewRecord(poolId, parameters);
      if(res.code !== SUCCESS_CODE){
        toast.show(`新增回访记录失败，${res.msg}`, { type: 'danger' });
        return;
      }
      toast.show('新增回访记录成功！', { type: 'success' });
      navigation.goBack();
      props?.route?.params?.refresh && props.route.params.refresh();
    } catch (err) {
      toast.show(`出现了意料之外的问题，请联系系统管理员处理`, { type: 'danger' });
    }
  };

  const callPhone = (item) => {
    Linking.openURL(`tel:${item}`);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={SignUpValidationSchema}
      onSubmit={onSubmit}>
      {({ handleSubmit, values, ...rest }) => {
        restForm = rest;
        return (
          <View style={{ flex: 1, backgroundColor: '#EEF4F7', paddingTop: 31 }}>
            <ScrollView style={styles.scrollArea}>
              <View style={[styles.cardArea]}>
                <Field
                  name="memberTags"
                  title="会员标签"
                  component={SelectTags}
                />
                <Field
                  name="memberName"
                  title="会员姓名"
                  editable={false}
                  placeholder="无"
                  inputStyle={{ color: '#CCCCCC' }}
                  component={FormItem}
                />
                {/* <Field
                  name="memberPhone"
                  title="会员手机号"
                  maxLength={11}
                  editable={false}
                  placeholder="无"
                  inputStyle={{color: '#CCCCCC'}}
                  component={FormItem}
                /> */}
                <View style={styles.phoneStyle}>
                  <Text style={styles.label}>手机号码: </Text>
                  <TouchableOpacity style={[styles.listItem_item, { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }]} onPress={() => callPhone(params.formList.mobile)}>
                    <Text style={[styles.listItem_text, { color: '#409EFF' }]}>{params.formList.mobile}</Text>
                    <Entypo name='phone' size={26} color='#409EFF' />
                  </TouchableOpacity>
                </View>
                <Field
                  name="memberDecision"
                  title="会员意愿"
                  component={TwoRadio}
                />
                {values.memberDecision &&
                  <>
                    <Field
                      name="intendCompany"
                      title="意向报名企业"
                      showTitle
                      noBorder
                      bottomButton
                      selectList={[]}
                      pageOnPress={() => navigation.navigate(NAVIGATION_KEYS.TRANSFER_FACTORY, {
                        list: companyList,
                        confirm: (list) => {
                          rest.setFieldValue('intendCompany', list[0]);
                          navigation.goBack();
                        },
                        pageTitle: '选择意向报名企业'
                      })}
                      component={SelectItemInPage}
                    />
                    <Field
                      name="intendSignUpDate"
                      title="意向报名日期"

                      component={SelectDate}
                    />
                  </>
                }
                <Field
                  name="thisTimeReviewRecord"
                  title="本次回访记录"
                  component={FormItem}
                />
                <Field
                  name="nextTimeReviewDate"
                  title="下次回访日期"
                  component={SelectDate}
                />
                {params?.historyList && params.historyList.length > 0 ? 
                  <>
                    <View style={{ height: 91, paddingHorizontal: 28, justifyContent: 'center' }}>
                      <Text style={{ fontSize: 32, color: '#333333' }}>历史回访记录</Text>
                    </View>
                    <View style={styles.bottomList}>
                      <View style={styles.recordTitle_head}>
                        <Text style={styles.recordTitle_item}>回访人</Text>
                        <Text style={[styles.recordTitle_item, { width: 220 }]}>回访日期</Text>
                        <Text style={{ paddingLeft: 10, fontSize: 28, color: '#333333' }}>回访详情</Text>
                      </View>
                      {params.historyList.map((renderItem, renderIndex) => {
                        if (renderIndex < 3) {
                          return (
                            <View key={renderIndex} style={[styles.bottomListItem, renderIndex % 2 === 0 && { backgroundColor: '#ecf5ff' }]}>
                              <Text style={styles.recordItem}>{renderItem.lastModifiedByName}</Text>
                              <Text style={[styles.recordItem, { width: 220 }]}>{moment(renderItem.lastModifiedDate).format('YY/MM/DD HH:mm')}</Text>
                              <Text style={{ paddingLeft: 10, fontSize: 28, color: '#333333', flex: 1, paddingVertical: 10 }}>{renderItem.content}</Text>
                            </View>
                          )
                        }
                      })}
                    </View>
                  </> : <>
                  {messageInfo.visitInfos && messageInfo.visitInfos.length > 0 ? <>
                      <View style={{height: 91, paddingHorizontal: 28, justifyContent: 'center'}}>
                        <Text style={{fontSize: 32, color: '#333333'}}>历史回访记录</Text>
                      </View>
                      <View style={styles.bottomList}>
                        <View style={styles.recordTitle_head}>
                          <Text style={styles.recordTitle_item}>回访人</Text>
                          <Text style={[styles.recordTitle_item, {width: 220}]}>回访日期</Text>
                          <Text style={{paddingLeft: 10, fontSize: 28, color: '#333333'}}>回访详情</Text>
                        </View>
                        {messageInfo.visitInfos.map((renderItem, renderIndex)=>{
                          if(renderIndex < 3){
                            return (
                              <View key={renderIndex} style={[styles.bottomListItem, renderIndex%2 === 0 && {backgroundColor: '#ecf5ff'}]}>
                                <Text style={styles.recordItem}>{renderItem.lastModifiedByName}</Text>
                                <Text style={[styles.recordItem, {width: 220}]}>{moment(renderItem.lastModifiedDate).format('YY/MM/DD HH:mm')}</Text>
                                <Text style={{paddingLeft: 10, fontSize: 28, color: '#333333', flex: 1, paddingVertical: 10}}>{renderItem.content}</Text>
                              </View>
                            )
                          }
                        })}
                      </View>
                    </> : <View style={{height: 91, alignItems: 'center', paddingHorizontal: 28, flexDirection: 'row' }}>
                    <Text style={{fontSize: 32, color: '#333333'}}>历史回访记录：</Text>
                    <Text style={{fontSize: 32, color: '#333333'}}>暂无历史回访记录</Text>
                  </View>}
                </>}
              </View>
            </ScrollView>
            <Button
              title="新增"
              onPress={handleSubmit}
              buttonStyle={styles.buttonStyle}
              containerStyle={styles.buttonContainerStyle}
              titleStyle={styles.titleStyle}
            />
          </View>
        )
      }}
    </Formik>
  )
}

const styles = StyleSheet.create({
  scrollArea: {
    flex: 1,
    paddingHorizontal: 32
  },
  buttonStyle: {
    height: 88,
    backgroundColor: '#409EFF',
    borderColor: 'transparent',
    borderWidth: 0,
    borderRadius: 44
  },
  buttonContainerStyle: {
    marginHorizontal: 32,
    marginVertical: 20
  },
  titleStyle: {
    fontSize: 35
  },
  theWayToGo: {
    color: '#000',
    fontSize: 15,
    fontWeight: 'bold',
    marginLeft: 10,
    marginBottom: 10
  },
  cardArea: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10
  },
  historyList: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderColor: 'rgba(0, 0, 0, .05)'
  },
  longTextItem: {
    flex: 1,
    fontSize: 28,
    minHeight: 60
  },
  recordTitle_head: {
    height: 60,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#409EFF',
    alignItems: 'center'
  },
  recordTitle_item: {
    width: 120,
    height: '100%',
    borderRightWidth: 1,
    borderRightColor: '#409EFF',
    textAlignVertical: 'center',
    paddingLeft: 4,
    fontSize: 28,
    color: '#333333'
  },
  recordItem: {
    height: '100%',
    width: 120,
    borderRightWidth: 1,
    borderRightColor: '#409EFF',
    textAlignVertical: 'center',
    paddingLeft: 4,
    fontSize: 28,
    color: '#333333'
  },
  bottomList: {
    borderWidth: 1,
    marginHorizontal: 20,
    borderColor: '#409EFF',
    borderBottomWidth: 0,
    marginBottom: 20
  },
  bottomListItem: {
    minHeight: 60,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#409EFF'
  },
  phoneStyle: {
    flex: 1,
    minHeight: 91,
    flexDirection: 'row',
    paddingHorizontal: 30,
    borderBottomWidth: 1,
    textAlign: 'center',
    borderColor: 'rgba(0, 0, 0, .05)'
  },
  label: {
    // paddingVertical: 40,
    fontSize: 32,
    color: '#000',
    lineHeight: 91
  },
  listItem_text: {
    color: '#409EFF',
    fontSize: 32,
  },
  listItem_item: {
    flex: 1,
    paddingLeft: 5,
    justifyContent: 'center'
  },
});

export default EditReturnView;