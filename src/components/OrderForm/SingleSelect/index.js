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

  const selectOnPress = () => {
    dispatch(setTitle('请选择企业'));
    dispatch(openDialog(<SingleSelectList selectList={selectList}/>));
  };

  return (
    <View style={!form.errors[field.name] && styles.selectArea}>
      <View style={styles.container}>
        <Text style={styles.labelText}>{label}：</Text>
        <TouchableOpacity style={styles.inputContainer} onPress={selectOnPress}>
          <Text numberOfLines={1} style={styles.itemText}>{'哈哈哈'}</Text>
          <AntDesign
            name={showDialog ? 'up' : 'down'}
            size={36}
            color={showDialog ? '#999999' : '#000000'}
          />
        </TouchableOpacity>
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
    fontSize: 28,
    color: '#333333'
  },
  itemText: {
    fontSize: 26,
    color: '#333333'
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
  }
})

export default SingleSelect;