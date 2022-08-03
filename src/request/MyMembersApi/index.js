import httpRequest from '../httpRequest';

const MyMembersApi = {
  // 我的会员首页列表
  MyMemberList: async ({queryKey: [ key, params]}) => await httpRequest.post('admin/app/memberPool/list', params),
  // 我的会员首页获取企业详情
  CompaniesList: async() => await httpRequest.get(`common/companies/forSelect`),
  // 我的会员首页获取门店列表
  StoreList: async() => await httpRequest.get(`common/store/withMember/forSelect`),
  // 会员详情
  MemberDetail: async (poolId) => await httpRequest.get(`admin/app/memberPool/${poolId}`),
  // 企业详情
  CompanyDetail: async (poolId) =>await httpRequest.get(`admin/app/memberPool/${poolId}/order`),
  // 入职记录（求职记录）
  EntryRecord: async(poolId) => await httpRequest.get(`admin/memberPool/${poolId}/jobRecord`), 
  // 回访记录
  ReviewRecord: async(poolId) => await httpRequest.get(`admin/memberPool/${poolId}/returnVisit`), 
  // 新增回访记录
  IncreaseReviewRecord: async(poolId, params) => {
    console.log('poll', poolId);
    console.log('params', params);
    return await httpRequest.post(`admin/memberPool/${poolId}/returnVisit`, params);
  }, 
  // 加入报名
  SignUp: async(poolId, params) => await httpRequest.post(`admin/memberPool/${poolId}/help/signUp`, params),
  // 获取订单信息
  getOrderMessage: async(params) => await httpRequest.post(`common/order/forSelect`, params), 
  // 编辑回访记录里的会员标签；
  MemberTagList: async() => await httpRequest.get('admin/member/tag'),
  // 编辑回访记录中的选择意向报名企业列表；
  CompanyList: async() => await httpRequest.get('common/companies/forSelect')
}

export default MyMembersApi;