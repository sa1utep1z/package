/**离职审批Api */
import httpRequest from '../httpRequest';

const LeavingManageApi = {
  /**离职申请列表 */
  LeavingApplyList: async(params) => await httpRequest.post(`admin/app/resignApply/list`, params),
  /**离职申请数据统计 */
  LeavingApplyNumber: async(params) => await httpRequest.post(`admin/app/resignApply/list/statis`, params),
  /**离职申请企业信息（订单详情） */
  OrderInfo: async(applyId) => await httpRequest.get(`admin/app/resignApply/${applyId}/orderInfo`),
  /**离职申请会员信息（招聘来源） */
  MemberInfo: async(applyId) => await httpRequest.get(`admin/app/resignApply/${applyId}/memberInfo`),
  /**离职申请详情 */
  ResignApply: async(applyId) => await httpRequest.get(`admin/app/resignApply/${applyId}`),
  /**审批 */
  Audit: async(detailId, params) => await httpRequest.post(`admin/approve/process/${detailId}`, params)
};

export default LeavingManageApi;