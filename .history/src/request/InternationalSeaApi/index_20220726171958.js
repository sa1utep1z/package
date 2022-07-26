import httpRequest from '../httpRequest';

const InternationalSeaApi = {
  InternationalSea: async () => await httpRequest.get('app/highSeas/receive/list')
}

export default InternationalSeaApi;