import React, {useState, useEffect, Children} from "react";
import { View, StyleSheet, Text, TouchableOpacity, TextInput } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Formik, Field, useFormik } from 'formik';
import * as Yup from 'yup';
import { Shadow } from 'react-native-shadow-2';
import { TabView, TabBar } from 'react-native-tab-view';

import SingleInput from "../../../../../../components/OrderForm/SingleInput";
import OrderRangeInput from "../../../../../../components/OrderForm/OrderRangeInput";
import SingleSelect from "../../../../../../components/OrderForm/SingleSelect";
import LittleSingleSelect from "../../../../../../components/OrderForm/LittleSingleSelect";
import LittleSingleInput from "../../../../../../components/OrderForm/LittleSingleInput";
import RadioSelect from "../../../../../../components/OrderForm/RadioSelect";
import OrderRangeDate from "../../../../../../components/OrderForm/OrderRangeDate";
import SelectPhotos from "../../../../../../components/OrderForm/SelectPhotos";
import LittleSingleDate from "../../../../../../components/OrderForm/LittleSingleDate";
import TabSelectItem from "../../../../../../components/OrderForm/TabSelectItem";
import MyMembersApi from "../../../../../../request/MyMembersApi";
import { SALARY_TYPE, FOOD_LIST, DORMITORY_LIST, WATER_FEE_LIST, MODE_LIST, MALE_OR_FEMALE, MEMBER_FEE_MODE, FEE_WAY_MODE } from "../../../../../../utils/const";
import SettlementRules from "./SettlementRules";
import { deepCopy } from "../../../../../../utils";

let restForm;
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
  littleProgramSalaryDetail: '',
  food: [],
  dormitory: [],
  water_fee: [],
  commercial: '',
  social: '',
  leave_self: '',
  induction: '',
  remark: '',
  orderRangeDate1: {
    startDate: '',
    endDate: ''
  },
  mode1: [],
  wagesAndSalary1: {
    value: [{ label: '不区分男女', value: 'NOT_DISTINGUISH' }],
    children: {
      fee_mode: {
        value: [{ label: '纯', value: 'PURE' }],
        children: {
          pure: {
            mode: [{ label: '工价', value: 'WORK_FEE' }],
            value: ''
          },
          working: {
            time: '',
            mode1: {
              mode: [{ label: '工价', value: 'WORK_FEE' }],
              value: ''
            },
            mode2: {
              mode: [{ label: '工价', value: 'WORK_FEE' }],
              value: ''
            }
          },
          card_day: {
            value: '',
            mode1: {
              mode: [{ label: '工价', value: 'WORK_FEE' }],
              value: ''
            },
            mode2: {
              mode: [{ label: '工价', value: 'WORK_FEE' }],
              value: ''
            }
          },
          card_hour: {
            value: '',
            mode1: {
              mode: [{ label: '工价', value: 'WORK_FEE' }],
              value: ''
            },
            mode2: {
              mode: [{ label: '工价', value: 'WORK_FEE' }],
              value: ''
            }
          },
          working_day: {
            value: '',
            mode1: {
              mode: [{ label: '工价', value: 'WORK_FEE' }],
              value: ''
            },
            mode2: {
              mode: [{ label: '工价', value: 'WORK_FEE' }],
              value: ''
            }
          },
          working_hour: {
            value: '',
            mode1: {
              mode: [{ label: '工价', value: 'WORK_FEE' }],
              value: ''
            },
            mode2: {
              mode: [{ label: '工价', value: 'WORK_FEE' }],
              value: ''
            }
          }
        }
      }
    }
  }
};

const WagesDetail = () => {
  const [showDetail, setShowDetail] = useState(true);


  const detailOnPress = () => setShowDetail(!showDetail);




  const onSubmit = async (values) => {
    console.log('提交表单', values)
  };

  return (
    <View style={{marginTop: 20}}>
      <TouchableOpacity style={styles.touchArea} onPress={detailOnPress}>
        <Text style={[styles.title, showDetail && styles.boldText]}>会员工价详情</Text>
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
          onSubmit={onSubmit}>
          {({values, handleSubmit, ...rest }) => {
            restForm = rest;
            restForm.values = values;
            console.log('rest', rest);
            return (
              <View style={{ flex: 1, paddingHorizontal: 28}}>
                <View style={{flex: 1, flexDirection: 'row'}}>
                  <Field
                    name="littleProgramSalaryDetail"
                    label="工价详情"
                    placeholder="请输入工价详情文本"
                    maxLength={200}
                    multiline
                    lengthLimit
                    inputContainerStyle={{minHeight: 120, alignItems: 'flex-start'}}
                    component={SingleInput}
                  />
                  <TouchableOpacity style={{backgroundColor: '#409EFF', height: 60, paddingHorizontal: 18, justifyContent: 'center', marginLeft: 20, borderRadius: 6}} onPress={handleSubmit}>
                    <Text style={{fontSize: 28, color: '#fff', fontWeight: 'bold'}}>保存</Text>
                  </TouchableOpacity>
                </View>
                <Field
                  name="job"
                  label="借支类型"
                  radioList={SALARY_TYPE}
                  component={RadioSelect}
                />
                {values.job.length && values.job[0].value !== 'NoDEBIT' ? <Field
                  name="requireNumber"
                  label="借支金额"
                  selectTextOnFocus
                  keyboardType="numeric"
                  maxLength={4}
                  component={SingleInput}
                  inputRightComponent={<Text style={{height: 60, textAlignVertical: 'center', fontSize: 26, color: '#333333'}}>{values.job[0].value === 'DAILY' ? '元/天' : values.job[0].value === 'WEEKLY' ? '周/天' : '月/天'}</Text>}
                /> : <></>}
                <Field  
                  name='food'
                  label="就餐"
                  selectList={FOOD_LIST}
                  component={SingleSelect}
                />
                <Field  
                  name='dormitory'
                  label="住宿"
                  selectList={DORMITORY_LIST}
                  component={SingleSelect}
                />
                <Field  
                  name='water_fee'
                  label="水电费"
                  selectList={WATER_FEE_LIST}
                  component={SingleSelect}
                />
                <Field
                  name="commercial"
                  label="购买商保"
                  placeholder="请输入商保文本"
                  maxLength={200}
                  multiline
                  lengthLimit
                  selectTextOnFocus
                  inputContainerStyle={{minHeight: 100, alignItems: 'flex-start'}}
                  labelStyle={{width: 170}}
                  component={SingleInput}
                />
                <Field
                  name="social"
                  label="购买社保"
                  placeholder="请输入社保文本"
                  maxLength={200}
                  multiline
                  lengthLimit
                  selectTextOnFocus
                  inputContainerStyle={{minHeight: 100, alignItems: 'flex-start'}}
                  labelStyle={{width: 170}}
                  component={SingleInput}
                />
                <Field
                  name="leave_self"
                  label="自离薪资"
                  placeholder="请输入自离薪资文本"
                  maxLength={200}
                  multiline
                  lengthLimit
                  selectTextOnFocus
                  inputContainerStyle={{minHeight: 100, alignItems: 'flex-start'}}
                  labelStyle={{width: 170}}
                  component={SingleInput}
                />
                <Field
                  name="induction"
                  label="会员入职奖"
                  placeholder="请输入会员入职奖文本"
                  maxLength={200}
                  multiline
                  lengthLimit
                  selectTextOnFocus
                  inputContainerStyle={{minHeight: 100, alignItems: 'flex-start'}}
                  labelStyle={{width: 170}}
                  component={SingleInput}
                />
                <Field
                  name="remark"
                  label="备注说明"
                  placeholder="请输入备注说明文本"
                  maxLength={200}
                  multiline
                  lengthLimit
                  selectTextOnFocus
                  inputContainerStyle={{minHeight: 100, alignItems: 'flex-start'}}
                  labelStyle={{width: 170}}
                  component={SingleInput}
                />
                <Text style={{fontSize: 22, color: 'red', textAlign: 'center'}}>请注意月初和月底跨月招聘时，适用日期要合理设置，避免工价异常！</Text>
                <View>
                  <Text style={styles.labelText}>会员结算规则：</Text>
                  {/* 结算规则组件 */}
                  <SettlementRules
                    values={values}
                    restForm={restForm}
                    initialValues={initialValues}
                  />
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
    fontSize: 26,
    color: '#333333'
  },
  tabBarStyle: {
    height: 60,
    backgroundColor: '#fff'
  },
  tabBarIndicatorStyle: {
    backgroundColor: '#409EFF' 
  }
});

export default WagesDetail;