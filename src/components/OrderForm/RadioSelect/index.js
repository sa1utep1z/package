import React, {useEffect} from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {ErrorMessage} from 'formik';
import { CheckBox } from '@rneui/themed';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

/**单选*/
const RadioSelect = ({
  field, 
  form, 
  label,
  radioList = [],
  radioItemsStyle,
  labelStyle,
  canSelect = true, //是否可以选择；
  isRequire = false,
  showLabel = true,
  rightComponent,
  AreaStyle,
  otherRadioPress, //点击时候触发其他判断函数；
  ...rest
}) => {

  const radioOnPress = (radio) => {
    if(!canSelect) return;
    form.setFieldValue(field.name, [radio]);
    otherRadioPress && otherRadioPress(field.name);
  };

  return (
    <View style={[styles.selectArea, form.errors[field.name] && form.touched[field.name] && {marginBottom: 10}, AreaStyle]}>
      <View style={styles.container}>
        {showLabel ? <Text style={[styles.labelText, labelStyle]}>
          {isRequire && <Text style={{color: 'red'}}>*</Text>}
          {label}：</Text> : <></>}
        <View style={{flex: 1}}>
          <View style={[styles.radiosArea, form.errors[field.name] && form.touched[field.name] && styles.errorBorder, radioItemsStyle]}>
            {radioList.map((radio, radioIndex) => {
              const isChecked = !!field?.value?.length ? field.value[0].value === radio.value : false;
              return (
                <TouchableOpacity key={radioIndex} activeOpacity={canSelect ? 0.2 : 1} style={[styles.touchArea, {maxWidth: `${(1/radioList.length) * 100}%`}]} onPress={() => radioOnPress(radio)}>
                  <MaterialIcons style={styles.icon} name={isChecked ? 'radio-button-checked' : 'radio-button-off'} size={32} color={canSelect ? isChecked ? '#409EFF' : '#999999' : '#999999'} />
                  <Text style={[styles.itemText, !field?.value?.length && styles.itemText_none]}>{radio.label}</Text>
                </TouchableOpacity>
              )
            })}
            {rightComponent}
          </View>
          <ErrorMessage name={field.name} style={styles.errorMessage} component={Text} />
        </View>
      </View>
    </View>
  )
};

const styles = StyleSheet.create({
  selectArea: {
    marginBottom: 20
  },
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start'
  },
  labelText: {
    height: 60,
    textAlignVertical: 'center',
    minWidth: 150,
    fontSize: 28,
    color: '#333333'
  },
  radiosArea: {
    flexDirection: 'row', 
    alignItems: 'center', 
    borderWidth: 2, 
    borderColor: '#E5E5E5', 
    borderRadius: 6, 
    paddingLeft: 10
  },
  touchArea: {
    minHeight: 60,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5
  },
  itemText: {
    fontSize: 26, 
    color: '#333333', 
    paddingRight: 10
  },
  icon: {
    textAlign: 'center', 
    marginRight: 5
  },
  itemText_none: {
    fontSize: 26,
    color: '#999999'
  },
  errorMessage: {
    color: 'red',
    fontSize: 22
  },
  errorBorder: {
    borderColor: 'red'
  },
  errorBorder_radio: {
    borderColor: 'red'
  }
})

export default RadioSelect;