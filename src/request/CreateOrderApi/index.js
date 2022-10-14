import httpRequest from '../httpRequest';

const CreateOrderApi = {
  QueryOrderList: async (params) => await httpRequest.post('admin/app/order/page', params), //查询订单列表；
  GetType: async () => await httpRequest.get('admin/app/order/total'), //获取订单各状态数字；
  CopyOrder: async (params) => await httpRequest.post('admin/app/order/copy', params), //复制订单；
  ContinueOrder: async (orderId) => await httpRequest.put(`admin/app/order/continue/${orderId}`), //续单；
  StopOrder: async (orderId) => await httpRequest.put(`admin/app/order/${orderId}/offShelf`), //下架；
  DeleteOrder: async (orderId) => await httpRequest.delete(`admin/app/order/delete/${orderId}`), //删除；

  CreateBasicOrder: async (params) => await httpRequest.post('admin/order/basic', params), //订单基本信息；
  RequirementOrder: async (params) => await httpRequest.post('admin/order/requirement', params), //录用要求；
  PolicyRequirement: async (params) => await httpRequest.post('admin/order/applyDetail', params), //接单政策说明；
  CommissionDescription: async (params, orderId) => await httpRequest.post(`admin/empReward/${orderId}`, params), //招聘员提成说明；
  WageDetail: async (params) => await httpRequest.post('admin/order/wageDetail', params), //会员工价详情顶部；
  WageSettlement: async (params, orderId) => await httpRequest.post(`admin/settlement/${orderId}`, params), //会员工价规则；
};

export default CreateOrderApi;