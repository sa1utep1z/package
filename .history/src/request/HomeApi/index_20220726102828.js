import httpRequest from '../httpRequest';

const HomeApi = {
  HomePage: async (params) => await httpRequest.post('admin/app/index/orderPage', params)
}

export default HomeApi;