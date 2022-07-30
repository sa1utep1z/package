import httpRequest from '../httpRequest';

const MyMembersApi = {
  MyMemberList: async ({queryKey: [ key, params]}) => {
    console.log('params',params)
    return await httpRequest.post('admin/memberPool/list', params)
  },
  MemberTagList: async() => {
    return await httpRequest.get('admin/member/tag')
  },
  CompanyList: async() => {
    return await httpRequest.get('common/companies/forSelect')
  }
}

export default MyMembersApi;