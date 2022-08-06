import React from 'react';
import {Platform, View, Text, TextInput} from 'react-native';
import { ToastProvider } from "react-native-toast-notifications";
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { simpleUpdate } from 'react-native-update';
import ScaleView from 'react-native-scale-view';

import store from './redux/store';
import Navigator from './navigator';
import moment from 'moment';
import "moment/locale/zh-cn";
import _updateConfig from '../update.json';

moment.locale('zh-cn');

const { appKey } = _updateConfig[Platform.OS];

TextInput.defaultProps = Object.assign({}, TextInput.defaultProps, {defaultProps: false});
Text.defaultProps = Object.assign({}, Text.defaultProps, {allowFontScaling: false});

const App = () => {
  const queryClient = new QueryClient();

  return (
    <ScaleView designWidth={750}>
      <QueryClientProvider client={queryClient}>
        <ToastProvider 
          placement="top"
          duration={1000}
          animationDuration={250}
          offsetTop={100}
          animationType='zoom-in'
          normalColor="rgba(64,158,255, 0.95)"
          successColor="rgba(73,182,117, 0.95)"
          warningColor="rgba(227,212,28, 0.95)"
          dangerColor="rgba(204,0,0, 0.95)"
          // icon={<AntDesign name='message1' size={20} color='#fff'/>}
          successIcon={<AntDesign name='checkcircleo' size={20} color='#fff'/>}
          warningIcon={<AntDesign name='warning' size={20} color='#fff'/>}
          dangerIcon={<AntDesign name='exclamationcircleo' size={20} color='#fff'/>}
          renderToast={(toastOptions) => {
            const type = toastOptions.type;
            return (
              <View style={[{backgroundColor: toastOptions.normalColor, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10, marginBottom: 20},
                type === 'success' && {backgroundColor: toastOptions.successColor},
                type === 'warning' && {backgroundColor: toastOptions.warningColor},
                type === 'danger' && {backgroundColor: toastOptions.dangerColor}
              ]}>
                <Text style={{fontSize: 24, color: '#fff'}}>{toastOptions.message}</Text>
              </View>
            )
          }}
        >
          <Provider store={store}>
            <Navigator/>
          </Provider>
        </ToastProvider>
      </QueryClientProvider>
    </ScaleView>
)};

export default simpleUpdate(App, { appKey });