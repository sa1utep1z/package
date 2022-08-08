import React, {useState} from 'react';
import {StyleSheet} from 'react-native';
import {Text, Input, Icon} from '@rneui/themed';
import {ErrorMessage} from 'formik';

const LoginInput = ({
  field, 
  form,
  password = false,
  ...props
}) => {
  const [seePassword, setSeePassword] = useState(true);

  const seePasswordOnPress = () => setSeePassword(!seePassword);

  return (
    <>
      <Input
        label={props.label}
        placeholder={props.placeholder || `请输入${props.label}`}
        value={field.value}
        onChangeText={form.handleChange(field.name)}
        containerStyle={styles.containerStyle}
        labelStyle={styles.labelStyle}
        inputContainerStyle={styles.inputContainerStyle}
        inputStyle={styles.inputStyle}
        secureTextEntry={password && seePassword}
        rightIcon={password && <Icon
          name={seePassword ? 'eye-with-line' : 'eye'}
          type='entypo'
          size={40}
          color="#409EFF"
          onPress={seePasswordOnPress}
        />}
        rightIconContainerStyle={{height: '100%', paddingTop: 24}}
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
    paddingLeft: 33,
    paddingRight: 33,
    height: 114
  },
  labelStyle: {
    width: 131, 
    fontSize: 36, 
    paddingBottom: 24,
    color: '#000',
    textAlignVertical: 'bottom',
    borderBottomColor: 'rgba(0, 0, 0, .05)',
    borderBottomWidth: 2
  },
  inputContainerStyle: {
    flex: 1, 
    padding: 0,
    alignItems: 'flex-end',
    borderBottomColor: 'rgba(0, 0, 0, .05)',
    borderBottomWidth: 2
  },
  inputStyle: {
    fontSize: 30,
    padding: 0,
    paddingBottom: 24,
    color: '#000'
  },
  errorInput: {
    marginLeft: 75,
    color: 'red'
  }
})

export default LoginInput;