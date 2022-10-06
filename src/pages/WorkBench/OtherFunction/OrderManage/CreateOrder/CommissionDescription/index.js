import React, {useState, useEffect} from "react";
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Formik, Field } from 'formik';
import * as Yup from 'yup';
import { Shadow } from 'react-native-shadow-2';

import SingleInput from "../../../../../../components/OrderForm/SingleInput";
import OrderRangeInput from "../../../../../../components/OrderForm/OrderRangeInput";
import SingleSelect from "../../../../../../components/OrderForm/SingleSelect";
import RadioSelect from "../../../../../../components/OrderForm/RadioSelect";
import OrderRangeDate from "../../../../../../components/OrderForm/OrderRangeDate";
import SelectPhotos from "../../../../../../components/OrderForm/SelectPhotos";
import OrderSingleDate from "../../../../../../components/OrderForm/OrderSingleDate";
import MyMembersApi from "../../../../../../request/MyMembersApi";
import { SUCCESS_CODE, CONDITIONS_LIST, REWARD_MODE } from "../../../../../../utils/const";
import { deepCopy } from "../../../../../../utils";

const validationSchema = Yup.object().shape({
  orderName: Yup.string().required('请输入订单名称'),
  factory: Yup.array().min(1, '请选择用工企业'),
  job: Yup.array().min(1, '请选择岗位'),
  jobType: Yup.array().min(1, '请选择工种'),
  orderRangeDate: Yup.object({
    startDate: Yup.string().required('请选择订单开始日期'),
    endDate: Yup.string().required('请选择订单结束日期')
  }),
  orderDuration: Yup.string().required('请选择订单工期'),
  jobOrder: Yup.string().required('请输入职位顺序'),
  complexSalary: Yup.object({
    start: Yup.string().required('请输入起始薪资'),
    end: Yup.string().required('请输入结束薪资')
  }),
  pictureList: Yup.array().min(1, '请选择职位展示图片'),
  littleProgramTitle: Yup.string().required('请输入小程序职位标题'),
  littleProgramSalaryDetail: Yup.string().required('请输入小程序薪资详情文本'),
});

const initialValues = {
  orderName: '',
  factory: [],
  jobOrder: '',
  job: [],
  jobType: [],
  orderRangeDate: {
    startDate: '',
    endDate: ''
  },
  orderDuration: '',
  complexSalary: {
    start: '',
    end: ''
  },
  pictureList: [],
  littleProgramTitle: '',
  littleProgramSalaryDetail: ''
};

const CommissionDescription = () => {
  const [showDetail, setShowDetail] = useState(true);
  const [companyList, setCompanyList] = useState([]);
  const [rulesList, setRulesList] = useState([{
    name: 1,
    age: 2
  }]);

  useEffect(() => {
    getFactoryList();
  }, [])

  const getFactoryList = async() => {
    try {
      const res = await MyMembersApi.CompaniesList();
      console.log('res', res)
      if(res.code !== SUCCESS_CODE){
        toast.show(`获取企业列表失败，${res.msg}`, { type: 'danger' });
        return;
      }
      setCompanyList(res.data);
    } catch (error) {
      console.log('error', error);
    }
  };

  const detailOnPress = () => setShowDetail(!showDetail);

  const onSubmit = async (values) => {
    console.log('提交表单', values)
  };

  const deleteRule = (rule) => {
    const copyList = deepCopy(rulesList);
    const findRuleIndex = rulesList.findIndex(item => item.name === rule.name);
    copyList.splice(findRuleIndex, 1);
    setRulesList(copyList);
  };

  const addRule = () => {
    const copyList = deepCopy(rulesList);
    copyList.push({
      name: rulesList.length + 1,
      age: rulesList.length + 2
    });
    setRulesList(copyList);
  };

  return (
    <View style={{marginTop: 20}}>
      <TouchableOpacity style={styles.touchArea} onPress={detailOnPress}>
        <Text style={[styles.title, showDetail && styles.boldText]}>招聘员提成说明</Text>
        <AntDesign
          name={showDetail ? 'down' : 'up'}
          size={36}
          color={showDetail ? '#000000' : '#999999'}
        />
      </TouchableOpacity>
      {showDetail && <View style={{backgroundColor: '#ffffff', borderTopWidth: 1, borderTopColor: '#999999', paddingTop: 20}}>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          handleChange={(e) => console.log('e', e)}
          onSubmit={onSubmit}>
          {({ handleSubmit, ...rest }) => {
            console.log('rest', rest);
            return (
              <View style={{ flex: 1, paddingHorizontal: 28}}>
                <View style={{flex: 1, flexDirection: 'row'}}>
                  <View style={{flex: 1}}>
                    <Field
                      name="jobType"
                      label="提成模式"
                      radioList={REWARD_MODE}
                      component={RadioSelect}
                    />
                  </View>
                  <TouchableOpacity style={{backgroundColor: '#409EFF', height: 60, paddingHorizontal: 18, justifyContent: 'center', marginLeft: 20, borderRadius: 6}} onPress={handleSubmit}>
                    <Text style={{fontSize: 28, color: '#fff', fontWeight: 'bold'}}>保存</Text>
                  </TouchableOpacity>
                </View>
                <View>
                  <Text style={styles.labelText}>提成规则详情：</Text>
                  <View style={{marginTop: 10}}>
                    {rulesList.map((rule, ruleIndex) => {

                      return (
                        <Shadow key={ruleIndex} style={{width: '100%', marginBottom: 30}}>
                          <View style={{borderRadius: 10}}>
                            <View style={{height: 60, backgroundColor: '#EFEFEF', justifyContent: 'center', borderTopRightRadius: 10, borderTopLeftRadius: 10}}>
                              {rulesList.length !== 1 && <TouchableOpacity style={{width: 60, height: 60, position: 'absolute', zIndex: 999, justifyContent: 'center', alignItems: 'center'}} onPress={()=>deleteRule(rule)}>
                                <AntDesign
                                  name='delete'
                                  size={36}
                                  color='#ff6666'
                                />
                              </TouchableOpacity>}
                              <Text style={{fontSize: 28, fontWeight: 'bold', textAlign: 'center'}}>{`适用门店${ruleIndex + 1}`}</Text>
                              {rulesList.length !== 5 && <TouchableOpacity style={{width: 60, height: 60, position: 'absolute', zIndex: 999, right: 0, justifyContent: 'center', alignItems: 'center'}} onPress={addRule}>
                                <AntDesign
                                  name='pluscircleo'
                                  size={36}
                                  color='#409EFF'
                                />
                              </TouchableOpacity>}
                            </View>
                            <View style={{flex: 1, padding: 20}}>
                              <Field
                                name="orderRangeDate"
                                label="订单日期"
                                component={OrderRangeDate}
                              />
                              <Field  
                                name="factory"
                                label="用工企业"
                                selectList={companyList}
                                component={SingleSelect}
                              />
                              <View style={{flex: 1, flexDirection: 'row'}}>
                                <View style={{flex: 1}}>
                                  <Field
                                    name="jobType"
                                    label="条件设置"
                                    radioList={CONDITIONS_LIST}
                                    component={RadioSelect}
                                  />
                                </View>
                                <View style={{width: 110, marginLeft: 10}}>
                                  <Field
                                    name="orderName"
                                    placeholder="天数"
                                    maxLength={2}
                                    showLabel={false}
                                    keyboardType="numeric"
                                    selectTextOnFocus
                                    component={SingleInput}
                                  />
                                </View>
                                <View style={{width: 40, height: 60, justifyContent: 'center', alignItems: 'center', backgroundColor: '#409EFF', borderRadius: 6, marginLeft: 10}}>
                                  <Text style={{fontSize: 28, color: '#ffffff'}}>天</Text>
                                </View>
                              </View>
                            </View>
                          </View>
                        </Shadow>
                      )})}
                  </View>
                </View>
              </View>
            )
          }}
        </Formik>
      </View>}
    </View>
  )
};

const styles = StyleSheet.create({
  touchArea: {
    height: 94, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    backgroundColor: '#ffffff', 
    paddingHorizontal: 30, 
    alignItems: 'center'
  },
  title: {
    fontSize: 32, 
    color: '#000000'
  },
  boldText: {
    fontWeight: 'bold'
  },
  labelText: {
    height: 60,
    textAlignVertical: 'center',
    minWidth: 150,
    fontSize: 28,
    color: '#333333'
  },
});

export default CommissionDescription;