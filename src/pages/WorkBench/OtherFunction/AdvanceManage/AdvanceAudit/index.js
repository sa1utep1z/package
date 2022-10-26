import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { StyleSheet, View, ScrollView, Text, TouchableOpacity, Linking } from 'react-native';
import { ButtonGroup, Dialog, Button } from '@rneui/themed';
import Entypo from 'react-native-vector-icons/Entypo';
import { useToast } from "react-native-toast-notifications";
import moment from 'moment';
import { Formik, Field } from 'formik';
import { useSelector } from 'react-redux';
import AntDesign from 'react-native-vector-icons/AntDesign';
import SelectItem from '../../../../../components/Form/SelectItem';
import { ProgressSteps, ProgressStep } from 'react-native-progress-steps';
import NormalDialog from "../../../../../components/NormalDialog";
import EmptyArea from '../../../../../components/EmptyArea';
import { TYPERESULT, MEMBERS_STATUS, WAY_TO_GO, WATERMARK_LIST_SMALL, SUCCESS_CODE, JOB_ON_Result, ADVANCERESULT, ADVANCE_AMOUNT, CHANEL_SOURCE_LIST } from '../../../../../utils/const';
import { deepCopy } from '../../../../../utils';
import { TextInput } from 'react-native';
import AdvanceApi from '../../../../../request/AdvanceApi';


let restForm;
const AdvanceAudit = (props) => {
  const memberInfo = useSelector(state => state.MemberInfo.memberInfo);
  const { route: { params: { msg } } } = props;
  const toast = useToast();
  const dialogRef = useRef(null);
  const [dialogContent, setDialogContent] = useState({});
  const [advanceFlow, setAdvanceFlow] = useState({}); // 进度详情
  const [inputValue, setInputValue] = useState(''); // 输入金额
  const [inputRemark, setInputRemark] = useState(''); // 输入审核意见
  const [isApply, setIsApply] = useState(false); // 审核同意/拒绝状态
  const [visible4, setVisible4] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState({}); // 点击的审核数据
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
    { type: 'advanceAmount', title: '借支金额', value: [] },
    { type: 'bankName', title: '银行名称', value: '' },
    { type: 'bankAccount', title: '银行卡号', value: '' },
    { type: 'status', title: '申请状态', value: '' },
    { type: 'applyDate', title: '提交时间', value: '' },
  ]);

  const initialValues = {
    advanceAmount: [],
  }
  const statusPress = [
    {
      title: '拒绝',
      value: 'FAIL',
    },
    {
      title: '同意',
      value: 'PASS',
    }
  ]
  useEffect(() => {
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
            case 'signUpType':
              const chanelType = CHANEL_SOURCE_LIST.find(name => name.value === msg[key]);
              findItem.value = chanelType?.title;
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
            case 'status':
              const chanelStatus = ADVANCERESULT.find(name => name.value === msg[key]);
              findItem.value = chanelStatus?.title;
              break;
            case 'advanceAmount':
              const chanelAmount = ADVANCE_AMOUNT.filter(item => item.value === String(msg[key]));
              console.log('advanceAmount', chanelAmount, msg[key]);
              restForm.setFieldValue('advanceAmount', chanelAmount);
              setInputValue(msg[key]);
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
  console.log('isApply', isApply, inputRemark)

  useEffect(() => {
    if (msg) {
      getAdvanceFlow();
    }
  }, [msg])

  // 获取审批流程数据
  const getAdvanceFlow = async () => {
    try {
      const res = await AdvanceApi.AdvanceFlow(msg.applyId);
      if (res?.code !== SUCCESS_CODE) {
        toast.show(`${res?.msg}`, { type: 'danger' });
        return;
      }
      setAdvanceFlow(res.data);
      console.log('打印审核进度：', res)
    } catch (err) {
      toast.show(`出现了意料之外的问题，请联系系统管理员处理`, { type: 'danger' });
      console.log('打印错误信息：', err)
    }
  };

  // 输入审核意见
  const onChangeRemark = (value) => {
    console.log('打印审核意见：', value);
    setInputRemark(value);
  };

  // 拒绝
  const pressFail = (item) => {
    console.log('打印通过的值111：', isApply, item);
    setIsApply(true);
  }

  // 审批意见通过
  const pressPass = async (item) => {
    try {
      const prams = {
        pass: true,
        remark: '',
        billMonth: '',
        approveData: {
          advanceAmount: inputValue ? inputValue : '',
        },
      };
      console.log('打印通过的值111：', prams, msg.approveDetailId);
      setIsApply(false);
      const res = await AdvanceApi.AddApprove(msg.approveDetailId, prams);
      if (res?.code !== SUCCESS_CODE) {
        toast.show(`${res?.msg}`, { type: 'danger' });
        return;
      }
      if (selectedIndex.role === 'BELONG_RESIDENT_SINGLE') {
        toast.show('审批通过，进入财务审批流程', 2000);
      } else if (selectedIndex.role === 'FINANCE') {
        toast.show('审批通过，进入会计审批流程', 2000);
      } else {
        toast.show('审批通过，发放款项', 2000);
      }
      getAdvanceFlow();
      setVisible4(false);
      console.log('打印审核进度：', res)
    } catch (err) {
      toast.show(`出现了意料之外的问题，请联系系统管理员处理`, { type: 'danger' });
      console.log('打印错误信息：', err)
    }
  }

  // 拒绝申请
  const handleSubmit = async () => {
    try {
      const prams = {
        pass: false,
        remark: inputRemark,
        billMonth: '',
        approveData: {
          advanceAmount: inputValue ? inputValue : '',
        },
      };
      console.log('打印请求的参数：', prams);
      if (inputRemark) {
        const res = await AdvanceApi.AddApprove(msg.approveDetailId, prams);
        if (res?.code !== SUCCESS_CODE) {
          toast.show(`${res?.msg}`, { type: 'danger' });
          return;
        }
        toast.show('审批流程已终止');
        getAdvanceFlow();
        setVisible4(false);
      } else {
        toast.show('审批意见不能为空！', { type: 'danger' });
      }
    } catch (error) {
      toast.show(`出现了意料之外的问题，请联系系统管理员处理`, { type: 'danger' });
      console.log('打印错误信息：', error)
    }
  }


  //打开审批弹窗
  const applyResult = (item) => {
    setVisible4(true);
    setSelectedIndex(item);
  }

  const callPhone = (item) => {
    Linking.openURL(`tel:${item.value}`);
  };

  const callPhones = (item) => {
    Linking.openURL(`tel:${item.mobile}`);
  };

  // 提交报名表单
  const onSubmit = async (values) => {
    try {
      console.log('提交参数11：', values)
    } catch (error) {
      console.log('errorerrorerrorerrorerrorerror', error)
    }
  }

  return (
    <ScrollView style={styles.msgArea}>
      <View style={styles.topArea}>
        {showList?.length ? showList.map((item, index) => {
          return (
            <View key={index} style={styles.memberItem}>
              {
                item.type != 'advanceAmount' && <Text style={styles.memberItem_text}>{item.title}：</Text>
              }
              {item.type === 'mobile' ?
                item.value ? <TouchableOpacity style={[styles.memberItem_value, { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }]} onPress={() => callPhone(item)}>
                  <Text style={{ color: '#409EFF', fontSize: 28 }}>{item.value}</Text>
                  <Entypo name='phone' size={16} color='#409EFF' />
                </TouchableOpacity> : <Text style={{ textAlignVertical: 'center', paddingLeft: 3, fontSize: 28 }}>无</Text> : item.type === 'advanceAmount' ?
                  <View style={styles.memberItem_value}>
                    <Formik
                      initialValues={initialValues}
                      handleChange={(e) => console.log('e', e)}
                      onSubmit={onSubmit}>
                      {({ handleSubmit, ...rest }) => {
                        const amount = rest.values;
                        console.log('values', amount)
                        if (amount.advanceAmount.length) {
                          const newAmount = amount.advanceAmount[0].value;
                          setInputValue(newAmount);
                        }
                        restForm = rest;
                        return (
                          <View style={{ flex: 1 }}>
                            <Field
                              name="advanceAmount"
                              title="借支金额"
                              noBorder
                              bottomButton
                              singleSelect
                              inPageField
                              formalLabel
                              labelText={{ fontSize: 30 }}
                              selectContainerStyle={{ height: 40, paddingLeft: -8, }}
                              selectList={ADVANCE_AMOUNT}
                              component={SelectItem}
                            />
                          </View>
                        )
                      }}
                    </Formik>
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
        <View style={{ marginBottom: 40 }}>
          {
            advanceFlow && <View style={styles.stepBoxStyle}>
              <View style={styles.border}>
                <Text style={styles.borderText}>会员</Text>
              </View>
              <View style={styles.content}>
                <View>
                  <Text style={styles.titleText}>提交申请</Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={styles.timeText}>会员</Text>
                  <Text style={styles.box}>[<Text style={styles.nameText}>{advanceFlow.userName}</Text>]</Text>
                  <TouchableOpacity onPress={() => callPhones(advanceFlow)}><Text style={styles.nameText}>{advanceFlow.mobile}</Text></TouchableOpacity>
                  <Text style={styles.timeText}>{advanceFlow.createDate ? moment(advanceFlow.createDate).format('YYYY-MM-DD HH:mm:ss') : ''}</Text>
                </View>
              </View>
            </View>
          }
          {
            advanceFlow && advanceFlow.flowDetails && advanceFlow.flowDetails.map((item, index) => {
              return (
                <View key={index}>
                  <View style={styles.line}></View>
                  <View style={styles.stepBoxStyle}>
                    <View style={styles.border}>
                      <Text style={styles.borderText}>{item.role === 'FINANCE' ? '财务' : item.role === 'TREASURER' ? '会计' : '驻厂'}</Text>
                    </View>
                    <View style={styles.content}>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={styles.titleText}>{item.role === 'FINANCE' ? '财务' : item.role === 'TREASURER' ? '会计' : '驻厂'}审核.</Text>
                        <TouchableOpacity onPress={() => applyResult(item)}>
                          <Text style={[styles.titleText, { color: '#409EFF', fontSize: item.pass === null ? 35 : 26 }]}>{item.pass === null ? '待审核' : item.pass === true ? '通过' : '拒绝'}</Text>
                        </TouchableOpacity>
                        {item.remark && <Text style={[styles.timeText, { marginLeft: 10 }]}>原因：{item.remark}</Text>}
                      </View>
                      <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.timeText}>{item.role === 'FINANCE' ? '财务' : item.role === 'TREASURER' ? '会计' : '驻厂'}</Text>
                        {item.userName && <Text style={styles.box}>[<Text style={styles.nameText}>{item.userName}</Text>]</Text>}
                        <TouchableOpacity onPress={() => callPhones(item)}><Text style={styles.nameText}>{item.mobile}</Text></TouchableOpacity>
                        <Text style={styles.timeText}>{item.time ? moment(item.time).format('YYYY-MM-DD HH:mm:ss') : ''}</Text>
                      </View>
                    </View>
                  </View>
                  {item.pass === false && <>
                    <View style={styles.line}></View>
                    <View style={styles.stepBoxStyle}>
                      <View style={[styles.border, { backgroundColor: 'red', borderColor: 'red' }]}>
                        <Text style={[styles.borderText, { color: '#fff' }]}>终止</Text>
                      </View>
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 20 }}>
                        <Text style={[styles.titleText]}>审批流程终止结束</Text>
                      </View>
                    </View>
                  </>
                  }
                </View>
              )
            })
          }
        </View>
        <Dialog
          isVisible={visible4}
        >
          <View style={styles.dialogContent}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ color: '#333', textAlign: 'center', fontWeight: 'bold', fontSize: 20, marginLeft: 80 }} >审批意见</Text>
              <TouchableOpacity onPress={() => setVisible4(false)}>
                <AntDesign
                  name='closecircle'
                  size={20}
                  style={{ textAlign: 'right' }}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.resultArea}>
              {
                statusPress && statusPress.map((item, index) => {
                  return (
                    <TouchableOpacity key={index} style={[styles.buttom, { backgroundColor: item.title === '拒绝' ? 'red' : '#409EFF' }]} onPress={item.title === '同意' ? () => pressPass(item) : () => pressFail(item)} >
                      <Text style={styles.buttomText}>{item.title}</Text>
                    </TouchableOpacity>
                  )
                })
              }
            </View>
            {
              isApply && <>
                <View style={styles.reason}>
                  <Text>审批意见：</Text>
                  <TextInput
                    style={styles.inputStyle}
                    placeholder="请输入审核意见"
                    multiline
                    onChangeText={onChangeRemark}
                  />
                </View>
                <View>
                  <Text style={styles.remark}>注：审批拒绝后，审批流程将终止。</Text>
                </View>
                <View style={{ flexDirection: 'row', marginTop: 30, justifyContent: 'space-between' }}>
                  <Button
                    title="取消"
                    onPress={() => setVisible4(!visible4)}
                    buttonStyle={[styles.comfirmStyle]}
                    titleStyle={styles.comfirmText}
                    containerStyle={styles.buttonContainerStyle}
                  />
                  <Button
                    title="确认"
                    onPress={handleSubmit}
                    buttonStyle={styles.comfirmStyle}
                    titleStyle={styles.comfirmText}
                    containerStyle={styles.buttonContainerStyle}
                  />
                </View>
              </>
            }
            {/* <>
              <View style={styles.reason}>
                <Text>费用记账月份：</Text>
                <TouchableOpacity style={styles.pickerTouchable}>
                  <AntDesign
                    name='calendar'
                    size={16}
                  />
                  <Text style={styles.font}>2022-10-20</Text>
                </TouchableOpacity>
              </View>
              <View>
                <Text style={styles.remark}>注:财务审核时，务必填写费用归属记账月份，便于发薪前扣除已发生的所有借款、预支薪资。</Text>
              </View>
            </> */}
          </View>
        </Dialog>
      </View>
      <NormalDialog
        ref={dialogRef}
        dialogContent={dialogContent}
      />
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
    marginBottom: 30,
  },
  stepBoxStyle: {
    flexDirection: 'row',
    marginHorizontal: 0
  },
  border: {
    flexDirection: 'row',
    width: 70,
    height: 70,
    backgroundColor: '#fff',
    borderColor: '#409EFF',
    borderWidth: 2,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },
  borderText: {
    fontSize: 26,
    color: '#409EFF',
    textAlign: 'center'
  },
  box: {
    fontSize: 27,
    color: '#333',
    marginLeft: 10,
    marginRight: 10
  },
  content: {
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    marginLeft: 20,
  },
  titleText: {
    fontSize: 26,
    color: '#333',
  },
  nameText: {
    fontSize: 26,
    color: '#409EFF',
    marginRight: 20
  },
  timeText: {
    fontSize: 26,
    color: '#333',
  },
  line: {
    height: 50,
    borderLeftWidth: 4,
    borderColor: '#409EFF',
    marginHorizontal: 33,
  },
  dialogContent: {
    paddingHorizontal: 0,
    justifyContent: 'space-between'
  },
  resultArea: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    // marginHorizontal: 30,
    marginTop: 20,
  },
  buttom: {
    width: 80,
    height: 35,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#409EFF',
    borderRadius: 5
  },
  buttomText: {
    fontSize: 20,
    color: '#fff'
  },
  reason: {
    flexDirection: 'row',
    marginHorizontal: 20,
    alignItems: 'center',
    marginTop: 20
  },
  inputStyle: {
    flexDirection: 'row',
    width: 150,
    minHeight: 60,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, .05)',
    flexWrap: 'wrap',
    paddingHorizontal: 10
  },
  remark: {
    fontSize: 14,
    color: '#FF4040',
    marginHorizontal: 20,
    marginTop: 10
  },
  comfirmStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    height: 30,
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 0,
  },
  comfirmText: {
    fontSize: 16,
    color: '#333'
  },
  buttonStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 680,
    height: 60,
    backgroundColor: '#409EFF',
    borderColor: 'transparent',
    borderWidth: 0,
    borderRadius: 50,
    margin: 30,
  },
  pickerTouchable: {
    flex: 1,
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, .05)',
  },
  font: {
    flex: 1,
    textAlign: 'center',
    color: '#999999',
    fontSize: 14
  },
})

export default AdvanceAudit;