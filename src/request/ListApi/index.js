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
  CompleteInfo: async(flowId, params) => await httpRequest.put(`admin/app/recruitFlow/completeInfo/${flowId}`, params),

  // 待入职名单
  // 获取待入职名单数据
  GetWaitList: async(params) => await httpRequest.post('admin/app/recruitFlow/onBoardingPage', params),
  // 待入职各状态人数
  GetWaitStatus: async(params) => await httpRequest.post('admin/app/recruitFlow/onBoardin/list/num', params),
  // 批量操作
  batchAll: async(params) => await httpRequest.put('admin/app/recruitFlow/onBoardin/batch', params),
  // 已入职
  GetPassList: async(flowId, params) => await httpRequest.put(`admin/app/recruitFlow/onBoardin/pass/${flowId}`, params),
  // 未报到
  GetNoArrive: async(flowId, params) => await httpRequest.put(`admin/app/recruitFlow/onBoardin/fail/${flowId}`, params),
  /**面试名单 */
  //首页
  InterViewList: async ({queryKey: [ key, params]}) => await httpRequest.post('admin/app/recruitFlow/interviewPage', params),
  InterViewList2: async (params) =>{
    console.log('params', params);
    return  await httpRequest.post('admin/app/recruitFlow/interviewPage', params)
  },
  //获取面试各状态人数
  GetInterviewTypeList: async(params) => await httpRequest.post('admin/app/recruitFlow/interview/list/num', params),
  //面试通过
  PassInInterview: async(flowId) => await httpRequest.put(`admin/app/recruitFlow/interview/pass/${flowId}`),
  //未去面试
  NoArriveInInterview: async(flowId, params) => await httpRequest.put(`admin/app/recruitFlow/interview/noArrive/${flowId}`, params),
  //面试不通过
  FailInInterview: async(flowId, params) => await httpRequest.put(`admin/app/recruitFlow/interview/fail/${flowId}`, params),
  //批量操作
  BatchOperateInInterview: async(params) => await httpRequest.put(`admin/app/recruitFlow/interview/batch`, params),
}

export default ListApi;