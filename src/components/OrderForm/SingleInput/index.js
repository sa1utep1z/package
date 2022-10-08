import React from 'react';
import {StyleSheet, View, Text, TextInput} from 'react-native';
import {ErrorMessage} from 'formik';

/**单行输入*/
const SingleInput = ({
  field, 
  form, 
  label,
  placeholder,
  inputStyle,
  inputContainerStyle,
  labelStyle,
  inputRightComponent,
  lengthLimit = false, //是否限制字数（多行输入框输入文本右下角）
  showLabel = true, //是否展示标题，默认为是
  centerInput = false, //输入框是否居中
  ...rest
}) => {
  return (
    <View style={[{flex: 1}, !form.errors[field.name] && styles.inputArea, inputStyle]}>
      <View style={styles.container}>
        {showLabel && <Text style={[styles.labelText, labelStyle]}>{label}：</Text>}
        <View style={{flex: 1}}>
          <View style={[styles.inputContainer, form.errors[field.name] && styles.errorBorder, inputContainerStyle]}>
            <View style={{flexDirection: 'row'}}>
              <TextInput
                value={field.value}
                placeholder={placeholder || `请输入${label}`}
                placeholderTextColor="#999999"
                onChangeText={form.handleChange(field.name)}
                style={[{flex: 1, fontSize: 26}, centerInput && {textAlign: 'center'}]}
                selectionColor="#409EFF"
                {...rest}
              />
              {inputRightComponent}
            </View>
            {lengthLimit ? <View style={{width: '100%', alignItems: 'flex-end', paddingBottom: 5, marginLeft: 5}}>
              <Text style={{fontSize: 22, color: '#999999'}}>{`${field.value.length}/${rest.maxLength}`}</Text>
            </View> : <></>}
          </View>
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
  inputArea: {
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
  inputContainer: {
    minHeight: 60,
    borderWidth: 2,
    borderColor: '#E5E5E5',
    borderRadius: 6,
    paddingHorizontal: 19,
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

export default SingleInput;