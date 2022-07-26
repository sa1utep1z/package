import httpRequest from '../httpRequest';

const HomeApi = {
  HomePage: async ({queryKey: [ key, params]}) => {
    console.log('key', key)
    console.log('parmas', params);
    await httpRequest.post('admin/app/index/orderPage', params)
  }
}

export default HomeApi;