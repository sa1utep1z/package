import React, {useState, useRef} from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Shadow } from 'react-native-shadow-2';
import { Formik, Field } from 'formik';
import Entypo from 'react-native-vector-icons/Entypo';
import { useToast } from "react-native-toast-notifications";
import { Button } from '@rneui/themed';
import moment from 'moment';
import * as Yup from 'yup';

import SingleInput from "../../../../components/OrderForm/SingleInput";
import RadioSelect from "../../../../components/OrderForm/RadioSelect";
import SingleSelect from "../../../../components/OrderForm/SingleSelect";
import OrderSingleDate from "../../../../components/OrderForm/OrderSingleDate";
import OCR_Scan from '../../../../components/OCR_Scan';
import ListApi from '../../../../request/ListApi';
import { SUCCESS_CODE, CHANEL_SOURCE_NAME, DORMITORY_LIVE_TYPE, DORMITORY_TYPE, CREATE_ORDER_JOB_TYPE } from '../../../../utils/const';

let restForm;

const validationSchema = Yup.object().shape({
  memberName: Yup.string().required('请输入姓名'),
  memberPhone: Yup.string().required('请输入手机号'),
  memberIdCard: Yup.string().required('请输入身份证号'),
  memberFrom: Yup.string().required('请输入籍贯'),
  dormitoryType: Yup.array().min(1, '请选择入住类别'),
  maleOrFemale: Yup.array().min(1, '请选择宿舍分类'),
  buildingNum: Yup.array().min(1, '请选择宿舍楼栋'),
  floorNum: Yup.array().min(1, '请选择楼层'),
  roomNum: Yup.array().min(1, '请选择房间号'),
  bedNum: Yup.array().min(1, '请选择床位号'),
  liveInDate: Yup.string().required('请选择入住日期'),
  temporaryLiving: Yup.string().required('请选择临时住宿期限'),
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

const CreateDormitory = () => {
  const OCR_Ref = useRef(null);
  const toast = useToast();

  const [signUpInfoLoading, setSignUpInfoLoading] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [signUpInfo, setSignUpInfo] = useState({});
  const [signUpNotice, setSignUpNotice] = useState('请输入身份证号或通过【OCR】拍照读取会员报名信息');

  const onSubmit = (values) => {
    console.log('提交了表单', values);
  };

  const openOCR = () => !buttonLoading && OCR_Ref?.current.setModalVisible(true);

  const IdCardOnInput = (value) => {
    if(value.length === 18){
      queryMemberFlowId(value);
    }else{
      setSignUpInfo({});
      setSignUpNotice('请输入身份证号或通过【OCR】拍照读取会员报名信息');
    }
  };

  const queryMemberFlowId = async(memberId) => {
    setSignUpInfoLoading(true);
    try {
      const res = await ListApi.SignUpList({str: memberId, role: "RECRUIT"});
      if(res?.code !== SUCCESS_CODE){
        toast.show(`${res?.msg}`, {type: 'danger'});
        return;
      }
      console.log('queryMemberFlowId -> res', res);
      if(res.data.content.length){
        const flowId = res.data.content[0].flowId;
        queryMemberInfo(flowId, res.data.content[0].companyShortName);
      }else{
        setSignUpInfoLoading(false);
        setSignUpNotice('暂无该会员报名信息，请确认身份证号是否正确！');
      }
    } catch (error) {
      console.log('error', error)
      toast.show(`出现了意料之外的问题，请联系系统管理员处理`, { type: 'danger' });
    }
  };

  const queryMemberInfo = async(flowId, companyShortName) => {
    try {
      const res = await ListApi.MemberMessage(flowId);
      if(res?.code !== SUCCESS_CODE){
        toast.show(`${res?.msg}`, {type: 'danger'});
        return;
      }
      console.log('res', res);
      res.data.companyShortName = companyShortName;
      setSignUpInfo(res.data);
    } catch (error) {
      toast.show(`出现了意料之外的问题，请联系系统管理员处理`, { type: 'danger' });
    } finally{
      setSignUpInfoLoading(false);
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
                            <Text style={styles.lineContentText}>{signUpInfo.recruitName || '无'}</Text>
                          </View>
                        </View>}
                        {signUpInfo.signUpType === 'SUPPLIER' &&<View style={styles.lineArea}>
                          <View style={styles.lineTitleArea}>
                            <Text style={styles.lineTitle}>供应商</Text>
                          </View>
                          <View style={styles.lineContentArea}>
                            <Text style={styles.lineContentText}>{signUpInfo.supplier || '无'}</Text>
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
                            <Text style={styles.lineContentText}>{signUpInfo.companyShortName}</Text>
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
                        name="dormitoryType"
                        label="入住类别"
                        isRequire
                        labelStyle={{width: 160}}
                        radioList={DORMITORY_LIVE_TYPE}
                        component={RadioSelect}
                      />
                      <Field
                        name="maleOrFemale"
                        label="宿舍分类"
                        isRequire
                        labelStyle={{width: 160}}
                        radioList={DORMITORY_TYPE}
                        component={RadioSelect}
                      />
                      <Field
                        name="buildingNum"
                        label="宿舍楼栋"
                        isRequire
                        canSearch={false}
                        labelStyle={{width: 160}}
                        selectList={CREATE_ORDER_JOB_TYPE}
                        component={SingleSelect}
                      />
                      <Field
                        name="floorNum"
                        label="楼层"
                        isRequire
                        canSearch={false}
                        labelStyle={{width: 160}}
                        selectList={CREATE_ORDER_JOB_TYPE}
                        component={SingleSelect}
                      />
                      <Field
                        name="roomNum"
                        label="房间号"
                        isRequire
                        canSearch={false}
                        labelStyle={{width: 160}}
                        selectList={CREATE_ORDER_JOB_TYPE}
                        component={SingleSelect}
                      />
                      <Field
                        name="bedNum"
                        label="床位号"
                        isRequire
                        canSearch={false}
                        labelStyle={{width: 160}}
                        selectList={CREATE_ORDER_JOB_TYPE}
                        component={SingleSelect}
                      />
                      <Field
                        name="liveInDate"
                        label="入住日期"
                        isRequire
                        labelStyle={{width: 160}}
                        component={OrderSingleDate}
                      />
                      {rest.values.dormitoryType.length ? rest.values.dormitoryType[0].value === 'TEMPORARY_LIVE' && <Field
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