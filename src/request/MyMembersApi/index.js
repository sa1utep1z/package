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
  CompanyDetail: async (poolId) =>{
    return await httpRequest.get(`admin/app/memberPool/${poolId}/order`)
  },
  // 入职记录（求职记录）
  EntryRecord: async(poolId) => await httpRequest.get(`admin/memberPool/${poolId}/jobRecord`), 
  // 回访记录
  ReviewRecord: async(poolId) => await httpRequest.get(`admin/memberPool/${poolId}/returnVisit`), 
  // 编辑回访记录里的会员标签；
  MemberTagList: async() => await httpRequest.get('admin/member/tag'),
  // 编辑回访记录中的选择意向报名企业列表；
  CompanyList: async() => await httpRequest.get('common/companies/forSelect')
}

export default MyMembersApi;