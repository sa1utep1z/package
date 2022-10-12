import httpRequest from '../httpRequest';

const CompanyApi = {
  AddComplaint: async (params) => await httpRequest.post('admin/app/feedback', params), //新增投诉建议
  ComplaintList: async (params) => await httpRequest.post('admin/app/feedback/list', params), // 获取投诉列表
  ComplaintTotalList: async (params) => await httpRequest.post('admin/app/feedback/list/statistics', params), // 获取投诉数据统计
  EditComplaint: async (feedbackId, params) => await httpRequest.put(`admin/app/feedback/${feedbackId}/edit`, params), // 编辑投诉信息
  Transfer: async (feedbackId, params) => await httpRequest.put(`admin/app/feedback/${feedbackId}/transfer`, params), // 转单
  UrgeComplaint: async (feedbackId) => await httpRequest.put(`admin/app/feedback/${feedbackId}/urge`), // 催单
  BatchTransfer: async (params) => await httpRequest.post('admin/app/feedback/transfer/batch', params), // 批量转单
  GetCompanyInfo: async (feedbackId) => await httpRequest.get(`admin/app/feedback/${feedbackId}`), // 获取反馈详情
  GetUserList: async () => await httpRequest.get('/common/user/detail/forSelect'), // 获取用户数据
  UploadImages: async (prams) => await httpRequest.post('/admin/file/upload', prams,  // 上传照片
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }),
}

export default CompanyApi;