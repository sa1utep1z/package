import httpRequest from '../../httpRequest';

const DormitoryDataListApi = {
  //获取报名信息；
  getRoomList: async (params) => await httpRequest.post(`/admin/app/room/resource/status`, params),
  //房间内部住宿信息；
  getRoomMemberList: async(roomId) => await httpRequest.get(`/admin/app/room/resource/room/${roomId}/live`),
};

export default DormitoryDataListApi;