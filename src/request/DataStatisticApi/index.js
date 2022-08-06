import httpRequest from '../httpRequest';

const DataStatisticApi = {
  // 获取供应商总数
  Supplier: async (prams) => await httpRequest.post(`admin/app/statistics/total/supplier`, prams),
  // 获取门店总数
  Store: async (prams) => await httpRequest.post(`admin/app/statistics/total/store`, prams),
  // 获取招聘员总数
  Recruiter: async (prams) => await httpRequest.post(`admin/app/statistics/total/recruiter`, prams),
  // 获取企业总数
  Company: async (prams) => await httpRequest.post(`admin/app/statistics/total/company`, prams),
  // 查询符合条件的人并按门店分组数据
  SearchStoreGroup: async (prams) => await httpRequest.post(`admin/app/statistics/search/group/store`, prams),
  // 查询符合条件的人并按企业分组数据
  SearchCompanyGroup: async (prams) => await httpRequest.post(`admin/app/statistics/search/group/company`, prams),
  // 获取供应商分组数据
  SupplierGroup: async (prams) => await httpRequest.post(`admin/app/statistics/group/supplier`, prams),
  // 获取门店分组数据
  StoreGroup: async (prams) => await httpRequest.post(`admin/app/statistics/group/store`, prams),
  // 获取招聘员分组数据
  RecruiterGroup: async (prams) => await httpRequest.post(`admin/app/statistics/group/recruiter`, prams),
  // 获取企业分组数据
  CompanyGroup: async (prams) => await httpRequest.post(`admin/app/statistics/group/company`, prams),
}

export default DataStatisticApi;