import httpRequest from '../httpRequest';

const HireReportFormApi = {
  // 招聘员列表
  RecruiterList: async () => await httpRequest.get('/common/user/forSelect'),
  // 企业列表
  CompaniesList: async() => await httpRequest.get(`common/companies/forSelect`),
  // 会员列表
  StoreList: async() => await httpRequest.get(`common/store/withMember/forSelect`),
  // 供应商列表
  SupplierList: async() => await httpRequest.get(`common/supplier/forSelect`)
}

export default HireReportFormApi;