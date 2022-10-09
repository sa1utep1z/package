import React, {useState} from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {ErrorMessage} from 'formik';
import { CheckBox } from '@rneui/themed';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import AntDesign from 'react-native-vector-icons/AntDesign';

/**Tab栏单选（两个元素）*/
const TabSelectItem = ({
  form,
  field, 
  selectList
}) => {
  const itemOnPress = (item) => {
    form.setFieldValue(field.name, [item]);
  };

  return (
    <View style={{flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#999999'}}>
      {selectList.map((item, itemIndex) => (
        <TouchableOpacity key={itemIndex} style={[{height: 60, flex: 1, justifyContent: 'center'}, itemIndex === 0 && {borderTopLeftRadius: 10}, itemIndex === 1 && {borderTopRightRadius: 10} , field.value[0].value === item.value && {backgroundColor: '#409EFF'}]} onPress={() => itemOnPress(item)}>
          <Text style={[{textAlign: 'center', fontSize: 22}, field.value[0].value === item.value && {color: '#ffffff'}]}>{item.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  )
};

const styles = StyleSheet.create({

})

export default TabSelectItem;