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
      {rest.isRequired && <Text style={styles.required}>*</Text>}
      <Text style={[styles.label, rest.isRequired && {marginRight: 4}, labelStyle]}>{rest.title}: </Text>
    </View>
  );

  const OCRArea = (
    <TouchableOpacity title="request permissions" style={styles.OCRArea} onPress={onPress}>
      {/* <Button title="request permissions" onPress={onPress} style={styles.OCRText}>OCR </Button> */}
      <Text style={styles.OCRText}>OCR  </Text>
      <AntDesign
        name='scan1'
        size={32}
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
    height: 91,
    flexDirection: 'row', 
    alignItems: 'center',
    borderBottomWidth: 2,
    borderColor: 'rgba(0, 0, 0, .05)',
    paddingRight: 0,
    paddingLeft: 28
  },
  noBorder: {
    flex: 1,
    borderBottomWidth: 0
  },
  inputStyle: {
    fontSize: 32, 
    color: '#000',
    paddingHorizontal: 0
  },
  errorInput: {
    fontSize: 26,
    textAlign: 'center',
    color: 'red'
  },
  labelArea: {
    height: '100%',
    flexDirection: 'row',  
    alignItems: 'center', 
    justifyContent: 'center',
    marginRight: 10
  },
  label: {
    textAlign: 'center',
    fontSize: 32
  },
  required: {
    color: 'red', 
    textAlign: 'center', 
    textAlignVertical: 'top', 
    alignSelf: 'flex-start', 
    marginTop: 25,
    fontSize: 25
  },
  OCRArea: {
    height: '100%',
    flexDirection: 'row', 
    justifyContent: 'center',
    alignItems: 'center'
  },
  OCRText: {
    fontSize: 32,
    fontWeight: 'bold'
  }
})

export default FormItem;