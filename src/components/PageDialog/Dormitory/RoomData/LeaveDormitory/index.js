import React, {useState, useRef, useImperativeHandle, forwardRef} from "react";
import { ScrollView, Text, View, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { Formik, Field } from 'formik';
import moment from 'moment';
import { Shadow } from 'react-native-shadow-2';
import { useToast } from "react-native-toast-notifications";
import { useDispatch } from "react-redux";

import { DORMITORY_LEAVE_REASON } from "../../../../../utils/const";
import SelectTimeOfFilterMore from '../../../../HeaderSearchOfDormitory/FilterMore/SelectTimeOfFilterMore';
import DormitoryListApi from '../../../../../request/Dormitory/DormitoryListApi';
import { SUCCESS_CODE } from '../../../../../utils/const';
import * as PageDialog1 from "../../../../../redux/features/PageDialog";
import * as PageDialog2 from "../../../../../redux/features/PageDialog2"

let restForm;
const initialValues = {
  leaveDate: moment().format('YYYY-MM-DD')
};

const LeaveDormitory = ({
  memberMsg,
  refresh
}) => {
  const toast = useToast();
  const scrollViewRef = useRef(null);
  const dispatch = useDispatch();

  const [reasonWrong, setReasonWrong] = useState(false);
  const [selectReason, setSelectReason] = useState('');
  const [btnLoading, setBtnLoading] = useState(false);

  const onSubmit = (values) => {
    if(!selectReason){
      scrollViewRef?.current?.scrollToEnd();
      setReasonWrong(true);
      return;
    }
    if(btnLoading) return;
    const formatValue = {
      liveOutDate: values.leaveDate,
      liveOnReasonType: selectReason
    };
    leaveConfirm(formatValue);
  };

  const leaveConfirm = async(params) => {
    try {
      setBtnLoading(true);
      const res = await DormitoryListApi.leaveConfirm(params, memberMsg.id);
      console.log('leaveConfirm --> res', res);
      if(res?.code !== SUCCESS_CODE){
        toast.show(`${res?.msg}`, {type: 'danger'});
        return;
      }
      toast.show('退宿成功！', {type: 'success'});
      dispatch(PageDialog1.closeDialog());
      dispatch(PageDialog2.closeDialog());
      refresh && refresh();
    } catch (error) {
      console.log('leaveConfirm -> error', error);
      toast.show(`出现了意料之外的问题，请联系管理员处理`, { type: 'danger' });
    } finally{
      setBtnLoading(false);
    }
  };

  const reasonOnPress = (reason) => {
    setSelectReason(reason);
    setReasonWrong(false);
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}>
      {({...rest}) => {
        restForm = rest;
        return (
          <View style={{height: 900}}>
            <ScrollView ref={scrollViewRef} showsVerticalScrollIndicator={false}>
              <View style={styles.memberInfo}>
                <Shadow style={styles.dormitoryArea}>
                  <View style={styles.dormitoryArea_topArea}>
                    <Text style={styles.dormitoryArea_topAreaText}>会员信息</Text>
                  </View>
                  <View style={styles.dormitoryArea_bottomArea}>
                    <View style={styles.listItem}>
                      <View style={styles.leftTitle}>
                        <Text style={styles.titleText}>姓名</Text>
                      </View>
                      <Text style={styles.rightText}>{memberMsg?.name || '无'}</Text>
                    </View>
                    <View style={styles.listItem}>
                      <View style={styles.leftTitle}>
                        <Text style={styles.titleText}>手机号</Text>
                      </View>
                      <Text selectable style={[styles.rightText, {color: '#409EFF'}]}>{memberMsg?.mobile || '无'}</Text>
                    </View>
                    <View style={styles.listItem}>
                      <View style={styles.leftTitle}>
                        <Text style={styles.titleText}>身份证号</Text>
                      </View>
                      <Text selectable style={[styles.rightText, {color: '#409EFF'}]}>{memberMsg?.idNo || '无'}</Text>
                    </View>
                    <View style={styles.listItem}>
                      <View style={styles.leftTitle}>
                        <Text style={styles.titleText}>入住日期</Text>
                      </View>
                      <Text style={styles.rightText}>{memberMsg.date ? moment(memberMsg.date).format('YYYY-MM-DD') : '无'}</Text>
                    </View>
                    <View style={styles.lastItem}>
                      <View style={styles.leftTitle}>
                        <Text style={styles.titleText}>入住类别</Text>
                      </View>
                      <Text style={styles.rightText}>{memberMsg.ability === 'DORM_TEMPORARY' ? '临时住宿' : '常规住宿'}</Text>
                    </View>
                  </View>
                </Shadow>
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
                      <Text style={styles.rightText}>{memberMsg.building || '无'}</Text>
                    </View>
                    <View style={styles.listItem}>
                      <View style={styles.leftTitle}>
                        <Text style={styles.titleText}>宿舍分类</Text>
                      </View>
                      <Text style={styles.rightText}>{memberMsg.male ? '男生宿舍' : '女生宿舍'}</Text>
                    </View>
                    <View style={styles.listItem}>
                      <View style={styles.leftTitle}>
                        <Text style={styles.titleText}>宿舍楼层</Text>
                      </View>
                      <Text style={styles.rightText}>{memberMsg.floor}F</Text>
                    </View>
                    <View style={styles.listItem}>
                      <View style={styles.leftTitle}>
                        <Text style={styles.titleText}>房间号</Text>
                      </View>
                      <Text style={styles.rightText}>{memberMsg.roomName ? `${memberMsg.roomName}号` : '无'}</Text>
                    </View>
                    <View style={styles.lastItem}>
                      <View style={styles.leftTitle}>
                        <Text style={styles.titleText}>床位号</Text>
                      </View>
                      <Text style={styles.rightText}>{memberMsg.bedNo ? `${memberMsg.bedNo}号床` : '无'}</Text>
                    </View>
                  </View>
                </Shadow>
              </View>
              <View style={styles.operateArea}>
                <View style={styles.leaveDate}>
                  <Field
                    name="leaveDate"
                    label="退宿日期"
                    fontSize={26}
                    canDelete={false}
                    borderColor='#EFEFEF'
                    component={SelectTimeOfFilterMore}
                  />
                </View>
                <View style={styles.reasonArea}>
                  <Text style={styles.reasonTitle}>退宿原因：</Text>
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
              </View>
            </ScrollView>
            <View style={styles.bottomBtnArea}>
              <TouchableOpacity style={styles.btnPressArea} onPress={restForm.handleSubmit}>
                <Text style={styles.bottomBtnText}>保 存</Text>
                {btnLoading && <ActivityIndicator style={{marginLeft: 20}} size={26} color="#FFFFFF" />}
              </TouchableOpacity>
            </View>
          </View>
        )}}
    </Formik>
  )
};

const styles = StyleSheet.create({
  memberInfo: {
    paddingHorizontal: 20, 
    marginTop: 10
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
  operateArea: {
    borderWidth: 1, 
    marginHorizontal: 20, 
    paddingTop: 20, 
    borderColor: '#EFEFEF', 
    borderRadius: 8
  },
  leaveDate: {
    height: 55, 
    paddingHorizontal: 20
  },
  reasonArea: {
    height: 200, 
    margin: 20
  },
  reasonTitle: {
    fontSize: 26, 
    color: '#333333', 
    marginBottom: 10
  },
  bottomBtnArea: {
    height: 100, 
    padding: 20
  },
  btnPressArea: {
    flex: 1, 
    backgroundColor: '#409EFF', 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderRadius: 8
  },
  bottomBtnText: {
    fontSize: 28, 
    fontWeight: 'bold', 
    color: '#FFFFFF'
  }
})

export default LeaveDormitory;