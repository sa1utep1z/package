import React, {useState, useRef} from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Shadow } from 'react-native-shadow-2';
import { Formik, Field } from 'formik';
import Entypo from 'react-native-vector-icons/Entypo';
import { useToast } from "react-native-toast-notifications";
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
  import { useNavigation } from '@react-navigation/native';
  import { Button } from '@rneui/themed';
import moment from 'moment';
import * as Yup from 'yup';

import SingleInput from "../../../../components/OrderForm/SingleInput";
import RadioSelect from "../../../../components/OrderForm/RadioSelect";
import SingleSelect from "../../../../components/OrderForm/SingleSelect";
import SelectPhotos from "../../../../components/OrderForm/SelectPhotos";
import OrderSingleDate from "../../../../components/OrderForm/OrderSingleDate";
import OCR_Scan from '../../../../components/OCR_Scan';
import DormitoryViolationApi from '../../../../request/Dormitory/DormitoryViolationApi';
import { SUCCESS_CODE, CHANEL_SOURCE_NAME, VIOLATION_TYPE_LIST, PUNISH_RESULT } from '../../../../utils/const';
import NAVIGATION_KEYS from '../../../../navigator/key';

const MaleOrFemaleRightIcon = ({value}) => value.length ? 
<View style={styles.maleOrFemaleRightIconArea}>
  <Ionicons 
    size={40} 
    name={value[0].value === 'DORM_MALE' ? 'man' : 'woman'} 
    color={value[0].value === 'DORM_MALE' ? '#409EFF' : '#eb00d8'}
  />
</View> : <></>;

const PunishResultRightIcon = ({value}) => value.length ?
<View style={styles.punishResultRightIconArea}>
  {value[0].value === 'cancelLiving' ? <MaterialCommunityIcons name="account-cancel" size={40} color="red" /> : <AntDesign name='warning' size={36} color={value[0].value === 'warning' ? '#ffcc00' : 'red'} />}
</View> : <></>;

let restForm;

const validationSchema = Yup.object().shape({
  memberName: Yup.string().required('请输入姓名'),
  memberPhone: Yup.string().required('请输入手机号'),
  memberIdCard: Yup.string().required('请输入身份证号'),
  violationType: Yup.array().min(1, '请选择违纪类别'),
  violationPhotos: Yup.array().min(1, '请拍照上传违纪照片（最多两张）'),
  punishResult: Yup.array().min(1, '请选择处罚结果'),
  punishDate: Yup.string().required('请选择处罚日期'),
});
const initialValues = {
  memberName: '',
  memberPhone: '',
  memberIdCard: '',
  violationType: [],
  violationOtherReason: '',
  violationPhotos: [],
  punishResult: [],
  punishDate: moment().format('YYYY-MM-DD')
};

const AddViolation = () => {
  const OCR_Ref = useRef(null);
  const toast = useToast();
  const navigation = useNavigation();

  const [memberInfoLoading, setMemberInfoLoading] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [signUpInfo, setSignUpInfo] = useState({});
  const [signUpNotice, setSignUpNotice] = useState('请输入身份证号或通过【OCR】拍照读取会员报名信息');

  const onSubmit = (values) => {
    const formatValue = {
      idNo: values.memberIdCard || '',
      type: values.violationType.length ? values.violationType[0].value : '', 
      result: values.punishResult.length ? values.punishResult[0].value : '',
      date: values.punishDate,
      pic: values.violationPhotos.length ? values.violationPhotos : [],
    };
    if(values.violationType[0].value === 'DORM_DISCIPLINE_OTHER'){
      if(!values.violationOtherReason){
        toast.show('请填写违纪文字描述', {type: 'danger'});
        return;
      }
      formatValue.desc = values.violationOtherReason
    }
    addViolation(formatValue);
  };

  const addViolation = async(params) => {
    try {
      const res = await DormitoryViolationApi.addViolation(params);
      if(res?.code !== SUCCESS_CODE){
        toast.show(`开罚单失败，${res?.msg}`, {type: 'danger'});
        return;
      }
      setTimeout(()=>{
        toast.show('开罚单成功', {type: 'success'});
        navigation.navigate(NAVIGATION_KEYS.DORMITORY_VIOLATION, {
          refresh: true
        })
      },500)
    } catch (error) {
      console.log('error', error);
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
    try {
      setMemberInfoLoading(true);
      const res = await DormitoryViolationApi.queryMemberDormitoryInfo(memberId);
      console.log('queryMemberFlowId -> res', res);
      if(res?.code !== SUCCESS_CODE){
        toast.show(`${res?.msg}`, {type: 'danger'});
        setSignUpNotice('无该会员报名信息，请确认身份证号是否正确！');
        return;
      }
      toast.show(`成功查询报名信息`, { type: 'success' });
      setSignUpInfo({...res.data});
      res.data.name && restForm.setFieldValue('memberName', res.data.name);
      res.data.mobile && restForm.setFieldValue('memberPhone', res.data.mobile);
    } catch (error) {
      console.log('error', error)
      toast.show(`出现了意料之外的问题，请联系系统管理员处理`, { type: 'danger' });
    } finally {
      setMemberInfoLoading(false);
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
        return (
          <>
            <ScrollView style={styles.screen} keyboardShouldPersistTaps="handled">
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
                      {memberInfoLoading && <ActivityIndicator style={{marginBottom: 10}} size={36} color="#409EFF"/>}
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
                            <Text style={styles.lineContentText}>{signUpInfo.shortCompanyName || '无'}</Text>
                          </View>
                        </View>
                      </> : <Text style={[styles.noticeText, signUpNotice.includes('！') && {color: 'red'}]}>{signUpNotice}</Text>}
                    </View>
                  </View>
                </Shadow>
                <Shadow style={styles.shadowArea}>
                  <View style={styles.content}>
                    <View style={styles.titleArea}>
                      <Text style={styles.titleText}>住宿信息</Text>
                    </View>
                    <View style={styles.shadowContent_signUpInfo}>
                      {memberInfoLoading && <ActivityIndicator style={{marginBottom: 10}} size={36} color="#409EFF"/>}
                      {signUpInfo?.signUpType ? <>
                        <View style={[styles.lineArea, {borderTopLeftRadius: 8, borderTopRightRadius: 8}]}>
                          <View style={[styles.lineTitleArea, {borderTopLeftRadius: 8}]}>
                            <Text style={styles.lineTitle}>宿舍分类</Text>
                          </View>
                          <View style={styles.lineContentArea}>
                            <Text style={styles.lineContentText}>{signUpInfo.idNo ? `${signUpInfo.idNo[17] % 2 === 0 ? '女生宿舍' : '男生宿舍'}` : '无'}</Text>
                          </View>
                        </View>
                        <View style={styles.lineArea}>
                          <View style={styles.lineTitleArea}>
                            <Text style={styles.lineTitle}>宿舍楼栋</Text>
                          </View>
                          <View style={styles.lineContentArea}>
                            <Text style={styles.lineContentText}>{signUpInfo.buildingName}</Text>
                          </View>
                        </View>
                        <View style={styles.lineArea}>
                          <View style={styles.lineTitleArea}>
                            <Text style={styles.lineTitle}>楼层</Text>
                          </View>
                          <View style={styles.lineContentArea}>
                            <Text style={styles.lineContentText}>{signUpInfo.floorName}F</Text>
                          </View>
                        </View>
                        <View style={styles.lineArea}>
                          <View style={styles.lineTitleArea}>
                            <Text style={styles.lineTitle}>房间号</Text>
                          </View>
                          <View style={styles.lineContentArea}>
                            <Text style={styles.lineContentText}>{signUpInfo.roomName}房</Text>
                          </View>
                        </View>
                        <View style={[styles.lineArea, {borderBottomWidth: 1, borderBottomLeftRadius: 8, borderBottomRightRadius: 8}]}>
                          <View style={[styles.lineTitleArea, {borderBottomLeftRadius: 8}]}>
                            <Text style={styles.lineTitle}>床位号</Text>
                          </View>
                          <View style={styles.lineContentArea}>
                            <Text style={styles.lineContentText}>{signUpInfo.bedName}床</Text>
                          </View>
                        </View>
                      </> : <Text style={[styles.noticeText, signUpNotice.includes('！') && {color: 'red'}]}>{signUpNotice}</Text>}
                    </View>
                  </View>
                </Shadow>
                <Shadow style={[styles.shadowArea, {marginBottom: 10}]}>
                  <View style={styles.content}>
                    <View style={styles.titleArea}>
                      <Text style={styles.titleText}>违纪信息</Text>
                    </View>
                    <View style={styles.shadowContent_violationInfo}>
                      <Field
                        name="violationType"
                        label="违纪类别"
                        isRequire
                        canSearch={false}
                        labelStyle={{width: 160}}
                        selectList={VIOLATION_TYPE_LIST}
                        component={SingleSelect}
                      />
                      {rest.values.violationType.length ? rest.values.violationType[0].value === 'DORM_DISCIPLINE_OTHER' && <Field
                        name="violationOtherReason"
                        label="违纪文字描述"
                        selectTextOnFocus
                        isRequire
                        clearIcon
                        labelStyle={{width: 220}}
                        inputContainerStyle={{minHeight: 120}}
                        component={SingleInput}
                      /> : <></>}
                      <Field
                        name="punishResult"
                        label="处罚结果"
                        isRequire
                        labelStyle={{width: 160}}
                        radioList={PUNISH_RESULT}
                        rightComponent={<PunishResultRightIcon value={rest.values.punishResult} />}
                        component={RadioSelect}
                      />
                      <Field
                        name="violationPhotos"
                        label="违纪照片"
                        type="takePicture"
                        isRequire
                        maxPictureNum={2}
                        labelStyle={{width: 160}}
                        component={SelectPhotos}
                      />
                      <Field
                        name="punishDate"
                        label="处罚日期"
                        isRequire
                        labelStyle={{width: 160}}
                        component={OrderSingleDate}
                      />
                    </View>
                  </View>
                </Shadow>
              </View>
            </ScrollView>
            <Button
              title="开罚单"
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
    marginBottom: 20,
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
    flexDirection: 'row',
    padding: 20,
    paddingBottom: 0
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
  shadowContent_violationInfo: {
    backgroundColor: '#FFFFFF', 
    borderBottomLeftRadius: 10, 
    borderBottomRightRadius: 10,
    padding: 20,
    paddingBottom: 0
  },
  punishResultRightIconArea: {
    flex: 1, 
    height: 60, 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  maleOrFemaleRightIconArea: {
    flex: 1, 
    height: 60, 
    justifyContent: 'center', 
    alignItems: 'flex-end', 
    paddingRight: 10
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

export default AddViolation;