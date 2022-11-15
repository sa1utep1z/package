import React, {useState, useRef} from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Shadow } from 'react-native-shadow-2';
import { Formik, Field } from 'formik';
import * as Yup from 'yup';
import { Button } from '@rneui/themed';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import SingleInput from "../../../../components/OrderForm/SingleInput";
import RadioSelect from "../../../../components/OrderForm/RadioSelect";
import SingleSelect from "../../../../components/OrderForm/SingleSelect";
import SelectPhotos from "../../../../components/OrderForm/SelectPhotos";
import { SUCCESS_CODE, DORMITORY_TYPE, CREATE_ORDER_JOB_TYPE, PROPERTY_STATUS_LIST } from '../../../../utils/const';

const RightUnionOfNumber = ({field, form}) => (
  <View style={styles.unionArea}>
    <TouchableOpacity style={styles.touchArea} onPress={() => form.setFieldValue(field.name, 'ge')}>
      <MaterialIcons
        style={styles.iconArea}
        size={32}
        color={field.value == 'ge' ? '#409EFF' : '#999999'}
        name={field.value == 'ge' ? 'radio-button-checked' : 'radio-button-off'}
      />
      <Text style={styles.iconText}>个</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.touchArea} onPress={() => form.setFieldValue(field.name, 'tai')}>
      <MaterialIcons
        style={styles.iconArea}
        size={32}
        color={field.value == 'tai' ? '#409EFF' : '#333333'}
        name={field.value == 'tai' ? 'radio-button-checked' : 'radio-button-off'}
      />
      <Text style={styles.iconText}>台</Text>
    </TouchableOpacity>
  </View>
);

let restForm;

const validationSchema = Yup.object().shape({
  maleOrFemale: Yup.array().min(1, '请选择宿舍分类'),
  buildingNum: Yup.array().min(1, '请选择宿舍楼栋'),
  floorNum: Yup.array().min(1, '请选择楼层'),
  roomNum: Yup.array().min(1, '请选择房间号'),
});
const initialValues = {
  maleOrFemale: [],
  buildingNum: [],
  floorNum: [],
  roomNum: [],
  property1: {
    propertyName: '',
    number: '',
    union: 'ge',
    propertyStatus: [],
    propertyPhotos: [],
  },
};

const AddProperty = () => {
  const scrollRef = useRef(null);

  const [propertyList, setPropertyList] = useState([{name: 'property1', wrong: false}]);
  const [selectUnion, setSelectUnion] = useState('ge');

  const checkPropertyList = (values) => {
    //提交的时候对资产列表进行核验；
    const fieldNameList = Object.keys(values);
    const propertyNameList = fieldNameList.filter(field => field.includes('property'));
    if(propertyNameList.length){
      const propertyValidateList = propertyNameList.map(property => {
        if(!values[property].propertyName.length || !values[property].number.length || !values[property].propertyStatus.length || !values[property].propertyPhotos.length){
          return false;
        }else{
          return true;
        }
      });
      const copyList = [...propertyList];
      propertyValidateList.map((property, propertyIndex) => copyList[propertyIndex].wrong = !property);
      setPropertyList(copyList);
      return !propertyValidateList.every(item => item);
    }
  };

  const onSubmit = (values) => {
    console.log('点击了提交', values);
  };

  const save = () => {
    restForm.handleSubmit();
    const hasWrong = checkPropertyList(restForm.values);
    if(hasWrong) return;
  };

  const deleteProperty = () => {
    const newArr = [...propertyList];
    newArr.pop();
    setPropertyList(newArr);

    const newProperty = { ...restForm.values };
    delete newProperty[`property${propertyList.length}`];
    restForm.setValues(newProperty);
  };

  const addProperty = () => {
    scrollRef?.current?.scrollToEnd();
    const newArr = [...propertyList];
    newArr.push({name: `property${propertyList.length + 1}`, wrong: false});
    setPropertyList(newArr);

    const newProperty = { ...restForm.values };
    newProperty[`property${propertyList.length + 1}`] = {
      propertyName: '',
      number: '',
      union: 'ge',
      propertyStatus: [],
      propertyPhotos: [],
    };
    restForm.setValues(newProperty);
  };

  const changeUnion = (union) => setSelectUnion(union);

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}>
      {({...rest }) => {
        restForm = rest;
        return (
          <>
            <ScrollView ref={scrollRef} style={styles.screen} keyboardShouldPersistTaps="handled">
              <View style={styles.shadowContainer}>
                <Shadow style={[styles.shadowArea, {marginBottom: 30}]}>
                  <View style={styles.content}>
                    <View style={styles.titleArea}>
                      <Text style={styles.titleText}>宿舍信息</Text>
                    </View>
                    <View style={styles.shadowContent_liveInfo}>
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
                    </View>
                  </View>
                </Shadow>
                {propertyList.map((property, propertyIndex) => {
                  const propertyNameIndex = propertyIndex + 1;
                  const isLastIndex = propertyIndex === propertyList.length - 1;
                  return (
                    <Shadow key={propertyIndex} style={[styles.shadowArea, {marginBottom: isLastIndex ? 10 : 30}]}>
                      <View style={styles.content}>
                        <View style={styles.titleArea}>
                          {propertyNameIndex === propertyList.length && propertyNameIndex !== 1 && <TouchableOpacity style={styles.deleteIcon} onPress={() => deleteProperty(property)}>
                            <AntDesign name='delete' size={36} color='#ff6666' />
                          </TouchableOpacity>}
                          <Text style={styles.titleText}>资产{`${propertyNameIndex}`}</Text>
                          {propertyNameIndex === propertyList.length && propertyList.length !== 10 && <TouchableOpacity style={styles.addIcon} onPress={addProperty}>
                            <AntDesign name='pluscircleo' size={36} color='#409EFF' />
                          </TouchableOpacity>}
                        </View>
                        <View style={[styles.shadowContent_liveInfo, property.wrong && {paddingTop: 0}]}>
                          {property.wrong && <Text style={styles.warningText}>该资产未填写完整！</Text>}
                          <Field
                            name={`property${propertyNameIndex}.propertyName`}
                            label="资产名称"
                            selectTextOnFocus
                            isRequire
                            multiline
                            clearIcon
                            labelStyle={{width: 160}}
                            inputStyle={{flex: 0, minHeight: 60}}
                            component={SingleInput}
                          />
                          <Field
                            name={`property${propertyNameIndex}.number`}
                            label="数量"
                            isRequire
                            multiline
                            clearIcon
                            selectTextOnFocus
                            keyboardType="numeric"
                            labelStyle={{width: 160}}
                            inputStyle={{flex: 0, minHeight: 60, flex: 1}}
                            inputRightComponent={<Field name={`property${propertyNameIndex}.union`} component={RightUnionOfNumber} />}
                            component={SingleInput}
                          />
                          <Field
                            name={`property${propertyNameIndex}.propertyStatus`}
                            label="资产状态"
                            isRequire
                            labelStyle={{width: 160}}
                            radioList={PROPERTY_STATUS_LIST}
                            component={RadioSelect}
                          />
                          <Field
                            name={`property${propertyNameIndex}.propertyPhotos`}
                            label="资产照片"
                            type="takePicture"
                            isRequire
                            maxPictureNum={3}
                            labelStyle={{width: 160}}
                            component={SelectPhotos}
                          />
                        </View>
                      </View>
                    </Shadow>
                  )
                })}
              </View>
            </ScrollView>
            <Button
              title="保存"
              onPress={save}
              containerStyle={styles.buttonContainerStyle}
              buttonStyle={styles.buttonStyle}
              titleStyle={styles.titleStyle}
            />
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
  shadowContainer: {
    flex: 1, 
    paddingHorizontal: 20, 
    paddingTop: 30
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
  addIcon: {
    width: 60, 
    height: 60, 
    position: 'absolute', 
    zIndex: 999, 
    right: 0, 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  deleteIcon: {
    width: 60, 
    height: 60, 
    position: 'absolute', 
    zIndex: 999, 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  shadowContent_liveInfo: {
    backgroundColor: '#FFFFFF', 
    borderBottomLeftRadius: 10, 
    borderBottomRightRadius: 10,
    padding: 20,
    paddingBottom: 0
  },
  unionArea: {
    width: 160, 
    height: 60, 
    flexDirection: 'row'
  },
  touchArea: {
    flex: 1, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center'
  },
  iconArea: {
    textAlign: 'center', 
    marginRight: 5
  },
  iconText: {
    fontSize: 26, 
    color: '#333333'
  },
  warningText: {
    textAlign: 'center', 
    fontSize: 24, 
    color: 'red', 
    marginVertical: 10
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

export default AddProperty;