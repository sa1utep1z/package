import React from 'react';
import { ToastProvider } from "react-native-toast-notifications";
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Provider } from 'react-redux';

import store from './redux/store';
import Navigator from './navigator';
import moment from 'moment';
import "moment/locale/zh-cn";

moment.updateLocale("zh-cn");

export default App = () => {

  return (
  <ToastProvider 
    placement="top"
    duration={1000}
    animationDuration={250}
    offsetTop={30}
    animationType='zoom-in'
    normalColor="rgba(64,158,255, 0.95)"
    successColor="rgba(73,182,117, 0.95)"
    warningColor="rgba(227,212,28, 0.95)"
    dangerColor="rgba(204,0,0, 0.95)"
    // icon={<AntDesign name='message1' size={20} color='#fff'/>}
    successIcon={<AntDesign name='checkcircleo' size={20} color='#fff'/>}
    warningIcon={<AntDesign name='warning' size={20} color='#fff'/>}
    dangerIcon={<AntDesign name='exclamationcircleo' size={20} color='#fff'/>}
  >
    <Provider store={store}>
      <Navigator/>
    </Provider>
  </ToastProvider>
)};
