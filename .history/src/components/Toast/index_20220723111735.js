import React, { useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import {Text, StyleSheet} from 'react-native';
import {Tooltip} from '@rneui/themed';

//提示栏，显示时间默认1秒
const Toast = (props, ref) => {
  const [tipVisible, setTipVisible] = useState(false);
  const [content, setContent] = useState('无内容');
  const [showTime, setShowTime] = useState(null);
  const [color, setColor] = useState('');

  const info = (content, time = 1, color = '#808080') => {
    console.log('点击了登录的提示框呢', tipVisible, showTime);
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
    <Tooltip
      pointerColor={color}
      containerStyle={{backgroundColor: color}}
      popover={<Text style={styles.textStyle}>{content}</Text>}
      visible={tipVisible}
    />
)};

const styles = StyleSheet.create({
  textStyle: {
    color: '#fff'
  }
});

export default forwardRef(Toast);
