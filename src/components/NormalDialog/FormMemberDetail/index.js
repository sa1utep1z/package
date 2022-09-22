import React, { useState, useEffect, useMemo } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { Text } from '@rneui/themed';
import Entypo from 'react-native-vector-icons/Entypo';
import moment from 'moment';
import { useSelector } from 'react-redux';

import EmptyArea from '../../EmptyArea';
import { CHANEL_SOURCE_LIST, MEMBERS_STATUS, WAY_TO_GO, WATERMARK_LIST_SMALL, FAKE_MEMBER_INFO } from '../../../utils/const';
import { deepCopy } from '../../../utils';

const FormMemberDetail = ({
  memberInfoList = FAKE_MEMBER_INFO,
  showDate = false,
  noResignDate = false, //不要显示离职日期
}) => {
  const memberInfo = useSelector(state => state.MemberInfo.memberInfo);

  const [showList, setShowList] = useState([
    { type: 'name', title: '姓名', value: '' },
    { type: 'idNo', title: '身份证', value: '' },
    { type: 'mobile', title: '手机号', value: '' },
    { type: 'orderName', title: '职位名称', value: '' },
    { type: 'signUpType', title: '渠道来源', value: '' },
    { type: 'supplier', title: '供应商', value: '' },
    { type: 'recruitName', title: '经纪人', value: '' },
    { type: 'storeName', title: '归属门店', value: '' },
    { type: 'status', title: '状态', value: '' },
    { type: 'arrivalMode', title: '到厂方式', value: '' },
    { type: 'signUpTime', title: '录入时间', value: '' },
    { type: 'jobDate', title: '入职日期', value: '' },
    { type: 'resignDate', title: '离职日期', value: '' },
    // {title: '备注', value: ''}, 
    // {title: '是否住宿', value: ''}
  ]);

  useMemo(() => {
    const copyList = deepCopy(showList);
    for (let key in memberInfoList) {
      if (copyList.length) {
        const findItem = copyList.find(item => item.type === key);
        if (findItem) {
          switch (key) {
            case 'signUpType':
              const chanelName = CHANEL_SOURCE_LIST.find(name => name.value === memberInfoList[key]);
              findItem.value = chanelName?.title;
              break;
            case 'status':
              findItem.value = MEMBERS_STATUS[memberInfoList[key]];
              break;
            case 'arrivalMode':
              const arriveName = findItem.value = WAY_TO_GO.find(name => name.value === memberInfoList[key]);
              findItem.value = arriveName?.label;
              break;
            case 'signUpTime':
              findItem.value = memberInfoList[key] ? moment(memberInfoList[key]).format('YYYY-MM-DD HH:mm:ss') : '无';
              break;
            case 'jobDate':
              findItem.value = memberInfoList[key] ? moment(memberInfoList[key]).format('YYYY-MM-DD') : '无';
              break;
            case 'resignDate':
              findItem.value = memberInfoList[key] ? moment(memberInfoList[key]).format('YYYY-MM-DD') : '无';
              break;
            default:
              findItem.value = memberInfoList[key];
              break;
          }
        }
      }
    }
    //门店录入,删除供应商;供应商,删除经纪人;
    if(memberInfoList.signUpType === 'RECRUITER' && (copyList.findIndex(item => item.type === 'supplier') !== -1)){
      const supplierIndex = copyList.findIndex(item => item.type === 'supplier');
      copyList.splice(supplierIndex, 1);
    }else if(memberInfoList.signUpType === 'SUPPLIER' && (copyList.findIndex(item => item.type === 'recruitName') !== -1)){
      const recruiterIndex = copyList.findIndex(item => item.type === 'recruitName');
      copyList.splice(recruiterIndex, 1);
    }
    //删除离职日期
    if(noResignDate){
      const resignDateIndex = copyList.findIndex(item => item.type === 'resignDate');
      copyList.splice(resignDateIndex, 1);
    }
    setShowList(copyList);
  }, [memberInfoList])

  const callPhone = (item) => {
    Linking.openURL(`tel:${item.value}`);
  };

  const newDate = showList.filter((item) => (item.type !== 'jobDate' && item.type !== 'resignDate'));

  return (
    <ScrollView style={styles.msgArea}>
      {
        !showDate && <View style={styles.topArea}>
          {newDate?.length ? newDate.map((item, index) => {
            return (
              <View key={index} style={styles.memberItem}>
                <Text style={styles.memberItem_text}>{item.title}：</Text>
                {item.type === 'mobile' ? 
                item.value ? <TouchableOpacity style={[styles.memberItem_value, { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }]} onPress={() => callPhone(item)}>
                  <Text style={{ color: '#409EFF' }}>{item.value}</Text>
                  <Entypo name='phone' size={16} color='#409EFF' />
                </TouchableOpacity> : <Text style={{textAlignVertical: 'center', paddingLeft: 3}}>无</Text> : item.type === 'name' ?
                <View style={styles.memberItem_value}>
                  <Text selectable={true} style={{ color: '#409EFF' }}>{item.value || '无'}</Text>
                </View> : item.type === 'idNo' ? <View style={styles.memberItem_value}>
                  <Text selectable={true} style={{ color: '#409EFF' }}>{item.value || '无'}</Text>
                </View> : <View style={styles.memberItem_value}>
                  <Text>{item.value || '无'}</Text>
                </View>}
              </View>
            )
          }) : <EmptyArea />}
        </View>
      }
      {
        showDate && <View style={styles.topArea}>
          {showList?.length ? showList.map((item, index) => {
            return (
              <View key={index} style={styles.memberItem}>
                <Text style={styles.memberItem_text}>{item.title}：</Text>
                {item.type === 'mobile' ? 
                item.value ? <TouchableOpacity style={[styles.memberItem_value, { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }]} onPress={() => callPhone(item)}>
                  <Text style={{ color: '#409EFF' }}>{item.value}</Text>
                  <Entypo name='phone' size={16} color='#409EFF' /> 
                </TouchableOpacity> : <Text style={{textAlignVertical: 'center', paddingLeft: 3}}>无</Text> :item.type === 'name' ?
                <View style={styles.memberItem_value}>
                  <Text selectable={true} style={{ color: '#409EFF' }}>{item.value || '无'}</Text>
                </View> : item.type === 'idNo' ? <View style={styles.memberItem_value}>
                  <Text selectable={true} style={{ color: '#409EFF' }}>{item.value || '无'}</Text>
                </View> : <View style={styles.memberItem_value}>
                  <Text>{item.value || '无'}</Text>
                </View>}
              </View>
            )
          }) : <EmptyArea />}
        </View>
      }
      <View style={{paddingHorizontal: 30, paddingBottom: 30, right: 0, height: '100%', width: '100%', position: 'absolute', flexDirection: 'row', flexWrap: 'wrap', overflow: 'hidden'}} pointerEvents={'none'}>
        {WATERMARK_LIST_SMALL.map((item, itemIndex) => {
          return (
            <View key={itemIndex} style={[{width: '25%', height: 100, transform: [{ rotateZ: '-15deg' }], justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0)'}, {opacity: item} ]}>
              <Text style={{ color: 'rgba(0,0,0,0.15)', fontSize: 10 }}>{`${memberInfo.store} · ${memberInfo.name}`}</Text>
            </View>
          )
        })}
      </View>
    </ScrollView>
  )
};

const styles = StyleSheet.create({
  msgArea: {
    maxHeight: 360,
    marginHorizontal: 10
  },
  topArea: {
    width: '100%',
    paddingHorizontal: 20
  },
  memberItem: {
    minHeight: 30,
    flexDirection: 'row'
  },
  memberItem_text: {
    textAlignVertical: 'center',
    textAlign: 'left'
  },
  memberItem_value: {
    flex: 1,
    justifyContent: 'center',
    marginLeft: 5,
    paddingLeft: 3
  }
})

export default FormMemberDetail;