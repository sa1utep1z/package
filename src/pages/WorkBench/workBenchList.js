import NAVIGATION_KEYS from '../../navigator/key';

export const workBenchList = [
    {
      moduleName: '名单合集',
      list: [{
        title: '报名名单',
        imgSource: require('../../assets/images/SignUpList.png'),
        routeName: NAVIGATION_KEYS.SIGN_UP_LIST
      }, {
        title: '面试名单',
        imgSource: require('../../assets/images/InterviewList.png'),
        routeName: NAVIGATION_KEYS.INTERVIEW_LIST
      }, {
        title: '待入职名单',
        imgSource: require('../../assets/images/WaitToEntryList.png'),
        routeName: NAVIGATION_KEYS.WAIT_TO_ENTRY_LIST
      }, {
        title: '在离职名单',
        imgSource: require('../../assets/images/LeavingList.png'),
        routeName: NAVIGATION_KEYS.LEAVING_LIST
      }, {
        title: '最新状态',
        imgSource: require('../../assets/images/NewestState.png'),
        routeName: NAVIGATION_KEYS.NEWEST_STATE
      }]
    }, {
      moduleName: '其他功能',
      list: [{
        title: '我的会员',
        imgSource: require('../../assets/images/MyMembers.png'),
        routeName: NAVIGATION_KEYS.MY_MEMBERS
      }, {
        title: '我的提成',
        imgSource: require('../../assets/images/MyCommission.png'),
        routeName: NAVIGATION_KEYS.MY_COMMISSION
      }, {
        title: '数据统计',
        imgSource: require('../../assets/images/DATA_Statistics.png'),
        routeName: NAVIGATION_KEYS.DATA_STATISTICS
      }, {
        title: '公海',
        imgSource: require('../../assets/images/InternationalSea.png'),
        routeName: NAVIGATION_KEYS.INTERNATIONAL_SEA
      }, {
        title: '招聘报表',
        imgSource: require('../../assets/images/HireReportForm.png'),
        routeName: NAVIGATION_KEYS.HIRE_REPORT_FORM
      }, {
        title: '裂变回访',
        imgSource: require('../../assets/images/MemberReview.png'),
        routeName: NAVIGATION_KEYS.MEMBER_REVIEW
      }, {
        title: '离职管理',
        imgSource: require('../../assets/images/LeaveExamine.png'),
        routeName: NAVIGATION_KEYS.LEAVE_EXAMINE
      }, {
        title: '合同管理',
        imgSource: require('../../assets/images/AgreementManagement.png'),
        routeName: NAVIGATION_KEYS.AGREEMENT_MANAGEMENT
      }, {
        title: '借支管理',
        imgSource: require('../../assets/images/PayManagement.png'),
        routeName: NAVIGATION_KEYS.PAY_MANAGEMENT
      }, {
        title: '投诉看板',
        imgSource: require('../../assets/images/ComplaintPlate.png'),
        routeName: NAVIGATION_KEYS.COMPLAINT_PLATE
      }, {
        title: '宿舍申请',
        imgSource: require('../../assets/images/ApplyDormitory.png'),
        routeName: NAVIGATION_KEYS.APPLY_DORMITORY
      }]
    }
  ];