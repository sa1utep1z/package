import React, {useState, useRef, useEffect} from "react";
import { ScrollView, Text, View, TouchableOpacity, StyleSheet, ActivityIndicator, Linking } from "react-native";
import { Shadow } from 'react-native-shadow-2';
import { Formik, Field } from 'formik';
import moment from "moment";
import Entypo from 'react-native-vector-icons/Entypo';
import { useToast } from "react-native-toast-notifications";
import { useDispatch } from "react-redux";

import SelectTimeOfFilterMore from '../../../../HeaderSearchOfDormitory/FilterMore/SelectTimeOfFilterMore';
import SelectItemOfFilterMore3 from '../../../../PageDialog3/SelectItemOfFilterMore3';
import DormitoryListApi from '../../../../../request/Dormitory/DormitoryListApi';
import { SUCCESS_CODE } from '../../../../../utils/const';
import * as PageDialog1 from "../../../../../redux/features/PageDialog";
import * as PageDialog2 from "../../../../../redux/features/PageDialog2"

let restForm;

const initialValues = {
  leaveDate: '',
  joinInDate: '',
  buildingNum: [],
  floorNum: [],
  roomNum: [],
  bedNum: [],
  liveExpireDate: ''
};

const AdjustDormitory = ({
  memberMsg,
  refresh
}) => {
  const scrollViewRef = useRef(null);
  const toast = useToast();
  const dispatch = useDispatch();

  const [bottomError, setBottomError] = useState(false);
  const [topError, setTopError] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [dormitoryList, setDormitoryList] = useState([]);

  useEffect(()=>{
    if(memberMsg.ability === 'DORM_TEMPORARY'){
      getTemporaryDormitoryList(memberMsg.idNo); //获取临时宿舍列表
    }else{
      getNormalDormitoryList(memberMsg.idNo); //获取常规宿舍列表
    }
  },[memberMsg])

  const getNormalDormitoryList = async(idNo) => {
    try {
      const res = await DormitoryListApi.getNormalDormitoryListWithoutIdNo(idNo);
      console.log('getNormalDormitoryList --> res', res);
      if(res?.code !== SUCCESS_CODE){
        toast.show(`${res?.msg}`, {type: 'danger'});
        return;
      }
      res.data.forEach(item => {
        item.value = item.id;
        item.label = item.name;
        if(item.floors.length){
          item.floors.forEach(item => {
            item.value = item.id;
            item.label = `${item.index}F`;
            if(item.rooms.length){
              item.rooms.forEach(item => {
                item.value = item.id;
                item.label = `${item.name}房`;
                if(item.beds.length){
                  item.beds.forEach(item => {
                    item.value = item.id;
                    item.label = `${item.bedNo}床`;
                  })
                }
              })
            }
          })
        }
      })
      setDormitoryList(res.data);
    } catch (error) {
      console.log('getNormalDormitoryList->error', error);
      toast.show(`出现了意料之外的问题，请联系管理员处理`, { type: 'danger' });
    }
  };

  const getTemporaryDormitoryList = async(idNo) => {
    try {
      const res = await DormitoryListApi.getTemporaryDormitoryList(idNo);
      console.log('getTemporaryDormitoryList --> res', res);
      if(res?.code !== SUCCESS_CODE){
        toast.show(`${res?.msg}`, {type: 'danger'});
        return;
      }
      res.data.forEach(item => {
        item.value = item.id;
        item.label = item.name;
        if(item.floors.length){
          item.floors.forEach(item => {
            item.value = item.id;
            item.label = `${item.index}F`;
            if(item.rooms.length){
              item.rooms.forEach(item => {
                item.value = item.id;
                item.label = `${item.name}房`;
                if(item.beds.length){
                  item.beds.forEach(item => {
                    item.value = item.id;
                    item.label = `${item.bedNo}床`;
                  })
                }
              })
            }
          })
        }
      })
      setDormitoryList(res.data);
    } catch (error) {
      console.log('getTemporaryDormitoryList->error', error);
      toast.show(`出现了意料之外的问题，请联系管理员处理`, { type: 'danger' });
    }
  };

  const checkValues = (values) => {
    let returnValue = false;
    let fieldNameList = ['bedNum', 'buildingNum', 'floorNum', 'roomNum'];
    const isNoneFieldValue = fieldNameList.some(fieldName => !values[fieldName].length);
    if(!values.leaveDate.length){
      setTopError(true);
      returnValue = true;
    }else{
      setTopError(false);
      returnValue = false;
    }
    if(isNoneFieldValue){
      scrollViewRef?.current?.scrollToEnd();
      setBottomError(true);
      returnValue = true;
      return returnValue;
    }else{
      setBottomError(false);
      returnValue = false;
    }
    if(memberMsg.ability === 'DORM_TEMPORARY' && !values.liveExpireDate.length){
      scrollViewRef?.current?.scrollToEnd();
      setBottomError(true);
      returnValue = true;
      return returnValue;
    }else{
      setBottomError(false);
      returnValue = false;
    }
    return returnValue;
  }

  const onSubmit = (values) => {
    const hasError = checkValues(values);
    if(hasError) return;
    if(btnLoading) return;
    const formatValue = {
      liveOutDate: values.leaveDate,
      nextLiveInDate: moment(values.leaveDate).add(1, 'd').format('YYYY-MM-DD'),
      roomBedId: values.bedNum.length ? values.bedNum[0].value : '',
      liveExpireDate: memberMsg.ability === 'DORM_TEMPORARY' ? values.liveExpireDate : '',
    };
    adjustDormitory(formatValue);
  };

  const adjustDormitory = async(params) => {
    try {
      setBtnLoading(true);
      const res = await DormitoryListApi.adjustDormitory(params, memberMsg.id);
      console.log('adjustDormitory -> res', res);
      if(res?.code !== SUCCESS_CODE){
        toast.show(`${res?.msg}`, {type: 'danger'});
        return;
      }
      toast.show('调迁成功！', {type: 'success'});
      dispatch(PageDialog1.closeDialog());
      dispatch(PageDialog2.closeDialog());
      refresh && refresh();
    } catch (error) {
      console.log('adjustDormitory->error', error);
      toast.show(`出现了意料之外的问题，请联系管理员处理`, { type: 'danger' });
    } finally {
      setBtnLoading(false);
    }
  };

  const selectOtherFuncOfLeaveDate = (type, date) => {
    restForm.setFieldValue('joinInDate', moment(date).add(1, 'd').format('YYYY-MM-DD'));
    if(type === 'leaveDate'){
      scrollViewRef?.current?.scrollToEnd();
    }
  };

  const selectOtherFuncOfJoinInDate = (type, date) => restForm.setFieldValue('leaveDate', moment(date).subtract(1, 'd').format('YYYY-MM-DD'));

  const callPhone = () => {
    if(!memberMsg.mobile) return;
    Linking.openURL(`tel:${memberMsg.mobile}`);
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}>
      {({...rest}) => {
        restForm = rest;
        return (
          <View style={styles.totalArea}>
            <View style={{paddingRight: 20, paddingLeft: 30}}>
              <Text style={styles.itemText}>会员姓名：{memberMsg.name || '无'}</Text>
              <TouchableOpacity style={{flexDirection: 'row'}} onPress={callPhone}>
                <Text selectable style={styles.itemText}>会员手机号：<Text selectable style={memberMsg.mobile && styles.blueText}>{memberMsg.mobile || '无'}</Text></Text>
                {memberMsg.mobile && <Entypo name='phone' size={32} color='#409EFF'/>}
              </TouchableOpacity>
              <Text selectable style={styles.itemText}>会员身份证号：<Text selectable style={styles.blueText}>{memberMsg.idNo}</Text></Text>
            </View>
            <ScrollView ref={scrollViewRef} showsVerticalScrollIndicator={false}>
              <View style={styles.topShadowArea}>
                <Shadow style={styles.dormitoryArea}>
                  <View style={styles.dormitoryArea_topArea}>
                    <Text style={styles.dormitoryArea_topAreaText}>调迁前宿舍</Text>
                  </View>
                  <View style={[styles.dormitoryArea_bottomArea, topError && {marginBottom: 0}]}>
                    <View style={styles.listItem}>
                      <View style={styles.leftTitle}>
                        <Text style={styles.titleText}>入住类别</Text>
                      </View>
                      <Text style={styles.rightText}>{memberMsg.ability === 'DORM_TEMPORARY' ? '临时住宿' : '常规住宿'}</Text>
                    </View>
                    <View style={styles.listItem}>
                      <View style={styles.leftTitle}>
                        <Text style={styles.titleText}>宿舍分类</Text>
                      </View>
                      <Text style={styles.rightText}>{memberMsg.male ? '男生宿舍' : '女生宿舍'}</Text>
                    </View>
                    <View style={styles.listItem}>
                      <View style={styles.leftTitle}>
                        <Text style={styles.titleText}>宿舍楼栋</Text>
                      </View>
                      <Text style={styles.rightText}>{memberMsg.building || '无'}</Text>
                    </View>
                    <View style={styles.listItem}>
                      <View style={styles.leftTitle}>
                        <Text style={styles.titleText}>宿舍楼层</Text>
                      </View>
                      <Text style={styles.rightText}>{memberMsg.floor ? `${memberMsg.floor}F` : '无'}</Text>
                    </View>
                    <View style={styles.listItem}>
                      <View style={styles.leftTitle}>
                        <Text style={styles.titleText}>房间号</Text>
                      </View>
                      <Text style={styles.rightText}>{memberMsg.roomName || '无'}</Text>
                    </View>
                    <View style={styles.listItem}>
                      <View style={styles.leftTitle}>
                        <Text style={styles.titleText}>床位号</Text>
                      </View>
                      <Text style={styles.rightText}>{memberMsg.bedNo ? `${memberMsg.bedNo}号床` : '无'}</Text>
                    </View>
                    <View style={styles.listItem}>
                      <View style={styles.leftTitle}>
                        <Text style={styles.titleText}>入住日期</Text>
                      </View>
                      <Text style={styles.rightText}>{memberMsg.date ? moment(memberMsg.date).format('YYYY-MM-DD') : '无'}</Text>
                    </View>
                    <View style={styles.lastItem}>
                      <View style={styles.leftTitle}>
                        <Text style={styles.titleText}>退宿日期</Text>
                      </View>
                      <View style={styles.lineArea}>
                        <Field
                          name="leaveDate"
                          label="退宿日期"
                          fontSize={24}
                          iconSize={28}
                          canDelete={false}
                          showLabel={false}
                          showArrow={false}
                          borderColor="#EFEFEF"
                          itemAreaStyle={{height: 50}}
                          touchAreaStyle={{height: 40, borderRadius: 4}}
                          startLimit={moment(memberMsg.date).add(1, 'd').format('YYYY-MM-DD')}
                          endLimit={moment().add(3, 'd').format('YYYY-MM-DD')}
                          selectOtherFunc={selectOtherFuncOfLeaveDate}
                          component={SelectTimeOfFilterMore}
                        />
                      </View>
                    </View>
                    {topError && <Text style={styles.noticeText}>表单未填写完整！</Text>}
                  </View>
                </Shadow>
              </View>
              <View style={styles.bottomShadowArea}>
                <Shadow style={[styles.dormitoryArea, {marginBottom: 10}]}>
                  <View style={styles.dormitoryArea_topArea}>
                    <Text style={styles.dormitoryArea_topAreaText}>调迁后宿舍</Text>
                  </View>
                  <View style={[styles.dormitoryArea_bottomArea, bottomError && {marginBottom: 0}]}>
                    <View style={styles.listItem}>
                      <View style={styles.leftTitle}>
                        <Text style={styles.titleText}>入住日期</Text>
                      </View>
                      <View style={styles.lineArea}>
                        <Field
                          name="joinInDate"
                          label="入住日期"
                          fontSize={24}
                          iconSize={28}
                          canDelete={false}
                          showLabel={false}
                          showArrow={false}
                          borderColor="#EFEFEF"
                          itemAreaStyle={{height: 50}}
                          touchAreaStyle={{height: 40, borderRadius: 4}}
                          startLimit={moment(memberMsg.date).add(2, 'd').format('YYYY-MM-DD')}
                          endLimit={moment().add(4, 'd').format('YYYY-MM-DD')}
                          selectOtherFunc={selectOtherFuncOfJoinInDate}
                          component={SelectTimeOfFilterMore}
                        />
                      </View>
                    </View>
                    <View style={styles.listItem}>
                      <View style={styles.leftTitle}>
                        <Text style={styles.titleText}>宿舍楼栋</Text>
                      </View>
                      <View style={styles.lineArea}>
                        <Field
                          name="buildingNum"
                          label="宿舍楼栋"
                          fontSize={24}
                          iconSize={28}
                          canDelete={false}
                          showLabel={false}
                          showArrow={false}
                          borderColor="#EFEFEF"
                          selectList={dormitoryList}
                          selectStyle={{height: 40, borderRadius: 4}}
                          component={SelectItemOfFilterMore3}
                        />
                      </View>
                    </View>
                    <View style={styles.listItem}>
                      <View style={styles.leftTitle}>
                        <Text style={styles.titleText}>楼层</Text>
                      </View>
                      <View style={styles.lineArea}>
                        <Field
                          name="floorNum"
                          label="楼层"
                          fontSize={24}
                          iconSize={28}
                          canDelete={false}
                          showLabel={false}
                          showArrow={false}
                          borderColor="#EFEFEF"
                          selectList={rest.values.buildingNum.length ? rest.values.buildingNum[0].floors : []}
                          selectStyle={{height: 40, borderRadius: 4}}
                          component={SelectItemOfFilterMore3}
                        />
                      </View>
                    </View>
                    <View style={styles.listItem}>
                      <View style={styles.leftTitle}>
                        <Text style={styles.titleText}>房间号</Text>
                      </View>
                      <View style={styles.lineArea}>
                        <Field
                          name="roomNum"
                          label="房间号"
                          fontSize={24}
                          iconSize={28}
                          canDelete={false}
                          showLabel={false}
                          showArrow={false}
                          borderColor="#EFEFEF"
                          selectList={rest.values.floorNum.length ? rest.values.floorNum[0].rooms : []}
                          selectStyle={{height: 40, borderRadius: 4}}
                          component={SelectItemOfFilterMore3}
                        />
                      </View>
                    </View>
                    <View style={styles.listItem}>
                      <View style={styles.leftTitle}>
                        <Text style={styles.titleText}>床位号</Text>
                      </View>
                      <View style={styles.lineArea}>
                        <Field
                          name="bedNum"
                          label="床位号"
                          fontSize={24}
                          iconSize={28}
                          canDelete={false}
                          showLabel={false}
                          showArrow={false}
                          borderColor="#EFEFEF"
                          selectList={rest.values.roomNum.length ? rest.values.roomNum[0].beds : []}
                          selectStyle={{height: 40, borderRadius: 4}}
                          component={SelectItemOfFilterMore3}
                        />
                      </View>
                    </View>
                    {memberMsg.ability === 'DORM_TEMPORARY' && <View style={styles.lastItem}>
                    <View style={styles.leftTitle}>
                      <Text style={styles.titleText}>临时期限</Text>
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
                        startLimit={moment(memberMsg.date).format('YYYY-MM-DD')}
                        endLimit={moment(memberMsg.date).add(3, 'd').format('YYYY-MM-DD')}
                        component={SelectTimeOfFilterMore}
                      />
                    </View>
                  </View>}
                    {bottomError && <Text style={styles.noticeText}>表单未填写完整！</Text>}
                  </View>
                </Shadow>
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
  totalArea: {
    height: 900,
  },
  blueText: {
    color: '#409EFF'
  },
  itemText: {
    fontSize: 26, 
    color: '#333333', 
    marginBottom: 10
  },
  topInfoArea: {
    height: 100, 
    backgroundColor: '#999999', 
    marginHorizontal: 20, 
    borderRadius: 8, 
    marginBottom: 10
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
  typeArea: {
    height: 40,
    borderWidth: 1,
    marginTop: 5, 
    borderRadius: 4, 
    borderColor: '#EFEFEF', 
    flexDirection: 'row', 
    paddingLeft: 10
  },
  typeAreaText: {
    textAlignVertical: 'center', 
    fontSize: 22, 
    color: '#333333'
  },
  maleArea: {
    flexDirection: 'row',
    paddingRight: 5
  },
  femaleArea: {
    flexDirection: 'row', 
    paddingRight: 20
  },
  checkBoxContainerStyle: {
    padding: 0, 
    marginRight: 0, 
    alignSelf: 'center'
  },
  topShadowArea: {
    padding: 20, 
    paddingTop: 10, 
    paddingBottom: 0
  },
  bottomShadowArea: {
    padding: 20, 
    paddingBottom: 0,
    paddingTop: 0
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
    margin: 10
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
  noticeText: {
    fontSize: 20, 
    color: 'red', 
    textAlign: 'center', 
    marginVertical: 5
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

export default AdjustDormitory;