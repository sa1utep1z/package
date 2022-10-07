import React, {useState} from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {ErrorMessage} from 'formik';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useDispatch } from 'react-redux';

import { openDialog, setTitle } from '../../../redux/features/PageDialog'; 
import SingleSelectList from '../../PageDialog/SingleSelectList';

/**单选*/
const SingleSelect = ({
  field, 
  form, 
  label,
  selectList = [],
  ...rest
}) => {
  const dispatch = useDispatch();

  const [showDialog, setShowDialog] = useState(false);

  const confirm = (list) => {
    form.setFieldValue(field.name, list);
  };

  const selectOnPress = () => {
    dispatch(setTitle('请选择用工企业'));
    dispatch(openDialog(<SingleSelectList selectList={selectList} fieldValue={field.value} confirm={confirm}/>));
  };

  return (
    <View style={[{flex: 1}, !form.errors[field.name] && styles.selectArea]}>
      <View style={styles.container}>
        <Text style={styles.labelText}>{label}：</Text>
        <View style={{flex: 1}}>
          <TouchableOpacity style={[styles.inputContainer, form.errors[field.name] && styles.errorBorder]} onPress={selectOnPress}>
            {field.value && <>
              <Text numberOfLines={1} style={[styles.itemText, !field.value.length && styles.itemText_none]}>
                {!!field.value.length ? field.value[0].label : `请选择${label}`}
              </Text>
            </>}
            <AntDesign
              name='down'
              size={36}
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
  itemText: {
    fontSize: 26,
    color: '#333333'
  },
  itemText_none: {
    fontSize: 26,
    color: '#999999'
  },
  inputContainer: {
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
    fontSize: 22,
    marginBottom: 10
  },
  errorBorder: {
    borderColor: 'red'
  }
})

export default SingleSelect;