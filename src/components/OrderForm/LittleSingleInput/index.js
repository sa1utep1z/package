import React from 'react';
import {StyleSheet, View, Text, TextInput} from 'react-native';
import {ErrorMessage} from 'formik';

/**缩小版单行输入框*/
const LittleSingleInput = ({
  field, 
  form, 
  inputStyle,
  inputContainerStyle,
  inputRightComponent,
  ...rest
}) => {
  return (
    <View style={[{flex: 1, flexDirection: 'row'}, inputStyle]}>
      <View style={[styles.inputContainer, inputContainerStyle]}>
        <TextInput
          value={field.value}
          placeholder='输入'
          placeholderTextColor="#999999"
          onChangeText={form.handleChange(field.name)}
          style={{flex: 1, fontSize: 22, textAlign: 'center', padding: 0}}
          selectionColor="#409EFF"
          {...rest}
        />
      </View>
      {inputRightComponent}
    </View>
  )
};

const styles = StyleSheet.create({
  inputContainer: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#E5E5E5',
    borderRadius: 6
  },
  errorMessage: {
    color: 'red',
    fontSize: 22
  },
  errorBorder: {
    borderColor: 'red'
  }
})

export default LittleSingleInput;