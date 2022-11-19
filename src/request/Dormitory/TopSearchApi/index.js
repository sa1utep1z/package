import httpRequest from '../../httpRequest';

const TopSearchApi = {
  //获取楼栋列表；
  getBuildingList: async () => await httpRequest.get('/common/roomBuilding/forSelect'),
  //获取楼层列表；
  getFloorList: async (buildingId) => await httpRequest.get(`/common/roomBuilding/${buildingId}/roomFloor/forSelect`),
  //获取房间列表；
  getRoomList: async (floorId) => await httpRequest.get(`/common/roomFloor/${floorId}/room/forSelect`),
  //获取床位列表；
  getBedList: async (roomId) => await httpRequest.get(`/common/room/${roomId}/bed/forSelect`),
};

export default TopSearchApi;