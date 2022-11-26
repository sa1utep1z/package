import moment from "moment";

export const SUCCESS_CODE = 0;

//今天
export const today = moment().format('YYYY-MM-DD');
export const TODAY = moment().format('YYYY-MM-DD');
//昨日
export const YESTERDAY = moment().subtract(1, 'day').format('YYYY-MM-DD');
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
export const LAST_MONTH_START = moment().subtract(1, 'month').startOf('month').format('YYYY-MM-DD');
//上月结束
export const LAST_MONTH_END = moment().subtract(1, 'month').endOf('month').format('YYYY-MM-DD');

export const FAKE_MEMBER_INFO = [
  { type: 'name', title: '姓名', value: '呵呵' },
  { type: 'IDCard', title: '身份证', value: '478523694562315964' },
  { type: 'phone', title: '手机号', value: '18088889999' },
  { type: 'jobName', title: '职位名称', value: '南山爱普生' },
  { type: 'jobFrom', title: '职位来源', value: '门店录入' },
  { type: 'belongOfPeople', title: '经纪人', value: '张三（18088879996）' },
  { type: 'belongOfStore', title: '归属门店', value: '新媒体店' },
  { type: 'signUpState', title: '报名状态', value: '待处理' },
  { type: 'theWayToArrive', title: '到厂方式', value: '门店集合' },
  { type: 'handleTime', title: '处理时间', value: moment().format('YYYY-MM-DD HH:mm:ss') },
  { type: 'remark', title: '备注', value: '门店集合' },
  { type: 'isStay', title: '是否住宿', value: '否' }
];

export const ADVANCE_INFO = [
  { type: 'userName', title: '会员姓名', value: '' },
  { type: 'idNo', title: '身份证号', value: '' },
  { type: 'mobile', title: '手机号码', value: '' },
  { type: 'companyShortName', title: '企业名称', value: '' },
  { type: 'jobName', title: '订单名称', value: '南山爱普生' },
  { type: 'jobFrom', title: '渠道来源', value: '门店录入' },
  { type: 'belongOfPeople', title: '招聘员', value: '张三' },
  { type: 'belongOfStore', title: '归属门店', value: '新媒体店' },
  { type: 'jobOn', title: '在职状态', value: '' },
  { type: 'jobDate', title: '入职日期', value: '' },
  { type: 'momney', title: '借支金额', value: '' },
  { type: 'content', title: '银行名称', value: '' },
  { type: 'imgs', title: '银行卡号', value: '' },
  { type: 'createdDate', title: '提交时间', value: '' },
];

export const COMPLAINT_INFO = [
  { type: 'type', title: '问题类型', value: '' },
  { type: 'userName', title: '会员姓名', value: '' },
  { type: 'idNo', title: '身份证号', value: '' },
  { type: 'mobile', title: '手机号码', value: '' },
  { type: 'companyShortName', title: '企业名称', value: '' },
  { type: 'jobOn', title: '是否在职', value: '' },
  { type: 'jobDate', title: '入职日期', value: '' },
  { type: 'createdDate', title: '反馈时间', value: '' },
  { type: 'content', title: '反馈内容', value: '' },
  { type: 'imgs', title: '上传照片', value: [] },
];
export const ARRIVE_WAY = [
  { id: 1, title: '自行到厂', value: 'byHimself' },
  { id: 2, title: '门店集合', value: 'unifyAssemble' }
];

//渠道来源
export const CHANEL_SOURCE_LIST = [
  { id: 1, title: '自主报名', value: 'SELF' },
  { id: 2, title: '门店录入', value: 'RECRUITER' },
  { id: 3, title: '供应商', value: 'SUPPLIER' },
  { id: 4, title: '会员推荐', value: 'MEMBER_RECOMMEND' }
];

//渠道来源对应的名字；
export const CHANEL_SOURCE_NAME = {
  'SELF': '自主报名',
  'RECRUITER': '门店录入',
  'SUPPLIER': '供应商',
  'MEMBER_RECOMMEND': '会员推荐',
};

export const HANDLE_STATE = [
  { title: '待处理', value: 'waitToHandle' },
  { title: '考虑中', value: 'considering' },
  { title: '未通过', value: 'notPass' },
  { title: '已通过', value: 'isPassed' }
];

// 报名名单的初始状态列表
export const DEFAULT_STATUS_LIST_OF_SIGN_UP_LIST = [
  { value: 'shenjingbing', title: '精神异常' },
  { value: 'noIDCard', title: '无身份证' },
  { value: 'youwenshen', title: '纹身不过' },
  { value: 'giveup', title: '现场放弃' },
  { value: 'failedExam', title: '考试不过' }
];

// 待入职未报到原因
export const DEFAULT_ONBORADINGSTATUS = [
  { value: 'unContact', title: '联系不上' },
  { value: 'giveUp', title: '放弃入职' },
  { value: 'busy', title: '临时有事' },
];

// 在离职原因
export const DEFAULT_JOBSTATUS = [
  { value: 'resignation', title: '辞职' },
  { value: 'selfDissociation', title: '自离' },
  { value: 'factoryDismissal', title: '工厂开除' },
  { value: 'giveUp', title: '放弃入职' },
  { value: 'worker', title: '工期满转正' },
];

// 面试名单的初始状态列表
export const DEFAULT_STATUS_LIST_OF_INTERVIEW_LIST = [
  { value: 'giveUp', title: '现场放弃' },
  { value: 'failInMedical', title: '体检不过' },
  { value: 'haveWenShen', title: '纹身不过' },
  { value: 'failedInExam', title: '考试不过' },
  { value: 'failInComprehensiveExam', title: '综合考试不过' }
];

// 预支审核拒绝原因
export const ADVANCE_RESONE = [
  { value: '该企业不借支', title: '该企业不借支' },
  { value: '不符合借支条件', title: '不符合借支条件' },
  { value: '发薪当周不借支', title: '发薪当周不借支' },
  { value: '入职不满出勤天数', title: '入职不满出勤天数' },
];

export const TAB_OF_LIST = {
  SIGN_UP_LIST: [
    { title: '全部', type: 'total', },
    { title: '待处理', type: 'pending', },
    { title: '无意愿', type: 'noIntention', },
    { title: '已报名', type: 'intention', }
  ],
  INTERVIEW_LIST: [
    { title: '全部', type: 'total' },
    { title: '待处理', type: 'pending' },
    { title: '未面试', type: 'noArrive' },
    { title: '未通过', type: 'fail' },
    { title: '已通过', type: 'pass' }
  ],
  WAIT_TO_ENTRY_LIST: [
    { title: '全部', type: 'total' },
    { title: '待处理', type: 'pending' },
    { title: '未报到', type: 'fail' },
    { title: '已入职', type: 'pass' }
  ],
  LEAVING_LIST: [
    { title: '全部', type: 'total' },
    { title: '离职', type: 'resign' },
    { title: '在职', type: 'on' }
  ],
  NEWEST_STATE: [
    { title: '姓名', type: 'name' },
    { title: '企业', type: 'enterprise' },
    { title: '两卡', type: 'twoCard' },
    { title: '打卡记录', type: 'record' },
    { title: '状态', type: 'status' },
    { title: '来源', type: 'from' }
  ],
  MY_MEMBERS: [
    { title: '全部', type: 'allNums' },
    { title: '待回访', type: 'preparingNums' },
    { title: '有意愿', type: 'haveWillNums' },
    { title: '无意愿', type: 'noWillNums' }
  ],
  ORDER_MANAGE: [
    { title: '全部', type: 'total' },
    { title: '招聘中', type: 'ifShelf' },
    { title: '停招', type: 'unShelf' }
  ],
  COMPLAINT_LIST: [
    { title: '全部', type: 'total' },
    { title: '待处理', type: 'PREPARING' },
    { title: '处理中', type: 'PROCESSING' },
    { title: '已结案', type: 'END' },
  ],
  ADVANCE_LIST: [
    { title: '全部', type: 'allNums' },
    { title: '审核中', type: 'pendingNums' },
    { title: '拒绝', type: 'failNums' },
    { title: '通过', type: 'passNums' }
  ],
};

export const CHANGING_STAGE_LIST_IN_DIALOG = [
  {
    title: '报名', value: 'SIGN_UP_PENDING', statusList: [
      { title: '已报名', value: 'SIGN_UP_INTENTION' },
      {
        title: '无意向', value: 'SIGN_UP_NO_INTENTION', reasonList: [
          { title: '精神异常', value: 'jingshenbing' },
          { title: '无身份证', value: 'noIDCard' },
          { title: '大花臂', value: 'bigFlowerHand' },
          { title: '有案底', value: 'inPrison' },
          { title: '在外地', value: 'out' }
        ]
      }
    ]
  },
  {
    title: '面试', value: 'INTERVIEW_PENDING', statusList: [
      { title: '通过', value: 'INTERVIEW_PASS' },
      {
        title: '未通过', value: 'INTERVIEW_FAIL', reasonList: [
          { title: '现场放弃', value: 'giveUp' },
          { title: '身份证过期', value: 'IDCardOutDate' },
          { title: '精神异常', value: 'jingshenbing' },
          { title: '纹身不过', value: 'haveWenShen' },
          { title: '联系不上', value: 'unconnected' },
          { title: '考试不过', value: 'failInExam' },
          { title: '体检不过', value: 'failInPhysical' }
        ]
      },
      {
        title: '未面试', value: 'INTERVIEW_NO_ARRIVE', reasonList: [
          { title: '现场放弃', value: 'giveUp' },
          { title: '身份证过期', value: 'IDCardOutDate' },
          { title: '精神异常', value: 'jingshenbing' },
          { title: '纹身不过', value: 'haveWenShen' },
          { title: '联系不上', value: 'unconnected' },
          { title: '考试不过', value: 'failInExam' },
          { title: '体检不过', value: 'failInPhysical' }
        ]
      }
    ]
  },
  {
    title: '待入职', value: 'ON_BOARDING_PENDING', statusList: [
      { title: '已入职', value: 'ON_BOARDING_PASS' },
      {
        title: '未报到', value: 'ON_BOARDING_FAIL', reasonList: [
          { title: '联系不上', value: 'unconnected' },
          { title: '放弃入职', value: 'giveUpJob' },
          { title: '临时有事', value: 'haveSomething' }
        ]
      }
    ]
  },
  {
    title: '离职', value: 'JOB_RESIGN', reasonList: [
      { title: '辞职', value: 'resign' },
      { title: '自离', value: 'selfLeave' },
      { title: '工期满转正', value: 'positive' },
      { title: '工厂开除', value: 'fired' },
      { title: '放弃入职', value: 'giveUp' }
    ]
  },
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

export const NEWEST_STATE_KEY = [
  { title: '报名-待处理', value: 'SIGN_UP_PENDING', id: 1}, 
  { title: '报名-无意向', value: 'SIGN_UP_NO_INTENTION', id: 2},
  { title: '报名-已报名', value: 'SIGN_UP_INTENTION', id: 3},
  { title: '面试-待处理', value: 'INTERVIEW_PENDING', id: 4},
  { title: '面试-通过', value: 'INTERVIEW_PASS', id: 5},
  { title: '面试-未去面试', value: 'INTERVIEW_NO_ARRIVE', id: 6 },
  { title: '面试-未通过', value: 'INTERVIEW_FAIL', id: 7 },
  { title: '入职-待处理', value: 'ON_BOARDING_PENDING', id: 8},
  { title: '入职-未报到', value: 'ON_BOARDING_FAIL', id: 9 },
  { title: '入职-已入职', value: 'ON_BOARDING_PASS', id: 10 },
  { title: '在职', value: 'JOB_ON', id: 11},
  { title: '离职', value: 'JOB_RESIGN', id: 12 },
];

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

export const TYPERESULT = [
  { title: '薪资问题', value: 'SALARY', id: 1 },
  { title: '借支问题', value: 'BORROW', id: 2 },
  { title: '驻厂问题', value: 'RESIDENTIAL', id: 3 },
  { title: '投诉问题', value: 'COMPLAINT', id: 4 },
  { title: '宿舍问题', value: 'DORMITORY', id: 5 },
];

export const JOB_ON_Result = [
  { title: '在职', value: 'JOB_ON', id: 1 },
  { title: '离职', value: 'JOB_RESIGN', id: 2 },
];

export const ADVANCERESULT = [
  { title: '审核中', value: 'PENDING', id: 1 },
  { title: '拒绝', value: 'FAIL', id: 2 },
  { title: '通过', value: 'PASS', id: 3 },
  { title: '撤回', value: 'CANCEL', id: 4 },
  { title: '废弃', value: 'INVALID', id: 5 },
];

export const BANCKWAY = [
  { title: '放款方式-银行卡', value: 'PAYMENT_BANK', id: 1 },
  { title: '放款方式-无卡发薪', value: 'PAYMENT_NO_CARD', id: 2 },
];

export const STATUSRESULT = [
  { title: '待处理', value: 'PREPARING', id: 1 },
  { title: '处理中', value: 'PROCESSING', id: 2 },
  { title: '已结案', value: 'END', id: 3 },
];
export const SOURCETYPES = [
  { title: '后台导入', value: 'IMPORT', id: 1 },
  { title: '游客关注', value: 'VISITOR', id: 2 },
  { title: '招聘员录入', value: 'INPUT', id: 3 },
  { title: '供应商导入', value: 'SUPPLIER', id: 4 },
  { title: '分享裂变', value: 'SHARE', id: 5 },
];

export const ISEND = [
  { label: '是', value: true, id: 1 },
  { label: '否', value: false, id: 2 },
];

export const STATUS_LIST = [
  { title: '全部', value: '', id: 1 },
  { title: '无', value: 'none', id: 2 },
  { title: '报名-无意向', value: 'sign_up_no_intention', id: 3 },
  { title: '面试-未去面试', value: 'interview_no_arrive', id: 4 },
  { title: '面试-未通过', value: 'interview_fail', id: 5 },
  { title: '入职-未报到', value: 'on_boarding_fail', id: 6 },
  { title: '在职', value: 'job_on', id: 7 },
  { title: '预离职', value: 'prepare_job_resign', id: 8 },
  { title: '离职', value: 'job_resign', id: 9 }
];

export const COMPANY_SHIFT = [
  { label: '长白班', value: 'SHIFT_CATEGORY_LONG', checked: false },
  { label: '两班倒', value: 'SHIFT_CATEGORY_TWO', checked: false },
  { label: '三班倒', value: 'SHIFT_CATEGORY_THREE', checked: false },
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
  { label: '自己衣服', value: 'DRESS_OWN' },
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
export const MICROSCOPE = [
  { label: '看', value: 'MICROSCOPE_SEE' },
  { label: '不看', value: 'MICROSCOPE_NOT_SEE' },
  { label: '都有', value: 'ALL_HAVE' },
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
export const RETURNFACTORY = [
  { label: '不要返厂', value: 'RETURN_FACTORY_NOT' },
  { label: '返厂可去', value: 'RETURN_FACTORY' },
  { label: '有条件返厂可去', value: 'RETURN_FACTORY_CONDITION' },
];
export const COMPANYNATIONALITY = [
  { label: '不限', value: 'NATIONALITY_UNLIMITED' },
  { label: '只要汉族', value: 'NATIONALITY_ONLY_HAN' },
  { label: '除四大名族可去', value: 'NATIONALITY_EXCLUDE_FOUR' },
];
export const BACKGROUND = [
  { label: '案底能去', value: 'BACKGROUND_UNLIMITED' },
  { label: '案底不能去', value: 'BACKGROUND_LIMIT' },
];
export const STUDENTPROVE = [
  { label: '不查证明', value: 'STUDENT_PROVE_NOT_CHECK' },
  { label: '严查证明', value: 'STUDENT_PROVE_SEVERE_CHECK' },
];
export const COMPANY_SCALE = [
  { id: 1, title: '0-500人', value: 'SCALE_FIRST' },
  { id: 2, title: '501-1000人', value: 'SCALE_SECOND' },
  { id: 3, title: '1001-3000人', value: 'SCALE_THIRD' },
  { id: 4, title: '3001-5000人', value: 'SCALE_FOURTH' },
  { id: 5, title: '5000人以上', value: 'SCALE_FIFTH' },
];
export const ADVANCE_AMOUNT = [
  { id: 1, title: '100', value: '100' },
  { id: 2, title: '200', value: '200' },
  { id: 3, title: '300', value: '300' },
  { id: 4, title: '400', value: '400' },
  { id: 5, title: '500', value: '500' },
];
export const COMPANY_TYPE = [
  { id: 1, title: 'A', value: 'TYPE_A' },
  { id: 2, title: 'B', value: 'TYPE_B' },
  { id: 3, title: 'C', value: 'TYPE_C' },
];
export const COMPANY_INDUSTRY = [
  { id: 1, title: '制造业', value: 'INDUSTRY_MANUFACTURE' },
  { id: 2, title: '食品业', value: 'INDUSTRY_FOOD' },
  { id: 3, title: '服务业', value: 'INDUSTRY_SERVE' },
];
export const STATUS_LISTS = [
  { title: '报名-无意向', value: 'sign_up_no_intention', id: 1 },
  { title: '面试-未去面试', value: 'interview_no_arrive', id: 2 },
  { title: '面试-未通过', value: 'interview_fail', id: 3 },
  { title: '入职-未报到', value: 'on_boarding_fail', id: 4 },
  { title: '在职', value: 'job_on', id: 5 },
  { title: '预离职', value: 'prepare_job_resign', id: 6 },
  { title: '离职', value: 'job_resign', id: 7 }
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

//到厂方式；
export const WAY_TO_GO = [
  { label: '自行到厂', value: 'FACTORY' },
  { label: '门店集合', value: 'STORE' },
];

//到厂方式；
export const WAY_TO_GO_NAME = {
  'FACTORY': '自行到厂',
  'STORE': '门店集合'
};

export const NEWEST_STATE_LIST_HEAD = [
  { title: '姓名' },
  { title: '企业' },
  { title: '两卡' },
  { title: '打卡记录' },
  { title: '状态' },
  { title: '来源' }
];

export const ADVANCE_STATE_LIST_HEAD = [
  { title: '姓名' },
  { title: '企业' },
  { title: '门店' },
  { title: '金额' },
  { title: '状态' },
  { title: '来源' }
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
  { key: 'supplier', title: '供应商' },
  { key: 'way', title: '渠道' }
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
  { value: 'signUpIntention', title: '已报名' },
  { value: 'interviewPass', title: '面试通过' },
  { value: 'onBoardingPass', title: '入职' }
];

export const ORIGIN_COMPARE_STATUS_LIST = [
  { value: 'onBoardingPass', title: '入职' }
];

export const CHART_STATUS_LIST = [
  { value: 'signUp', title: '报名邀约' },
  { value: 'signUpIntention', title: '已报名' },
  { value: 'interviewNoArrive', title: '面试未去' },
  { value: 'interviewFail', title: '面试未过' },
  { value: 'interviewPass', title: '面试通过' },
  { value: 'onBoardingFail', title: '未报到' },
  { value: 'onBoardingPass', title: '入职' },
  { value: 'resignNum', title: '离职' }
];

export const PERCENT_CHART_STATUS_LIST = [
  /**报名 */
  { value: 'SIGN_UP_PENDING', title: '报名-待处理' },
  { value: 'SIGN_UP_NO_INTENTION', title: '报名-无意愿' },

  /**面试 */
  { value: 'INTERVIEW_PENDING', title: '面试-待处理' },
  { value: 'INTERVIEW_NO_ARRIVE', title: '面试-未去面试' },
  { value: 'INTERVIEW_FAIL', title: '面试-未通过' },

  /**入职 */
  { value: 'ON_BOARDING_PENDING', title: '入职-待处理' },
  { value: 'ON_BOARDING_FAIL', title: '入职-未报到' },

  /**在离职 */
  { value: 'JOB_ON', title: '在职' },
  { value: 'JOB_RESIGN', title: '离职' }
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
  'FAIL': '拒绝',
  'CANCEL': '撤销'
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

//渲染水印的数组大；
export const WATERMARK_LIST = [
  1, 0, 1, 0, 0, 1, 0, 1,
  1, 0, 1, 0, 0, 1, 0, 1,
  1, 0, 1, 0, 0, 1, 0, 1,
  1, 0, 1, 0, 0, 1, 0, 1,
  1, 0, 1, 0, 0, 1, 0, 1,
  1, 0, 1, 0, 0, 1, 0, 1,
  1, 0, 1, 0, 0, 1, 0, 1,
  1, 0, 1, 0, 0, 1, 0, 1,
  1, 0, 1, 0, 0, 1, 0, 1,
  1, 0, 1, 0, 0, 1, 0, 1
];

//渲染水印的数组小；
export const WATERMARK_LIST_SMALL = [
  1, 0, 1, 0, 0, 1, 0, 1,
  1, 0, 1, 0, 0, 1, 0, 1,
  1, 0, 1, 0, 0, 1, 0, 1,
  1, 0, 1, 0, 0, 1, 0, 1
];

//渲染水印的数组更小；
export const WATERMARK_LIST_SMALLEST = [
  1, 0, 1, 0, 0, 1, 0, 1
];

//新建订单-岗位枚举值：
export const CREATE_ORDER_JOB_ORDER = [
  { label: '普工', value: 'GENERAL_WORKER' },
  { label: '技工', value: 'TECH_WORKER' },
  { label: '工程师', value: 'ENGINEER_WORKER' }
];

//新建订单-工种枚举值：
export const CREATE_ORDER_JOB_TYPE = [
  { label: '正式工', value: 'FORMAL_WORKER' },
  { label: '派遣工-小时工', value: 'DISPATCH_HOURLY_WORKER' },
  { label: '派遣工-同工同酬', value: 'DISPATCH_EQUAL_PAY' }
];

//新建订单-录用要求-性别枚举值：
export const FEMALE_LIMIT = [
  { label: '不限', value: 'UNLIMIT' },
  { label: '限制比例', value: 'LIMIT' }
];

//新建订单-招聘员提成说明-提成模式枚举值：
export const REWARD_MODE = [
  { label: '短线买断', value: 'STUB' },
  { label: '长线按天提成', value: 'LONG_LINE' }
];

//新建订单-接单政策说明-长短线：
export const SETTLEMENT_MODE = [
  { label: '短线', value: 'short' },
  { label: '长线', value: 'long' },
];

//新建订单-接单政策说明-范围周期：
export const SETTLEMENT_RANGE_MODE = [
  { label: '每月', value: 'month' },
  { label: '每周', value: 'week' },
];

//新建订单-接单政策说明-范围周期-月：
export const SETTLEMENT_RANGE_MONTH = [
  { label: '1号', value: 1, type: 'month' },
  { label: '2号', value: 2, type: 'month' },
  { label: '3号', value: 3, type: 'month' },
  { label: '4号', value: 4, type: 'month' },
  { label: '5号', value: 5, type: 'month' },
  { label: '6号', value: 6, type: 'month' },
  { label: '7号', value: 7, type: 'month' },
  { label: '8号', value: 8, type: 'month' },
  { label: '9号', value: 9, type: 'month' },
  { label: '10号', value: 10, type: 'month' },
  { label: '11号', value: 11, type: 'month' },
  { label: '12号', value: 12, type: 'month' },
  { label: '13号', value: 13, type: 'month' },
  { label: '14号', value: 14, type: 'month' },
  { label: '15号', value: 15, type: 'month' },
  { label: '16号', value: 16, type: 'month' },
  { label: '17号', value: 17, type: 'month' },
  { label: '18号', value: 18, type: 'month' },
  { label: '19号', value: 19, type: 'month' },
  { label: '20号', value: 20, type: 'month' },
  { label: '21号', value: 21, type: 'month' },
  { label: '22号', value: 22, type: 'month' },
  { label: '23号', value: 23, type: 'month' },
  { label: '24号', value: 24, type: 'month' },
  { label: '25号', value: 25, type: 'month' },
  { label: '26号', value: 26, type: 'month' },
  { label: '27号', value: 27, type: 'month' },
  { label: '28号', value: 28, type: 'month' },
  { label: '29号', value: 29, type: 'month' },
  { label: '30号', value: 30, type: 'month' },
  { label: '31号', value: 31, type: 'month' },
];

//新建订单-接单政策说明-范围周期-周：
export const SETTLEMENT_RANGE_WEEK = [
  { label: '周日', value: 1, type: 'week' },
  { label: '周一', value: 2, type: 'week' },
  { label: '周二', value: 3, type: 'week' },
  { label: '周三', value: 4, type: 'week' },
  { label: '周四', value: 5, type: 'week' },
  { label: '周五', value: 6, type: 'week' },
  { label: '周六', value: 7, type: 'week' },
];

//新建订单-接单政策说明-回款方式：
export const RETURN_WAY_LIST = [
  { label: '对公', value: 'PUBLIC' },
  { label: '对私', value: 'PRIVATE' },
];

//新建订单-接单政策说明-接单费用标准-模式：
export const SHORT_LINE_STANDARDS_MODE = [
  { label: '打卡满（小时）', value: 'var-punch-hour' },
  { label: '在职满（小时）', value: 'var-work-hour' },
  { label: '打卡满（天）', value: 'var-punch-day' },
  { label: '在职满（天）', value: 'var-work-day' },
];

//新建订单-招聘员提成说明-条件设置枚举值：
export const CONDITIONS_LIST = [
  { value: 'var-punch-day', label: '打卡满', type: 'punch_day' },
  { value: 'var-work-day', label: '在职满', type: 'work_day' }
];

//新建订单-会员工价详情-借支类型枚举值：
export const SALARY_TYPE = [
  { label: '日借支', value: 'DAILY' },
  { label: '周借支', value: 'WEEKLY' },
  { label: '月借支', value: 'MONTHLY' },
  { label: '无借支', value: 'NONE' }
];

//新建订单-会员工价详情-就餐枚举值：
export const FOOD_LIST = [
  { label: '免费工作餐', value: 'FOOD_FREE' },
  { label: '三餐包吃', value: 'FOOD_THREE_INCLUDE' },
  { label: '刷卡吃饭', value: 'FOOD_SWIPE' },
  { label: '自费吃饭', value: 'FOOD_OWN' },
];

//新建订单-会员工价详情-住宿枚举值：
export const DORMITORY_LIST = [
  { label: '住宿免费', value: 'DORMITORY_FREE' },
  { label: '住宿扣费', value: 'DORMITORY_NOT_FREE' },
  { label: '无住宿', value: 'NOT_DORMITORY' }
];

//新建订单-会员工价详情-住宿枚举值：
export const WATER_FEE_LIST = [
  { label: '不扣费', value: 'NODEDUCTION' },
  { label: '超额扣费', value: 'EXCESSDEDUCTION' },
  { label: '房间均摊', value: 'ROOMSHARING' },
  { label: '全员均摊', value: 'WHOLESHARING' },
  { label: '定额均摊', value: 'QUOTASHARING' }
];

//新建订单-会员工价详情-模式枚举值：
export const MODE_LIST = [
  { label: '纯工价', value: 'WAGE' },
  { label: '满自然月', value: 'MONTH' },
  { label: '发薪日在职', value: 'PAYDAY' },
  { label: '同工同酬+返费', value: 'REBATE_WAGE' },
  { label: '同工同酬+补差价', value: 'SPREAD_WAGE' },
  { label: '满工期', value: 'DURATION' },
  { label: '其他', value: 'OTHER' }
];

//新建订单-会员工价详情- 区分男女枚举值：
export const MALE_OR_FEMALE = [
  { label: '不区分男女', value: 'NOT_DISTINGUISH' },
  { label: '区分男女', value: 'DISTINGUISH' }
];

//新建订单-会员工价详情-工价/底薪-模式枚举值：
export const MEMBER_FEE_MODE = [
  { label: '纯', value: 'PURE' },
  { label: '是否在职', value: 'WORKING' },
  { label: '打卡是否满（单位：天）', value: 'CARD_DAY' },
  { label: '打卡是否满（单位：时）', value: 'CARD_HOUR' },
  { label: '在职是否满（单位：天）', value: 'WORKING_DAY' },
  { label: '在职是否满（单位：时）', value: 'WORKING_HOUR' }
];

//新建订单-会员工价详情-工价模式枚举值：
export const FEE_WAY_MODE = {
  wagesAndSalary: [
    { label: '工价', value: 'WAGE' },
    { label: '底薪', value: 'BASIC_SALARY' },
    { label: '日薪', value: 'DAY_SALARY' },
    { label: '日结', value: 'DAY_SETTLEMENT' }
  ],
  differenceAndReturnMoney: [
    { label: '返费', value: 'REBATE' },
    { label: '差价', value: 'SPREAD' },
    { label: '补足', value: 'FILL' },
    { label: '补贴', value: 'SUBSIDY' },
    { label: '稳岗', value: 'STABLE' }
  ]
};

export const FEE_WAY_NAME = {
  'WAGE': '元/小时',
  'BASIC_SALARY': '元/月',
  'DAY_SALARY': '元/天',
  'DAY_SETTLEMENT': '元/天',

  'REBATE': '元',
  'SPREAD': '元/小时',
  'FILL': '元/小时',
  'SUBSIDY': '元/小时',
  'STABLE': '元/小时'
};

//订单管理-页面-工种；
export const WORK_TYPE_NAME = {
  'FORMAL_WORKER': '正式工',
  'DISPATCH_HOURLY_WORKER': '小时工', //派遣工-小时工
  'DISPATCH_EQUAL_PAY': '正式工' //派遣工-同工同酬
};

//退宿原因；
export const DORMITORY_LEAVE_REASON = [
  {label: '离职退宿', value: 'DORM_LIVE_OUT_RESIGN'},
  {label: '临时住宿退宿', value: 'DORM_LIVE_OUT_TEMPORARY'},
  {label: '违纪取消床位', value: 'DORM_LIVE_OUT_VIOLATE'},
  {label: '个人外租退宿', value: 'DORM_LIVE_OUT_PERSONAL'}
];

//在离宿名单-入住类别-枚举；
export const DORMITORY_STAY_TYPE = [
  {label: '全部', value: ''},
  {label: '常规住宿', value: 'DORM_ROUTINE'},
  {label: '临时住宿', value: 'DORM_TEMPORARY'},
];

//入住类别；
export const DORMITORY_LIVE_TYPE = [
  {label: '常规住宿', value: 'DORM_ROUTINE'},
  {label: '临时住宿', value: 'DORM_TEMPORARY'},
];

//男女宿舍；
export const DORMITORY_TYPE_NAME = {
  DORM_MALE: '男',
  DORM_FEMALE: '女'
};

//宿舍分类；
export const DORMITORY_TYPE = [
  {label: '男生宿舍', value: 'DORM_MALE'},
  {label: '女生宿舍', value: 'DORM_FEMALE'},
];

//宿舍分类（包括ALL）；
export const DORMITORY_ALL_TYPE = [
  {label: '全部', value: 'ALL'},
  {label: '男生宿舍', value: 'DORM_MALE'},
  {label: '女生宿舍', value: 'DORM_FEMALE'},
];

//宿舍卫生状况；
export const DORMITORY_HYGIENE_LIST = [
  {label: '合格', value: 'pass'},
  {label: '不合格', value: 'fail'},
];

//宿舍设施状况；
export const DORMITORY_FACILITY_LIST = [
  {label: '正常', value: 'normal'},
  {label: '维修中', value: 'fixing'},
  {label: '损坏', value: 'broken'},
  {label: '丢失', value: 'missing'},
];

//入住类别；
export const PROPERTY_STATUS_LIST = [
  {label: '正常', value: 'normal'},
  {label: '损坏', value: 'broken'},
  {label: '维修中', value: 'fixing'},
];

//违纪类别；
export const VIOLATION_TYPE_LIST = [
  {label: '违规使用大功率电器', value: 'useHighPowerElectricalAppliance'},
  {label: '私拉乱接电线', value: 'connectWiresWithoutPermission'},
  {label: '恶意损坏宿舍物品', value: 'brokeDormitoryThing'},
  {label: '宿舍打架斗殴', value: 'fightInDormitory'},
  {label: '私藏管制刀具', value: 'carryKnife'},
  {label: '私自闯入异性宿舍', value: 'breakingIntoFemaleDormitory'}, //女性不大可能闯入男性宿舍吧-v-
  {label: '违规带外人留宿', value: 'carryOtherPeopleIntoDormitory'},
  {label: '其他', value: 'otherReason'},
];

//违纪类别；
export const PUNISH_RESULT = [
  {label: '警告', value: 'warning'},
  {label: '二次警告', value: 'warningTwoSecond'},
  {label: '取消住宿', value: 'cancelLiving'},
];

//房间类型；
export const ROOM_TYPE_LIST = [
   {label: '空房间', color: '#2BE211', value: 'emptyRoom'},
   {label: '未住满', color: '#FAF005', value: 'notFull'},
   {label: '已住满', color: '#ED0F0F', value: 'full'},
   {label: '维修中/占用中', color: '#999999', value: 'occupying'},
];

//房间类型对应颜色；
export const ROOM_TYPE_COLOR = [
  '#2BE211', '#FAF005', '#ED0F0F', '#999999', '#999999',
];
