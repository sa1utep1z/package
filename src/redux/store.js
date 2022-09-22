import { configureStore } from '@reduxjs/toolkit';

import listHeaderSearchReducer from './features/listHeaderSearch';
import RangeDateOfListReducer from './features/RangeDateOfList';
import homeSearchReducer from './features/homeSearch';
import RoleSwitchReducer from './features/RoleSwitch';
import NowSelectTabNameInListReducer from './features/NowSelectTabNameInList';
import RoleInfoReducer from './features/RoleInfo';
import HireReportDialogReducer from './features/HireReport/HireReportDialog';
import PageDialogReducer from './features/PageDialog';
import MemberInfoReducer from './features/MemberInfo';

export default configureStore({
  reducer: {
    listHeaderSearch: listHeaderSearchReducer, //名单顶部开关
    RangeDateOfList: RangeDateOfListReducer, //名单顶部时间筛选
    homeSearch: homeSearchReducer, //首页顶部开关
    roleSwitch: RoleSwitchReducer, //顶部状态栏角色状态
    nowSelectTabNameInList: NowSelectTabNameInListReducer, //名单中目前选择的Tab栏
    roleInfo: RoleInfoReducer, //登录应用保存的角色信息
    HireReportDialog: HireReportDialogReducer, //招聘看板中的悬浮窗
    PageDialog: PageDialogReducer, //所有页面的悬浮窗
    MemberInfo: MemberInfoReducer, //登陆人信息
  },
  
  //解决redux更新数据无法传入Moment的问题；
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: false,
    })
})