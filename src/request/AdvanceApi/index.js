import httpRequest from '../httpRequest';

const AdvanceApi = {
  AddApprove: async (detailId, params) => await httpRequest.post(`admin/approve/process/${detailId}`, params), //审批接口
  AdvanceList: async (params) => await httpRequest.post('admin/app/advance/list', params), // 获取预支薪资列表
  AdvanceTotalList: async (params) => await httpRequest.post('admin/app/advance/list/statistics', params), // 获取预支薪资数据统计
  EditAdvance: async (params) => await httpRequest.post('admin/advance/list', params), // 预支申请
  AdvanceFlow: async (applyId) => await httpRequest.get(`/advance/${applyId}/flow`), // 获取预支审核进度
  GetUserList: async () => await httpRequest.get('/common/user/detail/forSelect'), // 获取用户数据
  MemberMessage: async (poolId) => await httpRequest.get(`admin/app/listApi/memberInfo/${poolId}`), // 获取会员信息
  OrderInfo: async(flowId) => await httpRequest.get(`admin/app/listApi/orderInfo/${flowId}`), // 订单详情
  UploadImages: async (prams) => await httpRequest.post('/admin/file/upload', prams,  // 上传照片
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }),
}

export default AdvanceApi;