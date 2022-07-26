/* eslint-disable no-param-reassign */
import axios from 'axios';
import Cookies from 'js-cookie';
import { storageKeys } from '@/constants';

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_ENDPOINT,
  timeout: 10000,
  headers: {},
});

const handleUnauthorized = () => {
  Cookies.remove(storageKeys.token);
  window.location.href = `${window.location.origin}${process.env.REACT_APP_ROUTER_BASENAME ? `/${process.env.REACT_APP_ROUTER_BASENAME}` : ''}/login`;
};

// Add a request interceptor
instance.interceptors.request.use((config) => {
  config.headers['X-Device'] = 'pc';
  const token = Cookies.get(storageKeys.token);
  if (token) {
    config.headers['X-User-Token'] = token;
  }
  return config;
}, (error) => Promise.reject(error));

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
  if (error.response && error.response.status === 401) {
    handleUnauthorized();
  }
  return Promise.reject(error);
});

export default instance;
