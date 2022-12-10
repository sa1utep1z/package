import React, {useState, useRef, useEffect, useImperativeHandle, forwardRef} from "react";
import { ScrollView, Text, View, TouchableOpacity, StyleSheet, Linking, ActivityIndicator } from "react-native";
import { Formik, Field } from 'formik';
import moment from 'moment';
import { Shadow } from 'react-native-shadow-2';
import { useToast } from "react-native-toast-notifications";
import { useDispatch } from "react-redux";
import Entypo from 'react-native-vector-icons/Entypo';

import { DORMITORY_LEAVE_REASON } from "../../../utils/const";
import SelectTimeOfFilterMore from '../../HeaderSearchOfDormitory/FilterMore/SelectTimeOfFilterMore';
import DormitoryListApi from '../../../request/Dormitory/DormitoryListApi';
import { closeDialog } from "../../../redux/features/PageDialog";
import { SUCCESS_CODE } from '../../../utils/const';

let restForm;
const initialValues = {
  leaveDate: ''
};

const LeaveDormitory = ({
  dormitoryInfo,
  refresh
}, ref) => {
  const scrollViewRef = useRef(null);
  const toast = useToast();
  const dispatch = useDispatch();

  const [selectReason, setSelectReason] = useState('');
  const [reasonWrong, setReasonWrong] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);

  useEffect(() => {
    restForm.setFieldValue('leaveDate', moment().format('YYYY-MM-DD'));
  }, [])

  const onSubmit = (values) => {
    if(!selectReason){
      scrollViewRef?.current?.scrollToEnd();
      setReasonWrong(true);
      return;
    }
    const formatValue = {
      liveOutDate: values.leaveDate,
      liveOnReasonType: selectReason
    };
    leaveConfirm(formatValue);
  };

  const leaveConfirm = async(params) => {
    try {
      setBtnLoading(true);
      const res = await DormitoryListApi.leaveConfirm(params, dormitoryInfo.id);
      console.log('leaveConfirm --> res', res);
      if(res?.code !== SUCCESS_CODE){
        toast.show(`${res?.msg}`, {type: 'danger'});
        return;
      }
      dispatch(closeDialog());
      toast.show('退宿成功！', {type: 'success'});
      refresh && refresh();
    } catch (error) {
      console.log('leaveConfirm -> error', error);
      toast.show(`出现了意料之外的问题，请联系管理员处理`, { type: 'danger' });
    } finally {
      setBtnLoading(false);
    }
  };

  const reasonOnPress = (reason) => {
    setSelectReason(reason);
    reasonWrong && setReasonWrong(false);
  };

  const callPhone = () => {
    if(!dormitoryInfo.mobile) return;
    Linking.openURL(`tel:${dormitoryInfo.mobile}`);
  };

  const rejectOnPress = () => dispatch(closeDialog());

  const passOnPress = () => {
    if(btnLoading) return;
    restForm.handleSubmit();
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}>
      {({...rest}) => {
        restForm = rest;
        return (
          <>
            <View style={{paddingLeft: 50, paddingBottom: 0}}>
              <Text style={styles.itemText}>会员姓名：{dormitoryInfo.userName || '无'}</Text>
              <TouchableOpacity style={{flexDirection: 'row'}} onPress={callPhone}>
                <Text selectable style={styles.itemText}>会员手机号：<Text selectable style={dormitoryInfo.mobile && styles.blueText}>{dormitoryInfo.mobile || '无'}</Text></Text>
                {dormitoryInfo.mobile && <Entypo name='phone' size={32} color='#409EFF'/>}
              </TouchableOpacity>
              <Text selectable style={styles.itemText}>会员身份证号：<Text selectable style={styles.blueText}>{dormitoryInfo.idNo || '无'}</Text></Text>
            </View>
            <ScrollView ref={scrollViewRef} showsVerticalScrollIndicator={false}>
              <View style={{paddingHorizontal: 40, paddingTop: 10}}>
                <Shadow style={styles.dormitoryArea}>
                  <View style={styles.dormitoryArea_topArea}>
                    <Text style={styles.dormitoryArea_topAreaText}>住宿信息</Text>
                  </View>
                  <View style={styles.dormitoryArea_bottomArea}>
                    <View style={styles.listItem}>
                      <View style={styles.leftTitle}>
                        <Text style={styles.titleText}>入住类别</Text>
                      </View>
                      <Text style={styles.rightText}>{dormitoryInfo.liveInType === "DORM_ROUTINE" ? '常规住宿' : '临时住宿'}</Text>
                    </View>
                    <View style={styles.listItem}>
                      <View style={styles.leftTitle}>
                        <Text style={styles.titleText}>宿舍分类</Text>
                      </View>
                      <Text style={styles.rightText}>{dormitoryInfo.liveType === "DORM_MALE" ? '男生宿舍' : '女生宿舍'}</Text>
                    </View>
                    <View style={styles.listItem}>
                      <View style={styles.leftTitle}>
                        <Text style={styles.titleText}>宿舍楼栋</Text>
                      </View>
                      <Text style={styles.rightText}>{dormitoryInfo.roomBuildingName}</Text>
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
                    <View style={styles.listItem}>
                      <View style={styles.leftTitle}>
                        <Text style={styles.titleText}>床位号</Text>
                      </View>
                      <Text style={styles.rightText}>{dormitoryInfo.bedNo}</Text>
                    </View>
                    <View style={styles.lastItem}>
                      <View style={styles.leftTitle}>
                        <Text style={styles.titleText}>入住日期</Text>
                      </View>
                      <Text style={styles.rightText}>{dormitoryInfo.liveInDate ? moment(dormitoryInfo.liveInDate).format('YYYY-MM-DD') : '无'}</Text>
                    </View>
                  </View>
                </Shadow>
              </View>
              <View style={{height: 55, paddingHorizontal: 40}}>
                <Field
                  name="leaveDate"
                  label="退宿日期"
                  fontSize={26}
                  canDelete={false}
                  borderColor='#EFEFEF'
                  startLimit={moment().format('YYYY-MM-DD')}
                  endLimit={moment().add(3, 'd').format('YYYY-MM-DD')}
                  component={SelectTimeOfFilterMore}
                />
              </View>
              <View style={{height: 200, margin: 20, marginHorizontal: 40}}>
                <Text style={{fontSize: 26, color: '#333333', marginBottom: 10}}>退宿原因：</Text>
                <View style={[{flex: 1, borderWidth: 1, borderColor: '#EFEFEF', borderRadius: 10, flexDirection: 'row', flexWrap: 'wrap', padding: 20, marginLeft: 10}, reasonWrong && {borderColor: 'red'}]}>
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
            <View style={styles.bottomArea}>
              <View style={styles.leftArea}>
                <TouchableOpacity style={styles.buttonArea} onPress={rejectOnPress}>
                  <Text style={styles.closeText}>取消</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.rightArea}>
                <TouchableOpacity style={styles.buttonArea} onPress={passOnPress}>
                  <Text style={[styles.confirmText, btnLoading && {color: '#999999'}]}>确认</Text>
                  {btnLoading && <ActivityIndicator style={{position: 'absolute', right: 10, bottom: 10}} size={36} color="#999999" />}
                </TouchableOpacity>
              </View>
            </View>
          </>
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
    flexDirection: 'row',
    justifyContent: 'center', 
    alignItems: 'center'
  },
  closeText: {
    fontSize: 28, 
  },
  confirmText: {
    fontSize: 28, 
    color: '#409EFF'
  }
})

export default forwardRef(LeaveDormitory);