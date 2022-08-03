import moment from "moment";

export const SUCCESS_CODE = 0;

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
  {title: '自行到厂', value: 'byHimself'},
  {title: '门店集合', value: 'unifyAssemble'}
];

export const HANDLE_STATE = [
  {title: '待处理', value: 'waitToHandle'},
  {title: '考虑中', value: 'considering'},
  {title: '未通过', value: 'notPass'},
  {title: '已通过', value: 'isPassed'}
];

export const DEFAULT_STATUS_LIST = [
  {value: 'shenjingbing' ,title: '精神异常'},
  {value: 'noIDCard', title: '无身份证'},
  {value: 'youwenshen', title: '纹身不过'},
  {value: 'giveup', title: '现场放弃'},
  {value: 'failedExam', title: '考试不过'}
];

export const TAB_OF_LIST = {
  SIGN_UP_LIST: [
    {title: '全部',type: 'all',},
    {title: '待处理',type: 'waitToHandle',},
    {title: '无意向',type: 'noIntention',},
    {title: '已报名',type: 'signedUp',}
  ],
  INTERVIEW_LIST: [
    {title: '全部',type: 'all'},
    {title: '待处理',type: 'waitToHandle'},
    {title: '未面试',type: 'notInterview'},
    {title: '未通过',type: 'notPass'},
    {title: '已通过',type: 'wasPass'}
  ],
  WAIT_TO_ENTRY_LIST: [
    {title: '全部',type: 'all'},
    {title: '待处理',type: 'waitToHandle'},
    {title: '未报道',type: 'notReport'},
    {title: '已入职',type: 'wasEntry'}
  ],
  LEAVING_LIST: [
    {title: '全部',type: 'all'},
    {title: '离职',type: 'leaved'},
    {title: '在职',type: 'working'}
  ],
  NEWEST_STATE: [
    {title: '姓名',type: 'name'},
    {title: '企业',type: 'enterprise'},
    {title: '两卡',type: 'twoCard'},
    {title: '状态',type: 'status'},
    {title: '打卡记录',type: 'record'},
    {title: '来源',type: 'from'}
  ],
  MY_MEMBERS: [
    {title: '全部', type: 'all'},
    {title: '待处理', type: 'waitToHandle'},
    {title: '无意向', type: 'noIntention'},
    {title: '已报名', type: 'signedUp'}
  ]
};

export const CHANGING_STAGE_LIST_IN_DIALOG = [
  {title: '报名', value: 'signUp', statusList: [
    {title: '已报名', value: 'wasSignedUp'},
    {title: '无意向', value: 'noThought', reasonList: [
      {title: '精神异常', value: 'jingshenbing'},
      {title: '无身份证', value: 'noIDCard'},
      {title: '大花臂', value: 'bigFlowerHand'},
      {title: '有案底', value: 'inPrison'},
      {title: '在外地', value: 'out'}
    ]}
  ]},
  {title: '面试', value: 'interview', statusList: [
    {title: '通过', value: 'pass'},
    {title: '未通过', value: 'failed', reasonList: [
      {title: '现场放弃', value: 'giveUp'},
      {title: '身份证过期', value: 'IDCardOutDate'},
      {title: '精神异常', value: 'jingshenbing'},
      {title: '纹身不过', value: 'haveWenShen'},
      {title: '联系不上', value: 'unconnected'},
      {title: '考试不过', value: 'failInExam'},
      {title: '体检不过', value: 'failInPhysical'}
    ]},
    {title: '未面试', value: 'notInterview', reasonList: [
      {title: '现场放弃', value: 'giveUp'},
      {title: '身份证过期', value: 'IDCardOutDate'},
      {title: '精神异常', value: 'jingshenbing'},
      {title: '纹身不过', value: 'haveWenShen'},
      {title: '联系不上', value: 'unconnected'},
      {title: '考试不过', value: 'failInExam'},
      {title: '体检不过', value: 'failInPhysical'}
    ]}
  ]},
  {title: '待入职', value: 'joinIn', statusList: [
    {title: '已入职', value: 'working'},
    {title: '未报到', value: 'notArrive', reasonList: [
      {title: '联系不上', value: 'unconnected'},
      {title: '临时有事', value: 'haveSomething'},
      {title: '放弃入职', value: 'giveUpJob'}
    ]}
  ]},
  {title: '离职', value: 'leave', reasonList: [
    {title: '辞职', value: 'resign'},
    {title: '自离', value: 'selfLeave'},
    {title: '工期满转正', value: 'positive'},
    {title: '工厂开除', value: 'fired'},
    {title: '放弃入职', value: 'giveUp'}
  ]},
];

export const SEAS_SOURCE_TYPE = {
  'IMPORT': '后台导入',
  'VISITOR': '游客关注',
  'INPUT': '招聘员录入',
  'SUPPLIER': '供应商导入',
  'SHARE': '分享裂变'
};

//我的会员-状态
export const MEMBERS_STATUS = {
  'SIGN_UP_NO_INTENTION': '无意向',
  'INTERVIEW_NO_ARRIVE': '未去面试',
  'INTERVIEW_FAIL': '未通过',
  'ON_BOARDING_FAIL': '未报到',
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
  {title: '全部', value: 'all', id: 1},
  {title: '空', value: 'null', id: 2},
  {title: '报名-无意向', value: 'sign_up_no_intention', id: 3},
  {title: '面试-未去面试', value: 'interview_no_arrive', id: 4},
  {title: '面试-未通过', value: 'interview_fail', id: 5},
  {title: '入职-未报到', value: 'on_boarding_fail', id: 6},
  {title: '在职', value: 'job_on', id: 7},
  {title: '预离职', value: 'prepare_job_resign', id: 8},
  {title: '离职', value: 'job_resign', id: 9}
]
 
export const COMPANY_SHIFT = [
  { label: '长白班', value: 'SHIFT_CATEGORY_LONG' },
  { label: '两班倒', value: 'SHIFT_CATEGORY_TWO' },
  { label: '三班倒', value: 'SHIFT_CATEGORY_THREE' },
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