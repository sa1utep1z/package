import React, {useState, useEffect, useMemo, useCallback} from "react";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { useDispatch } from 'react-redux';
import { Formik, Field } from 'formik';

import { closeDialog } from "../../../redux/features/PageDialog";
import SelectItemOfFilterMore from './SelectItemOfFilterMore';

let restForm;
const initialValues = {
  floor: []
};

const FilterMore = ({
  originForm
}) => {
  const dispatch = useDispatch();

  const confirmOnPress = () => {
    console.log('originForm', originForm);
    originForm.submitForm();
    dispatch(closeDialog());
  };

  const onSubmit = values => {
    console.log('values', values);
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
            <View style={{flex: 1, paddingHorizontal: 30}}>
              <View style={{height: 60}}>
                <Field
                  name="floor"
                  label="楼层"
                  originForm={originForm}
                  component={SelectItemOfFilterMore}
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
  totalArea: {
    height: 900
  },
  topArea: {
    flex: 1,
    borderWidth: 1
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
  }
})

export default FilterMore;