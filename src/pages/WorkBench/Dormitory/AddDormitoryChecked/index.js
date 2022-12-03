import React, {useState} from "react";
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView } from 'react-native';
import { Shadow } from 'react-native-shadow-2';
import { Formik, Field } from 'formik';
import * as Yup from 'yup';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useToast } from "react-native-toast-notifications";
import { useNavigation } from "@react-navigation/native";
import { Button } from '@rneui/themed';
import moment from "moment";

import RadioSelect from "../../../../components/OrderForm/RadioSelect";
import SelectPhotos from "../../../../components/OrderForm/SelectPhotos";
import SingleSelect from "../../../../components/OrderForm/SingleSelect";
import SingleInput from "../../../../components/OrderForm/SingleInput";
import OrderSingleDate from "../../../../components/OrderForm/OrderSingleDate";
import { SUCCESS_CODE, DORMITORY_HYGIENE_LIST, DORMITORY_FACILITY_LIST } from '../../../../utils/const';
import NAVIGATION_KEYS from "../../../../navigator/key";
import DormitoryCheckListApi from "../../../../request/Dormitory/DormitoryCheckListApi";

let restForm;
const validationSchema = Yup.object().shape({
  dormitoryHygiene: Yup.array().min(1, '请选择宿舍卫生状况'),
  dormitoryFacility: Yup.array().min(1, '请选择宿舍资产状况'),
  waterNum: Yup.string().required('请输入本期水表数'),
  waterImg: Yup.array().min(1, '请上传水表现场照一张'),
  electricNum: Yup.string().required('请输入本期电表数'),
  electricImg: Yup.array().min(1, '请上传电表现场照一张'),
  remark: Yup.string().required('请输入点检情况描述'),
  nextCheckDate: Yup.string().required('请选择下次点检日期'),
});
const initialValues = {
  dormitoryHygiene: [],
  dormitoryHygienePictureList: [],
  dormitoryFacility: [],
  dormitoryFacilityPictureList: [],
  fireDeviceStatus: [],
  fireDeviceImg: [],
  waterNum: '',
  waterImg: [],
  electricNum: '',
  electricImg: [],
  remark: '',
  nextCheckDate: ''
};

const AddDormitoryChecked = ({route: {params: {item}}}) => {
  const toast = useToast();
  const navigation = useNavigation();

  const [buttonLoading, setButtonLoading] = useState(false);

  const onSubmit = values => {
    const formatParams = {
      roomId: item.roomId, 
      date: moment(item.date).format('YYYY-MM-DD'),
      nextDate: values.nextCheckDate, //下次点检日期
      hygieneStatus: values.dormitoryHygiene.length ? values.dormitoryHygiene[0].value : '', //卫生状况
      hygieneImg: values.dormitoryHygienePictureList, //卫生照片
      assetStatus: values.dormitoryFacility.length ? values.dormitoryFacility[0].value : '', //资产状况
      assetImg: values.dormitoryFacilityPictureList, //资产照片
      fireDeviceStatus: values.fireDeviceStatus.length ? values.fireDeviceStatus[0].value : '', //消防设施状况
      fireDeviceImg: values.fireDeviceImg, //消防照片
      waterNum: Number(values.waterNum), //水表数
      waterImg: values.waterImg[0], //水表照
      electricNum: Number(values.electricNum), //电表数
      electricImg: values.electricImg[0], //电表照
      desc: values.remark, //点检情况描述
    };
    addCheckedRecord(formatParams);
  };

  const addCheckedRecord = async(params) => {
    try {
      setButtonLoading(true);
      const res = await DormitoryCheckListApi.addPropertyRecord(params);
      console.log('addCheckedRecord -> res', res);
      if(res?.code !== SUCCESS_CODE){
        toast.show(`${res?.msg}`, {type: 'danger'});
        return;
      }
      toast.show('新增点检记录成功', {type: 'success'});
      navigation.navigate(NAVIGATION_KEYS.DORMITORY_CHECK_LIST, {
        refresh: true
      })
    } catch (error) {
      console.log('error', error);
      toast.show(`出现了意料之外的问题，请联系系统管理员处理`, { type: 'danger' });
    } finally {
      setButtonLoading(false);
    }
  };

  const waterInputRightComponent = (
    <View style={styles.rightArea}>
      <Text style={styles.rightAreaText}>立方</Text>
      <Ionicons style={styles.rightAreaIcon} name='water' size={36} color='#409EFF' />
    </View>
  );

  const electricInputRightComponent = (
    <View style={styles.rightArea}>
      <Text style={styles.rightAreaText}>度</Text>
      <MaterialCommunityIcons style={[styles.rightAreaIcon, {transform: [{ rotateZ: '5deg' }]}]} name='lightning-bolt' size={36} color='#ffd700' />
    </View>
  );

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}>
      {({...rest }) => {
        restForm = rest;
        return (
          <View style={styles.screen}>
            <View style={styles.topArea}>
              <Text style={styles.topArea_topText}>点检日期：{moment(item.date).format('YYYY-MM-DD')}</Text>
              <View style={styles.topArea_bottomArea}>
                <Text style={styles.bottomArea_leftText}>楼栋：{item.buildingName}</Text>
                <Text style={styles.bottomArea_rightText}>房间号：{item.roomName}</Text>
              </View>
            </View>
            <KeyboardAvoidingView style={{flex: 1, flexDirection: 'column'}}>
              <ScrollView style={styles.scrollView}>
                <View style={styles.shadowView}>
                  <Shadow style={styles.shadowArea}>
                    <View style={styles.content}>
                      <View style={styles.titleArea}>
                        <Text style={styles.titleText}>点检详情</Text>
                      </View>
                      <View style={styles.shadowContent}>
                        <Field
                          name="dormitoryHygiene"
                          label="宿舍卫生状况"
                          isRequire
                          labelStyle={{width: 220}}
                          radioList={DORMITORY_HYGIENE_LIST}
                          component={RadioSelect}
                        />
                        <Field
                          name="dormitoryHygienePictureList"
                          label="宿舍卫生照片"
                          type="takePicture"
                          maxPictureNum={2}
                          labelStyle={{width: 220}}
                          component={SelectPhotos}
                        />
                        <Field
                          name="dormitoryFacility"
                          label="宿舍资产状况"
                          isRequire
                          canSearch={false}
                          selectList={DORMITORY_FACILITY_LIST}
                          labelStyle={{width: 220}}
                          component={SingleSelect}
                        />
                        <Field
                          name="dormitoryFacilityPictureList"
                          label="宿舍资产照片"
                          type="takePicture"
                          maxPictureNum={2}
                          labelStyle={{width: 220}}
                          component={SelectPhotos}
                        />
                        <Field
                          name="fireDeviceStatus"
                          label="消防设施状况"
                          isRequire
                          canSearch={false}
                          selectList={DORMITORY_FACILITY_LIST}
                          labelStyle={{width: 220}}
                          component={SingleSelect}
                        />
                        <Field
                          name="fireDeviceImg"
                          label="消防设施照片"
                          type="takePicture"
                          maxPictureNum={2}
                          labelStyle={{width: 220}}
                          component={SelectPhotos}
                        />
                        <Field
                          name="waterNum"
                          label="本期水表数"
                          isRequire
                          selectTextOnFocus
                          keyboardType="numeric"
                          maxLength={8}
                          labelStyle={{width: 220}}
                          component={SingleInput}
                          inputRightComponent={waterInputRightComponent}
                        />
                        <Field
                          name="waterImg"
                          label="水表现场照片"
                          type="takePicture"
                          isRequire
                          maxPictureNum={1}
                          labelStyle={{width: 220}}
                          component={SelectPhotos}
                        />
                        <Field
                          name="electricNum"
                          label="本期电表数"
                          isRequire
                          selectTextOnFocus
                          keyboardType="numeric"
                          maxLength={8}
                          labelStyle={{width: 220}}
                          component={SingleInput}
                          inputRightComponent={electricInputRightComponent}
                        />
                        <Field
                          name="electricImg"
                          label="电表现场照片"
                          type="takePicture"
                          isRequire
                          maxPictureNum={1}
                          labelStyle={{width: 220}}
                          component={SelectPhotos}
                        />
                        <Field
                          name="remark"
                          label="本次点检情况描述"
                          isRequire
                          selectTextOnFocus
                          labelStyle={{width: 280}}
                          inputContainerStyle={{minHeight: 120, alignItems: 'flex-start'}}
                          component={SingleInput}
                        />
                        <Field
                          name="nextCheckDate"
                          label="下次点检日期"
                          isRequire
                          labelStyle={{width: 220}}
                          startLimit={moment().format('YYYY-MM-DD')}
                          endLimit={moment().add(15, 'd').format('YYYY-MM-DD')}
                          component={OrderSingleDate}
                        />
                      </View>
                    </View>
                  </Shadow>
                </View>
              </ScrollView>
            </KeyboardAvoidingView>
            <Button
              title="保存"
              loading={buttonLoading}
              onPress={restForm.handleSubmit}
              containerStyle={styles.buttonContainerStyle}
              buttonStyle={styles.buttonStyle}
              titleStyle={styles.titleStyle}
            />
          </View>
        )
      }}
    </Formik>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  screen: {
    flex: 1,
    paddingTop: 30
  },
  topArea: {
    height: 120, 
    marginHorizontal: 20, 
    backgroundColor: '#979797', 
    borderRadius: 10
  },
  topArea_topText: {
    flex: 1, 
    fontSize: 28, 
    color: '#FFFFFF', 
    textAlign: 'center', 
    textAlignVertical: 'center', 
    borderBottomWidth: 1, 
    borderColor: '#FFFFFF'
  },
  topArea_bottomArea: {
    flex: 1, 
    flexDirection: 'row'
  },
  bottomArea_leftText: {
    flex: 1, 
    fontSize: 28, 
    color: '#FFFFFF', 
    textAlign: 'center', 
    textAlignVertical: 'center', 
    borderRightWidth: 1, 
    borderColor: '#FFFFFF'
  },
  bottomArea_rightText: {
    flex: 1, 
    fontSize: 28, 
    color: '#FFFFFF', 
    textAlign: 'center', 
    textAlignVertical: 'center'
  },
  scrollView: { 
    flex: 1
  },
  shadowView: {
    flex: 1, 
    paddingHorizontal: 20, 
    paddingTop: 30
  },
  shadowArea: {
    width: '100%',
    marginBottom: 10
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
  shadowContent: {
    backgroundColor: '#FFFFFF', 
    borderBottomLeftRadius: 10, 
    borderBottomRightRadius: 10,
    padding: 20,
    paddingBottom: 0
  },
  rightArea: {
    flexDirection: 'row', 
    alignItems: 'center', 
    marginRight: 10
  },
  rightAreaText: {
    height: 60, 
    textAlignVertical: 'center', 
    fontSize: 26, 
    color: '#333333'
  },
  rightAreaIcon: {
    marginLeft: 5
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

export default AddDormitoryChecked;