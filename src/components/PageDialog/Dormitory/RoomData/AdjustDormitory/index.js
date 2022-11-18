import React, {useState, useRef, useImperativeHandle, forwardRef} from "react";
import { ScrollView, Text, View, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { Shadow } from 'react-native-shadow-2';
import { CheckBox } from '@rneui/themed';
import { Formik, Field } from 'formik';
import moment from "moment";

import SelectTimeOfFilterMore from '../../../../HeaderSearchOfDormitory/FilterMore/SelectTimeOfFilterMore';
import SelectItemOfFilterMore from '../../../../HeaderSearchOfDormitory/FilterMore/SelectItemOfFilterMore';

let restForm;

const initialValues = {
  leaveDate: '',
  joinInDate: '',
  buildingNum: [],
  floorNum: [],
  roomNum: [],
  bedNum: []
};

const AdjustDormitory = ({
}) => {
  const scrollViewRef = useRef(null);

  const [dormitoryType, setDormitoryType] = useState('male');
  const [bottomError, setBottomError] = useState(false);
  const [topError, setTopError] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);

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
          <View style={styles.totalArea}>
            <View style={styles.topInfoArea}>
              <View style={styles.topInfoArea_top}>
                <Text selectable style={styles.top_leftText}>姓名：张三</Text>
                <Text selectable style={styles.top_rightText}>手机号：15390913806</Text>
              </View>
              <Text selectable style={styles.topInfoArea_bottom}>身份证号：452123123412341234</Text>
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
    height: 900
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
  top_rightText: {
    flex: 1, 
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