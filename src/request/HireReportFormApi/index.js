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

  /**企业趋势 */
  CompanyTrend: async(params) => await httpRequest.post(`admin/app/board/trend/company`, params),
  /**门店趋势 */
  StoreTrend: async(params) => await httpRequest.post(`admin/app/board/trend/store`, params),
  /**招聘员趋势 */
  RecruiterTrend: async(params) => await httpRequest.post(`admin/app/board/trend/recruiter`, params),
  /**供应商趋势 */
  SupplierTrend: async(params) => await httpRequest.post(`admin/app/board/trend/supplier`, params),
  /**渠道趋势 */
  SignUpTypeTrend: async(params) => await httpRequest.post(`admin/app/board/trend/signUpType`, params),

  /**企业数据（百分比） */
  Company: async(params) => await httpRequest.post(`admin/app/board/proportion/company`, params),
  Store: async(params) => await httpRequest.post(`admin/app/board/proportion/store`, params),
  Recruiter: async(params) => await httpRequest.post(`admin/app/board/proportion/recruiter`, params),
  Supplier: async(params) => await httpRequest.post(`admin/app/board/proportion/supplier`, params),
  SignUpType: async(params) => await httpRequest.post(`admin/app/board/proportion/signUpType`, params)
}

export default HireReportFormApi;