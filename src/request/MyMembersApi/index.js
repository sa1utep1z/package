import httpRequest from '../httpRequest';

const MyMembersApi = {
  // 我的会员首页列表
  MyMemberList: async ({queryKey: [ key, params]}) => {
    console.log('params',params)
    return await httpRequest.post('admin/app/memberPool/list', params)
  },
  // 会员详情
  MemberDetail: async (poolId) => await httpRequest.get(`admin/app/memberPool/${poolId}`),
  // 企业详情
  CompanyDetail: async (poolId) => await httpRequest.get(`admin/app/memberPool/62c56a9a4844402adafebd32/order`),
  // 编辑回访记录里的会员标签；
  MemberTagList: async() => await httpRequest.get('admin/member/tag'),
  // 编辑回访记录中的选择意向报名企业列表；
  CompanyList: async() => await httpRequest.get('common/companies/forSelect')
}

export default MyMembersApi;