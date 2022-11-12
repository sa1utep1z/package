import React from "react";
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Shadow } from 'react-native-shadow-2';
import { Formik, Field } from 'formik';
import * as Yup from 'yup';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Button } from '@rneui/themed';

import RadioSelect from "../../../../components/OrderForm/RadioSelect";
import SelectPhotos from "../../../../components/OrderForm/SelectPhotos";
import SingleSelect from "../../../../components/OrderForm/SingleSelect";
import SingleInput from "../../../../components/OrderForm/SingleInput";
import OrderSingleDate from "../../../../components/OrderForm/OrderSingleDate";
import { DORMITORY_HYGIENE_LIST, DORMITORY_FACILITY_LIST } from '../../../../utils/const';

let restForm;
const validationSchema = Yup.object().shape({
  dormitoryHygiene: Yup.array().min(1, '请选择宿舍卫生状况'),
  dormitoryFacility: Yup.array().min(1, '请选择宿舍设施状况'),
  waterNum: Yup.string().required('请输入本期水表数'),
  electricNum: Yup.string().required('请输入本期电表数'),
  waterAndElectricPicture: Yup.array().min(2, '请完整上传水/电表现场照片'),
  remark: Yup.string().required('请输入点检情况描述'),
  nextCheckDate: Yup.string().required('请选择下次点检日期'),
});
const initialValues = {
  dormitoryHygiene: [],
  dormitoryHygienePictureList: [],
  dormitoryFacility: [],
  dormitoryFacilityPictureList: [],
  waterNum: '',
  electricNum: '',
  waterAndElectricPicture: [],
  remark: '',
  nextCheckDate: ''
};

const AddDormitoryChecked = ({route: {params: {item}}}) => {
  console.log('item', item);

  const onSubmit = values => {
    console.log('values', values);
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
              <Text style={styles.topArea_topText}>点检日期：{item.checkDate}</Text>
              <View style={styles.topArea_bottomArea}>
                <Text style={styles.bottomArea_leftText}>楼栋：{item.building}</Text>
                <Text style={styles.bottomArea_rightText}>房间号：{item.room}</Text>
              </View>
            </View>
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
                        maxPictureNum={3}
                        labelStyle={{width: 220}}
                        component={SelectPhotos}
                      />
                      <Field
                        name="dormitoryFacility"
                        label="宿舍设施状况"
                        isRequire
                        canSearch={false}
                        selectList={DORMITORY_FACILITY_LIST}
                        labelStyle={{width: 220}}
                        component={SingleSelect}
                      />
                      <Field
                        name="dormitoryFacilityPictureList"
                        label="宿舍设施照片"
                        type="takePicture"
                        maxPictureNum={3}
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
                        name="waterAndElectricPicture"
                        label="水/电表现场照片"
                        type="takePicture"
                        isRequire
                        maxPictureNum={2}
                        labelStyle={{width: 280}}
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
                        component={OrderSingleDate}
                      />
                    </View>
                  </View>
                </Shadow>
              </View>
            </ScrollView>
            <Button
              title="保存"
              onPress={restForm.handleSubmit}
              containerStyle={styles.buttonContainerStyle}
              buttonStyle={styles.buttonStyle}
              titleStyle={styles.titleStyle}
            />
        </View>)
      }}
    </Formik>
  )
};

const styles = StyleSheet.create({
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
    marginBottom: 25
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