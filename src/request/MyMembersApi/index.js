import httpRequest from '../httpRequest';

const MyMembersApi = {
  MyMemberList: async ({queryKey: [ key, params]}) => {
    console.log('params',params)
    return await httpRequest.post('admin/memberPool/list', params)
  },
}

export default MyMembersApi;