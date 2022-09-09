import { FilterNavigationList } from '../utils';

const NAVIGATION_PAGES_LIST = {
  //登录首页
  LOGIN: require('./Login'), 
  FORGET_PSW: require('./Login/ForgetPassword'), 
  USER_AGREEMENT: require('./Login/UserAgreement'),
  PRIVACY_POLICY: require('./Login/PrivacyPolicy'),

  //首页
  HOME: require('./Home'),
  COMPANY_DETAIL: require('./Home/CompanyDetail'),
  SIGN_UP: require('./Home/SignUp'),

  //工作台（名单）
  INTERVIEW_LIST: require('./WorkBench/List/InterviewList'),
  LEAVING_LIST: require('./WorkBench/List/LeavingList'),
  SIGN_UP_LIST: require('./WorkBench/List/SignUpList'),
  WAIT_TO_ENTRY_LIST: require('./WorkBench/List/WaitToEntryList'),
  NEWEST_STATE: require('./WorkBench/List/NewestState'),
  TRANSFER_FACTORY: require('./WorkBench/List/TransferFactory'),
  EDIT_MEMBER: require('./WorkBench/List/EditMember'),
  BATCH_OPERATE_LIST: require('./WorkBench/List/BatchOperateList'),
  RECORD_OF_WORKING: require('./WorkBench/List/RecordOfWorking'),
  COMPLETE_MEMBER: require('./WorkBench/List/CompleteMember'),
  LEAVING_MANAGE: require('./WorkBench/FactoryManage/LeavingManage'),

  //工作台（其他功能）
  AGREEMENT_MANAGEMENT: require('./WorkBench/OtherFunction/AgreementManagement'),
  APPLY_DORMITORY: require('./WorkBench/OtherFunction/ApplyDormitory'),
  COMPLAINT_PLATE: require('./WorkBench/OtherFunction/ComplaintPlate'),
  DATA_STATISTICS: require('./WorkBench/OtherFunction/DATA_Statistics'),
  HIRE_REPORT_FORM: require('./WorkBench/OtherFunction/HireReportForm'),
  INTERNATIONAL_SEA: require('./WorkBench/OtherFunction/InternationalSea'),
  LEAVE_EXAMINE: require('./WorkBench/OtherFunction/LeaveExamine'),
  MEMBER_REVIEW: require('./WorkBench/OtherFunction/MemberReview'),
  MY_COMMISSION: require('./WorkBench/OtherFunction/MyCommission'),
  MY_MEMBERS: require('./WorkBench/OtherFunction/MyMembers'),
  PAY_MANAGEMENT: require('./WorkBench/OtherFunction/PayManagement'),

  //我的会员
  EDIT_RETURN_VISIT: require('./WorkBench/OtherFunction/MyMembers/EditReturnView'),
  EDIT_MEMBER_DETAIL: require('./WorkBench/OtherFunction/MyMembers/EditMemberDetail'),
  JOIN_IN_SIGN_UP: require('./WorkBench/OtherFunction/MyMembers/JoinInSignUp'),
  
  //工具栏
  WORKBENCH: require('./WorkBench'),
  MESSAGE: require('./messages/Message'),
  MINE: require('./Mine'),

  //我的
  PERSONAL_CARD: require('./Mine/PersonalCard'),
  RESET: require('./Mine/Reset'),

  // 消息
  RESIGNATION_MESSAGE: require('./messages/resignationMessage'),
  REVISIT_MESSAGE: require('./messages/ReVisitMessage'),
  SYSTEM_MESSAGE: require('./messages/systemMessage'),
  NOTICE_MESSAGE: require('./messages/noticeMessage'),
  ADVISE_MESSAGE: require('./messages/adviseMessage'),
};

module.exports = FilterNavigationList(NAVIGATION_PAGES_LIST);