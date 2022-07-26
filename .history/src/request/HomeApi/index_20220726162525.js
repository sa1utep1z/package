import httpRequest from '../httpRequest';

const HomeApi = {
  HomePage: async ({queryKey: [ key, params]}) => await httpRequest.post('admin/app/index/orderPage', params),
  CompanyList: async (params) => await httpRequest.post('admin/app/index/company/order', params),
}

export default HomeApi;