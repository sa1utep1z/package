import React from 'react';
import {StyleSheet, View, Text, TextInput} from 'react-native';
import {ErrorMessage} from 'formik';

/**单行输入*/
const SingleInput = ({
  field, 
  form, 
  label,
  rightButton,
  placeholder,
  inputStyle,
  inputContainerStyle,
  ...rest
}) => {
  return (
    <View style={[!form.errors[field.name] && styles.inputArea, inputStyle]}>
      <View style={styles.container}>
        <Text style={styles.labelText}>{label}：</Text>
        <View style={[styles.inputContainer, form.errors[field.name] && styles.errorBorder, inputContainerStyle]}>
          <TextInput
            value={field.value}
            placeholder={placeholder || `请输入${label}`}
            placeholderTextColor="#999999"
            onChangeText={form.handleChange(field.name)}
            style={{fontSize: 26}}
            selectionColor="#409EFF"
            {...rest}
          />
        </View>
        {rightButton}
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
  inputArea: {
    marginBottom: 20
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  labelText: {
    minWidth: 150,
    fontSize: 28,
    color: '#333333'
  },
  inputContainer: {
    flex: 1,
    minHeight: 60,
    borderWidth: 2,
    borderColor: '#E5E5E5',
    borderRadius: 6,
    paddingHorizontal: 19,
  },
  errorMessage: {
    color: 'red',
    fontSize: 22
  },
  errorBorder: {
    borderColor: 'red'
  }
})

export default SingleInput;