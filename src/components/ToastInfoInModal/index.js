/**
 * 之所以起这个组件，是因为用的react-native-toast-notifications组件在全局作用内生效没有问题，但是在具备弹窗modal层的时候，toast会显示在modal之下。所以这个组件是专门用在【Modal】层面上的提示框。
 */
import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Toast from "react-native-toast-notifications";
 
const ToastInfoInModal = (props, ref) => {
  const toastRef = useRef();

  useImperativeHandle(ref, () => {
    return { toast };
  }, []);

  const toast = (content, type) => {
    const options = {type};
    toastRef.current.show(content, options);
  };

  return (
    <Toast
      ref={toastRef}
      placement="top"
      duration={1000}
      animationDuration={250}
      animationType='zoom-in'
      normalColor="rgba(64,158,255, 0.95)"
      successColor="rgba(73,182,117, 0.95)"
      warningColor="rgba(227,212,28, 0.95)"
      dangerColor="rgba(204,0,0, 0.95)"
      icon={<AntDesign name='message1' size={20} color='#fff'/>}
      successIcon={<AntDesign name='checkcircleo' size={20} color='#fff'/>}
      warningIcon={<AntDesign name='warning' size={20} color='#fff'/>}
      dangerIcon={<AntDesign name='exclamationcircleo' size={20} color='#fff'/>}
    />
  )
};
 
export default forwardRef(ToastInfoInModal);
 