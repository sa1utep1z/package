import httpRequest from '../../utils/httpRequest';

const HomeApi = {
  HomePage: (params) => httpRequest.post('admin/app/index/orderPage', params)
}

export default HomeApi;