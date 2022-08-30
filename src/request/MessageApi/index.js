import httpRequest from '../httpRequest';

const MessageApi = {
  // 获取消息列表
  MessageList: async (prams) => await httpRequest.post(`admin/user/message/query`, prams),
  // 批量消息已读
  BatchMessage: async (prams) => await httpRequest.put(`admin/user/message/read/batch`, prams),
  // 获取消息类型未读数据
  MessageNoRead: async (prams) => await httpRequest.post(`admin/user/message/top`, prams),
  // 获取已读数据
  MessageRead: async (prams) => await httpRequest.post(`admin/user/message/read/${messageId}`, prams),
}

export default MessageApi;