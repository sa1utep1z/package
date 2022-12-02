import httpRequest from '../../httpRequest';

const DormitoryCheckListApi = {
  //分页查询；
  getCheckList: async (params) => await httpRequest.post(`/admin/app/dorm/check/page`, params),
  //分页查询统计；
  getCheckListStatics: async (params) => await httpRequest.post(`/admin/app/dorm/check/page/statistics`, params),
  //添加点检记录；
  addPropertyRecord: async(params) => await httpRequest.post('/admin/app/dorm/check/add', params),
  //查看点检详情；
  queryCheckedDetail: async(id) => await httpRequest.get(`/admin/app/dorm/check/detail/${id}`),
  //点检记录；
  queryCheckedRecord: async(id) => await httpRequest.get(`/admin/app/dorm/check/log/${id}`),
  //查看资产；
  queryPropertyOfRecord: async(roomId) => await httpRequest.get(`/admin/app/dorm/check/${roomId}/asset/list`),
  //添加资产；
  addPropertyOfRecord: async(params) => await httpRequest.post('/admin/app/dorm/check/asset/add', params),
};

export default DormitoryCheckListApi;