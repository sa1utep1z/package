import React, {useState} from "react";
import { Text, View, TouchableOpacity, StyleSheet, Linking } from "react-native";
import { useDispatch } from "react-redux";
import { Formik, Field } from 'formik';
import { Shadow } from 'react-native-shadow-2';
import moment from "moment";
import Entypo from 'react-native-vector-icons/Entypo';
import { useToast } from "react-native-toast-notifications";

import { closeDialog } from "../../../../../redux/features/PageDialog";
import SelectTimeOfFilterMore from '../../../../HeaderSearchOfDormitory/FilterMore/SelectTimeOfFilterMore';
import DormitoryListApi from '../../../../../request/Dormitory/DormitoryListApi';
import { SUCCESS_CODE } from '../../../../../utils/const';

let restForm;
const initialValues = {
  stayDate: '',
  liveExpireDate: ''
};

const WaitToEntry = ({
  dormitoryInfo,
  refresh,
  canOperate = true,
}) => {
  const dispatch = useDispatch();
  const toast = useToast();

  const rejectOnPress = () => dispatch(closeDialog());

  const [warning, setWarning] = useState('');

  const onSubmit = values => {
    if(!canOperate){
      toast.show('无权限', {type: 'warning'});
      return;
    }
    if(!values.stayDate.length){
      if(dormitoryInfo.liveInType === "DORM_TEMPORARY" && !values.liveExpireDate.length){
        setWarning('请选择入住日期与临时住宿期限！');
        return;
      }
      setWarning('请选择入住日期！');
      return;
    }else if (dormitoryInfo.liveInType === "DORM_TEMPORARY" && !values.liveExpireDate.length){
      setWarning('请选择临时住宿期限！');
      return;
    }
    const params = {
      liveInType: dormitoryInfo.liveInType,
      liveInDate: values.stayDate,
      liveExpireDate: values.liveExpireDate,
    };
    confirmLiving(params);
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

  const callPhone = () => {
    if(!dormitoryInfo.mobile) return;
    Linking.openURL(`tel:${dormitoryInfo.mobile}`);
  };

  console.log('canOperate', canOperate);
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}>
      {({...rest}) => {
        restForm = rest;
        return (
          <>
            <View style={styles.topArea}>
              <View style={{paddingLeft: 10, marginBottom: 5}}>
                <Text style={styles.itemText}>会员姓名：{dormitoryInfo.userName || '无'}</Text>
                <TouchableOpacity style={{flexDirection: 'row'}} onPress={callPhone}>
                  <Text selectable style={styles.itemText}>会员手机号：<Text selectable style={dormitoryInfo.mobile && styles.blueText}>{dormitoryInfo.mobile || '无'}</Text></Text>
                  {dormitoryInfo.mobile && <Entypo name='phone' size={32} color='#ffffff'/>}
                </TouchableOpacity>
                <Text selectable style={styles.itemText}>会员身份证号：<Text selectable style={styles.blueText}>{dormitoryInfo.idNo || '无'}</Text></Text>
              </View>
              <Shadow style={styles.dormitoryArea}>
                <View style={{borderRadius: 10}}>
                  <View style={styles.dormitoryArea_topArea}>
                    <Text style={styles.dormitoryArea_topAreaText}>分配宿舍信息</Text>
                  </View>
                  <View style={styles.dormitoryArea_bottomArea}>
                    <View style={styles.listItem}>
                      <View style={styles.leftTitle}>
                        <Text style={styles.titleText}>入住类别</Text>
                      </View>
                      <Text style={styles.rightText}>{dormitoryInfo.liveInType === "DORM_TEMPORARY" ? '临时住宿' : '常规住宿'}</Text>
                    </View>
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
                    <View style={styles.listItem}>
                      <View style={styles.leftTitle}>
                        <Text style={styles.titleText}>床位号</Text>
                      </View>
                      <Text style={styles.rightText}>{dormitoryInfo.bedNo}</Text>
                    </View>
                    <View style={dormitoryInfo.liveInType === 'DORM_TEMPORARY' ? styles.listItem : styles.lastItem}>
                      <View style={styles.leftTitle}>
                        <Text style={styles.titleText}>入住日期</Text>
                      </View>
                      <View style={styles.lineArea}>
                        <Field
                          name="stayDate"
                          label="入住日期"
                          fontSize={24}
                          iconSize={28}
                          canDelete={false}
                          showLabel={false}
                          showArrow={false}
                          borderColor="#EFEFEF"
                          itemAreaStyle={{height: 50}}
                          touchAreaStyle={{height: 40, borderRadius: 4}}
                          startLimit={moment().format('YYYY-MM-DD')}
                          endLimit={moment().add(3, 'd').format('YYYY-MM-DD')}
                          component={SelectTimeOfFilterMore}
                        />
                      </View>
                    </View>
                    {dormitoryInfo.liveInType === 'DORM_TEMPORARY' && <View style={styles.lastItem}>
                      <View style={styles.leftTitle}>
                        <Text style={styles.titleText}>临时住宿期限</Text>
                      </View>
                      <View style={styles.lineArea}>
                        <Field
                          name="liveExpireDate"
                          label="临时住宿期限"
                          fontSize={24}
                          iconSize={28}
                          canDelete={false}
                          showLabel={false}
                          showArrow={false}
                          borderColor="#EFEFEF"
                          itemAreaStyle={{height: 50}}
                          touchAreaStyle={{height: 40, borderRadius: 4}}
                          startLimit={moment().format('YYYY-MM-DD')}
                          endLimit={moment().add(3, 'd').format('YYYY-MM-DD')}
                          component={SelectTimeOfFilterMore}
                        />
                      </View>
                    </View>}
                    {warning ? <Text style={styles.warningText}>{warning}</Text> : <></>}
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
                  <Text style={[styles.confirmText, !canOperate && {color: '#999999'}]}>确定</Text>
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
  topInfoArea: {
    height: 100, 
    backgroundColor: '#999999', 
    borderRadius: 8, 
    marginBottom: 20
  },
  topInfoArea_top: {
    flex: 1, 
    flexDirection: 'row', 
    borderBottomWidth: 1, 
    borderColor: '#FFFFFF'
  },
  top_leftText: {
    fontSize: 24, 
    color: '#FFFFFF', 
    borderRightWidth: 1, 
    borderColor: '#FFFFFF', 
    textAlign: 'center', 
    textAlignVertical: 'center', 
    paddingHorizontal: 40
  },
  callPhoneArea: {
    flex: 1, 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  top_rightText: {
    fontSize: 24, 
    color: '#FFFFFF', 
    textAlignVertical: 'center', 
    textAlign: 'center'
  },
  topInfoArea_bottom: {
    flex: 1, 
    fontSize: 24, 
    color: '#FFFFFF', 
    textAlign: 'center', 
    textAlignVertical: 'center'
  },
  lineArea: {
    flex: 1, 
    height: '100%', 
    paddingHorizontal: 5
  },
  warningText: {
    fontSize: 24, 
    color: 'red', 
    textAlign: 'center', 
    marginTop: 5
  },
  blueText: {
    color: '#409EFF'
  },
  itemText: {
    fontSize: 26, 
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
    width: 180, 
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