import React from 'react';
import {StyleSheet, View, Text, TextInput} from 'react-native';
import {ErrorMessage} from 'formik';

/**范围输入框*/
const OrderRangeInput = ({
  field, 
  form, 
  label,
  rightButton,
  placeholder,
  inputStyle,
  inputRightComponent,
  ...rest
}) => {
  console.log('form', form);

  const changeTextOnStart = (value) => {
    const newObj = {
      ...field.value,
      start: value
    }
    form.setFieldValue(field.name, newObj);
  };

  const changeTextOnEnd = (value) => {
    const newObj = {
      ...field.value,
      end: value
    }
    form.setFieldValue(field.name, newObj);
  };

  return (
    <View style={[{marginBottom: form.errors[field.name] ? 10 : 20}, inputStyle]}>
      <View style={styles.container}>
        <Text style={styles.labelText}>{label}：</Text>
        <View style={[styles.inputContainer, form.errors[field.name] && styles.errorBorder]}>
          <View style={{flex: 1}}>
            <View style={[{flex: 1, flexDirection: 'row', borderWidth: 2, borderColor: '#E5E5E5', borderRadius: 6, paddingHorizontal: 20}, form.errors[field.name]?.start && form.touched[field.name]?.start && {borderColor: 'red'}]}>
              <TextInput
                value={field.value.start}
                placeholder={`起始${label}`}
                placeholderTextColor="#999999"
                onChangeText={changeTextOnStart}
                style={{flex: 1, fontSize: 26}}
                selectionColor="#409EFF"
                {...rest}
              />
              {inputRightComponent}
            </View>
            {!!form.errors[field.name] && form.touched[field.name] && <View style={{flexDirection: 'row'}}>
              <Text style={{fontSize: 22, color: 'red'}}>{form.errors[field.name].start}</Text>
            </View>}
          </View>
          <Text style={{marginHorizontal: 10, fontSize: 26, height: 60, textAlignVertical: 'center'}}>至</Text>
          <View style={{flex: 1}}>
            <View style={[{flex: 1, flexDirection: 'row', borderWidth: 2, borderColor: '#E5E5E5', borderRadius: 6, paddingHorizontal: 20}, form.errors[field.name]?.end && form.touched[field.name]?.end && {borderColor: 'red'}]}>
              <TextInput
                value={field.value.end}
                placeholder={`结束${label}`}
                placeholderTextColor="#999999"
                onChangeText={changeTextOnEnd}
                style={{flex: 1, fontSize: 26}}
                selectionColor="#409EFF"
                {...rest}
              />
              {inputRightComponent}
            </View>
            {!!form.errors[field.name] && form.touched[field.name] && <View style={{flexDirection: 'row'}}>
              <Text style={{fontSize: 22, color: 'red'}}>{form.errors[field.name].end}</Text>
            </View>}
          </View>
        </View>
        {rightButton}
      </View>

    </View>
  )
};

const styles = StyleSheet.create({
  inputArea: {
    marginBottom: 20
  },
  container: {
    flexDirection: 'row'
  },
  labelText: {
    height: 60,
    textAlignVertical: 'center',
    minWidth: 150,
    fontSize: 28,
    color: '#333333'
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start'
  },
  errorMessage: {
    color: 'red',
    fontSize: 22
  },
  errorBorder: {
    borderColor: 'red'
  }
})

export default OrderRangeInput;