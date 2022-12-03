import httpRequest from '../../httpRequest';

const DormitoryListApi = {
  //获取报名信息；
  getSignUpInfo: async (IdCard) => await httpRequest.get(`/admin/app/dormLive/${IdCard}/recruitFlow/info`),
  //常规宿舍列表（须企业id）；
  getNormalDormitoryList: async(IdCard, companyId) => await httpRequest.get(`/common/dorm/${IdCard}/${companyId}/routine/hierarchy`),
  //常规宿舍列表（无须企业id）；
  getNormalDormitoryListWithoutIdNo: async(IdNo) => await httpRequest.get(`/common/dorm/${IdNo}/routine/hierarchy`), 
  //临时宿舍列表（无须企业id）；
  getTemporaryDormitoryList: async(IdCard) => await httpRequest.get(`/common/dorm/${IdCard}/temporary/hierarchy`),
  //新增住宿信息；
  addDormitoryInfo: async(params) => await httpRequest.post('/admin/app/dormLive', params),
  //在离宿列表；
  getDormitoryList: async(params) => await httpRequest.post('/admin/app/dormLive/list', params),
  //在离宿列表-统计；
  getDormitoryType: async(params) => await httpRequest.post('/admin/app/dormLive/list/statistics', params), 
  //入住确认；
  confirmLiving: async(params, dormLiveId) => await httpRequest.post(`/admin/app/dormLive/${dormLiveId}/liveIn`, params), 
  //退宿确认；
  leaveConfirm: async(params, dormLiveId) => await httpRequest.post(`/admin/app/dormLive/${dormLiveId}/liveOut`, params), 
  //调迁宿舍；
  adjustDormitory: async(params, dormLiveId) => await httpRequest.post(`/admin/app/dormLive/${dormLiveId}/transfer`, params), 
  //批量入住；
  batchLiveIn: async(params) => await httpRequest.post(`/admin/app/dormLive/batch/liveIn`, params), 
  //批量退宿；
  batchLiveOut: async(params) => await httpRequest.post(`/admin/app/dormLive/batch/liveOut`, params), 
  //根据房间id查询剩余床位；
  queryRestBedList: async(roomId) => await httpRequest.get(`/common/dorm/${roomId}/roomBed/forSelect`),
};

export default DormitoryListApi;