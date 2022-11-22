import React, {useState} from "react";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { useDispatch } from "react-redux";
import { Formik, Field } from 'formik';
import { CheckBox } from '@rneui/themed';
import { Shadow } from 'react-native-shadow-2';
import * as Yup from 'yup';
import moment from "moment";
import { useToast } from "react-native-toast-notifications";

import { closeDialog } from "../../../../../redux/features/PageDialog";
import SelectTimeOfFilterMore from '../../../../HeaderSearchOfDormitory/FilterMore/SelectTimeOfFilterMore';
import DormitoryListApi from '../../../../../request/Dormitory/DormitoryListApi';
import { SUCCESS_CODE } from '../../../../../utils/const';

let restForm;
const validationSchema = Yup.object().shape({
  stayDate: Yup.string().required('请选择入住日期！'),
});
const initialValues = {
  stayDate: ''
};

const WaitToEntry = ({
  dormitoryInfo,
  refresh
}) => {
  const dispatch = useDispatch();
  const toast = useToast();

  const rejectOnPress = () => dispatch(closeDialog());

  const onSubmit = values => {
    confirmLiving({liveInDate: values.stayDate});
  };

  const confirmLiving = async(params) => {
    try {
      const res = await DormitoryListApi.confirmLiving(params, dormitoryInfo.id);
      console.log('confirmLiving --> res', res);
      if(res?.code !== SUCCESS_CODE){
        toast.show(`${res?.msg}`, {type: 'danger'});
        return;
      }
      dispatch(closeDialog());
      toast.show('入住成功！', {type: 'success'});
      refresh && refresh();
    } catch (error) {
      console.log('confirmLiving -> error', error);
      toast.show(`出现了意料之外的问题，请联系管理员处理`, { type: 'danger' });
    }
  };

  return (
    <Formik
    initialValues={initialValues}
    validationSchema={validationSchema}
    onSubmit={onSubmit}>
    {({...rest}) => {
      restForm = rest;
      return (
        <>
          <View style={styles.topArea}>
            <Text style={styles.itemText}>会员姓名：{dormitoryInfo.userName}</Text>
            <Text selectable style={styles.itemText}>会员手机号：<Text selectable style={styles.blueText}>{dormitoryInfo.mobile}</Text></Text>
            <Text selectable style={[styles.itemText, {marginBottom: 20}]}>会员身份证号：<Text selectable style={styles.blueText}>{dormitoryInfo.idNo}</Text></Text>
            <Text style={styles.itemText}>入住类别：{dormitoryInfo.liveInType === "DORM_TEMPORARY" ? '临时住宿' : '常规住宿'}</Text>
            <Field
              name="stayDate"
              label="入住日期"
              component={SelectTimeOfFilterMore}
              endLimit={moment().format('YYYY-MM-DD')}
            />
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
                    <Text style={styles.rightText}>{dormitoryInfo.roomBuildingName}</Text>
                  </View>
                  <View style={styles.listItem}>
                    <View style={styles.leftTitle}>
                      <Text style={styles.titleText}>宿舍分类</Text>
                    </View>
                    <Text style={styles.rightText}>{dormitoryInfo.liveType === "DORM_MALE" ? '男生宿舍' : '女生宿舍'}</Text>
                  </View>
                  <View style={styles.listItem}>
                    <View style={styles.leftTitle}>
                      <Text style={styles.titleText}>宿舍楼层</Text>
                    </View>
                    <Text style={styles.rightText}>{dormitoryInfo.roomFloorIndex}F</Text>
                  </View>
                  <View style={styles.listItem}>
                    <View style={styles.leftTitle}>
                      <Text style={styles.titleText}>房间号</Text>
                    </View>
                    <Text style={styles.rightText}>{dormitoryInfo.roomNo}</Text>
                  </View>
                  <View style={styles.lastItem}>
                    <View style={styles.leftTitle}>
                      <Text style={styles.titleText}>床位号</Text>
                    </View>
                    <Text style={styles.rightText}>{dormitoryInfo.bedNo}</Text>
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
              <TouchableOpacity style={styles.buttonArea} onPress={rest.handleSubmit}>
                <Text style={styles.confirmText}>确定</Text>
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
    color: '#409EFF'
  },
})

export default WaitToEntry;