import React, { useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import {Text, StyleSheet, View} from 'react-native';
import {Tooltip} from '@rneui/themed';

//提示栏，显示时间默认1秒
const Toast = ({
  ...rest
}, ref) => {
  const [tipVisible, setTipVisible] = useState(false);
  const [content, setContent] = useState('无内容');
  const [showTime, setShowTime] = useState(0.5);
  const [color, setColor] = useState('');

  const info = (content, time = 0.5, color = '#808080') => {
    setTipVisible(true);
    content && setContent(content);
    time && setShowTime(time);
    color && setColor(color);
  };

  useImperativeHandle(ref, () => {
    return { info };
  }, []);

  useEffect(()=>{
    const timer = setTimeout(()=>{
      setTipVisible(false);
    }, showTime * 1000)
    return () => clearTimeout(timer);
  }, [tipVisible])

  return (
    <View style={{borderWidth: 1, height: 20}}>
      <Tooltip
        pointerColor={color}
        containerStyle={{backgroundColor: color}}
        popover={<Text style={styles.textStyle}>{content}</Text>}
        visible={true}
        width={200}
          {...rest}
      />
    </View>
    
)};

const styles = StyleSheet.create({
  textStyle: {
    color: '#fff'
  }
});

export default forwardRef(Toast);
