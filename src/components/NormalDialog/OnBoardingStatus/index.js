import React, { useState, useRef, useEffect, useMemo } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native';
import { Text, Dialog, Input } from '@rneui/themed';
import { useToast } from 'react-native-toast-notifications';
import AntDesign from 'react-native-vector-icons/AntDesign';
import DateTimePicker from '@react-native-community/datetimepicker';
import { DEFAULT_ONBORADINGSTATUS } from '../../../utils/const';
import moment from "moment";
import { deepCopy } from '../../../utils';
import ListApi from '../../../request/ListApi';
import { SUCCESS_CODE } from '../../../utils/const';

const ListChangeStatus = ({
  memberInfo = [],
  dialogRef,
  batchOperateList = [],
  item,
  refresh,
  navigation
}, ref) => {
  const toast = useToast();
  const inputRef = useRef(null);
  const invalidVal = new Date();
  const [statusList, setStatusList] = useState(DEFAULT_ONBORADINGSTATUS);
  const [inputContent, setInputContent] = useState('');
  const [selectStatus, setSelectStatus] = useState('notCheckedIn');
  const [reasonList, setReasonList] = useState([]);
  const [showReason, setShowReason] = useState(false);
  const [selectDate, setSelectDate] = useState(false);
  const [dateTime, setDateTime] = useState(invalidVal);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    setStatusList(DEFAULT_ONBORADINGSTATUS);
    return () => setStatusList([]);
  }, [])

  useMemo(() => {
    setShowReason(selectStatus === 'notCheckedIn');
    setSelectDate(selectStatus === 'hasEmployed');
  }, [selectStatus])

  const status = memberInfo?.find(item => item.type === 'signUpState');

  const increaseReason = () => {
    setInputContent('');
    const newArr = deepCopy(statusList);
    newArr.push({
      value: `new_value_${statusList.length - (DEFAULT_ONBORADINGSTATUS.length - 1)}`,
      title: inputContent
    })
    setStatusList(newArr);
  };

  const pressReason = (reason) => {
    const originArr = deepCopy(statusList);
    const pressItem = originArr.find(item => item.value === reason.value);
    pressItem.isSelected = !pressItem.isSelected;
    setStatusList(originArr);

    if (reasonList.includes(reason.value)) {
      reasonList.splice(reasonList.findIndex(item => item === reason.value), 1);
      setReasonList(reasonList);
      return;
    }
    reasonList.push(reason.value);
    setReasonList(reasonList);
  };

  // 选择已入职
  const pressStatus = (status) => {
    setSelectStatus(status);
  }

  const dateChange = (event, selectedDate) => {
    setModalVisible(false);
    if(event.type !== "set") return;
    setDateTime(selectedDate);
  };

  // 改变状态
  const changeStatus = () => {
    //批量操作；
    if(batchOperateList.length){
      batchOperate();
      return;
    }
    if (selectStatus === 'notCheckedIn') {
      noEmployed();
      return;
    }
    hasEmployed();
  };

  const getParams = () => {
    let flows = [], reasons = [], params = {};
    //操作项列表
    batchOperateList.length && batchOperateList.map(item => {
      flows.push({label: item.label, value: item.value});
    })
    //状态
    switch(selectStatus){
      case 'notCheckedIn':
        params.status = 'ON_BOARDING_FAIL';
        break;
      case 'hasEmployed':
        params.status = 'ON_BOARDING_PASS';
        params.date = dateTime;
        break;
    }
    //原因
    if(selectStatus !== 'hasEmployed' && statusList.length){
      reasonList.map(item => reasons.push(statusList.find(status => status.value === item).title));
    }
    return {...params, flows, reasons};
  };

  // 批量操作
  const batchOperate = async () => {
    const params = getParams();
    try {
      const res = await ListApi.batchAll(params);
      if (res?.code !== SUCCESS_CODE) {
        toast.show(`请求失败，${res?.msg}。`, { type: 'danger' });
        return;
      }
      toast.show(`成功修改${res.data.total - res.data.failTotal}条。${res.data.failTotal > 0 ? `失败${res.data.failTotal}条，分别是${res.data.failItem.length && res.data.failItem.join('、')}。` : ''}`, { type: 'success' });
      refresh && refresh();
      navigation && navigation.goBack();
    } catch (err) {
      console.log('批量操作ERR', err)
      toast.show(`出现了意料之外的问题，请联系系统管理员处理`, { type: 'danger' });
    } finally {
      dialogRef.current.setShowDialog(false);
    }
  };

  // 未报到
  const noEmployed = async () => {
    dialogRef.current.setShowDialog(false);
    const flowId = item.flowId;
    let reasons = [];
    if (statusList.length) {
      reasonList.map(item => reasons.push(statusList.find(status => status.value === item).title));
    }
    const params = {
      reasons
    };
    try {
      const res = await ListApi.GetNoArrive(flowId, params);
      console.log('res', res)
      if (res?.code !== SUCCESS_CODE) {
        toast.show(`请求失败，${res?.msg}。`, { type: 'danger' });
        return;
      }
      toast.show(`修改状态成功！`, { type: 'success' });
      refresh && refresh();
    } catch (err) {
      console.log('err', err);
      toast.show(`出现了意料之外的问题，请联系系统管理员处理`, { type: 'danger' });
    }
  };

  // 已入职
  const hasEmployed = async () => {
    dialogRef.current.setShowDialog(false);
    const flowId = item.flowId;
    const params = {
      date: moment(dateTime).format('YYYY-MM-DD'),
    }
    try {
      const res = await ListApi.GetPassList(flowId, params);
      console.log('res', res)
      if (res?.code !== SUCCESS_CODE) {
        toast.show(`请求失败，${res?.msg}。`, { type: 'danger' });
        return;
      }
      toast.show(`修改状态成功！`, { type: 'success' });
      refresh && refresh();
    } catch (err) {
      console.log('err', err);
      toast.show(`出现了意料之外的问题，请联系系统管理员处理`, { type: 'danger' });
    }
  };

  return (
    <>
      <View style={styles.msgArea}>
        <View style={{ width: '100%', paddingHorizontal: 10 }}>
          <View style={styles.tagArea}>
            <Text style={[styles.tagArea_title, { marginBottom: 15 }]}>状态选择</Text>
            <View style={styles.tags}>
              <TouchableOpacity style={[styles.tag, selectStatus === 'notCheckedIn' && { backgroundColor: '#409EFF' }]} onPress={() => pressStatus('notCheckedIn')}>
                <Text style={[styles.tag_text, selectStatus === 'notCheckedIn' && { color: '#fff' }]}>未报到</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.tag, selectStatus === 'hasEmployed' && { backgroundColor: '#409EFF' }]} onPress={() => pressStatus('hasEmployed')}>
                <Text style={[styles.tag_text, selectStatus === 'hasEmployed' && { color: '#fff' }]}>已入职</Text>
              </TouchableOpacity>
            </View>
          </View>
          {showReason && <View style={styles.tagArea}>
            <Text style={[styles.tagArea_title, { marginBottom: 15 }]}>原因选择</Text>
            <ScrollView style={{ maxHeight: 150 }}>
              <View style={styles.tags_little}>
                {statusList.length && statusList.map((item, index) => {
                  const isFill = statusList.length % 3 === 2;
                  const isLastElement = index === statusList.length - 1;
                  return (
                    <View key={index}>
                      <TouchableOpacity style={styles.tag_little} onPress={() => pressReason(item)}>
                        <Text style={[styles.tag_littleText, item.isSelected && styles.tag_littleText_selected]}>{item.title}</Text>
                      </TouchableOpacity>
                      {isLastElement && isFill && (<View style={{ width: '33.33%' }}></View>)}
                    </View>
                  )
                })}
              </View>
            </ScrollView>
            <Input
              ref={inputRef}
              value={inputContent}
              onChangeText={text => setInputContent(text)}
              placeholder='手动输入原因'
              containerStyle={styles.input_containerStyle}
              inputContainerStyle={styles.input_inputContainerStyle}
              inputStyle={styles.inputStyle}
              rightIcon={
                <TouchableOpacity style={styles.input_rightIcon} onPress={increaseReason}>
                  <Text style={styles.input_rightIconText}>保存</Text>
                </TouchableOpacity>
              }
            />
          </View>}
          {selectDate && <View style={styles.tagArea}>
            <View style={styles.datePicker}>
              <Text style={styles.tagArea_title}>日期选择</Text>
              <TouchableOpacity style={styles.pickerTouchable} onPress={() => setModalVisible(true)}>
                <AntDesign
                  name='calendar'
                  size={20}
                  style={{ marginHorizontal: 10 }}
                  color='#999999'
                />
                <Text style={styles.font}>{moment(dateTime).format('YYYY-MM-DD')}</Text>
              </TouchableOpacity>
            </View>
            {
              modalVisible && <DateTimePicker
                value={dateTime}
                onChange={dateChange}
              />
            }
          </View>
          }
        </View>
        <View style={styles.bottomButtonArea}>
          <TouchableOpacity style={styles.bottomLeft} onPress={() => dialogRef.current.setShowDialog(false)}>
            <Text style={styles.leftText}>取消</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bottomRight} onPress={changeStatus}>
            <Text style={styles.rightText}>确认</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  )
};

const styles = StyleSheet.create({
  msgArea: {
    alignItems: 'center'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5
  },
  tagArea: {
    borderWidth: 1,
    borderColor: '#EFEFEF',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10
  },
  tagArea_title: {
    fontSize: 15,
    fontWeight: 'bold',
    // marginBottom: 10
  },
  tags: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  tags_little: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  tag: {
    height: 26,
    backgroundColor: '#EEEEEE',
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center'
  },
  tag_text: {
    paddingHorizontal: 30,
    fontSize: 15,
    color: '#999999'
  },
  tag_little: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    marginRight: 8
  },
  tag_littleText: {
    paddingVertical: 3,
    paddingHorizontal: 6,
    fontSize: 14,
    backgroundColor: '#EEEEEE',
    borderRadius: 3,
    color: '#999999'
  },
  tag_littleText_selected: {
    backgroundColor: '#409EFF',
    color: '#fff'
  },
  input_containerStyle: {
    paddingHorizontal: 5,
    height: 28,
    backgroundColor: '#EEEEEE',
    borderRadius: 4,
    marginTop: 10
  },
  input_inputContainerStyle: {
    height: 28,
    borderBottomWidth: 0
  },
  inputStyle: {
    fontSize: 14,
    color: '#999999'
  },
  input_rightIcon: {
    height: '100%',
    justifyContent: 'center'
  },
  input_rightIconText: {
    color: '#fff',
    backgroundColor: '#409EFF',
    paddingHorizontal: 5,
    borderRadius: 3,
    paddingVertical: 1
  },
  bottomButtonArea: {
    flexDirection: 'row',
    height: 45,
    marginTop: 10
  },
  bottomLeft: {
    flex: 1,
    borderTopWidth: 1,
    borderRightWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 6,
    borderColor: '#E3E3E3'
  },
  leftText: {
    fontSize: 16,
    color: '#999999'
  },
  bottomRight: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#E3E3E3',
    borderBottomRightRadius: 6
  },
  rightText: {
    fontSize: 16,
    color: '#409EFF'
  },
  datePicker: {
    // flex: 1,
    flexDirection: 'row',
    alignItems: 'center',

  },
  pickerTouchable: {
    // flex: 1,
    width: 150,
    height: 35,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    marginLeft: 20,
    borderWidth: 1,
    borderColor: '#E3E3E3',
  },
})

export default ListChangeStatus;