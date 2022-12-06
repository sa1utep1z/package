import { FilterNavigationList } from '../utils';

const NAVIGATION_PAGES_LIST = {
  //登录
  LOGIN: require('./Login'), //登录
  FORGET_PSW: require('./Login/ForgetPassword'), //修改密码
  USER_AGREEMENT: require('./Login/UserAgreement'), //用户协议
  PRIVACY_POLICY: require('./Login/PrivacyPolicy'), //隐私政策

  //首页
  HOME: require('./Home'), //首页
  COMPANY_DETAIL: require('./Home/CompanyDetail'), //企业详情
  SIGN_UP: require('./Home/SignUp'), //报名

  //工作台
  WORKBENCH: require('./WorkBench'), //工作台
  
  //工作台（商务管理）
  BUSINESS_MANAGE: require('./WorkBench/OtherFunction/BusinessManage'), //企业管理
  BUSINESS_ADD: require('./WorkBench/OtherFunction/BusinessManage/BusinessAdd'), //新增企业
  BUSINESS_EDIT: require('./WorkBench/OtherFunction/BusinessManage/BusinessEdit'), //编辑企业
  ORDER_MANAGE: require('./WorkBench/OtherFunction/OrderManage'), //订单管理
  CERATE_ORDER: require('./WorkBench/OtherFunction/OrderManage/CreateOrder'), //新建订单

  //工作台（名单合集）
  SIGN_UP_LIST: require('./WorkBench/List/SignUpList'), //报名名单
  INTERVIEW_LIST: require('./WorkBench/List/InterviewList'), //面试名单
  WAIT_TO_ENTRY_LIST: require('./WorkBench/List/WaitToEntryList'), //待入职名单
  LEAVING_LIST: require('./WorkBench/List/LeavingList'), //在离职名单
  NEWEST_STATE: require('./WorkBench/List/NewestState'), //最新状态
  INTERNATIONAL_SEA: require('./WorkBench/OtherFunction/InternationalSea'), //公海
  MY_MEMBERS: require('./WorkBench/OtherFunction/MyMembers'), //我的会员
  EDIT_RETURN_VISIT: require('./WorkBench/OtherFunction/MyMembers/EditReturnView'), //编辑回访记录（我的会员）
  EDIT_MEMBER_DETAIL: require('./WorkBench/OtherFunction/MyMembers/EditMemberDetail'), //编辑会员信息（我的会员）
  JOIN_IN_SIGN_UP: require('./WorkBench/OtherFunction/MyMembers/JoinInSignUp'), //加入报名（我的会员）
  EDIT_MEMBER: require('./WorkBench/List/EditMember'), //编辑会员信息（名单）
  TRANSFER_FACTORY: require('./WorkBench/List/TransferFactory'), //转厂（名单）
  BATCH_OPERATE_LIST: require('./WorkBench/List/BatchOperateList'), //批量处理名单（名单）
  COMPLETE_MEMBER: require('./WorkBench/List/CompleteMember'), //完善报名三要素（名单）

  //工作台（会员服务）
  LEAVING_MANAGE: require('./WorkBench/FactoryManage/LeavingManage'), //离职审核
  COMPLAINT_FEEDBACK: require('./WorkBench/OtherFunction/ComplaintManage'), //投诉反馈
  COMPLAINT_ADD: require('./WorkBench/OtherFunction/ComplaintManage/AddComplaint'), //新增投诉
  COMPLAINT_EDIT: require('./WorkBench/OtherFunction/ComplaintManage/EditComplaint'), //编辑投诉
  ADVANCE_MANAGE: require('./WorkBench/OtherFunction/AdvanceManage'), //预支审核
  ADVANCE_AUDIT: require('./WorkBench/OtherFunction/AdvanceManage/AdvanceAudit'), //预支审核详情

  //工作台（宿舍管理）
  DORMITORY_LIST: require('./WorkBench/Dormitory/DormitoryList'), //在离宿名单
  CREATE_DORMITORY: require('./WorkBench/Dormitory/CreateDormitory'), //新增住宿
  BATCH_OPERATE_DORMITORY: require('./WorkBench/Dormitory/DormitoryList/BatchOperateDormitory'), //批量操作在离宿名单
  DORMITORY_CHECK_LIST: require('./WorkBench/Dormitory/DormitoryCheckList'), //宿舍点检
  ADD_PROPERTY: require('./WorkBench/Dormitory/AddProperty'), //添加资产
  ADD_DORMITORY_CHECKED: require('./WorkBench/Dormitory/AddDormitoryChecked'), //新增点检记录
  DORMITORY_VIOLATION: require('./WorkBench/Dormitory/DormitoryViolation'), //宿舍查房
  ADD_VIOLATION: require('./WorkBench/Dormitory/AddViolation'), //开罚单
  DORMITORY_DATA: require('./WorkBench/Dormitory/DormitoryData'), //房间态势

  //工作台（数据看板）
  DATA_STATISTICS: require('./WorkBench/OtherFunction/DATA_Statistics'), //数据统计
  HIRE_REPORT_FORM: require('./WorkBench/OtherFunction/HireReportForm'), //招聘看板
  DORMITORY_BED_PANEL: require('./WorkBench/Dormitory/DormitoryBedPanel'), //床位看板

  //工作台（待开发）
  RECORD_OF_WORKING: require('./WorkBench/List/RecordOfWorking'), //名单-员工考勤
  AGREEMENT_MANAGEMENT: require('./WorkBench/OtherFunction/AgreementManagement'), //合同管理
  APPLY_DORMITORY: require('./WorkBench/OtherFunction/ApplyDormitory'), //宿舍申请
  COMPLAINT_PLATE: require('./WorkBench/OtherFunction/ComplaintPlate'), //投诉看板
  LEAVE_EXAMINE: require('./WorkBench/OtherFunction/LeaveExamine'), //离职管理
  MEMBER_REVIEW: require('./WorkBench/OtherFunction/MemberReview'), //裂变回访
  MY_COMMISSION: require('./WorkBench/OtherFunction/MyCommission'), //我的提成
  PAY_MANAGEMENT: require('./WorkBench/OtherFunction/PayManagement'), //借支管理
  
  //我的
  MINE: require('./Mine'), //我的
  PERSONAL_CARD: require('./Mine/PersonalCard'), //对外名片
  RESET: require('./Mine/Reset'), //重置密码

  // 消息
  MESSAGE: require('./messages/Message'), //消息
  ADVISE_MESSAGE: require('./messages/adviseMessage'), //公告
  NOTICE_MESSAGE: require('./messages/noticeMessage'), //通知
  RESIGNATION_MESSAGE: require('./messages/resignationMessage'), //离职消息
  REVISIT_MESSAGE: require('./messages/ReVisitMessage'), //回访消息
  SYSTEM_MESSAGE: require('./messages/systemMessage'), //系统消息
};

module.exports = FilterNavigationList(NAVIGATION_PAGES_LIST);