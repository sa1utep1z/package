import React, { useState, useEffect, useMemo } from 'react';
import { StyleSheet, ScrollView, View, Text, TouchableOpacity, Linking } from 'react-native';
import { Button } from '@rneui/themed';
import { Formik, Field } from 'formik';
import * as Yup from 'yup';
import { useNavigation } from '@react-navigation/native';
import { useToast } from "react-native-toast-notifications";
import Entypo from 'react-native-vector-icons/Entypo';
import FormItem from '../../../../../components/Form/FormItem';
import SelectItem from '../../../../../components/Form/SelectItem';
import SelectDate from '../../../../../components/Form/SelectDate';
import MyMembersApi from '../../../../../request/MyMembersApi';
import SelectTags from '../../../../../components/Form/SelectTags';
import { SUCCESS_CODE, ARRIVE_WAY, CHANEL_SOURCE_LIST } from '../../../../../utils/const';

let restForm;

const SignUpValidationSchema = Yup.object().shape({

});

const initialValues = {
  memberName: '',
  memberPhone: '',
  memberIdCard: '',
  from: '门店录入',
  way: [{ id: 2, title: '门店集合', value: 'unifyAssemble' }],
  store: [],
  staff: [],
  orderId: [],
  company: [],
  memberTags: [],
  orderName: '',
  orderTime: '',
};

const JoinInSignUp = (props) => {
  const navigation = useNavigation();
  const { route: { params: { msg } } } = props;
  const toast = useToast();

  const [storeList, setStoreList] = useState([]);
  const [companyList, setCompanyList] = useState([]);
  const [orderList, setOrderList] = useState([]);

  useEffect(() => {
    setFieldValue();
    getStoreList();
    getCompaniesList();
  }, [])

  const onSubmit = async (values) => {
    const notBelong = checkStore(values);
    if (notBelong) {
      toast.show('请重新选择招聘员', { type: 'warning' });
      return;
    }
    if (!values.orderId.length) {
      toast.show('请选择订单编号！', { type: 'danger' });
      return;
    }
    const params = {
      userName: msg.userName,
      mobile: msg.mobile,
      idNo: msg.idNo,
      arrivalMode: values.way[0].value === 'byHimself' ? 'FACTORY' : 'STORE',
      orderId: values.orderId[0].orderId,
      storeId: values.store[0].storeId,
      recruiterId: values.staff[0].value,
      signUpType: 'RECRUITER' // 默认渠道来源为门店录入；
    };
    try {
      const res = await MyMembersApi.SignUp(msg.poolId, params);
      if (res.code !== SUCCESS_CODE) {
        toast.show(`${res.msg}`, { type: 'danger' });
        return;
      }
      toast.show(`加入报名成功！`, { type: 'success' });
      navigation.goBack();
    } catch (err) {
      toast.show(`加入报名失败，请稍后重试`, { type: 'danger' });
    }
  };

  const getCompaniesList = async () => {
    try {
      const res = await MyMembersApi.CompaniesList();
      if (res.code !== SUCCESS_CODE) {
        toast.show(`获取企业列表失败，${res.msg}`, { type: 'danger' });
        return;
      }
      if (res.data.length) {
        res.data.forEach((item, index) => {
          item.title = item.label;
          item.id = index + 1;
        });
        setCompanyList(res.data);
      }
    } catch (err) {
      console.log('err', err);
      toast.show(`获取企业列表失败，请稍后重试`, { type: 'danger' });
    }
  };

  const getStoreList = async () => {
    try {
      const res = await MyMembersApi.StoreList();
      if (res.code !== SUCCESS_CODE) {
        toast.show(`获取门店列表失败，${res.msg}`, { type: 'danger' });
        return;
      }
      if (res.data.length) {
        res.data.forEach((item, index) => {
          item.title = item.storeName;
          item.id = index + 1;
          item.value = item.storeId;
        });
        setStoreList(res.data);
        //如果回填表单有传门店和招聘员id，就回填表单；
        if (msg.storeId && msg.recruiterId) {
          const storeName = [res.data.find(store => store.storeId === msg.storeId)];
          restForm.setFieldValue('store', storeName);
          const recruit = storeName[0].members.find(recruit => recruit.value === msg.recruiterId);
          if (recruit) {
            restForm.setFieldValue('staff', [recruit]);
            return;
          }
          restForm.setFieldValue('staff', []);
        }
      }
    } catch (err) {
      console.log('err', err);
      toast.show(`获取门店列表失败`, { type: 'danger' });
    }
  };

  const filter = async () => {
    const companyId = restForm.values.company.length ? restForm.values.company[0].value : '';
    const orderDate = restForm.values.orderTime;
    const params = { companyId, orderDate };
    if (!companyId.length) {
      toast.show('请选择意向报名企业', { type: 'warning' });
      return;
    }
    if (!orderDate.length) {
      toast.show('请选择订单日期', { type: 'warning' });
      return;
    }
    try {
      const res = await MyMembersApi.getOrderMessage(params);
      console.log('筛选的res', res);
      if (res.code !== SUCCESS_CODE) {
        toast.show(`获取订单信息失败，${res.msg}`, { type: 'danger' });
        return;
      }
      if (res.data.length) {
        res.data.forEach((item, index) => {
          item.title = item.name;
          item.id = index + 1;
          item.value = item.name;
        });
        setOrderList(res.data);
      }
      toast.show(`筛选成功，共${res.data.length}条订单`, { type: 'success' });
    } catch (err) {
      console.log('err', err);
      toast.show(`获取订单信息失败，请稍后重试`, { type: 'danger' });
    }
  };

  const setFieldValue = () => {
    if (msg) {
      restForm.setFieldValue('memberName', msg.userName);
      restForm.setFieldValue('memberPhone', msg.mobile);
      restForm.setFieldValue('memberIdCard', msg.idNo);
      restForm.setFieldValue('memberTags', msg.tags);
    }
  };

  //检查归属招聘员是否在所属门店列表里面；
  const checkStore = (values) => {
    if (values.store.length) {
      const memberList = values.store[0].members;
      if (values.staff.length) {
        const findIndex = memberList.findIndex(member => member.value === values.staff[0].value);
        if (findIndex === -1) {
          restForm.setFieldError('staff', '该门店下无该招聘员，请重新选择招聘员');
          return true;
        }
      }
    }
    return false;
  };

  const callPhone = (item) => {
    Linking.openURL(`tel:${item}`);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={SignUpValidationSchema}
      onSubmit={onSubmit}>
      {({ handleSubmit, ...rest }) => {
        restForm = rest;
        const selectStoreList = rest.values.store.length > 0 ? rest.values.store[0].members : [];
        if (selectStoreList.length > 0) {
          selectStoreList.map((item, index) => {
            item.title = item.label;
            item.id = index + 1;
          })
        }
        return (
          <View style={{ flex: 1 }}>
            <ScrollView style={styles.scrollArea}>
              <View style={[styles.cardArea, { marginTop: 28 }]}>
                <Field
                  name="memberTags"
                  title="会员标签"
                  placeholder="无"
                  onlyShow
                  component={SelectTags}
                />
                <Field
                  name="memberName"
                  title="会员姓名"
                  placeholder="无"
                  editable={false}
                  inputStyle={{ color: '#CCCCCC' }}
                  component={FormItem}
                />
                {/* <Field
                    name="memberPhone"
                    title="会员手机号"
                    placeholder="无"
                    maxLength={11}
                    editable={false}
                    inputStyle={{color: '#409EFF'}}
                    component={FormItem}
                    // onPress={() => callPhone(restForm)}
                  /> */}
                <View style={styles.phoneStyle}>
                  <Text style={styles.label}>手机号码: </Text>
                  <TouchableOpacity style={[styles.listItem_item, { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }]} onPress={() => callPhone(msg.mobile)}>
                    <Text style={[styles.listItem_text, { color: '#409EFF' }]}>{msg.mobile}</Text>
                    <Entypo name='phone' size={26} color='#409EFF' />
                  </TouchableOpacity>
                </View>
                <Field
                  name="memberIdCard"
                  title="身份证号"
                  placeholder="无"
                  editable={false}
                  inputStyle={{ color: '#CCCCCC' }}
                  component={FormItem}
                />
                <Field
                  name="from"
                  title="渠道来源"
                  editable={false}
                  inputStyle={{ color: '#CCCCCC' }}
                  component={FormItem}
                />
                <Field
                  name="way"
                  title="到厂方式"
                  noBorder
                  bottomButton
                  singleSelect
                  inPageField
                  validate={value => {
                    let errorMsg;
                    if (value.length === 0) {
                      errorMsg = '请选择到厂方式';
                    }
                    return errorMsg;
                  }}
                  selectList={ARRIVE_WAY}
                  component={SelectItem}
                />
                <Field
                  name="store"
                  title="所属门店"
                  noBorder
                  bottomButton
                  singleSelect
                  inPageField
                  canSearch
                  validate={value => {
                    let errorMsg;
                    if (value.length === 0) {
                      errorMsg = '请选择所属门店';
                    }
                    return errorMsg;
                  }}
                  selectList={storeList}
                  component={SelectItem}
                />
                <Field
                  name="staff"
                  title="归属招聘员"
                  noBorder
                  bottomButton
                  singleSelect
                  inPageField
                  validate={value => {
                    let errorMsg;
                    if (value.length === 0) {
                      errorMsg = '请选择归属招聘员';
                    }
                    return errorMsg;
                  }}
                  selectList={selectStoreList}
                  component={SelectItem}
                />
                <View style={{ paddingBottom: 20 }}>
                  <Text style={{ paddingLeft: 30, fontSize: 26, marginVertical: 5 }}>筛选</Text>
                  <View style={{ borderWidth: 1, marginHorizontal: 20, borderRadius: 8, borderColor: '#CCCCCC', flexDirection: 'row' }}>
                    <View style={{ flex: 1, borderRightWidth: 1, borderColor: '#CCCCCC' }}>
                      <Field
                        name="company"
                        title="意向报名企业"
                        noBorder
                        bottomButton
                        singleSelect
                        canSearch
                        inPageField
                        selectContainerStyle={{ paddingHorizontal: 10 }}
                        selectList={companyList}
                        component={SelectItem}
                      />
                      <Field
                        name="orderTime"
                        title="订单日期"
                        selectContainerStyle={{ paddingHorizontal: 10, borderBottomWidth: 0 }}
                        component={SelectDate}
                      />
                    </View>
                    <TouchableOpacity style={{ width: 80, justifyContent: 'center', alignItems: 'center', margin: 5, borderRadius: 6, backgroundColor: '#409EFF' }} onPress={filter}>
                      <Text style={{ color: '#fff', fontSize: 26 }}>筛选</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <Field
                  name="orderId"
                  title="订单名称"
                  noBorder
                  bottomButton
                  singleSelect
                  canSearch
                  inPageField
                  validate={value => {
                    let errorMsg;
                    if (value.length === 0) {
                      errorMsg = '请选择订单';
                    }
                    return errorMsg;
                  }}
                  selectContainerStyle={{ paddingHorizontal: 28 }}
                  selectList={orderList}
                  component={SelectItem}
                />
                {rest.values.orderId.length ? <>
                  <Field
                    name="orderName"
                    title="订单编号"
                    editable={false}
                    formValue={rest.values.orderId.length ? rest.values.orderId[0].orderNo : ''}
                    component={FormItem}
                  />
                  <View style={{ padding: 28 }}>
                    <Text style={{ fontSize: 32, color: '#333333', marginBottom: 20 }}>订单详情：</Text>
                    <Text style={{ fontSize: 32, color: '#333333', borderWidth: 1, padding: 20, borderRadius: 10, borderColor: '#999999' }}>{String(rest.values.orderId[0].orderPolicyDetail).replace(/<br\/>/g, "\n")}</Text>
                  </View>
                </> : <></>}
              </View>
            </ScrollView>
            <View style={styles.btnArea}>
              <Button
                title="保存"
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
    marginHorizontal: 8
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

export default JoinInSignUp;