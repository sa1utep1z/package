import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Text, TextInput} from 'react-native';
import {ErrorMessage} from 'formik';

/**缩小版单行输入框*/
const LittleSingleInput = ({
  field, 
  form, 
  inputStyle,
  inputContainerStyle,
  inputRightComponent,
  inputLength = [],
  maxLength = 0,
  ...rest
}) => {
  const [inputMaxLength, setInputMaxLength] = useState(3);

  useEffect(()=>{
    if(inputLength.length){
      const inputValue = inputLength[0].value;
      switch(inputValue){
        case 'WAGE':
          setInputMaxLength(4);
          break;
        case 'BASIC_SALARY':
          setInputMaxLength(5);
          break;
        case 'DAY_SALARY':
          setInputMaxLength(5);
          break;
        case 'DAY_SETTLEMENT':
          setInputMaxLength(5);
          break;
        case 'REBATE':
          setInputMaxLength(5);
          break;
        case 'SPREAD':
          setInputMaxLength(4);
          break;
        case 'FILL':
          setInputMaxLength(4);
          break;
        case 'SUBSIDY':
          setInputMaxLength(4);
          break;
        case 'STABLE':
          setInputMaxLength(4);
          break;
        default:
          setInputMaxLength(4);
          break;
      }
    }
  },[inputLength])

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
          maxLength={!!maxLength ? maxLength : inputMaxLength}
          selectTextOnFocus
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