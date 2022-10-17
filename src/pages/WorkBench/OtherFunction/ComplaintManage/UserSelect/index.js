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
  title,
  selectList = [],
  inputStyle,
  canSearch = true,
  ...rest
}) => {
  const dispatch = useDispatch();

  const [showDialog, setShowDialog] = useState(false);

  const confirm = (list) => {
    form.setFieldValue(field.name, list);
    console.log('选择的数组值：', list);
  };
  const formData = form.values;
  console.log('传过来的数组值：', field, label, formData);
  const selectOnPress = () => {
    dispatch(setTitle('请选择姓名'));
    dispatch(openDialog(<UserSelectList canSearch={canSearch} selectList={selectList} fieldValue={field.value} confirm={confirm}/>));
  };

  return (
    <View style={[{flex: 1, flexDirection: 'row'}, !form.errors[field.name] && styles.selectArea]}>
      <View style={[styles.container, inputStyle]}>
        <Text style={styles.labelText}>{title}：</Text>
        <TouchableOpacity style={[styles.inputContainer, form.errors[field.name] && styles.errorBorder]} onPress={selectOnPress}>
          {/* {field.value && <> */}
            <Text numberOfLines={1} style={[styles.itemText, !field.value.length && styles.itemText_none]}>
              {!!field.value.length ? field.value[0].userName : `请选择${title}`}
            </Text>
          {/* </>} */}
          <AntDesign
            name='down'
            size={16}
            color='#999999'
          />
        </TouchableOpacity>
      </View>
      {!!form.errors[field.name] && <View style={{flexDirection: 'row'}}>
        <Text style={[styles.labelText, {opacity: 0}]}>{title}：</Text>
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
    minWidth: 60,
    fontSize: 16,
    color: '#333333'
  },
  itemText: {
    fontSize: 16,
    color: '#333333'
  },
  itemText_none: {
    fontSize: 16,
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
    height: 30,
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