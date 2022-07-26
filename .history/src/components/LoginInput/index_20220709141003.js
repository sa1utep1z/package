import React from 'react';
import {StyleSheet} from 'react-native';
import {Text, Input} from '@rneui/themed';
import {ErrorMessage} from 'formik';

const LoginInput = ({field, form, ...props}) => {

  return (
    <>
      <Input
        label={props.label}
        placeholder={props.placeholder || `请输入${props.label}`}
        value={field.value}
        onChangeText={form.handleChange(field.name)}
        containerStyle={styles.containerStyle}
        labelStyle={styles.labelStyle}
        inputContainerStyle={styles.inputContainerStyle}
        inputStyle={styles.inputStyle}
        {...props}
      />
      <ErrorMessage
        name={field.name}
        component={Text}
        style={styles.errorInput}
      />
    </>
  )
}

const styles = StyleSheet.create({
  containerStyle: {
    flexDirection: 'row', 
    alignItems: 'center',
    marginTop: 10
  },
  labelStyle: {
    width: 60, 
    height: '100%', 
    color: '#000', 
    fontSize: 16, 
    fontWeight: 'bold', 
    borderBottomWidth: 2, 
    borderColor: '#E3E3E3', 
    paddingTop: 13
  },
  inputContainerStyle: {
    flex: 1, 
    borderColor: '#E3E3E3', 
    borderBottomWidth: 2
  },
  inputStyle: {
    fontSize: 15, 
    color: '#000'
  },
  errorInput: {
    marginLeft: 75,
    color: 'red'
  }
})

export default LoginInput;