import React from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import {Text, Input} from '@rneui/themed';
import {ErrorMessage} from 'formik';
import AntDesign from 'react-native-vector-icons/AntDesign';

const LongTextArea = ({
  field, 
  form, 
  title,
  labelAreaStyle,
  labelStyle,
  inputStyle,
  inputContainerStyle,
  containerStyle,
  ...rest
}) => {

  console.log('field', field.value);

  return (
    <View style={styles.totalArea}>
      <View style={[styles.titleArea, labelAreaStyle]}>
        <Text style={styles.titleArea_text}>{title}</Text>
      </View>
      <View style={styles.rightArea}>
        <Input
          value={field.value}
          placeholder='暂无回访记录'
          multiline
          inputContainerStyle={styles.inputContainerStyle}
          inputStyle={styles.inputStyle}
          errorStyle={styles.errorStyle}
          {...rest}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  totalArea: {
    minHeight: 80, 
    paddingHorizontal: 10, 
    flexDirection: 'row'
  },
  titleArea: {
    width: 80, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: 10
  },
  titleArea_text: {
    fontSize: 14
  },
  rightArea: {
    flex: 1, 
    borderWidth: 1, 
    borderColor: '#CCCCCC', 
    borderRadius: 8, 
    marginVertical: 10
  },
  inputContainerStyle: {
    paddingVertical: 5, 
    borderBottomWidth: 0
  },
  inputStyle: {
    padding: 0, 
    fontSize: 14
  },
  errorStyle: {
    display: 'none'
  }
})

export default LongTextArea;