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
  otherComponent,
  ...rest
}) => {

  return (
    <View style={styles.totalArea}>
      <View style={[styles.titleArea, labelAreaStyle]}>
        <Text style={styles.titleArea_text}>{title}：</Text>
      </View>
      <View style={styles.rightArea}>
        {otherComponent ? otherComponent : <Input
          value={field.value}
          placeholder='暂无回访记录'
          multiline
          inputContainerStyle={styles.inputContainerStyle}
          inputStyle={styles.inputStyle}
          errorStyle={styles.errorStyle}
          {...rest}
        />}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  totalArea: {
    minHeight: 160, 
    paddingLeft: 28,
    paddingRight: 10,
    flexDirection: 'row'
  },
  titleArea: {
    justifyContent: 'center', 
    alignItems: 'center'
  },
  titleArea_text: {
    fontSize: 32
  },
  rightArea: {
    flex: 1, 
    borderWidth: 1, 
    borderColor: '#CCCCCC', 
    borderRadius: 8, 
    marginVertical: 10,
    padding: 5
  },
  inputContainerStyle: {
    paddingVertical: 5, 
    borderBottomWidth: 0
  },
  inputStyle: {
    padding: 0, 
    fontSize: 28
  },
  errorStyle: {
    display: 'none'
  }
})

export default LongTextArea;