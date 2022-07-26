/* eslint-disable no-param-reassign */
import axios from 'axios';
import Config from 'react-native-config';
// import Cookies from 'js-cookie';
// import { storageKeys } from '@/constants';
import storage from '../utils/storage';

const instance = axios.create({
  baseURL: Config.API_URL,
  timeout: 10000,
  headers: {},
});
console.log('instance------------',instance);

const handleUnauthorized = () => {
  console.log('进入未授权的步骤了');
  // Cookies.remove(storageKeys.token);
  // window.location.href = `${window.location.origin}${process.env.REACT_APP_ROUTER_BASENAME ? `/${process.env.REACT_APP_ROUTER_BASENAME}` : ''}/login`;
};

// Add a request interceptor
instance.interceptors.request.use((config) => {
  config.headers['X-Device'] = 'app';
  storage.load({
    key: 'token'
  }).then(res => {
    console.log('storage->res->token', res);
  })
  // const token = Cookies.get(storageKeys.token);
  // if (token) {
  //   config.headers['X-User-Token'] = token;
  // }
  return config;
}, (error) =>{
  console.log('httpRequest->request->error', error);
  Promise.reject(error);
});

// Add a response interceptor
instance.interceptors.response.use((response) => {
  if (response?.data.code === 1) {
    message.error(response.data.msg, 2);
  }
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
