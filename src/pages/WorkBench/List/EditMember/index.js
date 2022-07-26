import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { Button } from '@rneui/themed';
import { Formik, Field } from 'formik';
import * as Yup from 'yup';
import moment from 'moment';
import { useToast } from "react-native-toast-notifications";
import { useNavigation } from '@react-navigation/native';

import FormItem from '../../../../components/Form/FormItem';
import SelectItem from '../../../../components/Form/SelectItem';
import { IDCard, phone } from '../../../../utils/validate';
import { CHANEL_SOURCE_LIST, MEMBERS_STATUS, WAY_TO_GO, SUCCESS_CODE } from '../../../../utils/const';
import ListApi from '../../../../request/ListApi';
import Radio from '../../../../components/Form/Radio';
import ChangeStatus from '../../../../components/Form/ChangeStatus';
import MyMembersApi from '../../../../request/MyMembersApi';
import { checkedType, deepCopy } from '../../../../utils';

const SignUpValidationSchema = Yup.object().shape({
  name: Yup.string().max(5, '姓名不能超过5个字符').required('请输入姓名')
});
const getEnumValue = (optionsData, enumKey) => optionsData.find((val) => val.value === enumKey)?.label;
let restForm, initialValues = {
  name: '',
  idNo: '',
  mobile: '',
  orderName: '',
  signUpType: [],
  storeName: [],
  recruitName: [],
  status: '',
  arrivalMode: '',
  signUpTime: '',
  jobDate: '',
  resignDate: ''
};

const EditMember = (props) => {
  const { route: { params } } = props;
  const toast = useToast();
  const navigation = useNavigation();

  const [storeList, setStoreList] = useState([]);

  useEffect(() => {
    for (let key in params.fieldList) {
      switch (key) {
        case 'signUpType':
          initialValues[key][0] = CHANEL_SOURCE_LIST.find(name => name.value === params.fieldList[key]);
          break;
        case 'status':
          initialValues[key] =params.fieldList[key];
          break;
        case 'arrivalMode':
          initialValues[key] = WAY_TO_GO.find(name => name.value === params.fieldList[key])?.label;
          break;
        case 'signUpTime':
          initialValues[key] = moment(params.fieldList[key])?.format('YYYY-MM-DD');
          break;
        case 'jobDate':
          initialValues[key] = params.fieldList[key] ? moment(params.fieldList[key]).format('YYYY-MM-DD') : '';
          break;
        case 'resignDate':
          initialValues[key] = params.fieldList[key] ? moment(params.fieldList[key]).format('YYYY-MM-DD') : '';
          break;
        default:
          initialValues[key] = params.fieldList[key] || '';
          break;
      }
    }
    console.log('initialValues', initialValues);
    restForm.setValues(initialValues);
    getStoreList();
  }, [])

  const getStoreList = async() => {
    try{  
      const res = await MyMembersApi.StoreList();
      if(res.code !== SUCCESS_CODE){
        toast.show(`获取门店列表失败，${res.msg}`, { type: 'danger' });
        return;
      }
      if(res.data.length){
        res.data.forEach((item,index) => {
          item.title = item.storeName;
          item.id = index + 1;
          item.value = item.storeId;
        });
        setStoreList(res.data);
        if(params.fieldList.storeId && params.fieldList.recruiterId){
          const storeName = [res.data.find(store => store.storeId === params.fieldList.storeId)];
          restForm.setFieldValue('storeName', storeName);
          const recruit = storeName[0].members.find(recruit => recruit.value === msg.recruiterId);
          if(recruit){
            restForm.setFieldValue('recruitName', recruit);
            return;
          }
          restForm.setFieldValue('recruitName', []);
        }
      }
    }catch(err){
      toast.show(`获取门店列表失败，请联系系统管理员处理`, { type: 'danger' });
    }
  };

  const onSubmit = async (values) => {
    //提交时如果有门店/招聘员关系的需要加下面函数判断招聘员是否在门店列表下；
    // checkStore(values);
    const flowId = params.fieldList.flowId;
    const par = {
      name: values.name,
      mobile: values.mobile,
      idNo: values.idNo
    };
    console.log('par', par);
    try {
      const res = await ListApi.CompleteInfo(flowId, par);
      console.log('res', res);
      if (res?.code !== SUCCESS_CODE) {
        toast.show(`${res?.msg}`, { type: 'danger' });
        return;
      }
      toast.show(`修改成功`, { type: 'success' });
      navigation.goBack();
    } catch (err) {
      toast.show(`出现了意料之外的问题，请联系系统管理员处理`, { type: 'danger' });
    }
  };

  const checkStore = (values) => {
    if(values.storeName.length){
      const memberList = values.store[0].members;
      if(values.recruitName.length){
        const findIndex = memberList.findIndex(member => member.value === values.recruitName[0].value); 
        if(findIndex === -1){
          restForm.setFieldError('recruitName', '该门店下无该招聘员，请重新选择招聘员');
          return
        }
      }
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={SignUpValidationSchema}
      onSubmit={onSubmit}>
      {({ handleSubmit, values, ...rest }) => {
        restForm = rest;
        const selectStoreList = checkedType(values.storeName) === 'Array' ? values.storeName.length ? values.storeName[0].members : [] : [];
        if(selectStoreList.length){
          selectStoreList.map((item, index) => {
            item.title = item.label;
            item.id = index + 1;
          })
        }
        return (
          <View style={{ flex: 1 }}>
            <ScrollView style={styles.scrollArea}>
              <View style={styles.cardArea}>
                <Field
                  name="name"
                  title="姓名"
                  component={FormItem}
                />
                <Field
                  name="idNo"
                  title="身份证"
                  placeholder="无"
                  disabled
                  component={FormItem}
                />
                <Field
                  name="mobile"
                  title="手机号"
                  placeholder="无"
                  disabled
                  maxLength={11}
                  component={FormItem}
                />
                <Field
                  name="orderName"
                  title="职位名称"
                  placeholder="无"
                  disabled
                  component={FormItem}
                />
                <Field
                  name="signUpType"
                  title="职位来源"
                  noBorder
                  bottomButton
                  inPageField
                  singleSelect
                  validate={value=>{
                    let errorMsg;
                    if(value.length === 0) {
                      errorMsg = '请选择渠道来源';
                    }
                    return errorMsg;
                  }}
                  selectList={CHANEL_SOURCE_LIST}
                  component={SelectItem}
                />
                <Field
                  name="storeName"
                  title="归属门店"
                  noBorder
                  singleSelect
                  bottomButton
                  inPageField
                  canSearch
                  validate={value=>{
                    let errorMsg;
                    if(value.length === 0) {
                      errorMsg = '请选择所属门店';
                    }
                    return errorMsg;
                  }}
                  selectList={storeList}
                  component={SelectItem}
                />
                <Field
                  name="recruitName"
                  title="归属招聘员"
                  noBorder
                  canSearch
                  bottomButton
                  singleSelect
                  inPageField
                  validate={value=>{
                    let errorMsg;
                    if(value.length === 0) {
                      errorMsg = '请选择归属招聘员';
                    }
                    return errorMsg;
                  }}
                  selectList={selectStoreList}
                  component={SelectItem}
                />
                <Field
                  name="arrivalMode"
                  title="到场方式"
                  placeholder="到场方式"
                  component={Radio}
                />
                <Field
                  name="signUpTime"
                  title="录入时间"
                  disabled
                  component={FormItem}
                />
                <Field
                  name="status"
                  title="状态"
                  fieldList={params.fieldList}
                  component={ChangeStatus}
                />
                {values.jobDate && <Field
                  name="jobDate"
                  title="入职日期"
                  disabled
                  component={FormItem}
                />}
                {values.resignDate && <Field
                  name="resignDate"
                  title="离职日期"
                  disabled
                  component={FormItem}
                />}
              </View>
            </ScrollView>
            <View style={styles.btnArea}>
              <Button
                title="保 存"
                onPress={handleSubmit}
                buttonStyle={styles.buttonStyle}
                containerStyle={styles.buttonContainerStyle}
                titleStyle={styles.titleStyle}
              />
            </View>
          </View>
        )
      }}
    </Formik>
  )
};

const styles = StyleSheet.create({
  scrollArea: {
    flex: 1
  },
  buttonStyle: {
    height: 45,
    backgroundColor: '#409EFF',
    borderColor: 'transparent',
    borderWidth: 0,
    borderRadius: 30
  },
  buttonContainerStyle: {
    marginHorizontal: 8
  },
  titleStyle: {
    fontSize: 20,
    fontWeight: 'bold'
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
    marginBottom: 10,
    marginHorizontal: 32,
    marginTop: 32
  },
  btnArea: {
    justifyContent: 'center',
    marginBottom: 20
  },
  buttonStyle: {
    height: 88,
    backgroundColor: '#409EFF',
    borderColor: 'transparent',
    borderWidth: 0,
    borderRadius: 44
  },
  buttonContainerStyle: {
    marginHorizontal: 32
  },
  titleStyle: {
    fontSize: 35
  },
})

export default EditMember;