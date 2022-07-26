import httpRequest from '../httpRequest';

const HomeApi = {
  HomePage: async ({queryKey: [ key, params]}) => {
    console.log('???')
    return await httpRequest.post('admin/app/index/orderPage', params)
  }
}

export default HomeApi;