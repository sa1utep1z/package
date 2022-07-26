import axios from 'axios';
import Config from 'react-native-config';

import storage from '../utils/storage';
import * as RootNavigation from '../navigator/RootNavigation';

const CancelToken = axios.CancelToken;
const source = CancelToken.source();

const instance = axios.create({
  baseURL: Config.API_URL,
  timeout: 5000,
  headers: {}
});

const handleUnauthorized = () => {
  if(window.handleUnauthorized) return;
  console.log('httpRequest->response->handleUnauthorized');
  RootNavigation.resetLogin();
};

instance.interceptors.request.use(async(config) => {
  config.headers['X-Device'] = 'app';
  const token = await storage.load({ key: 'token' });
  config.cancelToken = source.token;
  if(token){
    config.headers['X-User-Token'] = token;
    return config;
  }
  return config;
}, (error) =>{
  console.log('httpRequest->request->error', error);
  Promise.reject(error);
});

instance.interceptors.response.use((response) => {
  if (response?.data?.code === 10) {
    source.cancel();
    handleUnauthorized();
  }
  return response.data;
}, (error) => {
  console.log('httpRequest->response->error', error);
  if (error.response && error.response.status === 401) {
    handleUnauthorized();
    return new Promise(()=>{});
  }
  return Promise.reject(error);
});

export default instance;
