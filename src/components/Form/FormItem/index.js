import React from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import {Text, Input} from '@rneui/themed';
import {ErrorMessage} from 'formik';
import AntDesign from 'react-native-vector-icons/AntDesign';

const FormItem = ({
  field, 
  form, 
  labelAreaStyle,
  labelStyle,
  inputStyle,
  inputContainerStyle,
  containerStyle,
  onPress,
  ...rest
}) => {

  const label = (
    <View style={[styles.labelArea, labelAreaStyle]}>
      <Text style={[styles.label, rest.isRequired && {marginRight: 4}, labelStyle]}>{rest.title}</Text>
      {rest.isRequired && <Text style={styles.required}>*</Text>}
    </View>
  );

  const OCRArea = (
    <TouchableOpacity style={styles.OCRArea} onPress={onPress}>
      <Text style={styles.OCRText}>OCR  </Text>
      <AntDesign
        name='scan1'
        size={20}
        color='#409EFF'
      />
    </TouchableOpacity>
  );

  return (
    <>
      <Input
        value={field.value}
        label={label}
        placeholder={rest.placeholder || `请输入${rest.title}`}
        placeholderTextColor="#CCCCCC"
        onChangeText={form.handleChange(field.name)}
        containerStyle={[styles.containerStyle, rest?.noBorder && styles.noBorder, containerStyle]}
        inputStyle={[styles.inputStyle, inputStyle]}
        inputContainerStyle={[styles.noBorder, inputContainerStyle]}
        rightIcon={rest.OCR && OCRArea}
        {...rest}
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
    maxHeight: 48,
    flexDirection: 'row', 
    alignItems: 'center',
    borderColor: '#E3E3E3',
    borderBottomWidth: 1,
    paddingRight: 0,
  },
  noBorder: {
    flex: 1,
    borderBottomWidth: 0
  },
  inputStyle: {
    fontSize: 15, 
    color: '#000',
    paddingHorizontal: 0
  },
  errorInput: {
    marginLeft: 110,
    color: 'red'
  },
  labelArea: {
    width: 80,
    height: '100%',
    flexDirection: 'row',  
    alignItems: 'center', 
    justifyContent: 'center', 
    marginRight: 10
  },
  label: {
    textAlign: 'center'
  },
  required: {
    color: 'red', 
    textAlign: 'center', 
    textAlignVertical: 'top', 
    alignSelf: 'flex-start', 
    marginTop: 7
  },
  OCRArea: {
    height: '100%',
    flexDirection: 'row', 
    justifyContent: 'center',
    alignItems: 'center'
  },
  OCRText: {
    fontSize: 15,
    fontWeight: 'bold'
  }
})

export default FormItem;