import React, {useEffect} from 'react';
import {View, Text, TextInput, StatusBar} from 'react-native';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastProvider } from "react-native-toast-notifications";
import SplashScreen from 'react-native-splash-screen';
import ScaleView from 'react-native-scale-view';
import moment from 'moment';
import "moment/locale/zh-cn";

import store from './redux/store';
import Navigator from './navigator';
import _updateConfig from '../update.json';
import PageDialog from './components/PageDialog';
import PageDialog2 from './components/PageDialog2';
import PageDialog3 from './components/PageDialog3';

moment.locale('zh-cn');

//这里是解决应用字体随设备设置字体大小而缩放的问题；
TextInput.defaultProps = Object.assign({}, TextInput.defaultProps, {defaultProps: false});
Text.defaultProps = Object.assign({}, Text.defaultProps, {allowFontScaling: false});

const App = () => {
  
  useEffect(() => {
    SplashScreen.hide();
  }, [])
  
  const queryClient = new QueryClient();

  return (
    <ScaleView designWidth={750}>
      <QueryClientProvider client={queryClient}>
        <ToastProvider 
          placement="top"
          duration={3000}
          animationDuration={250}
          offsetTop={100}
          animationType='zoom-in'
          normalColor="rgba(64,158,255, 0.95)"
          successColor="rgba(73,182,117, 0.95)"
          warningColor="rgba(227,212,28, 0.95)"
          dangerColor="rgba(204,0,0, 0.95)"
          renderToast={(toastOptions) => {
            const type = toastOptions.type;
            return (
              <View style={[{backgroundColor: toastOptions.normalColor, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10, marginBottom: 20},
                type === 'success' && {backgroundColor: toastOptions.successColor},
                type === 'warning' && {backgroundColor: toastOptions.warningColor},
                type === 'danger' && {backgroundColor: toastOptions.dangerColor}
              ]}>
                <Text style={{fontSize: 28, color: '#fff'}}>{toastOptions.message}</Text>
              </View>
            )
          }}>
          <Provider store={store}>
            <Navigator />
            <StatusBar />
            <PageDialog />
            <PageDialog2 />
            <PageDialog3 />
          </Provider>
        </ToastProvider>
      </QueryClientProvider>
    </ScaleView>
)};

export default App;