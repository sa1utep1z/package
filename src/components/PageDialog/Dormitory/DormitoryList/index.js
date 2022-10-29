import React from "react";
import { ScrollView, Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { useDispatch } from "react-redux";
import { Formik, Field } from 'formik';

import WaterMark from '../../../WaterMark';
import { closeDialog } from "../../../../redux/features/PageDialog";
import HeaderSelectItem from '../../../HeaderSearchOfDormitory/HeaderSelectItem';

let restForm;
const initialValues = {
  buildingNum: []
};

const WaitToEntry = ({
}) => {
  const dispatch = useDispatch();

  const passOnPress = () => dispatch(closeDialog());

  const rejectOnPress = () => console.log('点击了拒绝！'); 

  const onSubmit = values => {
    console.log('confirm->values', values);
  };

  return (
    <Formik
    initialValues={initialValues}
    onSubmit={onSubmit}>
    {({...rest}) => {
      restForm = rest;
      return (
        <View style={styles.totalArea}>
          <View style={{flex: 1, paddingHorizontal: 30, borderWidth: 1}}>
            <Text style={{fontSize: 28, color: '#333333', marginBottom: 15}}>会员姓名：张三</Text>
            <Text selectable style={{fontSize: 28, color: '#333333', marginBottom: 15}}>会员手机号：<Text selectable style={{color: '#409EFF'}}>15390913806</Text></Text>
            <Text selectable style={{fontSize: 28, color: '#333333', marginBottom: 15}}>会员身份证号：<Text selectable style={{color: '#409EFF'}}>452123123412341234</Text></Text>
            <View style={{flex: 1, borderWidth: 1}}>
              <Field
                name="buildingNum"
                label="宿舍楼栋"
                canSearch={false}
                component={HeaderSelectItem}
              />
            </View>
          </View>
          <View style={styles.bottomArea}>
            <View style={styles.leftArea}>
              <TouchableOpacity style={styles.buttonArea} onPress={rejectOnPress}>
                <Text style={styles.closeText}>拒绝</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.rightArea}>
              <TouchableOpacity style={styles.buttonArea} onPress={passOnPress}>
                <Text style={styles.confirmText}>通过</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )
    }}
    </Formik>
  )
};

const styles = StyleSheet.create({
  totalArea: {
    height: 300
  },
  bottomArea: {
    height: 100, 
    flexDirection: 'row'
  },
  leftArea: {
    flex: 1, 
    borderTopWidth: 1, 
    borderRightWidth: 1, 
    borderColor: '#E3E3E3'
  },
  rightArea: {
    flex: 1, 
    borderTopWidth: 1, 
    borderColor: '#E3E3E3'
  },
  buttonArea: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  closeText: {
    fontSize: 28, 
    color: 'red'
  },
  confirmText: {
    fontSize: 28, 
    color: 'green'
  },
})

export default WaitToEntry;