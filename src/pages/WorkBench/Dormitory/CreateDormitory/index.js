import React, {useState, useEffect, useRef} from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Shadow } from 'react-native-shadow-2';
import { Formik, Field } from 'formik';
import Entypo from 'react-native-vector-icons/Entypo';
import { useToast } from "react-native-toast-notifications";
import { Button } from '@rneui/themed';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';
import * as Yup from 'yup';

import SingleInput from "../../../../components/OrderForm/SingleInput";
import RadioSelect from "../../../../components/OrderForm/RadioSelect";
import SingleSelect from "../../../../components/OrderForm/SingleSelect";
import OrderSingleDate from "../../../../components/OrderForm/OrderSingleDate";
import OCR_Scan from '../../../../components/OCR_Scan';
import DormitoryListApi from '../../../../request/Dormitory/DormitoryListApi';
import { SUCCESS_CODE, CHANEL_SOURCE_NAME, DORMITORY_LIVE_TYPE, DORMITORY_TYPE } from '../../../../utils/const';
import NAVIGATION_KEYS from '../../../../navigator/key';

let restForm;

const validationSchema = Yup.object().shape({
  memberName: Yup.string().required('请输入姓名'),
  memberPhone: Yup.string().required('请输入手机号'),
  memberIdCard: Yup.string().required('请输入身份证号'),
  memberFrom: Yup.string().required('请输入籍贯'),
  dormitoryType: Yup.array().min(1, '请选择入住类别'),
  bedNum: Yup.array().min(1, '请选择床位号'),
  liveInDate: Yup.string().required('请选择入住日期'),
});
const initialValues = {
  memberName: '',
  memberPhone: '',
  memberIdCard: '',
  memberFrom: '',
  dormitoryType: [],
  maleOrFemale: [],
  buildingNum: [],
  floorNum: [],
  roomNum: [],
  bedNum: [],
  liveInDate: moment().format('YYYY-MM-DD'),
  temporaryLiving: '',
};

const CreateDormitory = ({
  route: {
    params
  }
}) => {
  const OCR_Ref = useRef(null);
  const scrollViewRef = useRef(null);
  const toast = useToast();
  const navigation = useNavigation();

  const [signUpInfoLoading, setSignUpInfoLoading] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false); //这是OCR按钮的loading；
  const [bottomButtonLoading, setBottomButtonLoading] = useState(false); //这是保存按钮的loading；
  const [dormitoryInfoLoading, setDormitoryInfoLoading] = useState(false);
  const [signUpInfo, setSignUpInfo] = useState({});
  const [dormitoryMsg, setDormitoryMsg] = useState([]);
  const [signUpNotice, setSignUpNotice] = useState('请输入身份证号或通过【OCR】拍照读取会员报名信息');
  const [restBedMsg, setRestBedMsg] = useState([]); //在态势图中跳转新增住宿所查询到床位信息；
  const [restBedList, setRestBedList] = useState([]); //在态势图中跳转新增住宿所查询到的剩余床位列表；
  const [queryRestBedListLoading, setQueryRestBedListLoading] = useState(false);

  useEffect(()=>{
    if(params?.type === 'fromRoom'){
      const roomMsg = params.roomMessage;
      if(roomMsg.male){
        restForm.setFieldValue('maleOrFemale', [{label: '男生宿舍', value: 'DORM_MALE'}]);
      }else{
        restForm.setFieldValue('maleOrFemale', [{label: '女生宿舍', value: 'DORM_FEMALE'}]);
      }
      if(roomMsg.ability === 'DORM_TEMPORARY'){
        restForm.setFieldValue('dormitoryType', [{label: '临时住宿', value: 'DORM_TEMPORARY'}]);
      }else{
        restForm.setFieldValue('dormitoryType', [{label: '常规住宿', value: 'DORM_ROUTINE'}]);
      }
      queryRestBedList(roomMsg.roomId);
    }
  },[params])

  const onSubmit = (values) => {
    const formatFieldValue = {
      userName: values.memberName,
      mobile: values.memberPhone,
      idNo: values.memberIdCard,
      hometown: values.memberFrom,
      liveInType: values.dormitoryType[0].value,
      liveInDate: values.liveInDate,
      liveExpireDate: values.dormitoryType[0].value === 'DORM_TEMPORARY' ? values.temporaryLiving : '',
      roomBedId: values.bedNum[0].value,
    };
    addDormitoryInfo(formatFieldValue);
  };

  const queryRestBedList = async(roomId) => {
    try {
      setQueryRestBedListLoading(true);
      const res = await DormitoryListApi.queryRestBedList(roomId);
      console.log('queryRestBedList -> res', res);
      if(res?.code !== SUCCESS_CODE){
        toast.show(`${res?.msg}`, {type: 'danger'});
        return;
      }
      setRestBedMsg(res.data);
      if(res.data.beds.length){
        res.data.beds.map(item => {
          item.value = item.roomBedId;
          item.label = item.bedNo;
        });
        setRestBedList(res.data.beds);
      }
    } catch (error) {
      console.log('queryRestBedList -> error', error);
      toast.show(`出现了意料之外的问题，请联系系统管理员处理`, { type: 'danger' });
    } finally {
      setQueryRestBedListLoading(false);
    }
  };

  const addDormitoryInfo = async(formatParams) => {
    try {
      setBottomButtonLoading(true);
      console.log('addDormitoryInfo -> formatParams', formatParams);
      const res = await DormitoryListApi.addDormitoryInfo(formatParams);
      console.log('addDormitoryInfo -> res', res);
      if(res?.code !== SUCCESS_CODE){
        toast.show(`${res?.msg}`, {type: 'danger'});
        return;
      }
      toast.show(`新增住宿成功！`, { type: 'success' });
      if(params?.type === 'fromRoom'){
        navigation.goBack();
        params.refresh && params.refresh();
        return;
      }else{
        navigation.navigate(NAVIGATION_KEYS.DORMITORY_LIST, {
          refresh: true
        });
      }
    } catch (error) {
      console.log('error', error)
      toast.show(`出现了意料之外的问题，请联系系统管理员处理`, { type: 'danger' });
    } finally{
      setBottomButtonLoading(false);
    }
  };

  const openOCR = () => !buttonLoading && OCR_Ref?.current.setModalVisible(true);

  const IdCardOnInput = (value) => {
    if(value.length === 18){
      const sexNum = value[16];
      restForm.setFieldValue('maleOrFemale', [{label: `${sexNum % 2 === 0 ? '女生' : '男生'}宿舍`, value: `${sexNum % 2 === 0 ? 'DORM_FEMALE' : 'DORM_MALE'}`}]);
      queryMemberFlowId(value);
    }else{
      restForm.setFieldValue('maleOrFemale', []);
      setSignUpInfo({});
      setSignUpNotice('请输入身份证号或通过【OCR】拍照读取会员报名信息');
    }
  };

  const queryMemberFlowId = async(memberId) => {
    setSignUpInfoLoading(true);
    try {
      const res = await DormitoryListApi.getSignUpInfo(memberId);
      console.log('queryMemberFlowId -> res', res);
      if(res?.code !== SUCCESS_CODE){
        toast.show(`${res?.msg}`, {type: 'danger'});
        setSignUpNotice('无该会员报名信息，请确认身份证号是否正确！');
        return;
      }
      toast.show(`成功查询报名信息`, { type: 'success' });
      setSignUpInfo({...res.data});
      res.data.userName && restForm.setFieldValue('memberName', res.data.userName);
      res.data.mobile && restForm.setFieldValue('memberPhone', res.data.mobile);
    } catch (error) {
      console.log('queryMemberFlowId -> error', error);
      toast.show(`出现了意料之外的问题，请联系系统管理员处理`, { type: 'danger' });
    } finally {
      setSignUpInfoLoading(false);
    }
  };

  const getDormitoryList = async(dormitoryType) => {
    if(!signUpInfo?.signUpType) return;
    setDormitoryInfoLoading(true);
    try {
      let res, memberId = restForm.values.memberIdCard;
      switch(dormitoryType){
        case 'DORM_ROUTINE':
          res = await DormitoryListApi.getNormalDormitoryList(memberId, signUpInfo.companyId);
          console.log('DORM_ROUTINE -> res', res);
          break;
        case 'DORM_TEMPORARY':
          res = await DormitoryListApi.getTemporaryDormitoryList(memberId);
          console.log('DORM_TEMPORARY -> res', res);
          break;
      }
      if(res?.code !== SUCCESS_CODE){
        toast.show(`${res?.msg}`, {type: 'danger'});
        return;
      }
      scrollViewRef?.current?.scrollToEnd();
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
      setDormitoryMsg(res.data);
      restForm.setFieldValue('buildingNum', []);
      restForm.setFieldValue('floorNum', []);
      restForm.setFieldValue('roomNum', []);
      restForm.setFieldValue('bedNum', []);
    } catch (error) {
      toast.show(`出现了意料之外的问题，请联系系统管理员处理`, { type: 'danger' });
    } finally{
      setDormitoryInfoLoading(false);
    }
  };

  const queryOCRInfo = (OCRMsg) => IdCardOnInput(OCRMsg.idNo);

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}>
      {({...rest }) => {
        restForm = rest;
        useEffect(()=>{
          if(rest.values.dormitoryType.length){
            getDormitoryList(rest.values.dormitoryType[0].value);
          }
        },[rest.values.dormitoryType])
        return (
          <>
            <ScrollView ref={scrollViewRef} style={styles.screen} keyboardShouldPersistTaps="handled">
              <View style={{flex: 1, paddingHorizontal: 20, paddingTop: 30}}>
                <Shadow style={styles.shadowArea}>
                  <View style={styles.content}>
                    <View style={styles.titleArea}>
                      <Text style={styles.titleText}>会员信息</Text>
                    </View>
                    <View style={styles.shadowContent_memberInfo}>
                      <View style={{flex: 1}}>
                        <Field
                          name="memberName"
                          label="姓名"
                          selectTextOnFocus
                          isRequire
                          clearIcon
                          labelStyle={{width: 160}}
                          component={SingleInput}
                        />
                        <Field
                          name="memberPhone"
                          label="手机号"
                          selectTextOnFocus
                          isRequire
                          clearIcon
                          maxLength={11}
                          labelStyle={{width: 160}}
                          component={SingleInput}
                        />
                        <Field
                          name="memberIdCard"
                          label="身份证号"
                          selectTextOnFocus
                          isRequire
                          clearIcon
                          maxLength={18}
                          labelStyle={{width: 160}}
                          onChangeOtherFunc={IdCardOnInput}
                          component={SingleInput}
                        />
                        <Field
                          name="memberFrom"
                          label="籍贯"
                          selectTextOnFocus
                          isRequire
                          multiline
                          clearIcon
                          labelStyle={{width: 160}}
                          inputContainerStyle={{minHeight: 120}}
                          inputStyle={{flex: 0, minHeight: 60, marginBottom: 0}}
                          component={SingleInput}
                        />
                      </View>
                      <TouchableOpacity activeOpacity={buttonLoading ? 1 : 0.2} style={[styles.OCR_button, buttonLoading && {borderColor: '#999999', backgroundColor: '#ededed'}]} onPress={openOCR}>
                        <Entypo name="camera" size={32} color={buttonLoading ? "#999999" : "#409EFF"} />
                        <Text style={[styles.OCR_text, buttonLoading && {color: '#999999'}]}>OCR</Text>
                        {buttonLoading && <ActivityIndicator size={32} color="#999999" />}
                      </TouchableOpacity>
                    </View>
                  </View>
                </Shadow>
                <Shadow style={styles.shadowArea}>
                  <View style={styles.content}>
                    <View style={styles.titleArea}>
                      <Text style={styles.titleText}>报名信息</Text>
                    </View>
                    <View style={styles.shadowContent_signUpInfo}>
                      {signUpInfoLoading && <ActivityIndicator style={{marginBottom: 10}} size={36} color="#409EFF"/>}
                      {signUpInfo?.signUpType ? <>
                        <View style={[styles.lineArea, {borderTopLeftRadius: 8, borderTopRightRadius: 8}]}>
                          <View style={[styles.lineTitleArea, {borderTopLeftRadius: 8}]}>
                            <Text style={styles.lineTitle}>渠道来源</Text>
                          </View>
                          <View style={styles.lineContentArea}>
                            <Text style={styles.lineContentText}>{CHANEL_SOURCE_NAME[signUpInfo.signUpType]}</Text>
                          </View>
                        </View>
                        {signUpInfo.signUpType === 'RECRUITER' &&<View style={styles.lineArea}>
                          <View style={styles.lineTitleArea}>
                            <Text style={styles.lineTitle}>经纪人</Text>
                          </View>
                          <View style={styles.lineContentArea}>
                            <Text style={styles.lineContentText}>{signUpInfo.recruiterName || '无'}</Text>
                          </View>
                        </View>}
                        {signUpInfo.signUpType === 'SUPPLIER' &&<View style={styles.lineArea}>
                          <View style={styles.lineTitleArea}>
                            <Text style={styles.lineTitle}>供应商</Text>
                          </View>
                          <View style={styles.lineContentArea}>
                            <Text style={styles.lineContentText}>{signUpInfo.supplierName || '无'}</Text>
                          </View>
                        </View>}
                        <View style={styles.lineArea}>
                          <View style={styles.lineTitleArea}>
                            <Text style={styles.lineTitle}>归属门店</Text>
                          </View>
                          <View style={styles.lineContentArea}>
                            <Text style={styles.lineContentText}>{signUpInfo.storeName}</Text>
                          </View>
                        </View>
                        <View style={[styles.lineArea, {borderBottomWidth: 1, borderBottomLeftRadius: 8, borderBottomRightRadius: 8}]}>
                          <View style={[styles.lineTitleArea, {borderBottomLeftRadius: 8}]}>
                            <Text style={styles.lineTitle}>入职企业</Text>
                          </View>
                          <View style={styles.lineContentArea}>
                            <Text style={styles.lineContentText}>{signUpInfo.shortCompanyName}</Text>
                          </View>
                        </View>
                      </> : <Text style={[styles.noticeText, signUpNotice.includes('！') && {color: 'red'}]}>{signUpNotice}</Text>}
                    </View>
                  </View>
                </Shadow>
                <Shadow style={[styles.shadowArea, {marginBottom: 15}]}>
                  <View style={styles.content}>
                    <View style={styles.titleArea}>
                      <Text style={styles.titleText}>住宿信息</Text>
                    </View>
                    <View style={styles.shadowContent_liveInfo}>
                      <Field
                        name="maleOrFemale"
                        label="宿舍分类"
                        canSelect={false}
                        labelStyle={{width: 160}}
                        radioList={DORMITORY_TYPE}
                        component={RadioSelect}
                      />
                      <Field
                        name="dormitoryType"
                        label="入住类别"
                        isRequire
                        canSelect={!params?.type}
                        labelStyle={{width: 160}}
                        radioList={DORMITORY_LIVE_TYPE}
                        component={RadioSelect}
                      />
                      {params?.type !== 'fromRoom' ? <>
                        {dormitoryInfoLoading ? <ActivityIndicator style={{marginBottom: 20}} size={32} color="#409EFF" /> : <>
                          {signUpInfo?.signUpType ? rest.values.dormitoryType.length ? 
                            <>
                              <Field
                                name="buildingNum"
                                label="宿舍楼栋"
                                isRequire
                                canSearch={false}
                                canSelect={!params?.type}
                                labelStyle={{width: 160}}
                                selectList={dormitoryMsg}
                                component={SingleSelect}
                                validate={value => {
                                  let errorMsg;
                                  if(!value.length) errorMsg = '请选择宿舍楼栋';
                                  return errorMsg;
                                }}
                              />
                              <Field
                                name="floorNum"
                                label="楼层"
                                emptyText='请选择宿舍楼栋'
                                isRequire
                                canSearch={false}
                                canSelect={!params?.type}
                                labelStyle={{width: 160}}
                                selectList={rest.values.buildingNum.length ? rest.values.buildingNum[0].floors : []}
                                component={SingleSelect}
                                validate={value => {
                                  let errorMsg;
                                  if(!value.length) errorMsg = '请选择楼层';
                                  return errorMsg;
                                }}
                              />
                              <Field
                                name="roomNum"
                                label="房间号"
                                emptyText='请选择楼层'
                                isRequire
                                canSearch={false}
                                labelStyle={{width: 160}}
                                canSelect={!params?.type}
                                selectList={rest.values.floorNum.length ? rest.values.floorNum[0].rooms : []}
                                component={SingleSelect}
                                validate={value => {
                                  let errorMsg;
                                  if(!value.length) errorMsg = '请选择房间号';
                                  return errorMsg;
                                }}
                              />
                              <Field
                                name="bedNum"
                                label="床位号"
                                emptyText='请选择房间号'
                                isRequire
                                canSearch={false}
                                labelStyle={{width: 160}}
                                canSelect={!params?.type}
                                selectList={rest.values.roomNum.length ? rest.values.roomNum[0].beds : []}
                                component={SingleSelect}
                              />
                            </> : <Text style={[styles.noticeText, {marginBottom: 20}]}>请选择入住类别</Text> : <Text style={[styles.noticeText, {marginBottom: 20}, signUpNotice.includes('！') && {color: 'red'}]}>{signUpNotice.includes('！') ? '请输入正确的会员身份证号' : '请输入会员身份证号'}</Text>}
                        </>}
                      </> : <>
                        {!queryRestBedListLoading ? <>
                          <View style={styles.fakeItemArea}>
                            <Text style={styles.fakeItemArea_star}>*</Text>
                            <Text style={styles.fakeItemArea_title}>宿舍楼栋：</Text>
                            <TouchableOpacity style={styles.fakeItemArea_rightArea} onPress={() => toast.show('无法修改原有楼栋！', {type: 'warning'})}>
                              <Text style={{fontSize: 26, color: '#999999'}}>{restBedMsg.roomBuildingName}</Text>
                            </TouchableOpacity>
                          </View>
                          <View style={styles.fakeItemArea}>
                            <Text style={styles.fakeItemArea_star}>*</Text>
                            <Text style={styles.fakeItemArea_title}>楼层：</Text>
                            <TouchableOpacity style={styles.fakeItemArea_rightArea} onPress={() => toast.show('无法修改原有楼层！', {type: 'warning'})}>
                              <Text style={{fontSize: 26, color: '#999999'}}>{restBedMsg.roomFloorIndex}F</Text>
                            </TouchableOpacity>
                          </View>
                          <View style={styles.fakeItemArea}>
                            <Text style={styles.fakeItemArea_star}>*</Text>
                            <Text style={styles.fakeItemArea_title}>房间号：</Text>
                            <TouchableOpacity style={styles.fakeItemArea_rightArea} onPress={() => toast.show('无法修改原有房间号！', {type: 'warning'})}>
                              <Text style={{fontSize: 26, color: '#999999'}}>{restBedMsg.roomNo}</Text>
                            </TouchableOpacity>
                          </View>
                          <Field
                            name="bedNum"
                            label="床位号"
                            isRequire
                            canSearch={false}
                            labelStyle={{width: 160}}
                            selectList={restBedList}
                            component={SingleSelect}
                          />
                        </> : <ActivityIndicator style={{marginBottom: 20}} size={32} color="#409EFF" />}
                      </>}
                      <Field
                        name="liveInDate"
                        label="入住日期"
                        isRequire
                        labelStyle={{width: 160}}
                        component={OrderSingleDate}
                      />
                      {rest.values.dormitoryType.length ? rest.values.dormitoryType[0].value === 'DORM_TEMPORARY' && <Field
                        name="temporaryLiving"
                        label="临时住宿期限"
                        isRequire
                        labelStyle={{width: 220}}
                        startLimit={moment().format('YYYY-MM-DD')}
                        endLimit={moment().add(7, 'd').format('YYYY-MM-DD')}
                        component={OrderSingleDate}
                      /> : <></>}
                    </View>
                  </View>
                </Shadow>
              </View>
            </ScrollView>
            <Button
              title="保存"
              loading={bottomButtonLoading}
              onPress={restForm.submitForm}
              containerStyle={styles.buttonContainerStyle}
              buttonStyle={styles.buttonStyle}
              titleStyle={styles.titleStyle}
            />
            <OCR_Scan ref={OCR_Ref} restForm={restForm} uploadOtherFunc={queryOCRInfo} setButtonLoading={setButtonLoading} />
          </>
        )
      }}
    </Formik>
  )
};

const styles = StyleSheet.create({
  screen: {
    flex: 1
  },
  shadowArea: {
    width: '100%',
    marginBottom: 30
  },
  content: {
    borderRadius: 10
  },
  titleArea: {
    height: 60, 
    backgroundColor: '#EFEFEF', 
    justifyContent: 'center', 
    borderTopRightRadius: 10, 
    borderTopLeftRadius: 10
  },
  titleText: {
    fontSize: 28, 
    fontWeight: 'bold', 
    textAlign: 'center'
  },
  OCR_button: {
    marginLeft: 20, 
    justifyContent: 'center', 
    alignItems: 'center', 
    paddingHorizontal: 10, 
    borderRadius: 12, 
    borderWidth: 2,
    borderColor: '#409EFF',
    backgroundColor: '#ECF5FF'
  },
  OCR_text: {
    fontSize: 26, 
    fontWeight: 'bold', 
    color: '#409EFF'
  },
  shadowContent_memberInfo: {
    backgroundColor: '#FFFFFF', 
    borderBottomLeftRadius: 10, 
    borderBottomRightRadius: 10,
    padding: 20,
    flexDirection: 'row'
  },
  shadowContent_signUpInfo: {
    backgroundColor: '#FFFFFF', 
    borderBottomLeftRadius: 10, 
    borderBottomRightRadius: 10,
    padding: 20
  },
  shadowContent_liveInfo: {
    backgroundColor: '#FFFFFF', 
    borderBottomLeftRadius: 10, 
    borderBottomRightRadius: 10,
    padding: 20,
    paddingBottom: 0
  },
  fakeItemArea: {
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 20
  },
  fakeItemArea_star: {
    fontSize: 28, 
    color: 'red'
  },
  fakeItemArea_title: {
    width: 149, 
    fontSize: 28, 
    color: '#333333'
  },
  fakeItemArea_rightArea: {
    flex: 1, 
    height: 60, 
    borderWidth: 2, 
    borderColor: '#E5E5E5', 
    borderRadius: 6, 
    paddingHorizontal: 19,
    justifyContent: 'center'
  },
  lineArea: {
    height: 60, 
    flexDirection: 'row', 
    borderWidth: 1, 
    borderBottomWidth: 0, 
    borderColor: '#409EFF',
  },
  lineTitleArea: {
    width: 160, 
    borderRightWidth: 1, 
    borderColor: '#409EFF', 
    justifyContent: 'center', 
    backgroundColor: '#ECF5FF'
  },
  lineTitle: {
    fontSize: 26, 
    color: '#333333', 
    minWidth: 160, 
    textAlign: 'center'
  },
  lineContentArea: {
    flex: 1, 
    justifyContent: 'center', 
    paddingLeft: 20
  },
  lineContentText: {
    fontSize: 26, 
    color: '#333333'
  },
  noticeText: {
    fontSize: 24, 
    color: '#409EFF', 
    textAlign: 'center'
  },
  buttonContainerStyle: {
    margin: 20
  },  
  buttonStyle: {
    height: 80,
    backgroundColor: '#409EFF',
    borderWidth: 0,
    borderRadius: 50
  },
  titleStyle: {
    fontSize: 32,
    fontWeight: 'bold',
    letterSpacing: 10
  }
});

export default CreateDormitory;