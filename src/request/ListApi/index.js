/**名单api */
import httpRequest from '../httpRequest';

const ListApi = {
  /**名单通用API */
  //查询转厂转单列表
  FactoryList: async(params) => await httpRequest.post(`admin/app/listApi/transfer/able`, params),
  //转厂转单
  TransferFactory: async(flowId, toOrderNo) => await httpRequest.post(`admin/app/listApi/transfer/${flowId}/${toOrderNo}`),
  //企业详情
  FactoryMessage: async(flowId) => await httpRequest.get(`admin/app/listApi/orderInfo/${flowId}`),
  //会员详情
  MemberMessage: async(flowId) => await httpRequest.get(`admin/app/listApi/memberInfo/${flowId}`),

  /**报名名单 */
  //首页
  SignUpList: async ({queryKey: [ key, params]}) => await httpRequest.post('admin/app/recruitFlow/signUpPage', params),
  //获取报名各状态人数
  GetTypeList: async(params) => {
    console.log('params', params);
    return await httpRequest.post('admin/app/recruitFlow/signUp/list/num', params);
  },
  //查询转厂
}

export default ListApi;