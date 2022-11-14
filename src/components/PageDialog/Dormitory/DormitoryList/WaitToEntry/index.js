import React, {useState} from "react";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { useDispatch } from "react-redux";
import { Formik, Field } from 'formik';
import { CheckBox } from '@rneui/themed';
import { Shadow } from 'react-native-shadow-2';

import { closeDialog } from "../../../../../redux/features/PageDialog";
import SelectTimeOfFilterMore from '../../../../HeaderSearchOfDormitory/FilterMore/SelectTimeOfFilterMore';

let restForm;
const initialValues = {
  buildingNum: [],
  stayDate: ''
};

const WaitToEntry = ({
}) => {
  const dispatch = useDispatch();

  const [stayType, setStayType] = useState('normal');

  const passOnPress = () => dispatch(closeDialog());

  const rejectOnPress = () => dispatch(closeDialog());

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
        <>
          <View style={styles.topArea}>
            <Text style={styles.itemText}>会员姓名：张三</Text>
            <Text selectable style={styles.itemText}>会员手机号：<Text selectable style={styles.blueText}>188-8989-8989</Text></Text>
            <Text selectable style={[styles.itemText, {marginBottom: 20}]}>会员身份证号：<Text selectable style={styles.blueText}>452123123412341234</Text></Text>
            <View style={styles.typeArea}>
              <Text style={styles.typeArea_title}>入住类别：</Text>
              <View style={styles.typeArea_radio}>
                <TouchableOpacity style={styles.leftRadio} onPress={()=>setStayType('normal')}>
                  <CheckBox
                    center
                    size={30}
                    pointerEvents={'none'}
                    checked={stayType === 'normal'}
                    containerStyle={{padding: 0, marginRight: 0}}
                    checkedIcon="dot-circle-o"
                    uncheckedIcon="circle-o"
                  />
                  <Text style={styles.radioText}>常规住宿</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.rightRadio} onPress={()=>setStayType('casual')}>
                  <CheckBox
                    center
                    size={30}
                    pointerEvents={'none'}
                    checked={stayType === 'casual'}
                    containerStyle={{padding: 0, marginRight: 0}}
                    checkedIcon="dot-circle-o"
                    uncheckedIcon="circle-o"
                  />
                  <Text style={styles.radioText}>临时住宿</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={{height: 60, marginBottom: 30}}>
              <Field
                name="stayDate"
                label="入住日期"
                component={SelectTimeOfFilterMore}
              />
            </View>
            <Shadow style={styles.dormitoryArea}>
              <View style={{borderRadius: 10}}>
                <View style={styles.dormitoryArea_topArea}>
                  <Text style={styles.dormitoryArea_topAreaText}>分配宿舍信息</Text>
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
              </View>
            </Shadow>
          </View>
          <View style={styles.bottomArea}>
            <View style={styles.leftArea}>
              <TouchableOpacity style={styles.buttonArea} onPress={rejectOnPress}>
                <Text style={styles.closeText}>取消</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.rightArea}>
              <TouchableOpacity style={styles.buttonArea} onPress={passOnPress}>
                <Text style={styles.confirmText}>通过</Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      )
    }}
    </Formik>
  )
};

const styles = StyleSheet.create({
  topArea: {
    flex: 1, 
    paddingHorizontal: 30
  },
  blueText: {
    color: '#409EFF'
  },
  itemText: {
    fontSize: 28, 
    color: '#333333', 
    marginBottom: 15
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
    marginBottom: 30
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
    flex: 1, 
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
    color: '#999999'
  },
  confirmText: {
    fontSize: 28, 
    color: 'green'
  },
})

export default WaitToEntry;