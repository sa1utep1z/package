import React, {useState, useRef, useEffect} from 'react';
import {StyleSheet, View, TouchableOpacity, TextInput, Keyboard} from 'react-native';
import {Text, Input} from '@rneui/themed';
import { useToast } from 'react-native-toast-notifications';

import { NumberList } from '../../../utils/validate';

const VerifyCode = ({
  field, 
  form, 
  ...rest
}) => {
  const toast = useToast();

  const input1Ref = useRef(null);
  const input2Ref = useRef(null);
  const input3Ref = useRef(null);
  const input4Ref = useRef(null);
  const input5Ref = useRef(null);
  const input6Ref = useRef(null);

  const [value1, setValue1] = useState('');
  const [value2, setValue2] = useState('');
  const [value3, setValue3] = useState('');
  const [value4, setValue4] = useState('');
  const [value5, setValue5] = useState('');
  const [value6, setValue6] = useState('');

  const [focus, setFocus] = useState('focus1');

  //当请求失败时，自动清空表单；
  useEffect(()=>{
    if(!field.value.length){
      setValue1('');
      setValue2('');
      setValue3('');
      setValue4('');
      setValue5('');
      setValue6('');
    }
  },[field.value])
  
  //监听6个输入框的值，不填及填满都把键盘关掉；
  useEffect(() => {
    if(!value1 && !value2 && !value3 && !value4 && !value5 && !value6){
      setFocus('');
      Keyboard.dismiss();
    }
    if((value1 && value2 && value3 && value4 && value5 && value6) && focus === ''){
      Keyboard.dismiss();
      form.submitForm();
    }
    const code = `${value1}${value2}${value3}${value4}${value5}${value6}`;
    form.setFieldValue(field.name, code);
  }, [value1, value2, value3, value4, value5, value6])

  //只支持在软键盘上键入内容；开发环境中键盘输入无效，因为只有内容改变才会更新内容，不会实时监听到键入的内容实行跳转下一个输入框的操作。
  const onKeyPress = ({nativeEvent: {key: keyValue}}) => {
    //修改输入的值
    const nowInputIndex = Number(focus.charAt(focus.length - 1));
    switch(nowInputIndex){
      case 1:
        setValue1(keyValue);
        break;
      case 2:
        setValue2(keyValue);
        break;
      case 3:
        setValue3(keyValue);
        break;
      case 4:
        setValue4(keyValue);
        break;
      case 5:
        setValue5(keyValue);
        break;
      case 6:
        setValue6(keyValue);
        break;
    }

    //跳转到下一个输入框
    const nextFocusNumber = Number(focus.charAt(focus.length - 1)) + 1;
    const previousFocusNumber = Number(focus.charAt(focus.length - 1)) - 1;
    if(keyValue.length){
      if(nextFocusNumber < 7){
        setFocus(`focus${nextFocusNumber}`);
        switch(nextFocusNumber){
          case 2:
            input2Ref?.current?.focus();
            break;
          case 3:
            input3Ref?.current?.focus();
            break;
          case 4:
            input4Ref?.current?.focus();
            break;
          case 5:
            input5Ref?.current?.focus();
            break;
          case 6:
            input6Ref?.current?.focus();
            break;
        }
      }else if(nextFocusNumber === 7){
        setFocus('');
      }
    }else{
      if(previousFocusNumber > 0){
        setFocus(`focus${previousFocusNumber}`);
        switch(previousFocusNumber){
          case 1:
            input1Ref?.current?.focus();
            break;
          case 2:
            input2Ref?.current?.focus();
            break;
          case 3:
            input3Ref?.current?.focus();
            break;
          case 4:
            input4Ref?.current?.focus();
            break;
          case 5:
            input5Ref?.current?.focus();
            break;
        }
      }
    }
  };

  return (
    <View style={styles.totalArea}>
      <View style={styles.inputArea}>
        <TextInput
          ref={input1Ref}
          style={[
            styles.input, 
            focus === 'focus1' && {borderColor: '#409EFF'},
            {color: !NumberList.includes(Number(value1)) ? 'red' : '#333333'}
          ]}
          caretHidden
          selectTextOnFocus
          keyboardType="numeric"
          selectionColor="rgba(0,0,0,0)"
          selection={{start: 0, end: 1}}
          maxLength={1}
          value={value1}
          onKeyPress={onKeyPress}
          onFocus={()=>setFocus('focus1')}
        />
      </View>
      <View style={styles.inputArea}>
        <TextInput
          ref={input2Ref}
          style={[
            styles.input, 
            focus === 'focus2' && {borderColor: '#409EFF'},
            {color: !NumberList.includes(Number(value2)) ? 'red' : '#333333'}
          ]}
          caretHidden
          selectTextOnFocus
          keyboardType="numeric"
          selectionColor="rgba(0,0,0,0)"
          selection={{start: 0, end: 1}}
          maxLength={1}
          value={value2}
          onKeyPress={onKeyPress}
          onFocus={()=>setFocus('focus2')}
        />
      </View>
      <View style={styles.inputArea}>
        <TextInput
          ref={input3Ref}
          style={[
            styles.input, 
            focus === 'focus3' && {borderColor: '#409EFF'},
            {color: !NumberList.includes(Number(value3)) ? 'red' : '#333333'}
          ]}
          caretHidden
          selectTextOnFocus
          keyboardType="numeric"
          selectionColor="rgba(0,0,0,0)"
          selection={{start: 0, end: 1}}
          maxLength={1}
          value={value3}
          onKeyPress={onKeyPress}
          onFocus={()=>setFocus('focus3')}
        />
      </View>
      <View style={styles.inputArea}>
        <TextInput
          ref={input4Ref}
          style={[
            styles.input, 
            focus === 'focus4' && {borderColor: '#409EFF'},
            {color: !NumberList.includes(Number(value4)) ? 'red' : '#333333'}
          ]}
          caretHidden
          selectTextOnFocus
          keyboardType="numeric"
          selectionColor="rgba(0,0,0,0)"
          selection={{start: 0, end: 1}}
          maxLength={1}
          value={value4}
          onKeyPress={onKeyPress}
          onFocus={()=>setFocus('focus4')}
        />
      </View>
      <View style={styles.inputArea}>
        <TextInput
          ref={input5Ref}
          style={[
            styles.input, 
            focus === 'focus5' && {borderColor: '#409EFF'},
            {color: !NumberList.includes(Number(value5)) ? 'red' : '#333333'}
          ]}
          caretHidden
          selectTextOnFocus
          keyboardType="numeric"
          selectionColor="rgba(0,0,0,0)"
          selection={{start: 0, end: 1}}
          maxLength={1}
          value={value5}
          onKeyPress={onKeyPress}
          onFocus={()=>setFocus('focus5')}
        />
      </View>
      <View style={styles.inputArea}>
        <TextInput
          ref={input6Ref}
          style={[
            styles.input, 
            focus === 'focus6' && {borderColor: '#409EFF'},
            {color: !NumberList.includes(Number(value6)) ? 'red' : '#333333'}
          ]}
          caretHidden
          selectTextOnFocus
          keyboardType="numeric"
          selectionColor="rgba(0,0,0,0)"
          selection={{start: 0, end: 1}}
          maxLength={1}
          value={value6}
          onKeyPress={onKeyPress}
          onFocus={()=>setFocus('focus6')}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  totalArea: {
    height: 200,
    flexDirection: 'row',
    alignItems: 'center'
  },
  inputArea: {
    width: '16.67%', 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  input: {
    width: 80, 
    height: 80, 
    borderWidth: 4, 
    borderColor: '#000', 
    borderRadius: 15, 
    textAlign: 'center', 
    fontSize: 48,
    color: '#333333'
  }
})

export default VerifyCode;