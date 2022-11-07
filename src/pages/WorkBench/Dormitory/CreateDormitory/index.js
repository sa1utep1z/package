import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Shadow } from 'react-native-shadow-2';
import { Formik, Field } from 'formik';
import Entypo from 'react-native-vector-icons/Entypo';

import SingleInput from "../../../../components/OrderForm/SingleInput";

let restForm;
const initialValues = {
  memberName: '',
  memberPhone: '',
  memberIdCard: '',
  memberFrom: '',
};
const CreateDormitory = () => {

  const onSubmit = () => {
    console.log('提交了表单');
  };

  return (
    <Formik
    initialValues={initialValues}
    // validationSchema={validationSchema}
    onSubmit={onSubmit}>
    {({...rest }) => {
      restForm = rest;
      return (
        <View style={styles.screen}>
          <Shadow style={styles.shadowArea}>
            <View style={styles.content}>
              <View style={styles.titleArea}>
                <Text style={styles.titleText}>会员信息</Text>
              </View>
              <View style={styles.shadowContent}>
                <View style={{flex: 1}}>
                  <View style={{height: 60, marginBottom: 20}}>
                    <Field
                      name="memberName"
                      label="会员姓名"
                      selectTextOnFocus
                      isRequire
                      component={SingleInput}
                    />
                  </View>
                  <View style={{height: 60, marginBottom: 20}}>
                    <Field
                      name="memberPhone"
                      label="会员手机号"
                      selectTextOnFocus
                      isRequire
                      component={SingleInput}
                    />
                  </View>
                  <View style={{height: 60, marginBottom: 20}}>
                    <Field
                      name="memberIdCard"
                      label="会员身份证号"
                      selectTextOnFocus
                      isRequire
                      component={SingleInput}
                    />
                  </View>
                  <View style={{height: 60}}>
                    <Field
                      name="memberFrom"
                      label="籍贯"
                      selectTextOnFocus
                      isRequire
                      component={SingleInput}
                    />
                  </View>
                </View>
                <TouchableOpacity style={{marginLeft: 20, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 10, borderRadius: 8, backgroundColor: '#409EFF'}}>
                  <Entypo name="camera" size={32} color="#FFFFFF"/>
                  <Text style={{fontSize: 30, fontWeight: 'bold', color: '#FFFFFF'}}>OCR</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Shadow>
          <Shadow style={styles.shadowArea}>
            <View style={styles.content}>
              <View style={styles.titleArea}>
                <Text style={styles.titleText}>报名信息</Text>
              </View>
              <View style={styles.shadowContent}>

              </View>
            </View>
          </Shadow>
          <Shadow style={styles.shadowArea}>
            <View style={styles.content}>
              <View style={styles.titleArea}>
                <Text style={styles.titleText}>住宿信息</Text>
              </View>
              <View style={styles.shadowContent}>

              </View>
            </View>
          </Shadow>
        </View>
      )
    }}
  </Formik>
    
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30
  },
  shadowArea: {
    width: '100%',
    marginBottom: 30
  },
  content: {
    borderRadius: 10
  },
  titleArea: {
    height: 60, 
    backgroundColor: '#EFEFEF', 
    justifyContent: 'center', 
    borderTopRightRadius: 10, 
    borderTopLeftRadius: 10
  },
  titleText: {
    fontSize: 28, 
    fontWeight: 'bold', 
    textAlign: 'center'
  },
  shadowContent: {
    backgroundColor: '#FFFFFF', 
    borderBottomLeftRadius: 10, 
    borderBottomRightRadius: 10,
    padding: 20,
    flexDirection: 'row'
  }
});

export default CreateDormitory;