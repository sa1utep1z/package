import httpRequest from '../../httpRequest';

const DormitoryCheckListApi = {
  //分页查询
  getCheckList: async (params) => await httpRequest.post(`/admin/app/room/check/page`, params),
};

export default DormitoryCheckListApi;