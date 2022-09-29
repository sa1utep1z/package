import React from 'react';
import {StyleSheet, View, Text, TextInput} from 'react-native';
import {ErrorMessage} from 'formik';

/**单行输入*/
const SingleInput = ({
  field, 
  form, 
  label,
  rightButton,
  ...rest
}) => {
  return (
    <View style={!form.errors[field.name] && styles.inputArea}>
      <View style={styles.container}>
        <Text style={styles.labelText}>{label}：</Text>
        <View style={[styles.inputContainer, form.errors[field.name] && styles.errorBorder]}>
          <TextInput
            value={field.value}
            placeholder={`请输入${label}`}
            onChangeText={form.handleChange(field.name)}
            style={{fontSize: 26}}
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
    fontSize: 28,
    color: '#333333'
  },
  inputContainer: {
    flex: 1,
    height: 60,
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