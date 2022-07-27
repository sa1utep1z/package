import moment from "moment";

export const SUCCESS_CODE = 0;

export const MEMBER_INFO = [
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