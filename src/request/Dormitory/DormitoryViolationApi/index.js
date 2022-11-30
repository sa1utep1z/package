import httpRequest from '../../httpRequest';

const DormitoryViolationApi = {
  //获取查房列表；
  getViolationList: async (params) => await httpRequest.post(`/admin/app/dorm/discipline/page`, params),
  //获取查房列表统计；
  getViolationType: async (params) => await httpRequest.post(`/admin/app/dorm/discipline/page/statistics`, params),
  //开罚单；
  addViolation: async(params) => await httpRequest.post('/admin/app/dorm/discipline', params),  
  //查询会员住宿信息；
  queryMemberDormitoryInfo: async(idNo) => await httpRequest.get(`/admin/app/dorm/discipline/info/${idNo}`),
  //查询会员住宿违纪信息;
  queryMemberViolationInfo: async(violationId) => await httpRequest.get(`/admin/app/dorm/discipline/${violationId}`),
};

export default DormitoryViolationApi;