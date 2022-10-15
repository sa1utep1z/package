import httpRequest from '../httpRequest';

const CreateOrderApi = {
  QueryOrderList: async (params) => await httpRequest.post('admin/app/order/page', params), //查询订单列表；
  GetType: async () => await httpRequest.get('admin/app/order/total'), //获取订单各状态数字；
  CopyOrder: async (params) => await httpRequest.post('admin/app/order/copy', params), //复制订单；
  ContinueOrder: async (orderId) => await httpRequest.put(`admin/app/order/continue/${orderId}`), //续单；
  StopOrder: async (orderId) => await httpRequest.put(`admin/app/order/${orderId}/offShelf`), //下架；
  onOrder: async (orderId) => await httpRequest.put(`admin/app/order/${orderId}/onShelf`), //上架；
  DeleteOrder: async (orderId) => await httpRequest.delete(`admin/app/order/delete/${orderId}`), //删除；

  CreateBasicOrder: async (params) => await httpRequest.post('admin/order/basic', params), //订单基本信息；
  getBasicOrder: async (orderId) => await httpRequest.get(`admin/app/order/${orderId}/basic`), //查询订单基本信息；

  RequirementOrder: async (params) => await httpRequest.post('admin/order/requirement', params), //录用要求；
  getRequirementOrder: async (orderId) => await httpRequest.get(`admin/app/order/${orderId}/requirement`), //查询录用要求信息；

  PolicyRequirement: async (params) => await httpRequest.post('admin/order/applyDetail', params), //接单政策说明；
  getPolicyOrder: async (orderId) => await httpRequest.get(`admin/app/order/${orderId}/applyDetail`), //查询接单政策说明信息；

  CommissionDescription: async (params, orderId) => await httpRequest.post(`admin/empReward/${orderId}`, params), //招聘员提成说明；
  getCommissionOrder: async (orderId) => await httpRequest.get(`admin/app/empReward/mode/${orderId}`), //查询招聘员提成模式（表单）；
  getCommissionListOrder: async (orderId) => await httpRequest.get(`admin/app/empReward/${orderId}`), //查询招聘员提成规则（列表）；

  WageDetail: async (params) => await httpRequest.post('admin/app/order/wageDetail', params), //会员工价详情顶部；
  getWageDetailOrder: async (orderId) => await httpRequest.get(`admin/app/order/${orderId}/wageDetail`), //查询会员工价详情信息顶部；
  WageSettlement: async (params, orderId) => await httpRequest.post(`admin/app/settlement/${orderId}`, params), //会员工价结算规则底部；
  getWageSettlement: async (orderId) => await httpRequest.get(`admin/app/settlement/${orderId}`), //查询会员工价结算规则底部；
};

export default CreateOrderApi;