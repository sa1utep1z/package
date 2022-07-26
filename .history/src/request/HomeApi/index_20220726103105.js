import httpRequest from '../httpRequest';

const HomeApi = {
  HomePage: async (key, params) =>{
    console.log('key', key);
    console.log('params', params);
    return await httpRequest.post('admin/app/index/orderPage', params);
  }
}

export default HomeApi;