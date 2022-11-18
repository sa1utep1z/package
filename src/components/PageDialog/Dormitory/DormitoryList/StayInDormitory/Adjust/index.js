import React, {useState, useRef, useImperativeHandle, forwardRef} from "react";
import { ScrollView, Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { Shadow } from 'react-native-shadow-2';
import { CheckBox } from '@rneui/themed';
import { Formik, Field } from 'formik';
import moment from "moment";

import SelectTimeOfFilterMore from '../../../../../HeaderSearchOfDormitory/FilterMore/SelectTimeOfFilterMore';
import SelectItemOfFilterMore from '../../../../../HeaderSearchOfDormitory/FilterMore/SelectItemOfFilterMore';

let restForm;

const initialValues = {
  leaveDate: '',
  joinInDate: '',
  buildingNum: [],
  floorNum: [],
  roomNum: [],
  bedNum: []
};

const Adjust = ({}, ref) => {
  const scrollViewRef = useRef(null);

  const [dormitoryType, setDormitoryType] = useState('male');
  const [bottomError, setBottomError] = useState(false);
  const [topError, setTopError] = useState(false);

  useImperativeHandle(ref, () => {
    return { restForm };
  }, [restForm]);

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
    if(isNoneFieldValue || !values.joinInDate.length){
      scrollViewRef?.current?.scrollToEnd();
      setBottomError(true);
      returnValue = true;
    }else{
      setBottomError(false);
      returnValue = false;
    }
    return returnValue;
  }

  const onSubmit = (values) => {
    const hasError = checkValues(values);
  };

  const selectOtherFunc = (type, date) => {
    restForm.setFieldValue(type === 'leaveDate' ? 'joinInDate' : 'leaveDate', date);
    if(type === 'leaveDate'){
      scrollViewRef?.current?.scrollToEnd();
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}>
      {({...rest}) => {
        restForm = rest;
        return (
          <ScrollView ref={scrollViewRef} showsVerticalScrollIndicator={false}>
            <View style={{padding: 20, paddingBottom: 0}}>
              <Text style={styles.itemText}>会员姓名：张三</Text>
              <Text selectable style={styles.itemText}>会员手机号：<Text selectable style={styles.blueText}>15390913806</Text></Text>
              <Text selectable style={[styles.itemText, {marginBottom: 20}]}>会员身份证号：<Text selectable style={styles.blueText}>452123123412341234</Text></Text>
              <Shadow style={styles.dormitoryArea}>
                <View style={styles.dormitoryArea_topArea}>
                  <Text style={styles.dormitoryArea_topAreaText}>调迁前宿舍</Text>
                </View>
                <View style={styles.dormitoryArea_bottomArea}>
                  <View style={styles.listItem}>
                    <View style={styles.leftTitle}>
                      <Text style={styles.titleText}>宿舍楼栋</Text>
                    </View>
                    <Text style={styles.rightText}>241栋</Text>
                  </View>
                  <View style={styles.listItem}>
                    <View style={styles.leftTitle}>
                      <Text style={styles.titleText}>宿舍分类</Text>
                    </View>
                    <Text style={styles.rightText}>男生宿舍</Text>
                  </View>
                  <View style={styles.listItem}>
                    <View style={styles.leftTitle}>
                      <Text style={styles.titleText}>宿舍楼层</Text>
                    </View>
                    <Text style={styles.rightText}>1F</Text>
                  </View>
                  <View style={styles.listItem}>
                    <View style={styles.leftTitle}>
                      <Text style={styles.titleText}>房间号</Text>
                    </View>
                    <Text style={styles.rightText}>101</Text>
                  </View>
                  <View style={styles.listItem}>
                    <View style={styles.leftTitle}>
                      <Text style={styles.titleText}>床位号</Text>
                    </View>
                    <Text style={styles.rightText}>101-1</Text>
                  </View>
                  <View style={styles.listItem}>
                    <View style={styles.leftTitle}>
                      <Text style={styles.titleText}>入住日期</Text>
                    </View>
                    <Text style={styles.rightText}>2022-05-23</Text>
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
                        touchAreaStyle={{height: 40, borderRadius: 4}}
                        startLimit={moment().add(1).format('YYYY-MM-DD')}
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
                        name="joinInDate"
                        label="入住日期"
                        fontSize={24}
                        iconSize={28}
                        canDelete={false}
                        showLabel={false}
                        showArrow={false}
                        borderColor="#EFEFEF"
                        touchAreaStyle={{height: 40, borderRadius: 4}}
                        startLimit={moment().add(1).format('YYYY-MM-DD')}
                        selectOtherFunc={selectOtherFunc}
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
                        selectStyle={{height: 40, borderRadius: 4}}
                        component={SelectItemOfFilterMore}
                      />
                    </View>
                  </View>
                  <View style={styles.listItem}>
                    <View style={styles.leftTitle}>
                      <Text style={styles.titleText}>宿舍分类</Text>
                    </View>
                    <View style={styles.lineArea}>
                      <View style={styles.typeArea}>
                        <TouchableOpacity style={styles.maleArea} onPress={()=>setDormitoryType('male')}>
                          <CheckBox
                            center
                            size={26}
                            pointerEvents={'none'}
                            checked={dormitoryType === 'male'}
                            containerStyle={styles.checkBoxContainerStyle}
                            checkedIcon="dot-circle-o"
                            uncheckedIcon="circle-o"
                          />
                          <Text style={styles.typeAreaText}>男宿舍</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.femaleArea} onPress={()=>setDormitoryType('female')}>
                          <CheckBox
                            center
                            size={26}
                            pointerEvents={'none'}
                            checked={dormitoryType === 'female'}
                            containerStyle={styles.checkBoxContainerStyle}
                            checkedIcon="dot-circle-o"
                            uncheckedIcon="circle-o"
                          />
                          <Text style={styles.typeAreaText}>女宿舍</Text>
                        </TouchableOpacity>
                      </View>
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
                        selectStyle={{height: 40, borderRadius: 4}}
                        component={SelectItemOfFilterMore}
                      />
                    </View>
                  </View>
                  <View style={styles.lastItem}>
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
                        selectStyle={{height: 40, borderRadius: 4}}
                        component={SelectItemOfFilterMore}
                      />
                    </View>
                  </View>
                </View>
              </Shadow>
            </View>
          </ScrollView>
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