import httpRequest from '../httpRequest';

const MessageApi = {
  // 获取消息列表
  MessageList: async (prams) => await httpRequest.post(`admin/user/message/query`, prams),
  // 消息类型
  MessageType: async () => await httpRequest.get(`admin/user/message/type`),
  // 消息已读数据
  MessageRead: async (messageId) => await httpRequest.put(`admin/user/message/read/${messageId}`),
}

export default MessageApi;