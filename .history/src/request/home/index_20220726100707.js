const HomeApi = {
  HomePage: (params) => {
    return httpRequest.post('admin/app/index/orderPage', params);
  }
}

export default HomeApi;