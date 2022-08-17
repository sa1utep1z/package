import React, {useEffect} from 'react';
import {StyleSheet, ScrollView, View, Text} from 'react-native';
import {Button} from '@rneui/themed';
import {Formik, Field} from 'formik';
import * as Yup from 'yup';
import { useNavigation } from '@react-navigation/native';
import { useToast } from "react-native-toast-notifications";
import moment from 'moment';

import FormItem from '../../../../../components/Form/FormItem';
import MyMembersApi from '../../../../../request/MyMembersApi';
import { SEAS_SOURCE_TYPE, SUCCESS_CODE } from '../../../../../utils/const';
import { IDCard } from '../../../../../utils/validate';

let restForm;

const SignUpValidationSchema = Yup.object().shape({
  userName: Yup.string().max(5, '姓名不能超过5个字符').required('请输入姓名'),
  mobile: Yup.string().required('请输入会员手机号'),
  idNo: Yup.string().required('请输入身份证').matches(IDCard, '请输入正确的身份证号')
});

const initialValues = {
  userName: '',
  mobile: '',
  idNo: '',
  nation: '',
  hometown: '',
  sourceType: '',
  registerDate: '',
  recruiterName: '',
  storeName: ''
};

const JoinInSignUp = (props) => {
  const navigation = useNavigation();
  const {route: {params: {msg, poolId, refresh}}} = props;
  const toast = useToast();

  useEffect(()=>{
    setFieldValue();
  },[])

  const onSubmit = async(values) => {
    const params = {
      userName: values.userName,
      mobile: values.mobile,
      nation: values.nation,
      idNo: values.idNo,
      hometown: values.hometown
    };
    try{  
      const res = await MyMembersApi.EditMemberDetail(poolId, params);
      console.log('res', res);
      if(res.code !== SUCCESS_CODE){
        toast.show(`${res.msg}`, { type: 'danger' });
        return;
      }
      toast.show(`修改会员信息成功`, { type: 'success' });
      navigation.goBack();
      refresh && refresh();
    }catch(err){
      console.log('err', err);
      toast.show(`出现了意料之外的问题，请联系系统管理员处理`, { type: 'danger' });
    }
  };

  const setFieldValue = () => {
    if(msg){
      restForm.setValues({
        ...msg, 
        userName: msg.userName || '',
        mobile: msg.mobile || '',
        idNo: msg.idNo || '',
        sourceType: SEAS_SOURCE_TYPE[msg.sourceType], 
        registerDate: moment(msg.registerDate).format('YYYY-MM-DD'), 
        recruiterName: msg.recruiterName || '无', 
        storeName: msg.storeName || '无'
      });
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={SignUpValidationSchema}
      onSubmit={onSubmit}>
        {({handleSubmit, ...rest}) => {
          restForm = rest;
          return (
            <View style={{flex: 1}}>
              <ScrollView style={styles.scrollArea}>
                <View style={[styles.cardArea, {marginTop: 28}]}>
                  <Field
                    name="userName"
                    title="姓名"
                    placeholder="请补充填入姓名"
                    editable={!msg.userName}
                    component={FormItem}
                  />
                  <Field
                    name="mobile"
                    title="手机号"
                    placeholder="请补充填入手机号"
                    maxLength={11}
                    editable={!msg.mobile}
                    component={FormItem}
                  />
                  <Field
                    name="idNo"
                    title="身份证号"
                    maxLength={18}
                    placeholder="请补充填入身份证号"
                    editable={!msg.idNo}
                    component={FormItem}
                  />
                  {rest.values.idNo && rest.values.idNo.length === 18 && <>
                    <View style={styles.otherItem}>
                      <Text style={styles.item}>性别：</Text>
                      <Text style={styles.item}>{rest.values.idNo[rest.values.idNo.length - 2] % 2 === 0 ? '女' : '男'}</Text>
                    </View>
                    <View style={styles.otherItem}>
                      <Text style={styles.item}>年龄：</Text>
                      <Text style={styles.item}>{`${moment().year() - rest.values.idNo.substring(6, 10)}岁`}</Text>
                    </View>
                    <View style={styles.otherItem}>
                      <Text style={styles.item}>生日：</Text>
                      <Text style={styles.item}>{`${rest.values.idNo.substring(10, 12)}月${rest.values.idNo.substring(12, 14)}日`}</Text>
                    </View>
                  </>}
                  <Field
                    name="nation"
                    title="民族"
                    component={FormItem}
                  />
                  <Field
                    name="hometown"
                    title="籍贯"
                    component={FormItem}
                  />
                  <Field
                    name="sourceType"
                    title="来源"
                    editable={false}
                    component={FormItem}
                  />
                  <Field
                    name="registerDate"
                    title="注册时间"
                    editable={false}
                    component={FormItem}
                  />
                  <Field
                    name="storeName"
                    title="归属门店"
                    editable={false}
                    component={FormItem}
                  />
                  <Field
                    name="recruiterName"
                    title="归属招聘员"
                    editable={false}
                    component={FormItem}
                  />
                </View>
              </ScrollView>
              <Button
                title="保存"
                onPress={handleSubmit}
                buttonStyle={styles.buttonStyle}
                containerStyle={styles.buttonContainerStyle}
                titleStyle={styles.titleStyle}
              />
            </View>
        )}}
    </Formik>
  )
}

const styles = StyleSheet.create({
  scrollArea: {
    flex: 1, 
    paddingHorizontal: 28
  },
  buttonStyle: {
    height: 88,
    backgroundColor: '#409EFF',
    borderColor: 'transparent',
    borderWidth: 0,
    borderRadius: 44
  },
  buttonContainerStyle: {
    margin: 28
  },
  titleStyle: {
    fontSize: 28,
    fontWeight: 'bold'
  },
  theWayToGo: {
    color: '#000', 
    fontSize: 15, 
    fontWeight: 'bold', 
    marginLeft: 10,
    marginBottom: 10
  },
  btnArea: {
    justifyContent: 'center',
    paddingHorizontal: 28,
    marginBottom: 20
  },
  cardArea: {
    backgroundColor: '#fff', 
    borderRadius: 8,
    marginBottom: 10
  },
  otherItem: {
    height: 91, 
    flexDirection: 'row', 
    borderBottomWidth: 2, 
    borderBottomColor: 'rgba(0, 0, 0, .05)', 
    alignItems: 'center', 
    paddingLeft: 28
  },
  item: {
    fontSize: 32, 
    color: '#333333'
  }
});

export default JoinInSignUp;