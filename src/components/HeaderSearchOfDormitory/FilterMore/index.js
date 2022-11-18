import React, {useState, useEffect, useMemo, useCallback} from "react";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { useSelector, useDispatch } from 'react-redux';
import { Formik, Field } from 'formik';
import moment from 'moment';

import { closeDialog } from "../../../redux/features/PageDialog";
import SelectItemOfFilterMore from './SelectItemOfFilterMore';
import SelectTimeOfFilterMore from './SelectTimeOfFilterMore';
import { setStartDate, setEndDate } from "../../../redux/features/RangeDateOfList";

let restForm;
const initialValues = {
  floorNum: [],
  roomNum: [],
  bedNum: [],
  startDate: '',
  endDate: '',
};

const FilterMore = ({
  originForm
}) => {
  const dispatch = useDispatch();

  const rangeDate = useSelector(state => state.RangeDateOfList);
  const startDate = rangeDate.startDate ? moment(rangeDate.startDate).format('YYYY-MM-DD') : '';
  const endDate = rangeDate.endDate ? moment(rangeDate.endDate).format('YYYY-MM-DD') : '';

  useEffect(() => {
    if(originForm.values){
      if(originForm.values.hasOwnProperty('floorNum') && originForm.values.hasOwnProperty('roomNum') && originForm.values.hasOwnProperty('bedNum')){
        restForm.setValues({
          ...restForm.values,
          floorNum: originForm.values.floorNum,
          roomNum: originForm.values.roomNum,
          bedNum: originForm.values.bedNum,
        });
      }
    }

    restForm.setFieldValue('startDate', startDate);
    restForm.setFieldValue('endDate', endDate);
  }, [])

  const confirmOnPress = () => restForm.submitForm();

  const onSubmit = values => {
    console.log('confirm->values', values);
    originForm.setValues({
      ...originForm.values,
      ...values
    });
    originForm.submitForm();
    dispatch(closeDialog());
    dispatch(setStartDate(moment.utc(values.startDate)));
    dispatch(setEndDate(moment.utc(values.endDate)));
  };

  const close = () => dispatch(closeDialog());

  return (
    <View style={styles.totalArea}>
      <View style={styles.topArea}>
        <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}>
        {({...rest}) => {
          restForm = rest;
          return (
            <View style={styles.fieldArea}>
              <View style={styles.lineArea}>
                <Field
                  name="floorNum"
                  label="楼层"
                  type="floor"
                  originForm={originForm}
                  component={SelectItemOfFilterMore}
                />
              </View>
              <View style={styles.lineArea}>
                <Field
                  name="roomNum"
                  label="房间号"
                  type="room"
                  component={SelectItemOfFilterMore}
                />
              </View>
              <View style={styles.lineArea}>
                <Field
                  name="bedNum"
                  label="床位号"
                  type="bed"
                  component={SelectItemOfFilterMore}
                />
              </View>
              <View style={styles.lineArea}>
                <Field
                  name="startDate"
                  label="开始日期"
                  component={SelectTimeOfFilterMore}
                />
              </View>
              <View style={styles.lineArea}>
                <Field
                  name="endDate"
                  label="结束日期"
                  component={SelectTimeOfFilterMore}
                />
              </View>
            </View>
          )
        }}
        </Formik>
      </View>
      <View style={styles.bottomArea}>
        <View style={styles.leftArea}>
          <TouchableOpacity style={styles.buttonArea} onPress={close}>
            <Text style={styles.closeText}>取消</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.rightArea}>
          <TouchableOpacity style={styles.buttonArea} onPress={confirmOnPress}>
            <Text style={styles.confirmText}>确认</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
};

const styles = StyleSheet.create({
  totalArea: { },
  topArea: {
    flex: 1
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
    color: '#999999'
  },
  confirmText: {
    fontSize: 28, 
    color: '#409EFF'
  },
  fieldArea: {
    flex: 1, 
    paddingHorizontal: 30
  },
  lineArea: {
    height: 60, 
    marginBottom: 30
  }
})

export default FilterMore;