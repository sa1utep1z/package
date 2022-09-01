import NAVIGATION_KEYS from '../../navigator/key';

export const workBenchList = [
    {
      moduleName: '名单合集',
      list: [
        {
        title: '报名名单',
        imgBackground: require('../../assets/images/blue.png'),
        iconSource: require('../../assets/images/SignUpListIcon.png'),
        routeName: NAVIGATION_KEYS.SIGN_UP_LIST
      }, {
        title: '面试名单',
        imgBackground: require('../../assets/images/green.png'),
        iconSource: require('../../assets/images/InterviewListIcon.png'),
        routeName: NAVIGATION_KEYS.INTERVIEW_LIST
      }, {
        title: '待入职名单',
        imgBackground: require('../../assets/images/orange.png'),
        iconSource: require('../../assets/images/WaitToEntryListIcon.png'),
        routeName: NAVIGATION_KEYS.WAIT_TO_ENTRY_LIST
      }, {
        title: '在离职名单',
        imgBackground: require('../../assets/images/pink.png'),
        iconSource: require('../../assets/images/LeavingListIcon.png'),
        routeName: NAVIGATION_KEYS.LEAVING_LIST
      }, {
        title: '最新状态',
        imgBackground: require('../../assets/images/lightBlue.png'),
        iconSource: require('../../assets/images/NewestState.png'),
        routeName: NAVIGATION_KEYS.NEWEST_STATE
      }, {
        title: '公海',
        imgBackground: require('../../assets/images/deepGreen.png'),
        iconSource: require('../../assets/images/InternationalSeaIcon.png'),
        routeName: NAVIGATION_KEYS.INTERNATIONAL_SEA
      }, {
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
    ]}, {
      moduleName: '数据看板',
      list: [{
        title: '数据统计',
        imgBackground: require('../../assets/images/lightBlue.png'),
        iconSource: require('../../assets/images/DATA_StatisticsIcon.png'),
        routeName: NAVIGATION_KEYS.DATA_STATISTICS
      },
      {
        title: '招聘看板',
        imgBackground: require('../../assets/images/deepGreen.png'),
        iconSource: require('../../assets/images/HireReportFormIcon.png'),
        routeName: NAVIGATION_KEYS.HIRE_REPORT_FORM
      }, 
      {
        title: '投诉看板',
        imgBackground: require('../../assets/images/green.png'),
        iconSource: require('../../assets/images/ComplaintPlateIcon.png'),
        routeName: NAVIGATION_KEYS.COMPLAINT_PLATE
      },
      //  {
      //   title: '裂变看板',
      //   imgBackground: require('../../assets/images/deepPink.png'),
      //   iconSource: require('../../assets/images/fissionIcon.png'),
      //   routeName: NAVIGATION_KEYS.INTERNATIONAL_SEA
      // }
    ]
    }
  ];