import httpRequest from '../../httpRequest';

const DormitoryDataList = {
  //获取报名信息；
  getRoomList: async (params) => await httpRequest.post(`/admin/app/room/resource/status`, params),
};

export default DormitoryDataList;