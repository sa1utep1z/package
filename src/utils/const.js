import moment from "moment";

export const SUCCESS_CODE = 0;

//今天
export const today = moment().format('YYYY-MM-DD');
export const TODAY = moment().format('YYYY-MM-DD');
//昨日
export const YESTERDAY = moment().subtract(1,'day').format('YYYY-MM-DD');
//本周开始
export const THIS_WEEK_START = moment().weekday(0).format('YYYY-MM-DD');
//本周结束
export const THIS_WEEK_END = moment().weekday(6).format('YYYY-MM-DD');
//上周开始
export const LAST_WEEK_START = moment().weekday(-7).format('YYYY-MM-DD');
//上周结束
export const LAST_WEEK_END = moment().weekday(-1).format('YYYY-MM-DD');
//本月开始
export const THIS_MONTH_START = moment().startOf('month').format('YYYY-MM-DD');
//本月结束
export const THIS_MONTH_END = moment().endOf('month').format('YYYY-MM-DD');
//上月开始
export const LAST_MONTH_START = moment().subtract(1,'month').startOf('month').format('YYYY-MM-DD');
//上月结束
export const LAST_MONTH_END = moment().subtract(1,'month').endOf('month').format('YYYY-MM-DD');

export const FAKE_MEMBER_INFO = [
  {type: 'name', title: '姓名', value: '呵呵'},
  {type: 'IDCard', title: '身份证', value: '478523694562315964'},
  {type: 'phone', title: '手机号', value: '18088889999'},
  {type: 'jobName', title: '职位名称', value: '南山爱普生'},
  {type: 'jobFrom', title: '职位来源', value: '门店录入'},
  {type: 'belongOfPeople', title: '经纪人', value: '张三（18088879996）'},
  {type: 'belongOfStore', title: '归属门店', value: '新媒体店'},
  {type: 'signUpState', title: '报名状态', value: '待处理'},
  {type: 'theWayToArrive', title: '到厂方式', value: '门店集合'},
  {type: 'handleTime', title: '处理时间', value: moment().format('YYYY-MM-DD HH:mm:ss')},
  {type: 'remark', title: '备注', value: '门店集合'},
  {type: 'isStay', title: '是否住宿', value: '否'}
];

export const ARRIVE_WAY = [
  {id: 1, title: '自行到厂', value: 'byHimself'},
  {id: 2, title: '门店集合', value: 'unifyAssemble'}
];

//渠道来源
export const CHANEL_SOURCE_LIST = [
  {id: 1, title: '自主报名', value: 'SELF'},
  {id: 2, title: '门店录入', value: 'RECRUITER'},
  {id: 3, title: '供应商', value: 'SUPPLIER'},
  {id: 4, title: '会员推荐', value: 'MEMBER_RECOMMEND'}
]

export const HANDLE_STATE = [
  {title: '待处理', value: 'waitToHandle'},
  {title: '考虑中', value: 'considering'},
  {title: '未通过', value: 'notPass'},
  {title: '已通过', value: 'isPassed'}
];

// 报名名单的初始状态列表
export const DEFAULT_STATUS_LIST_OF_SIGN_UP_LIST = [
  {value: 'shenjingbing' ,title: '精神异常'},
  {value: 'noIDCard', title: '无身份证'},
  {value: 'youwenshen', title: '纹身不过'},
  {value: 'giveup', title: '现场放弃'},
  {value: 'failedExam', title: '考试不过'}
];

// 待入职未报到原因
export const DEFAULT_ONBORADINGSTATUS = [
  {value: 'unContact' ,title: '联系不上'},
  {value: 'giveUp', title: '放弃入职'},
  {value: 'busy', title: '临时有事'},
];

// 在离职原因
export const DEFAULT_JOBSTATUS = [
  {value: 'resignation' ,title: '辞职'},
  {value: 'selfDissociation', title: '自离'},
  {value: 'factoryDismissal', title: '工厂开除'},
  {value: 'giveUp', title: '放弃入职'},
  {value: 'worker', title: '工期满转正'},
];

// 面试名单的初始状态列表
export const DEFAULT_STATUS_LIST_OF_INTERVIEW_LIST = [
  {value: 'giveUp', title: '现场放弃'},
  {value: 'failInMedical' ,title: '体检不过'},
  {value: 'haveWenShen', title: '纹身不过'},
  {value: 'failedInExam', title: '考试不过'},
  {value: 'failInComprehensiveExam', title: '综合考试不过'}
];

export const TAB_OF_LIST = {
  SIGN_UP_LIST: [
    {title: '全部',type: 'total',},
    {title: '待处理',type: 'pending',},
    {title: '无意愿',type: 'noIntention',},
    {title: '已报名',type: 'intention',}
  ],
  INTERVIEW_LIST: [
    {title: '全部',type: 'total'},
    {title: '待处理',type: 'pending'},
    {title: '未面试',type: 'noArrive'},
    {title: '未通过',type: 'fail'},
    {title: '已通过',type: 'pass'}
  ],
  WAIT_TO_ENTRY_LIST: [
    {title: '全部',type: 'total'},
    {title: '待处理',type: 'pending'},
    {title: '未报到',type: 'fail'},
    {title: '已入职',type: 'pass'}
  ],
  LEAVING_LIST: [
    {title: '全部',type: 'total'},
    {title: '离职',type: 'resign'},
    {title: '在职',type: 'on'}
  ],
  NEWEST_STATE: [
    {title: '姓名',type: 'name'},
    {title: '企业',type: 'enterprise'},
    {title: '两卡',type: 'twoCard'},
    {title: '打卡记录',type: 'record'},
    {title: '状态',type: 'status'},
    {title: '来源',type: 'from'}
  ],
  MY_MEMBERS: [
    {title: '全部', type: 'allNums'},
    {title: '待回访', type: 'preparingNums'},
    {title: '有意愿', type: 'haveWillNums'},
    {title: '无意愿', type: 'noWillNums'}
  ]
};

export const CHANGING_STAGE_LIST_IN_DIALOG = [
  {title: '报名', value: 'SIGN_UP_PENDING', statusList: [
    {title: '已报名', value: 'SIGN_UP_INTENTION'},
    {title: '无意向', value: 'SIGN_UP_NO_INTENTION', reasonList: [
      {title: '精神异常', value: 'jingshenbing'},
      {title: '无身份证', value: 'noIDCard'},
      {title: '大花臂', value: 'bigFlowerHand'},
      {title: '有案底', value: 'inPrison'},
      {title: '在外地', value: 'out'}
    ]}
  ]},
  {title: '面试', value: 'INTERVIEW_PENDING', statusList: [
    {title: '通过', value: 'INTERVIEW_PASS'},
    {title: '未通过', value: 'INTERVIEW_FAIL', reasonList: [
      {title: '现场放弃', value: 'giveUp'},
      {title: '身份证过期', value: 'IDCardOutDate'},
      {title: '精神异常', value: 'jingshenbing'},
      {title: '纹身不过', value: 'haveWenShen'},
      {title: '联系不上', value: 'unconnected'},
      {title: '考试不过', value: 'failInExam'},
      {title: '体检不过', value: 'failInPhysical'}
    ]},
    {title: '未面试', value: 'INTERVIEW_NO_ARRIVE', reasonList: [
      {title: '现场放弃', value: 'giveUp'},
      {title: '身份证过期', value: 'IDCardOutDate'},
      {title: '精神异常', value: 'jingshenbing'},
      {title: '纹身不过', value: 'haveWenShen'},
      {title: '联系不上', value: 'unconnected'},
      {title: '考试不过', value: 'failInExam'},
      {title: '体检不过', value: 'failInPhysical'}
    ]}
  ]},
  {title: '待入职', value: 'ON_BOARDING_PENDING', statusList: [
    {title: '已入职', value: 'ON_BOARDING_PASS'},
    {title: '未报到', value: 'ON_BOARDING_FAIL', reasonList: [
      {title: '联系不上', value: 'unconnected'},
      {title: '放弃入职', value: 'giveUpJob'},
      {title: '临时有事', value: 'haveSomething'}
    ]}
  ]},
  {title: '离职', value: 'JOB_RESIGN', reasonList: [
    {title: '辞职', value: 'resign'},
    {title: '自离', value: 'selfLeave'},
    {title: '工期满转正', value: 'positive'},
    {title: '工厂开除', value: 'fired'},
    {title: '放弃入职', value: 'giveUp'}
  ]},
];

//这是在最新状态名单中的修改状态的枚举值
export const ALL_STATUS_IN_NEWEST_LIST = [
  'SIGN_UP_INTENTION',
  'SIGN_UP_NO_INTENTION',
  'INTERVIEW_PASS',
  'INTERVIEW_FAIL',
  'INTERVIEW_NO_ARRIVE',
  'ON_BOARDING_PASS',
  'ON_BOARDING_FAIL',
  'JOB_RESIGN'
];

export const SEAS_SOURCE_TYPE = {
  'IMPORT': '后台导入',
  'VISITOR': '游客关注',
  'INPUT': '招聘员录入',
  'SUPPLIER': '供应商导入',
  'SHARE': '分享裂变'
};

//我的会员-状态(所有状态合集)
export const MEMBERS_STATUS = {
  'NONE': '无',
  /**报名 */
  'SIGN_UP_PENDING': '报名待处理',
  'SIGN_UP_NO_INTENTION': '无意向',
  'SIGN_UP_INTENTION': '已报名',

  /**面试 */
  'INTERVIEW_PENDING': '面试待处理',
  'INTERVIEW_PASS': '已通过',
  'INTERVIEW_NO_ARRIVE': '未去面试',
  'INTERVIEW_FAIL': '未通过',

  /**入职 */
  'ON_BOARDING_PENDING': '入职待处理',
  'ON_BOARDING_FAIL': '未报到',
  'ON_BOARDING_PASS': '已入职',

  /**在离职 */
  'JOB_ON': '在职',
  'PREPARE_JOB_RESIGN': '预离职',
  'JOB_RESIGN': '离职'
};

//我的会员-会员信息
export const MEMBER_INFO_KEY = {
  'age': '年龄',
  'bornDay': '出生日',
  'bornMonth': '出生月份',
  'gender': '性别',
  'idNo': '身份证号',
  'mobile': '手机号',
  'hometown': '籍贯',
  'nation': '民族',
  'recruiterName': '归属招聘员',
  'registerDate': '注册时间',
  'sourceType': '来源',
  'storeName': '归属门店',
  'userName': '姓名'
};

export const GENDER = {
  'FEMALE': '女',
  'MALE': '男'
};

export const STATUS_LIST_KEY = {
  "ALL": '全部',
  "NULL": '空',
  "SIGN_UP_NO_INTENTION": '报名-无意向',
  "INTERVIEW_NO_ARRIVE": '面试-未去面试',
  "INTERVIEW_FAIL": '面试-未通过',
  "ON_BOARDING_FAIL": '入职-未报到',
  "JOB_ON": '在职',
  "PREPARE_JOB_RESIGN": '预离职',
  "JOB_RESIGN": '离职'
};

export const STATUS_LIST = [
  {title: '全部', value: '', id: 1},
  {title: '无', value: 'none', id: 2},
  {title: '报名-无意向', value: 'sign_up_no_intention', id: 3},
  {title: '面试-未去面试', value: 'interview_no_arrive', id: 4},
  {title: '面试-未通过', value: 'interview_fail', id: 5},
  {title: '入职-未报到', value: 'on_boarding_fail', id: 6},
  {title: '在职', value: 'job_on', id: 7},
  {title: '预离职', value: 'prepare_job_resign', id: 8},
  {title: '离职', value: 'job_resign', id: 9}
];
 
export const COMPANY_SHIFT = [
  { label: '长白班', value: 'SHIFT_CATEGORY_LONG' },
  { label: '两班倒', value: 'SHIFT_CATEGORY_TWO' },
  { label: '三班倒', value: 'SHIFT_CATEGORY_THREE' },
];
export const PROFESSION = [
  { label: '正式工', value: 'FORMAL_WORKER' },
  { label: '派遣工-小时工', value: 'DISPATCH_HOURLY_WORKER' },
  { label: '派遣工-同工同酬', value: 'DISPATCH_EQUAL_PAY' },
];
export const SITSTAND = [
  { label: '站班', value: 'STAND' },
  { label: '坐班', value: 'SIT_DOWN' },
  { label: '都有', value: 'ALL_HAVE' },
];
export const DRESS = [
  { label: '普通工衣', value: 'DRESS_ORDINARY' },
  { label: '无尘服', value: 'DRESS_DUST_FREE' },
  { label: '穿自己衣服', value: 'DRESS_OWN' },
];
export const COMPANY_LINE = [
  { label: '流水线', value: 'LINE_WATER' },
  { label: '非流水线', value: 'LINE_NOT_WATER' },
  { label: '都有', value: 'ALL_HAVE' },
];
export const DORMITORY = [
  { label: '住宿免费', value: 'DORMITORY_FREE' },
  { label: '住宿扣费', value: 'DORMITORY_NOT_FREE' },
  { label: '无住宿', value: 'NOT_DORMITORY' },
];
export const COMPANY_FOOD = [
  { label: '免费工作餐', value: 'FOOD_FREE' },
  { label: '三餐包吃', value: 'FOOD_THREE_INCLUDE' },
  { label: '刷卡吃饭', value: 'FOOD_SWIPE' },
  { label: '自费吃饭', value: 'FOOD_OWN' },
];
export const COMPANY_PHONE = [
  { label: '可以带', value: 'PHONE_CARRY' },
  { label: '不能带', value: 'PHONE_NOT_CARRY' },
];
export const COMPANY_IDCARD = [
  { label: '必须有磁有效', value: 'ID_CARD_MAGNETIC' },
  { label: '临时身份证可去', value: 'ID_CARD_TEMP' },
  { label: '无身份证可去', value: 'ID_CARD_NOT' },
];
export const COMPANY_ENGLISH = [
  { label: '不会可去', value: 'ENGLISH_NOT_MUST' },
  { label: '必须要会', value: 'ENGLISH_MUST' },
];
export const TATTOOSMOKE = [
  { label: '严查', value: 'TATTOO_SMOKE_CHECK' },
  { label: '不查', value: 'TATTOO_SMOKE_NOT_CHECK' },
  { label: '不可外露', value: 'TATTOO_SMOKE_NOT_EXPOSED' },
];
export const STATUS_LISTS = [
  {title: '报名-无意向', value: 'sign_up_no_intention', id: 1},
  {title: '面试-未去面试', value: 'interview_no_arrive', id: 2},
  {title: '面试-未通过', value: 'interview_fail', id: 3},
  {title: '入职-未报到', value: 'on_boarding_fail', id: 4},
  {title: '在职', value: 'job_on', id: 5},
  {title: '预离职', value: 'prepare_job_resign', id: 6},
  {title: '离职', value: 'job_resign', id: 7}
];
//报名状态列表；
export const SIGN_UP_STATUS = {
  "SIGN_UP_PENDING": '待处理',
  "SIGN_UP_NO_INTENTION": '无意愿',
  "SIGN_UP_INTENTION": '已报名'
};
// 入职状态值
export const ON_BOARDING_STATUS = {
  "ON_BOARDING_PENDING": '待处理',
  "ON_BOARDING_FAIL": '未报到',
  "ON_BOARDING_PASS": '已入职'
};
// 在离职状态值
export const JOB_ON_STATUS = {
  "JOB_ON": '在职',
  "JOB_RESIGN": '离职',
};
//面试状态列表；
export const INTERVIEW_STATUS = {
  "INTERVIEW_PENDING": "待处理",
  "INTERVIEW_NO_ARRIVE": "未去面试",
  "INTERVIEW_FAIL": "未通过",
  "INTERVIEW_PASS": "已通过"
};
export const WAY_TO_GO = [
  { label: '自行到厂', value: 'FACTORY' },
  { label: '门店集合', value: 'STORE' },
];

export const NEWEST_STATE_LIST_HEAD = [
  {title: '姓名'},
  {title: '企业'},
  {title: '两卡'},
  {title: '打卡记录'},
  {title: '状态'},
  {title: '来源'}
];

export const ORIGIN_HIRE_REPORT_OVERVIEW_LIST = [
  {
    title: '报名人数',
    type: 'SIGN_UP',
    num: 0,
    trendNumber: 0
  },
  {
    title: '面试人数',
    type: 'INTERVIEW',
    num: 0,
    trendNumber: 0
  },
  {
    title: '待入职人数',
    type: 'WAIT_TO_ENTRY',
    num: 0,
    trendNumber: 0
  },
  {
    title: '入职人数',
    type: 'JOB_IN',
    num: 0,
    trendNumber: 0
  },
  {
    title: '离职人数',
    type: 'LEAVING',
    num: 0,
    trendNumber: 0
  },
  {
    title: '在职人数',
    type: 'NOW',
    num: 0,
    trendNumber: 0
  }
];

export const HIRE_OVERVIEW_TAG_LIST = [
  { title: '今日', value: 'today' },
  { title: '本周', value: 'thisWeek' },
  { title: '本月', value: 'thisMonth' }
];

export const HIRE_DATA_BOX_TAG_LIST = [
  { title: '本周', value: 'thisWeek' },
  { title: '上周', value: 'lastWeek' },
  { title: '本月', value: 'thisMonth' }
];

export const HIRE_DATA_TREND_TAB_LIST = [
  { key: 'company', title: '企业' },
  { key: 'store', title: '门店' },
  { key: 'recruiter', title: '招聘员' },
  { key: 'supplier', title: '供应商' }
];

export const HIRE_DATA_COMPARE_TAB_LIST = [
  { value: 'thisWeekVSlastWeek', title: '本周VS上周' },
  { value: 'thisMonthVSlastMonth', title: '本月VS上月' }
];

export const ROLE_INFO = {
  'ADMIN': '管理员',
  'RECRUITER': '招聘员',
  'RESIDENT': '驻厂',
  'FINANCE': '财务'
};

export const ORIGIN_SELECTED_STATUS_LIST = [
  {value: 'signUpIntention', title: '已报名'},
  {value: 'interviewPass', title: '面试通过'},
  {value: 'onBoardingPass', title: '入职'}
];

export const ORIGIN_COMPARE_STATUS_LIST = [
  {value: 'onBoardingPass', title: '入职'}
];

export const CHART_STATUS_LIST = [
  {value: 'signUp', title: '报名邀约'},
  {value: 'signUpIntention', title: '已报名'},
  {value: 'interviewNoArrive', title: '面试未去'},
  {value: 'interviewFail', title: '面试未过'},
  {value: 'interviewPass', title: '面试通过'},
  {value: 'onBoardingFail', title: '未报到'},
  {value: 'onBoardingPass', title: '入职'},
  {value: 'resignNum', title: '离职'}
];

export const PERCENT_CHART_STATUS_LIST = [
  /**报名 */
  {value: 'SIGN_UP_PENDING', title: '报名-待处理'},
  {value: 'SIGN_UP_NO_INTENTION', title: '报名-无意愿'},

  /**面试 */
  {value: 'INTERVIEW_PENDING', title: '面试-待处理'},
  {value: 'INTERVIEW_NO_ARRIVE', title: '面试-未去面试'},
  {value: 'INTERVIEW_FAIL', title: '面试-未通过'},

  /**入职 */
  {value: 'ON_BOARDING_PENDING', title: '入职-待处理'},
  {value: 'ON_BOARDING_FAIL', title: '入职-未报到'},

  /**在离职 */
  {value: 'JOB_ON', title: '在职'},
  {value: 'JOB_RESIGN', title: '离职'}
];

export const MESSAGE_TYPE = [
  { label: '公告', value: 'ANNOUNCEMENT' },
  { label: '通知', value: 'ADMIN' },
  { label: '离职提醒', value: 'INNER_JOB_NOTIFICATION' },
  { label: '回访提醒', value: 'INNER_VISIT_NOTIFICATION' },
  { label: '系统消息', value: 'INNER_SYSTEM_MESSAGE' },
];

export const AUDIT_TYPE = {
  'PENDING': '待审核',
  'PASS': '通过',
  'FAIL': '拒绝'
};

/**颜色列表 */
export const COLOR_LIST = [
  '#409EFF',
  '#7640FF',
  '#FF4348',
  '#1cd66c'
];

export const PERCENT_COLOR_LIST = [
  '#FFB20E',
  '#FD8F52',
  '#FF4348',
  '#B665DB',
  '#FAC9D3',
  '#DEDDFF',
  '#1EA2F0',
  '#20D5DA',
  '#00F294',
  '#ACFCFF',
  '#FFCC69'
];