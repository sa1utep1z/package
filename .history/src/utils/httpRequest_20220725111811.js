import axios from 'axios';
import Config from 'react-native-config';

import storage from '../utils/storage';
import * as RootNavigation from '../navigator/RootNavigation';

const instance = axios.create({
  baseURL: Config.API_URL,
  timeout: 10000,
  headers: {},
});

const handleUnauthorized = () => {
  console.log('httpRequest->response->handleUnauthorized');
  RootNavigation.resetLogin();
};

instance.interceptors.request.use(async(config) => {
  console.log('config', config)
  config.headers['X-Device'] = 'app';
  // const token = await storage.load({ key: 'token' });
  // if(token){
  //   config.headers['X-User-Token'] = token;
  //   return config;
  // }
}, (error) =>{
  console.log('httpRequest->request->error', error);
  Promise.reject(error);
});

instance.interceptors.response.use((response) => {
  console.log('response',response)
  if (response?.data?.code === 10) {
    handleUnauthorized();
  }
  return response.data;
}, (error) => {
  console.log('httpRequest->response->error', error);
  if (error?.response?.status === 401) {
    handleUnauthorized();
  }
  return Promise.reject(error);
});

export default instance;
