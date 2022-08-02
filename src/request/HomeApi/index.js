import httpRequest from '../httpRequest';

const HomeApi = {
  HomePage: async ({queryKey: [ key, params]}) => {
    console.log('params',params)
    return await httpRequest.post('admin/app/index/orderPage', params)
  },
  CompanyList: async (params) => await httpRequest.post('admin/app/index/company/order', params),
  orderDetail: async (orderId) => await httpRequest.get(`admin/app/orderDetail/${orderId}`),
}

export default HomeApi;