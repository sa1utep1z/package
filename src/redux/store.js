import { configureStore } from '@reduxjs/toolkit';

import listHeaderSearchReducer from './features/listHeaderSearch';
import RangeDateOfListReducer from './features/RangeDateOfList';
import homeSearchReducer from './features/homeSearch';
import RoleSwitchReducer from './features/RoleSwitch';
import NowSelectTabNameInListReducer from './features/NowSelectTabNameInList';
import RoleInfoReducer from './features/RoleInfo';
import HireReportDialogReducer from './features/HireReport/HireReportDialog';

export default configureStore({
  reducer: {
    listHeaderSearch: listHeaderSearchReducer,
    RangeDateOfList: RangeDateOfListReducer,
    homeSearch: homeSearchReducer,
    roleSwitch: RoleSwitchReducer,
    nowSelectTabNameInList: NowSelectTabNameInListReducer,
    roleInfo: RoleInfoReducer,
    HireReportDialog: HireReportDialogReducer,
  },
  
  //解决redux更新数据无法传入Moment的问题；
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: false,
    })
})