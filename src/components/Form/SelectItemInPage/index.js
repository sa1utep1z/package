//这是会员标签的组件，目前只有一个应用场景，就还没有剥离出去，如果以后有相同使用场景，就把他请求接口写在外边。
import React, {useState, useRef} from 'react';
import {StyleSheet, View, TouchableOpacity, ActivityIndicator, ScrollView} from 'react-native';
import {Text, Input} from '@rneui/themed';
import {ErrorMessage} from 'formik';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useQuery } from '@tanstack/react-query';
import { useToast } from "react-native-toast-notifications";

import NormalDialog from '../../NormalDialog';
import MyMembersApi from '../../../request/MyMembersApi';
import { SUCCESS_CODE } from '../../../utils/const';
import { deepCopy } from '../../../utils';
import { useMemo } from 'react';

const SelectItemInPage = ({
  field, 
  form, 
  title,
  pageOnPress,
  labelAreaStyle,
  labelStyle,
  inputStyle,
  inputContainerStyle,
  containerStyle,
  ...rest
}) => {

  return (
    <>
      <View style={styles.selectArea}>
        <View style={[styles.titleArea, labelAreaStyle]}>
          <Text style={{fontSize: 32}}>{title}：</Text>
        </View>
        <TouchableOpacity style={styles.rightArea} onPress={pageOnPress}>
          <Text style={[styles.rightArea_text, !field.value && {color: '#999999'}]}>{field.value ? field.value.label : `请选择${title}`}</Text>
          <AntDesign
            name={'down'}
            size={30}
            color={!field.value ? '#CCCCCC' : 'black'}
          />
        </TouchableOpacity>
      </View>
      <ErrorMessage
        name={field.name}
        component={Text}
        style={styles.errorInput}
      />
    </>
  )
}

const styles = StyleSheet.create({
  errorInput: {
    textAlign: 'center',
    color: 'red'
  },
  selectArea: {
    height: 91,
    flexDirection: 'row', 
    borderBottomWidth: 2, 
    borderBottomColor: 'rgba(0, 0, 0, .05)',
    paddingHorizontal: 28
  },
  titleArea: {
    justifyContent: 'center', 
    alignItems: 'center'
  },
  rightArea: {
    flex: 1, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center'
  },
  rightArea_text: {
    fontSize: 32
  }
})

export default SelectItemInPage;