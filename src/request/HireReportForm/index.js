import httpRequest from '../httpRequest';

const HireReportFormApi = {
  // 招聘员列表
  RecruiterList: async () => await httpRequest.get('/common/user/forSelect'),
}

export default HireReportFormApi;