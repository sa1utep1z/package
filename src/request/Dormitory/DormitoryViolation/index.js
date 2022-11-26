import httpRequest from '../../httpRequest';

const DormitoryViolation = {
  //获取查房列表；
  getViolationList: async (params) => await httpRequest.post(`/admin/app/dorm/discipline/page`, params),
  //开罚单；
  addViolation: async(params) => await httpRequest.post('/admin/app/dorm/discipline', params),
};

export default DormitoryViolation;