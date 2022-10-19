import React, { useState, useEffect, useMemo } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { Text } from '@rneui/themed';
import Entypo from 'react-native-vector-icons/Entypo';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { ProgressSteps, ProgressStep } from 'react-native-progress-steps';
import EmptyArea from '../../../../../components/EmptyArea';
import { TYPERESULT, MEMBERS_STATUS, WAY_TO_GO, WATERMARK_LIST_SMALL, ADVANCE_INFO, JOB_ON_Result } from '../../../../../utils/const';
import { deepCopy } from '../../../../../utils';
import { TextInput } from 'react-native';
import AdvanceApi from '../../../../../request/AdvanceApi';

const AdvanceAudit = (props) => {
  const memberInfo = useSelector(state => state.MemberInfo.memberInfo);
  const { route: { params: { msg } } } = props;
  const [memberInfoList, setMemberInfoList] = useState(ADVANCE_INFO); // 详情信息
  const [inputValue, setInputValue] = useState(''); // 输入金额
  const [showList, setShowList] = useState([
    { type: 'userName', title: '会员姓名', value: '' },
    { type: 'idNo', title: '身份证号', value: '' },
    { type: 'mobile', title: '手机号码', value: '' },
    { type: 'companyShortName', title: '企业名称', value: '' },
    { type: 'orderName', title: '订单名称', value: '' },
    { type: 'signUpType', title: '渠道来源', value: '' },
    { type: 'recruiterName', title: '招聘员', value: '' },
    { type: 'supplierName', title: '供应商', value: '' },
    { type: 'storeName', title: '归属门店', value: '' },
    { type: 'memberStatus', title: '在职状态', value: '' },
    { type: 'jobDate', title: '入职日期', value: '' },
    { type: 'advanceAmount', title: '借支金额', value: '' },
    { type: 'bankName', title: '银行名称', value: '' },
    { type: 'bankAccount', title: '银行卡号', value: '' },
    { type: 'status', title: '申请状态', value: '' },
    { type: 'applyDate', title: '提交时间', value: '' },
  ]);
  console.log('打印传过来的参数：', msg);
  useMemo(() => {
    const copyList = deepCopy(showList);
    for (let key in msg) {
      if (copyList.length) {
        const findItem = copyList.find(item => item.type === key);
        if (findItem) {
          switch (key) {
            case 'type':
              const chanelName = TYPERESULT.find(name => name.value === msg[key]);
              findItem.value = chanelName?.title;
              break;
            case 'applyDate':
              findItem.value = msg[key] ? moment(msg[key]).format('YYYY-MM-DD HH:mm:ss') : '无';
              break;
            case 'jobDate':
              findItem.value = msg[key] ? moment(msg[key]).format('YYYY-MM-DD') : '无';
              break;
            case 'memberStatus':
              const chanelStatu = JOB_ON_Result.find(name => name.value === msg[key]);
              findItem.value = chanelStatu?.title;
              break;
            default:
              findItem.value = msg[key];
              break;
          }
        }
      }
    }
    setShowList(copyList);
  }, [msg])

  // 获取审批流程数据
  // const getTypeTotal = async () => {
  //   try {
  //     const res = await AdvanceApi.AdvanceTotalList(params);
  //     if (res?.code !== SUCCESS_CODE) {
  //       toast.show(`${res?.msg}`, { type: 'danger' });
  //       return;
  //     }
  //     setTabNumberList(res.data);
  //     console.log('打印全部数量：', res, params)
  //   } catch (err) {
  //     toast.show(`出现了意料之外的问题，请联系系统管理员处理`, { type: 'danger' });
  //   }
  // };

  const callPhone = (item) => {
    Linking.openURL(`tel:${item.value}`);
  };
  const onChangeText = value => setInputValue(value);
  const newDate = showList.filter((item) => (item.type !== 'jobDate' && item.type !== 'resignDate'));

  return (
    <ScrollView style={styles.msgArea}>
      <View style={styles.topArea}>
        {showList?.length ? showList.map((item, index) => {
          return (
            <View key={index} style={styles.memberItem}>
              <Text style={styles.memberItem_text}>{item.title}：</Text>
              {item.type === 'mobile' ?
                item.value ? <TouchableOpacity style={[styles.memberItem_value, { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }]} onPress={() => callPhone(item)}>
                  <Text style={{ color: '#409EFF', fontSize: 28 }}>{item.value}</Text>
                  <Entypo name='phone' size={16} color='#409EFF' />
                </TouchableOpacity> : <Text style={{ textAlignVertical: 'center', paddingLeft: 3, fontSize: 28 }}>无</Text> : item.type === 'momney' ?
                  <View style={styles.memberItem_value}>
                    {/* <Text selectable={true} style={{ color: item.value ? '#409EFF' : '#333', fontSize: 28 }}>{item.value || '无'}</Text> */}
                    <TextInput
                      style={{ flex: 1, fontSize: 28, }}
                      placeholder="请输入借支金额"
                      keyboardType="numeric"
                      value={item.value || inputValue}
                      onChangeText={onChangeText}
                    />
                  </View> : item.type === 'idNo' ? <View style={styles.memberItem_value}>
                    <Text selectable={true} style={{ color: item.value ? '#409EFF' : '#333', fontSize: 28 }}>{item.value || '无'}</Text>
                  </View> : <View style={styles.memberItem_value}>
                    <Text style={styles.vauleStyle}>{item.value || '无'}</Text>
                  </View>}
            </View>
          )
        }) : <EmptyArea />}
        <View>
          <Text style={styles.title}>审批流程</Text>
        </View>
        <View style={styles.stepBoxStyle}>
          <ProgressSteps labelFontSize={20} style={styles.stepsStyle}>
            <ProgressStep label="提交审核" style={styles.stepStyle}>
              <View style={{ alignItems: 'center' }}>
                <Text>This is the content within step 1!</Text>
              </View>
            </ProgressStep>
            <ProgressStep label="驻厂审核">
              <View style={{ alignItems: 'center' }}>
                <Text>This is the content within step 2!</Text>
              </View>
            </ProgressStep>
            <ProgressStep label="财务审核">
              <View style={{ alignItems: 'center' }}>
                <Text>This is the content within step 3!</Text>
              </View>
            </ProgressStep>
            <ProgressStep label="会计审核">
              <View style={{ alignItems: 'center' }}>
                <Text>This is the content within step 4!</Text>
              </View>
            </ProgressStep>
          </ProgressSteps>
        </View>
      </View>
      <View style={{ paddingHorizontal: 30, paddingBottom: 30, right: 0, height: '100%', width: '100%', position: 'absolute', flexDirection: 'row', flexWrap: 'wrap', overflow: 'hidden' }} pointerEvents={'none'}>
        {WATERMARK_LIST_SMALL.map((item, itemIndex) => {
          return (
            <View key={itemIndex} style={[{ width: '25%', height: 100, transform: [{ rotateZ: '-15deg' }], justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0)' }, { opacity: item }]}>
              <Text style={{ color: 'rgba(0,0,0,0.15)', fontSize: 10 }}>{memberInfo.store}</Text>
              <Text style={{ color: 'rgba(0,0,0,0.15)', fontSize: 10 }}>{memberInfo.name}</Text>
            </View>
          )
        })}
      </View>
    </ScrollView>
  )
};

const styles = StyleSheet.create({
  msgArea: {
    flex: 1,
    backgroundColor: '#fff'
  },
  topArea: {
    width: '100%',
    paddingHorizontal: 30
  },
  memberItem: {
    minHeight: 60,
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderColor: 'rgba(0, 0, 0, .05)',
  },
  memberItem_text: {
    textAlignVertical: 'center',
    textAlign: 'left',
    color: '#333',
    fontSize: 30,
  },
  memberItem_value: {
    flex: 1,
    justifyContent: 'center',
    marginLeft: 5,
    paddingLeft: 3
  },
  vauleStyle: {
    fontSize: 28,
    color: '#333',
  },
  imageBox: {
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    // margin: 30,
  },
  imags: {
    width: 290,
    height: 200,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#999999',
    marginRight: 20,
    marginBottom: 20,
    position: 'relative',
  },
  title: {
    fontSize: 32,
    color: '#333',
    marginTop: 30,
  },
  stepBoxStyle: {
    flex: 1,
    width: 680,
    // borderWidth: 6,
    justifyContent: 'space-between'
  },
  stepsStyle: {
    borderWidth: 4,
    backgroundColor: 'red'
  },
  stepStyle: {
    width: '100%',
    borderWidth: 1,
  },
  stepTitle: {
    fontSize: 24,
    color: '#333'
  },
})

export default AdvanceAudit;