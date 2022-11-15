import NAVIGATION_KEYS from '../../navigator/key';

export const WORKBENCH_LIST = [
  {
    key: 'businessManage',
    moduleName: '商务管理',
    list: [
      {
        key: 'businessManage',
        title: '企业管理',
        imgBackground: require('../../assets/images/CompanyManage.png'),
        routeName: NAVIGATION_KEYS.BUSINESS_MANAGE
      }, {
        key: 'orderManage',
        title: '订单管理',
        imgBackground: require('../../assets/images/orderManage.png'),
        routeName: NAVIGATION_KEYS.ORDER_MANAGE
      }
    ]
  }, 
  {
    key: 'list',
    moduleName: '名单合集',
    list: [
      {
        key: 'signUp',
        title: '报名名单',
        imgBackground: require('../../assets/images/blue.png'),
        iconSource: require('../../assets/images/SignUpListIcon.png'),
        routeName: NAVIGATION_KEYS.SIGN_UP_LIST
      }, {
        key: 'interview',
        title: '面试名单',
        imgBackground: require('../../assets/images/green.png'),
        iconSource: require('../../assets/images/InterviewListIcon.png'),
        routeName: NAVIGATION_KEYS.INTERVIEW_LIST
      }, {
        key: 'waitToEntry',
        title: '待入职名单',
        imgBackground: require('../../assets/images/orange.png'),
        iconSource: require('../../assets/images/WaitToEntryListIcon.png'),
        routeName: NAVIGATION_KEYS.WAIT_TO_ENTRY_LIST
      }, {
        key: 'leaving',
        title: '在离职名单',
        imgBackground: require('../../assets/images/pink.png'),
        iconSource: require('../../assets/images/LeavingListIcon.png'),
        routeName: NAVIGATION_KEYS.LEAVING_LIST
      }, {
        key: 'newestState',
        title: '最新状态',
        imgBackground: require('../../assets/images/lightBlue.png'),
        iconSource: require('../../assets/images/NewestState.png'),
        routeName: NAVIGATION_KEYS.NEWEST_STATE
      }, {
        key: 'seas',
        title: '公海',
        imgBackground: require('../../assets/images/deepGreen.png'),
        iconSource: require('../../assets/images/InternationalSeaIcon.png'),
        routeName: NAVIGATION_KEYS.INTERNATIONAL_SEA
      }, {
        key: 'myMember',
        title: '我的会员',
        imgBackground: require('../../assets/images/yellow.png'),
        iconSource: require('../../assets/images/MyMembersIcon.png'),
        routeName: NAVIGATION_KEYS.MY_MEMBERS
      }, 
    // {
    //   title: '我的提成',
    //   imgBackground: require('../../assets/images/deepPink.png'),
    //   iconSource: require('../../assets/images/MyCommissionIcon.png'),
    //   routeName: NAVIGATION_KEYS.MY_COMMISSION
    // }
    ]
  }, 
  {
    key: 'factoryManage',
    moduleName: '会员服务',
    list: [
        {
        key: 'leavingManage',
        title: '离职审核',
        imgBackground: require('../../assets/images/blue.png'),
        iconSource: require('../../assets/images/LeavingManage.png'),
        routeName: NAVIGATION_KEYS.LEAVING_MANAGE
      }, {
        key: 'complaintFeedback',
        title: '投诉反馈',
        imgBackground: require('../../assets/images/Complain.png'),
        routeName: NAVIGATION_KEYS.COMPLAINT_FEEDBACK
      }, {
        key: 'advanceManage',
        title: '预支审核',
        imgBackground: require('../../assets/images/borrow.png'),
        routeName: NAVIGATION_KEYS.ADVANCE_MANAGE
      }
    ]
  }, 
  {
    key: 'dormitory',
    moduleName: '宿舍管理',
    list: [
      {
        key: 'dormitoryList',
        title: '在离宿名单',
        imgBackground: require('../../assets/images/dormitoryList.png'),
        routeName: NAVIGATION_KEYS.DORMITORY_LIST
      }, {
        key: 'dormitoryCheckList',
        title: '宿舍点检',
        imgBackground: require('../../assets/images/dormitoryCheck.png'),
        routeName: NAVIGATION_KEYS.DORMITORY_CHECK_LIST
      }, {
        key: 'dormitoryViolation',
        title: '宿舍查房',
        imgBackground: require('../../assets/images/dormitoryViolation.png'),
        routeName: NAVIGATION_KEYS.DORMITORY_VIOLATION
      }, {
        key: 'dormitoryData',
        title: '宿舍态势',
        imgBackground: require('../../assets/images/dormitoryRecord.png'),
        routeName: NAVIGATION_KEYS.DORMITORY_DATA
      }
    ]
  }, 
  {
    key: 'dataPanel',
    moduleName: '数据看板',
    list: [
      {
        key: 'statistics',
        title: '数据统计',
        imgBackground: require('../../assets/images/lightBlue.png'),
        iconSource: require('../../assets/images/DATA_StatisticsIcon.png'),
        routeName: NAVIGATION_KEYS.DATA_STATISTICS
      }, {
        key: 'hire',
        title: '招聘看板',
        imgBackground: require('../../assets/images/deepGreen.png'),
        iconSource: require('../../assets/images/HireReportFormIcon.png'),
        routeName: NAVIGATION_KEYS.HIRE_REPORT_FORM
      }, 
    // {
    //   key: 'complaint',
    //   title: '投诉看板',
    //   imgBackground: require('../../assets/images/green.png'),
    //   iconSource: require('../../assets/images/ComplaintPlateIcon.png'),
    //   routeName: NAVIGATION_KEYS.COMPLAINT_PLATE
    // },
    //  {
    //   title: '裂变看板',
    //   imgBackground: require('../../assets/images/deepPink.png'),
    //   iconSource: require('../../assets/images/fissionIcon.png'),
    //   routeName: NAVIGATION_KEYS.INTERNATIONAL_SEA
    // }
    ]
  }
];