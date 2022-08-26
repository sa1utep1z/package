import React, {useState, useRef} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Text, Input, Icon} from '@rneui/themed';
import {ErrorMessage} from 'formik';
import AntDesign from 'react-native-vector-icons/AntDesign';

const LoginInput = ({
  field, 
  form,
  password = false,
  ...props
}) => {
  const inputRef = useRef(null);

  const [seePassword, setSeePassword] = useState(true);
  const [showClear, setShowClear] = useState(false);

  const clearInput = () => {
    form.setFieldValue(field.name, '');
    setShowClear(false);
  };

  const onChangeText = (e) => {
    form.setFieldValue(field.name, e);
    if(e.length){
      setShowClear(true);
    }else{
      setShowClear(false);
    }
  };

  const rightIcon = () => {
    if(password){
      return (
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          {showClear && 
          <TouchableOpacity onPress={clearInput} style={{height: '100%', justifyContent: 'center', paddingRight: 30}}>
            <AntDesign
              name='closecircle'
              size={30}
              color='#999999'
            />
          </TouchableOpacity>}
          <TouchableOpacity onPress={seePasswordOnPress}>
            <Icon
              name={seePassword ? 'eye-with-line' : 'eye'}
              type='entypo'
              size={40}
              color="#409EFF"
            />
          </TouchableOpacity>
        </View>
      )
    }else{
      return (
        <TouchableOpacity onPress={clearInput} style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: '100%', paddingTop: 5}}>
          {showClear && <AntDesign
            name='closecircle'
            size={30}
            color='#999999'
          />}
        </TouchableOpacity>
      )
    }
  };

  const seePasswordOnPress = () => setSeePassword(!seePassword);
  const onFocus = () => field.value.length && setShowClear(true);
  const onBlur = () => setShowClear(false);

  return (
    <>
      <Input
        ref={inputRef}
        label={props.label}
        placeholder={props.placeholder || `请输入${props.label}`}
        value={field.value}
        allowFontScaling={false}
        onChangeText={onChangeText}
        containerStyle={styles.containerStyle}
        labelStyle={styles.labelStyle}
        inputContainerStyle={styles.inputContainerStyle}
        inputStyle={styles.inputStyle}
        secureTextEntry={password && seePassword}
        rightIcon={rightIcon()}
        rightIconContainerStyle={{height: '100%', paddingTop: 24}}
        onFocus={onFocus}
        onBlur={onBlur}
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
    paddingLeft: 0,
    paddingRight: 0,
    height: 114,
    borderBottomColor: 'rgba(0, 0, 0, .05)',
    borderBottomWidth: 2
  },
  labelStyle: {
    width: 131, 
    fontSize: 36, 
    paddingBottom: 24,
    color: '#000',
    textAlignVertical: 'bottom'
  },
  inputContainerStyle: {
    flex: 1, 
    padding: 0,
    alignItems: 'flex-end',
    borderBottomWidth: 0
  },
  inputStyle: {
    fontSize: 30,
    padding: 0,
    paddingBottom: 24,
    color: '#000'
  },
  errorInput: {
    fontSize: 26,
    marginLeft: 131,
    color: 'red'
  }
})

export default LoginInput;