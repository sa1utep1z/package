import React, {useState, useRef, useImperativeHandle, forwardRef} from "react";
import { ScrollView, Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { Formik, Field } from 'formik';
import moment from 'moment';
import { Shadow } from 'react-native-shadow-2';

import { DORMITORY_LEAVE_REASON } from "../../../../../../utils/const";
import SelectTimeOfFilterMore from '../../../../../HeaderSearchOfDormitory/FilterMore/SelectTimeOfFilterMore';

let restForm;
const initialValues = {
  leaveDate: moment().format('YYYY-MM-DD')
};

const Leave = ({}, ref) => {
  const scrollViewRef = useRef(null);

  const [selectReason, setSelectReason] = useState('');
  const [reasonWrong, setReasonWrong] = useState(false);

  useImperativeHandle(ref, () => {
    return { scrollViewRef, selectReason, setReasonWrong };
  }, [selectReason]);

  const onSubmit = (values) => {
    console.log('提交', values);
  };

  const reasonOnPress = (reason) => {
    setSelectReason(reason);
    reasonWrong && setReasonWrong(false);
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}>
      {({...rest}) => {
        restForm = rest;
        return (
          <ScrollView ref={scrollViewRef} showsVerticalScrollIndicator={false}>
            <View style={{padding: 20, paddingBottom: 0}}>
              <Text style={styles.itemText}>会员姓名：张三</Text>
              <Text selectable style={styles.itemText}>会员手机号：<Text selectable style={styles.blueText}>15390913806</Text></Text>
              <Text selectable style={styles.itemText}>会员身份证号：<Text selectable style={styles.blueText}>452123123412341234</Text></Text>
              <Text selectable style={styles.itemText}>入住日期：2022-5-23</Text>
              <Text selectable style={[styles.itemText, {marginBottom: 20}]}>入住类别：常规住宿</Text>
            </View>
            <View style={{paddingHorizontal: 20}}>
              <Shadow style={styles.dormitoryArea}>
                <View style={styles.dormitoryArea_topArea}>
                  <Text style={styles.dormitoryArea_topAreaText}>住宿信息</Text>
                </View>
                <View style={styles.dormitoryArea_bottomArea}>
                  <View style={styles.listItem}>
                    <View style={styles.leftTitle}>
                      <Text style={styles.titleText}>宿舍楼栋</Text>
                    </View>
                    <Text style={styles.rightText}>241栋</Text>
                  </View>
                  <View style={styles.listItem}>
                    <View style={styles.leftTitle}>
                      <Text style={styles.titleText}>宿舍分类</Text>
                    </View>
                    <Text style={styles.rightText}>男生宿舍</Text>
                  </View>
                  <View style={styles.listItem}>
                    <View style={styles.leftTitle}>
                      <Text style={styles.titleText}>宿舍楼层</Text>
                    </View>
                    <Text style={styles.rightText}>1F</Text>
                  </View>
                  <View style={styles.listItem}>
                    <View style={styles.leftTitle}>
                      <Text style={styles.titleText}>房间号</Text>
                    </View>
                    <Text style={styles.rightText}>101</Text>
                  </View>
                  <View style={styles.lastItem}>
                    <View style={styles.leftTitle}>
                      <Text style={styles.titleText}>床位号</Text>
                    </View>
                    <Text style={styles.rightText}>101-1</Text>
                  </View>
                </View>
              </Shadow>
            </View>
            <View style={{height: 55, paddingHorizontal: 20}}>
              <Field
                name="leaveDate"
                label="退宿日期"
                fontSize={26}
                canDelete={false}
                borderColor='#EFEFEF'
                component={SelectTimeOfFilterMore}
              />
            </View>
            <View style={{height: 200, margin: 20}}>
              <Text style={{fontSize: 26, color: '#333333', marginBottom: 10}}>退宿原因：</Text>
              <View style={[{flex: 1, borderWidth: 1, borderColor: '#EFEFEF', borderRadius: 10, flexDirection: 'row', flexWrap: 'wrap', padding: 20}, reasonWrong && {borderColor: 'red'}]}>
                {reasonWrong && <Text style={{fontSize: 22, color: 'red', textAlignVertical: 'bottom', position: 'absolute', top: -35, right: 10}}>请选择退宿原因</Text>}
                {DORMITORY_LEAVE_REASON.map((reason, reasonIndex) => {
                  const isSelected = selectReason === reason.value;
                  return (
                    <TouchableOpacity key={reasonIndex} style={[{borderRadius: 6, backgroundColor: '#EFEFEF', paddingHorizontal: 15, paddingVertical: 5, marginRight: 20, marginBottom: 20}, isSelected && {backgroundColor: '#409EFF'}]} onPress={() => reasonOnPress(reason.value)}>
                      <Text style={[{fontSize: 26, color: '#999999'}, isSelected && {color: '#ffffff'}]}>{reason.label}</Text>
                    </TouchableOpacity>
                  )
                })}
              </View>
            </View>
          </ScrollView>
        )}}
    </Formik>
  )
};

const styles = StyleSheet.create({
  blueText: {
    color: '#409EFF'
  },
  itemText: {
    fontSize: 26, 
    color: '#333333', 
    marginBottom: 10
  },
  typeArea: {
    height: 60, 
    marginBottom: 20, 
    flexDirection: 'row'
  },
  typeArea_title: {
    minWidth: 140, 
    fontSize: 28, 
    color: '#000', 
    textAlignVertical: 'center'
  },
  typeArea_radio: {
    flex: 1, 
    borderWidth: 1, 
    borderRadius: 6, 
    borderColor: '#999999', 
    flexDirection: 'row'
  },
  leftRadio: {
    flexDirection: 'row', 
    alignItems: 'center', 
    marginHorizontal: 10
  },
  rightRadio: {
    flexDirection: 'row', 
    alignItems: 'center'
  },
  radioText: {
    fontSize: 26, 
    color: '#000', 
    textAlignVertical: 'center'
  },
  dormitoryArea: {
    width: '100%',
    marginBottom: 30,
    borderRadius: 10
  },
  dormitoryArea_topArea: {
    height: 60, 
    backgroundColor: '#EFEFEF', 
    justifyContent: 'center', 
    borderTopRightRadius: 10, 
    borderTopLeftRadius: 10
  },
  dormitoryArea_topAreaText: {
    fontSize: 28, 
    fontWeight: 'bold', 
    textAlign: 'center'
  },
  dormitoryArea_bottomArea: {
    padding: 10
  },
  listItem: {
    height: 50, 
    flexDirection: 'row', 
    borderTopWidth: 1, 
    borderLeftWidth: 1, 
    borderRightWidth: 1, 
    borderColor: '#409EFF', 
    alignItems: 'center'
  },
  lastItem: {
    height: 50, 
    flexDirection: 'row', 
    borderWidth: 1, 
    borderColor: '#409EFF', 
    alignItems: 'center'
  },
  leftTitle: {
    width: 150, 
    height: '100%', 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderRightWidth: 1, 
    borderColor: '#409EFF', 
    backgroundColor: '#ECF5FF'
  },
  titleText: {
    fontSize: 24, 
    color: '#333333', 
    fontWeight: 'bold'
  },
  rightText: {
    fontSize: 24, 
    paddingLeft: 20, 
    color: '#333333'
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
  },
  confirmText: {
    fontSize: 28, 
    color: '#409EFF'
  },
})

export default forwardRef(Leave);