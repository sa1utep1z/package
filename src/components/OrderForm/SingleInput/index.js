import React from 'react';
import {StyleSheet, View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView} from 'react-native';
import {ErrorMessage} from 'formik';
import AntDesign from 'react-native-vector-icons/AntDesign';

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
  onChangeOtherFunc, //输入的时候同步触发其他函数（比如输入身份证后查询某些信息）
  isRequire = false, //是否必填
  lengthLimit = false, //是否限制字数（多行输入框输入文本右下角）
  showLabel = true, //是否展示标题，默认为是
  centerInput = false, //输入框是否居中
  longText = false, //是否长文本，长文本则需要过滤<br/>标签
  clearIcon = false, //是否显示清空按钮，默认为否；
  ...rest
}) => {

  const onChangeText = (value) => {
    form.setFieldValue(field.name, value);
    onChangeOtherFunc && onChangeOtherFunc(value);
  };

  return (
    <View style={[styles.inputArea, form.errors[field.name] && form.touched[field.name] && {marginBottom: 10}, inputStyle]}>
      <View style={styles.container}>
        {showLabel && <Text style={[styles.labelText, labelStyle]}>
          {isRequire && <Text style={{color: 'red'}}>*</Text>}
          {label}：</Text>}
        <View style={{flex: 1}}>
          <View style={[styles.inputContainer, form.errors[field.name] && form.touched[field.name] && styles.errorBorder, inputContainerStyle]}>
            <View style={{flexDirection: 'row'}}>
              <TextInput
                value={field.value.replace(/<br\/>/g,"\n")}
                placeholder={placeholder || `请输入${label}`}
                placeholderTextColor="#999999"
                onChangeText={onChangeText}
                style={[{flex: 1, fontSize: 26}, centerInput && {textAlign: 'center'}]}
                selectionColor="#409EFF"
                {...rest}
              />
              {clearIcon && !!field.value.length && <TouchableOpacity activeOpacity={1} style={styles.clearIconArea} onPress={() => onChangeText('')}>
                <AntDesign name="closecircle" size={28} color="#999999" />
              </TouchableOpacity>}
              {inputRightComponent}
            </View>
            {lengthLimit ? <View style={styles.lengthLimitArea}>
              <Text style={styles.lengthLimitText}>{`${field.value.length}/${rest.maxLength}`}</Text>
            </View> : <></>}
          </View>
          <ErrorMessage
            name={field.name}
            style={styles.errorMessage}
            component={Text}
          />
        </View>
      </View>
    </View>
  )
};

const styles = StyleSheet.create({
  inputArea: {
    flex: 1, 
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
    paddingLeft: 18
  },
  clearIconArea: {
    width: 50, 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  lengthLimitArea: {
    width: '100%', 
    alignItems: 'flex-end', 
    paddingBottom: 5, 
    marginLeft: 5
  },
  lengthLimitText: {
    fontSize: 22, 
    color: '#999999'
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