import httpRequest from '../httpRequest';

const InternationalSeaApi = {
  InternationalSea: async () => await httpRequest.get('app/highSeas/receive/list'),
  Receive: async (id) => await httpRequest.put(`app/highSeas/${id}/receive`),
}

export default InternationalSeaApi;