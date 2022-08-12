import httpRequest from '../httpRequest';

const MineApi = {
  //我的信息
  MineMessage: async () => await httpRequest.get('admin/app/recruiter/self'),
  //查询对外名片
  QueryOutsideCard: async() => await httpRequest.get('admin/app/recruiter/card'),
  //更新对外名片
  JoinOutsideCard: async(params) => await httpRequest.put('admin/app/recruiter/card', params)
}

export default MineApi;