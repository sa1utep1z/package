import React, {useEffect, useState} from "react";
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import {Button, Text} from '@rneui/themed';
import {Formik, Field} from 'formik';
import FormItem from "../../../components/Form/FormItem";

const initialValues = {
  name: '波哥@众鼎日薪',
  phone: '14569874562',
  weChat: '14569874562',
  store: '总部店',
};

const PersonalCard = () => {
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
  },[isEditing])

  const onSubmit = (values) => {
    console.log('提交了表单哇呜',values);
  }

  return (
    <Formik
      initialValues={initialValues}
      // validationSchema={SignUpValidationSchema}
      onSubmit={onSubmit}>
        {({handleSubmit}) => (
          <>
            <View style={{flex: 1}}>
              <View style={[styles.cardArea, {marginTop: 10}]}>
                <Field
                  name="name"
                  title="姓名"
                  labelAreaStyle={styles.labelAreaStyle}
                  inputStyle={styles.inputStyle}
                  editable={isEditing}
                  component={FormItem}
                />
                <Field
                  name="phone"
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
                <Field
                  name="store"
                  title="门店"
                  containerStyle={{borderBottomWidth: 0}}
                  labelAreaStyle={styles.labelAreaStyle}
                  inputStyle={styles.inputStyle}
                  editable={false}
                  component={FormItem}
                />
              </View>
            </View>
            {isEditing && (
              <>
                <View style={styles.btnArea}>
                  <Button
                    title="保 存"
                    onPress={handleSubmit}
                    buttonStyle={styles.buttonStyle}
                    containerStyle={styles.buttonContainerStyle}
                    titleStyle={styles.titleStyle}
                  />
                </View>
              </>
            )}
          </>
        )}
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
    margin: 10
  },
  btnArea: {
    height: 70, 
    justifyContent: 'center'
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
  headRightText: {
    color: '#409EFF', 
    marginRight: 20, 
    fontSize: 16
  },
  labelAreaStyle: {
    justifyContent: 'flex-start'
  },
  inputStyle: {
    textAlign: 'right'
  }
});

export default PersonalCard;