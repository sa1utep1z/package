import httpRequest from '../httpRequest';

const CompanyApi = {
  AddCompany: async (params) => await httpRequest.post('admin/app/company', params), //新增企业
  CompanyList: async (params) => await httpRequest.post('admin/app/company/list', params), // 获取企业列表
  CompanyTotalList: async (params) => await httpRequest.post('admin/app/company/list/statistics', params), // 获取企业列表统计
  EditCompany: async (companyId) => await httpRequest.put(`admin/app/company/${companyId}`), // 编辑企业信息
  UserList: async () => await httpRequest.get('/common/user/detail/forSelect'), // 用户信息
  getDefaultImage: async () => await httpRequest.get(`admin/company/images`), // 默认企业图片
  // ocrReq: async (prams) => await httpRequest.post('admin/app/ocr', prams, 
  //   {
  //     headers: {
  //       'Content-Type': 'multipart/form-data'
  //     }
  //   }),
}

export default CompanyApi;