import React, {useState} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, TextInput} from 'react-native';
import {ErrorMessage} from 'formik';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useDispatch } from 'react-redux';

import { openDialog, setTitle } from '../../../../../redux/features/PageDialog'; 
import UserSelectList from '../../../../../components/PageDialog/UserSelectList';

/**用戶单选*/
const UserSelect = ({
  field, 
  form, 
  label,
  selectList = [],
  inputStyle,
  ...rest
}) => {
  const dispatch = useDispatch();

  const [showDialog, setShowDialog] = useState(false);

  const confirm = (list) => {
    form.setFieldValue(field.name, list);
    console.log('选择的数组值：', list);
    form.setFieldValue('contactResidents', [{userId: list[0].id, userName: list[0].userName, mobile: list[0].mobile}]);
  };
  const formData = form.values;
  console.log('传过来的数组值：', field, formData);
  const selectOnPress = () => {
    dispatch(setTitle('请选择姓名'));
    dispatch(openDialog(<UserSelectList selectList={selectList} fieldValue={field.value} confirm={confirm}/>));
  };

  return (
    <View style={[{flex: 1, flexDirection: 'row'}, !form.errors[field.name] && styles.selectArea]}>
      <View style={[styles.container, inputStyle]}>
        <Text style={styles.labelText}>{label}</Text>
        <TouchableOpacity style={[styles.inputContainer, form.errors[field.name] && styles.errorBorder]} onPress={selectOnPress}>
          {field.value && <>
            <Text numberOfLines={1} style={[styles.itemText, !field.value.length && styles.itemText_none]}>
              {!!field.value.length ? field.value[0].userName : `请选择${label}`}
            </Text>
          </>}
          <AntDesign
            name='down'
            size={36}
            color='#999999'
          />
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        <Text style={[styles.labelText, { marginLeft: 10 }]}>手机号</Text>
        <View>
          <TextInput
            value={!!field.value.length ? field.value[0].mobile : ''}
            placeholder='请输入手机号码'
            placeholderTextColor="#999999"
            onChangeText={form.handleChange(field.name)}
            style={styles.inputMobile}
            selectionColor="#409EFF"
            // {...rest}
          />
        </View>
      </View>
      {!!form.errors[field.name] && <View style={{flexDirection: 'row'}}>
        <Text style={[styles.labelText, {opacity: 0}]}>{label}：</Text>
        <ErrorMessage
          name={field.name}
          style={styles.errorMessage}
          component={Text}
        />
      </View>}
    </View>
  )
};

const styles = StyleSheet.create({
  selectArea: {
    marginBottom: 20
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  labelText: {
    minWidth: 80,
    fontSize: 28,
    color: '#333333'
  },
  itemText: {
    fontSize: 26,
    color: '#333333'
  },
  itemText_none: {
    fontSize: 26,
    color: '#999999'
  },
  inputMobile: {
    height: 60,
    flex: 1,
    borderWidth: 2,
    borderColor: '#E5E5E5',
    borderRadius: 6,
    textAlign: 'center',
    fontSize: 26,
    color: '#333',
    marginLeft: 10,
  },
  inputContainer: {
    flex: 1,
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 2,
    borderColor: '#E5E5E5',
    borderRadius: 6,
    paddingHorizontal: 19
  },
  errorMessage: {
    color: 'red',
    fontSize: 22
  },
  errorBorder: {
    borderColor: 'red'
  }
})

export default UserSelect;