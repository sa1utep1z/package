import React, {useEffect, useState} from "react";
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import {Button, Text} from '@rneui/themed';
import {Formik, Field} from 'formik';
import { useToast } from "react-native-toast-notifications";

import FormItem from "../../../components/Form/FormItem";
import MineApi from "../../../request/MineApi";
import { SUCCESS_CODE } from "../../../utils/const";

let restForm;
const initialValues = {
  name: '',
  phone: '',
  weChat: ''
};

const PersonalCard = () => {
  const toast = useToast();
  const navigation = useNavigation();

  const [isEditing, setIsEditing] = useState(false);

  useEffect(()=>{
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
          <Text style={[styles.headRightText, isEditing && {color: '#CCCCCC'}]}>{isEditing ? '取消编辑' : '编辑'}</Text>
        </TouchableOpacity>
      )
    })
    getMessage();
  },[isEditing])

  const getMessage = async() => {
    try{
      const res = await MineApi.QueryOutsideCard();
      if(res?.code !== SUCCESS_CODE){
        toast.show(`${res?.msg}`, {type: 'danger'});
        return;
      }
      setFormValue(res.data);
    }catch(err){
      toast.show(`出现了意料之外的问题，请联系系统管理员处理`, { type: 'danger' });
    }
  };

  const setFormValue = (data) => {
    const values = {
      name: data.name,
      contractMobile: data.contractMobile || '无',
      weChat: data.weChat || '无'
    }
    restForm.setValues(values);
  };

  const onSubmit = (values) => {
    const params = {
      name: values.name,
      contractMobile: values.contractMobile === '无'? '' : values.contractMobile, 
      weChat: values.weChat === '无' ? '' : values.weChat
    };
    sendMessage(params);
  };

  const sendMessage = async(params) => {
    try{
      const res = await MineApi.JoinOutsideCard(params);
      if(res?.code !== SUCCESS_CODE){
        toast.show(`${res?.msg}`, {type: 'danger'});
        return;
      }
      toast.show(`修改成功！`, {type: 'success'});
      setIsEditing(false);
    }catch(err){
      toast.show(`出现了意料之外的问题，请联系系统管理员处理`, { type: 'danger' });
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      // validationSchema={SignUpValidationSchema}
      onSubmit={onSubmit}>
        {({handleSubmit, ...rest}) => {
          restForm = rest;
          return (
          <>
            <View style={{flex: 1}}>
              <View style={[styles.cardArea]}>
                <Field
                  name="name"
                  title="姓名"
                  labelAreaStyle={styles.labelAreaStyle}
                  inputStyle={styles.inputStyle}
                  editable={isEditing}
                  component={FormItem}
                />
                <Field
                  name="contractMobile"
                  title="手机号"
                  labelAreaStyle={styles.labelAreaStyle}
                  inputStyle={styles.inputStyle}
                  editable={false}
                  component={FormItem}
                />
                <Field
                  name="weChat"
                  title="微信号"
                  labelAreaStyle={styles.labelAreaStyle}
                  inputStyle={styles.inputStyle}
                  editable={false}
                  component={FormItem}
                />
              </View>
            </View>
            {isEditing && (
              <Button
                title="保 存"
                onPress={handleSubmit}
                buttonStyle={styles.buttonStyle}
                containerStyle={styles.buttonContainerStyle}
                titleStyle={styles.titleStyle}
              />
            )}
          </>
        )}}
    </Formik>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1
  },
  cardArea: {
    backgroundColor: '#fff', 
    borderRadius: 8, 
    margin: 28
  },
  buttonStyle: {
    height: 80,
    backgroundColor: '#409EFF',
    borderColor: 'transparent',
    borderWidth: 0,
    borderRadius: 50
  },
  buttonContainerStyle: {
    marginHorizontal: 28,
    marginBottom: 28
  },
  titleStyle: {
    fontSize: 34,
    fontWeight: 'bold'
  },
  headRightText: {
    color: '#409EFF', 
    marginRight: 20, 
    fontSize: 32
  },
  labelAreaStyle: {
    justifyContent: 'flex-start'
  },
  inputStyle: {
    textAlign: 'right',
    paddingRight: 20
  }
});

export default PersonalCard;