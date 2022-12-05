import React, {useState, useEffect, useRef, useImperativeHandle, forwardRef} from "react";
import { ScrollView, Text, View, StyleSheet, Linking, TouchableOpacity } from "react-native";
import { Shadow } from 'react-native-shadow-2';
import { Formik, Field } from 'formik';
import moment from "moment";
import { useToast } from "react-native-toast-notifications";
import { useDispatch } from "react-redux";
import Entypo from 'react-native-vector-icons/Entypo';

import SelectTimeOfFilterMore from '../../../../../HeaderSearchOfDormitory/FilterMore/SelectTimeOfFilterMore';
import SelectItemOfFilterMore from '../../../../../HeaderSearchOfDormitory/FilterMore/SelectItemOfFilterMore';
import DormitoryListApi from '../../../../../../request/Dormitory/DormitoryListApi';
import { SUCCESS_CODE } from '../../../../../../utils/const';
import { closeDialog } from "../../../../../../redux/features/PageDialog";

let restForm;

const initialValues = {
  leaveDate: '',
  stayDate: '',
  buildingNum: [],
  floorNum: [],
  roomNum: [],
  bedNum: [],
  liveExpireDate: ''
};

const Adjust = ({
  dormitoryInfo,
  refresh
}, ref) => {
  const scrollViewRef = useRef(null);
  const toast = useToast();
  const dispatch = useDispatch();

  const [bottomError, setBottomError] = useState(false);
  const [topError, setTopError] = useState(false);
  const [dormitoryList, setDormitoryList] = useState([]);

  useImperativeHandle(ref, () => {
    return { restForm };
  }, [restForm]);

  useEffect(()=>{
    if(dormitoryInfo.liveInType === 'DORM_ROUTINE'){
      getNormalDormitoryList(); //获取常规宿舍列表
    }else{
      getTemporaryDormitoryList(); //获取临时宿舍列表
    }
  },[dormitoryInfo])

  const getNormalDormitoryList = async() => {
    try {
      const res = await DormitoryListApi.getNormalDormitoryListWithoutIdNo(dormitoryInfo.idNo);
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
      console.log('res.data', res.data);
    } catch (error) {
      console.log('getNormalDormitoryList->error', error);
      toast.show(`出现了意料之外的问题，请联系管理员处理`, { type: 'danger' });
    }
  };

  const getTemporaryDormitoryList = async() => {
    try {
      const res = await DormitoryListApi.getTemporaryDormitoryList(dormitoryInfo.idNo);
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
    if(dormitoryInfo.liveInType === 'DORM_TEMPORARY' && !values.liveExpireDate.length){
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
    const formatValue = {
      liveOutDate: values.leaveDate,
      nextLiveInDate: moment(values.leaveDate).add(1, 'd').format('YYYY-MM-DD'),
      roomBedId: values.bedNum.length ? values.bedNum[0].value : '',
      liveExpireDate: dormitoryInfo.liveInType === 'DORM_TEMPORARY' ? values.liveExpireDate : '',
    };
    adjustDormitory(formatValue);
  };

  const adjustDormitory = async(params) => {
    try {
      const res = await DormitoryListApi.adjustDormitory(params, dormitoryInfo.id);
      console.log('adjustDormitory -> res', res);
      if(res?.code !== SUCCESS_CODE){
        toast.show(`${res?.msg}`, {type: 'danger'});
        return;
      }
      toast.show('调迁成功！', {type: 'success'});
      dispatch(closeDialog());
      refresh && refresh();
    } catch (error) {
      console.log('adjustDormitory->error', error);
      toast.show(`出现了意料之外的问题，请联系管理员处理`, { type: 'danger' });
    }
  };

  const selectOtherFunc = (type, date) => {
    restForm.setFieldValue('stayDate', moment(date).add(1, 'd').format('YYYY-MM-DD'));
    if(type === 'leaveDate'){
      scrollViewRef?.current?.scrollToEnd();
    }
  };

  const selectOtherFuncOnStay = (type, date) => restForm.setFieldValue('leaveDate', moment(date).subtract(1, 'd').format('YYYY-MM-DD'));

  const callPhone = () => {
    if(!dormitoryInfo.mobile) return;
    Linking.openURL(`tel:${dormitoryInfo.mobile}`);
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}>
      {({...rest}) => {
        restForm = rest;
        return (
          <>
            <View style={{padding: 20, paddingLeft: 30, paddingBottom: 0}}>
              <Text style={styles.itemText}>会员姓名：{dormitoryInfo.userName}</Text>
              <TouchableOpacity style={{flexDirection: 'row'}} onPress={callPhone}>
                <Text selectable style={styles.itemText}>会员手机号：<Text selectable style={dormitoryInfo.mobile && styles.blueText}>{dormitoryInfo.mobile || '无'}</Text></Text>
                {dormitoryInfo.mobile && <Entypo name='phone' size={32} color='#409EFF'/>}
              </TouchableOpacity>
              <Text selectable style={styles.itemText}>会员身份证号：<Text selectable style={styles.blueText}>{dormitoryInfo.idNo}</Text></Text>
            </View>
            <ScrollView ref={scrollViewRef} showsVerticalScrollIndicator={false}>
              <View style={{padding: 20, paddingBottom: 0, paddingTop: 10}}>
                <Shadow style={styles.dormitoryArea}>
                  <View style={styles.dormitoryArea_topArea}>
                    <Text style={styles.dormitoryArea_topAreaText}>调迁前宿舍</Text>
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
                    <View style={styles.listItem}>
                      <View style={styles.leftTitle}>
                        <Text style={styles.titleText}>入住日期</Text>
                      </View>
                      <Text style={styles.rightText}>{dormitoryInfo.liveInDate ? moment(dormitoryInfo.liveInDate).format('YYYY-MM-DD') : '无'}</Text>
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
                          startLimit={moment().format('YYYY-MM-DD')}
                          endLimit={moment().add(3, 'd').format('YYYY-MM-DD')}
                          selectOtherFunc={selectOtherFunc}
                          component={SelectTimeOfFilterMore}
                        />
                      </View>
                    </View>
                    {topError && <Text style={{fontSize: 20, color: 'red', textAlign: 'center', marginVertical: 2}}>表单未填写完整！</Text>}
                  </View>
                </Shadow>
              </View>
              <View style={{padding: 20, paddingBottom: 0, paddingTop: 0}}>
                <Shadow style={styles.dormitoryArea}>
                  <View style={styles.dormitoryArea_topArea}>
                    <Text style={styles.dormitoryArea_topAreaText}>调迁后宿舍</Text>
                  </View>
                  {bottomError && <Text style={{fontSize: 20, color: 'red', textAlign: 'center', marginVertical: 2}}>表单未填写完整！</Text>}
                  <View style={[styles.dormitoryArea_bottomArea, bottomError && {marginTop: 0}]}>
                    <View style={styles.listItem}>
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
                          startLimit={moment().add(1, 'd').format('YYYY-MM-DD')}
                          endLimit={moment().add(4, 'd').format('YYYY-MM-DD')}
                          selectOtherFunc={selectOtherFuncOnStay}
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
                          selectList={dormitoryList}
                          borderColor="#EFEFEF"
                          selectStyle={{height: 40, borderRadius: 4}}
                          component={SelectItemOfFilterMore}
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
                          component={SelectItemOfFilterMore}
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
                          component={SelectItemOfFilterMore}
                        />
                      </View>
                    </View>
                    <View style={dormitoryInfo.liveInType === 'DORM_TEMPORARY' ? styles.listItem : styles.lastItem}>
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
                          component={SelectItemOfFilterMore}
                        />
                      </View>
                    </View>
                    {dormitoryInfo.liveInType === 'DORM_TEMPORARY' && <View style={styles.lastItem}>
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
                          startLimit={moment(dormitoryInfo.liveInDate).format('YYYY-MM-DD')}
                          endLimit={moment(dormitoryInfo.liveInDate).add(3, 'd').format('YYYY-MM-DD')}
                          selectOtherFunc={selectOtherFunc}
                          component={SelectTimeOfFilterMore}
                        />
                      </View>
                    </View>}
                  </View>
                </Shadow>
              </View>
            </ScrollView>
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
  lineArea: {
    flex: 1, 
    height: '100%', 
    paddingHorizontal: 5
  },
  joinInDate: {
    fontSize: 24, 
    color: '#999999', 
    marginTop: 8, 
    marginLeft: 20
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
  },
})

export default forwardRef(Adjust);