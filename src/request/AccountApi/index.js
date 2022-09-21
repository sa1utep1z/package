/**离职审批Api */
import httpRequest from '../httpRequest';

const AccountApi = {
  /**忘记/重置密码验证码  */
  SendCodeOfReset: async(mobile) => await httpRequest.get(`sms/sendSmsCode/forgetPwd/${mobile}`),
  /**忘记/重置密码 */
  ResetPassword: async(params) => await httpRequest.post(`admin/login/changePwd`, params),
};

export default AccountApi;