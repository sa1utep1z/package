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
        case 'WORK_FEE':
          setInputMaxLength(2);
          break;
        case 'LOW_FEE':
          setInputMaxLength(5);
          break;
        case 'DAY_FEE':
          setInputMaxLength(3);
          break;
        case 'DAY_END':
          setInputMaxLength(3);
          break;
        case 'RETURN_FEE':
          setInputMaxLength(5);
          break;
        case 'DISTANCE_FEE':
          setInputMaxLength(2);
          break;
        case 'SUPPLEMENT_FEE':
          setInputMaxLength(2);
          break;
        case 'SUBSIDIES_FEE':
          setInputMaxLength(2);
          break;
        case 'STABLE_WORK':
          setInputMaxLength(2);
          break;
        default:
          setInputMaxLength(3);
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