import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity, ActivityIndicator} from 'react-native';
import {ErrorMessage} from 'formik';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useDispatch } from 'react-redux';

import { openDialog, setTitle } from '../../../redux/features/PageDialog'; 
import SingleSelectList from '../../PageDialog/SingleSelectList';
import MyMembersApi from "../../../request/MyMembersApi";
import { SUCCESS_CODE } from '../../../utils/const';

/**缩小版的单选组件*/
const LittleSingleSelect = ({
  field, 
  form, 
  label = '',
  selectList = [], //单选列表自选
  type = '', //单选表单组件：提供几个基础模式：企业，门店，不需要模式也可以在外部传入selectList。
  ...rest
}) => {
  const dispatch = useDispatch();

  const confirm = (list) => {
    form.setFieldValue(field.name, list);
  };

  const selectOnPress = () => {
    dispatch(setTitle(`请选择${label}`));
    dispatch(openDialog(<SingleSelectList canSearch={false} selectList={selectList} fieldValue={field.value} confirm={confirm}/>));
  };

  return (
    <View style={[{flex: 1}, !form.errors[field.name] && styles.selectArea]}>
      <View style={styles.container}>
        <TouchableOpacity style={[styles.inputContainer, form.errors[field.name] && styles.errorBorder]} onPress={selectOnPress}>
          {field.value && <>
            <Text numberOfLines={1} style={[styles.itemText, !field.value.length && styles.itemText_none]}>
              {!!field.value.length ? field.value[0].label : `请选择${label}`}
            </Text>
          </>}
          <AntDesign
            name='down'
            size={26}
            color={!!field?.value?.length ? '#000000' : '#999999'}
          />
        </TouchableOpacity>
        {!!form.errors[field.name] && 
          <ErrorMessage
            name={field.name}
            style={styles.errorMessage}
            component={Text}
        />}
      </View>
    </View>
  )
};

const styles = StyleSheet.create({
  selectArea: {
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start'
  },
  itemText: {
    fontSize: 22,
    color: '#333333'
  },
  itemText_none: {
    fontSize: 26,
    color: '#999999'
  },
  inputContainer: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 2,
    borderColor: '#E5E5E5',
    borderRadius: 6,
    paddingHorizontal: 10
  },
  errorMessage: {
    color: 'red',
    fontSize: 22,
    marginBottom: 10
  },
  errorBorder: {
    borderColor: 'red'
  }
})

export default LittleSingleSelect;