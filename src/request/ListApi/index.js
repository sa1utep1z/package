/**名单api */
import httpRequest from '../httpRequest';

const ListApi = {
  /**名单通用API */
  //查询转厂转单列表
  FactoryList: async(params) => await httpRequest.post(`admin/app/listApi/transfer/able`, params),
  //转厂转单
  TransferFactory: async(flowId, toOrderId) => await httpRequest.put(`admin/app/listApi/transfer/${flowId}/${toOrderId}`),
  //企业详情
  FactoryMessage: async(flowId) => await httpRequest.get(`admin/app/listApi/orderInfo/${flowId}`),
  //会员详情
  MemberMessage: async(flowId) => await httpRequest.get(`admin/app/listApi/memberInfo/${flowId}`),

  /**报名名单 */
  //首页
  SignUpList: async ({queryKey: [ key, params]}) => await httpRequest.post('admin/app/recruitFlow/signUpPage', params),
  //获取报名各状态人数
  GetTypeList: async(params) => await httpRequest.post('admin/app/recruitFlow/signUp/list/num', params),
  //报名-无意愿
  NoIntention: async(flowId, params) => await httpRequest.put(`admin/app/recruitFlow/signUp/noIntention/${flowId}`, params),
  //报名-已报名
  HasIntention: async(flowId) => await httpRequest.put(`admin/app/recruitFlow/signUp/intention/${flowId}`),
  //完善报名三要素
  CompleteInfo: async(flowId, params) => await httpRequest.put(`admin/app/recruitFlow/completeInfo/${flowId}`, params)
}

export default ListApi;