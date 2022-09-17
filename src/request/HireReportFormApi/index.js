import httpRequest from '../httpRequest';

const HireReportFormApi = {
  // 招聘员列表
  RecruiterList: async () => await httpRequest.get('/common/user/forSelect'),
  // 企业列表
  CompaniesList: async() => await httpRequest.get(`common/companies/forSelect`),
  // 会员列表
  StoreList: async() => await httpRequest.get(`common/store/withMember/forSelect`),
  // 供应商列表
  SupplierList: async() => await httpRequest.get(`common/supplier/forSelect`),

  /**数据概览 */
  Overview: async(params) => await httpRequest.post(`admin/app/board/overview`, params),
  /**数据趋势与数据对比都是同一个接口 */
  LineData: async(params) => await httpRequest.post(`admin/app/board/detail`, params),
  /**企业数据 */
  Company: async(params) => await httpRequest.post(`admin/app/board/proportion/company`, params),
}

export default HireReportFormApi;