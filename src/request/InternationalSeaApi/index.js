import httpRequest from '../httpRequest';

const InternationalSeaApi = {
  InternationalSea: async () => await httpRequest.get('admin/app/highSeas/receive/list'),
  Receive: async (id) => await httpRequest.put(`admin/app/highSeas/${id}/receive`),
}

export default InternationalSeaApi;