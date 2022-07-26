import httpRequest from '../httpRequest';

const HomeApi = {
  HomePage: (params) => httpRequest.post('admin/app/index/orderPage', params)
}

export default HomeApi;