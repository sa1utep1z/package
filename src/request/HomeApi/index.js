import httpRequest from '../httpRequest';

const HomeApi = {
  HomePage: async ({queryKey: [ key, params]}) => await httpRequest.post('admin/app/index/orderPage', params),
  CompanyList: async (params) => await httpRequest.post('admin/app/index/company/order', params),
  orderDetail: async (orderId) => await httpRequest.get(`admin/app/orderDetail/${orderId}`),
  SignUp: async (orderId, prams) => await httpRequest.post(`admin/app/orderDetail/${orderId}`, prams),
  ocrReq: async (prams) => await httpRequest.post('admin/app/ocr', prams)
}

export default HomeApi;