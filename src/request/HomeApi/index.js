import httpRequest from '../httpRequest';

const HomeApi = {
  HomePage: async (params) => await httpRequest.post('admin/app/index/orderPage', params),
  CompanyList: async (params) => await httpRequest.post('admin/app/index/company/order', params),
  orderDetail: async (orderId) => await httpRequest.get(`admin/app/orderDetail/${orderId}`),
  SignUp: async (orderId, prams) => await httpRequest.post(`admin/app/orderDetail/${orderId}`, prams),
  GetBannerList: async () => await httpRequest.get(`admin/app/banner/list`),
  getRoleInfo: async () => await httpRequest.get(`admin/user/info`),
  ocrReq: async (prams) => await httpRequest.post('admin/app/ocr', prams, 
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }),
  SeasEnable: async () => await httpRequest.get(`admin/app/highSeas/enable`),
}

export default HomeApi;