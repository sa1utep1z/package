import React, {useState} from "react";
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Formik, Field } from 'formik';
import * as Yup from 'yup';

import SingleInput from "../../../../../../components/OrderForm/SingleInput";
import OrderRangeInput from "../../../../../../components/OrderForm/OrderRangeInput";
import RadioSelect from "../../../../../../components/OrderForm/RadioSelect";
import { FEMALE_LIMIT } from "../../../../../../utils/const";

const validationSchema = Yup.object().shape({
  requireNumber: Yup.string().required('请输入需求人数'),
  sex: Yup.array().min(1, '请选择性别'),
  male_age_limit: Yup.object({
    start: Yup.string().required('请输入起始年龄（男）'),
    end: Yup.string().required('请输入结束年龄（男）')
  }),
  female_age_limit: Yup.object({
    start: Yup.string().required('请输入起始年龄（女）'),
    end: Yup.string().required('请输入结束年龄（女）')
  })
});

const initialValues = {
  requireNumber: '',
  sex: [],
  male: '',
  female: '',
  male_age_limit: {
    start: '',
    end: ''
  },
  female_age_limit: {
    start: '',
    end: ''
  }
};

const Requirement = () => {
  const [showDetail, setShowDetail] = useState(true);

  const detailOnPress = () => setShowDetail(!showDetail);

  const onSubmit = (values) => {
    console.log('提交表单', values)
  };

  return (
    <View style={{marginTop: 20}}>
      <TouchableOpacity style={styles.touchArea} onPress={detailOnPress}>
        <Text style={[styles.title, showDetail && styles.boldText]}>录用要求</Text>
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
          return (
            <View style={{ flex: 1, paddingHorizontal: 28}}>
              <View style={{flex: 1, flexDirection: 'row'}}>
                <Field
                  name="requireNumber"
                  label="需求人数"
                  maxLength={4}
                  component={SingleInput}
                  inputRightComponent={<Text style={{height: 60, textAlignVertical: 'center', fontSize: 26, color: '#333333'}}>人</Text>}
                  selectTextOnFocus
                />
                <TouchableOpacity style={{backgroundColor: '#409EFF', height: 60, paddingHorizontal: 18, justifyContent: 'center', marginLeft: 20, borderRadius: 6}} onPress={handleSubmit}>
                  <Text style={{fontSize: 28, color: '#fff', fontWeight: 'bold'}}>保存</Text>
                </TouchableOpacity>
              </View>
              <Field
                name="sex"
                label="性别"
                radioList={FEMALE_LIMIT}
                validate={value => {
                  let errMsg = '';
                  if(value.length){
                    if(value[0].value === 'LIMIT' && values.requireNumber.length === 0){
                      return errMsg = '请先输入需求人数';
                    }
                  }
                  return errMsg;
                }}
                component={RadioSelect}
              />
              {values.sex.length && values.sex[0].value === 'LIMIT' ? <View style={{flex: 1, flexDirection: 'row'}}>
                <Field
                  name="male"
                  label="比例（男）"
                  keyboardType="numeric"
                  multiline={false}
                  numberOfLines={1}
                  validate={value => {
                    let errMsg = '';
                    if(Number(value) > Number(values.requireNumber)){
                      errMsg = '不能大于需求人数';
                    }
                    return errMsg;
                  }}
                  component={SingleInput}
                />
                <View style={{width: 20}}></View>
                <Field
                  name="female"
                  label="比例（女）"
                  keyboardType="numeric"
                  multiline={false}
                  numberOfLines={1}
                  validate={value => {
                    let errMsg = '';
                    if(Number(value) > Number(values.requireNumber)){
                      return errMsg = '不能大于需求人数';
                    }
                    return errMsg;
                  }}
                  component={SingleInput}
                />
              </View> : <></>}
              <Field
                name="male_age_limit"
                label="年龄（男）"
                keyboardType="numeric"
                maxLength={2}
                inputRightComponent={<Text style={{height: 60, textAlignVertical: 'center', fontSize: 26, color: '#333333'}}>岁</Text>}
                component={OrderRangeInput}
                placeholder={{
                  start: '起始年龄',
                  end: '结束年龄'
                }}
              />
              <Field
                name="female_age_limit"
                label="年龄（女）"
                keyboardType="numeric"
                maxLength={2}
                inputRightComponent={<Text style={{height: 60, textAlignVertical: 'center', fontSize: 26, color: '#333333'}}>岁</Text>}
                component={OrderRangeInput}
                placeholder={{
                  start: '起始年龄',
                  end: '结束年龄'
                }}
              />
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
  }
});

export default Requirement;