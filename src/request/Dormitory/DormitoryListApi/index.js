import httpRequest from '../../httpRequest';

const DormitoryListApi = {
  //获取报名信息；
  getSignUpInfo: async (IdCard) => await httpRequest.get(`/admin/app/dormLive/${IdCard}/recruitFlow/info`),
  //常规宿舍列表（须企业id）；
  getNormalDormitoryList: async(IdCard, companyId) => await httpRequest.get(`/common/dorm/${IdCard}/${companyId}/routine/hierarchy`),
  //临时宿舍列表（无须企业id）；
  getTemporaryDormitoryList: async(IdCard) => await httpRequest.get(`/common/dorm/${IdCard}/temporary/hierarchy`),
  //新增住宿信息；
  addDormitoryInfo: async(params) => await httpRequest.post('/admin/app/dormLive', params),
};

export default DormitoryListApi;