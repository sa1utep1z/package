import React, { useState, useEffect, useMemo } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { Text } from '@rneui/themed';
import Entypo from 'react-native-vector-icons/Entypo';
import moment from 'moment';
import { useDispatch } from "react-redux";

import EmptyArea from '../../EmptyArea';
import { CHANEL_SOURCE_LIST, MEMBERS_STATUS, WAY_TO_GO, WAY_TO_GO_NAME, CHANEL_SOURCE_NAME, FAKE_MEMBER_INFO } from '../../../utils/const';
import { closeDialog } from "../../../redux/features/PageDialog";
import { deepCopy } from '../../../utils';
import WaterMark from '../../WaterMark';

const MemberInfo = ({
  memberInfoList
}) => {
  const dispatch = useDispatch();

  const callPhone = () => Linking.openURL(`tel:${memberInfoList.mobile}`);

  const confirmOnPress = () => dispatch(closeDialog());

  return (
    <View style={{height: 850}}>
      <View style={styles.msgArea}>
        <View style={styles.itemArea}>
          <Text style={styles.titleText}>姓名：</Text>
          <Text selectable style={[styles.valueText, {color: '#409EFF'}]}>{memberInfoList.name}</Text>
        </View>
        <View style={styles.itemArea}>
          <Text style={styles.titleText}>身份证：</Text>
          <Text selectable style={[styles.valueText, {color: '#409EFF'}]}>{memberInfoList.idNo}</Text>
        </View>
        <View style={styles.itemArea}>
          <Text style={styles.titleText}>手机号：</Text>
          <TouchableOpacity style={styles.phoneArea} onPress={callPhone}>
            <Text selectable style={styles.phoneText}>{memberInfoList.mobile}</Text>
            <Entypo name='phone' size={32} color='#409EFF' />
          </TouchableOpacity>
        </View>
        <View style={styles.jobNameArea}>
          <Text style={styles.jobTitle}>职位名称：</Text>
          <Text style={{flex: 1, fontSize: 26}}>{memberInfoList.orderName}</Text>
        </View>
        <View style={styles.itemArea}>
          <Text style={styles.titleText}>渠道来源：</Text>
          <Text style={styles.valueText}>{CHANEL_SOURCE_NAME[memberInfoList.signUpType]}</Text>
        </View>
        {memberInfoList.signUpType === 'SUPPLIER' && <View style={styles.itemArea}>
          <Text style={styles.titleText}>供应商：</Text>
          <Text style={styles.valueText}>{memberInfoList.supplier || '无'}</Text>
        </View>}
        {memberInfoList.signUpType === 'RECRUITER' && <View style={styles.itemArea}>
          <Text style={styles.titleText}>经纪人：</Text>
          <Text style={styles.valueText}>{memberInfoList.recruitName || '无'}</Text>
        </View>}
        <View style={styles.itemArea}>
          <Text style={styles.titleText}>归属门店：</Text>
          <Text style={styles.valueText}>{memberInfoList.storeName}</Text>
        </View>
        <View style={styles.itemArea}>
          <Text style={styles.titleText}>状态：</Text>
          <Text style={styles.valueText}>{MEMBERS_STATUS[memberInfoList.status]}</Text>
        </View>
        <View style={styles.itemArea}>
          <Text style={styles.titleText}>到厂方式：</Text>
          <Text style={styles.valueText}>{WAY_TO_GO_NAME[memberInfoList.arrivalMode]}</Text>
        </View>
        <View style={styles.itemArea}>
          <Text style={styles.titleText}>录入时间：</Text>
          <Text style={styles.valueText}>{moment(memberInfoList.signUpTime).format('YYYY-MM-DD HH:mm:ss')}</Text>
        </View>
        <View style={styles.itemArea}>
          <Text style={styles.titleText}>入职日期：</Text>
          <Text style={styles.valueText}>{memberInfoList.jobDate ? moment(memberInfoList.jobDate).format('YYYY-MM-DD') : '无'}</Text>
        </View>
        <View style={styles.itemArea}>
          <Text style={styles.titleText}>离职日期：</Text>
          <Text style={styles.valueText}>{memberInfoList.resignDate ? moment(memberInfoList.resignDate).format('YYYY-MM-DD') : '无'}</Text>
        </View>
        <WaterMark />
      </View>
      <View style={styles.bottomArea}>
        <View style={styles.leftArea}>
          <TouchableOpacity style={styles.buttonArea} onPress={confirmOnPress}>
            <Text style={styles.closeText}>取消</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.rightArea}>
          <TouchableOpacity style={styles.buttonArea} onPress={confirmOnPress}>
            <Text style={styles.confirmText}>确定</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
};

const styles = StyleSheet.create({
  msgArea: {
    flex: 1,
    paddingHorizontal: 40
  },
  itemArea: {
    height: 50, 
    flexDirection: 'row', 
    marginBottom: 10
  },
  phoneArea: {
    flex: 1, 
    flexDirection: 'row', 
    alignItems: 'center'
  },
  phoneText: {
    fontSize: 26, 
    textAlignVertical: 'center', 
    color: '#409EFF', 
    marginRight: 5
  },
  jobNameArea: {
    minHeight: 50, 
    maxHeight: 80, 
    flexDirection: 'row', 
    marginBottom: 10
  },
  jobTitle: {
    minWidth: 150, 
    fontSize: 26, 
    textAlign: 'right', 
    textAlignVertical: 'top', 
    marginRight: 10
  },
  titleText: {
    minWidth: 150, 
    fontSize: 26, 
    textAlign: 'right', 
    textAlignVertical: 'center', 
    marginRight: 10
  },

  valueText: {
    fontSize: 26, 
    textAlignVertical: 'center'
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
  }
})

export default MemberInfo;