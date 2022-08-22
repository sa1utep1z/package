import { configureStore } from '@reduxjs/toolkit';

import listHeaderSearchReducer from './features/listHeaderSearch';
import userAuthorityReducer from './features/userAuthority';
import RangeDateOfListReducer from './features/RangeDateOfList';
import homeSearchReducer from './features/homeSearch';
import RoleSwitchReducer from './features/RoleSwitch';
import NowSelectTabNameInListReducer from './features/NowSelectTabNameInList';
import RoleInfoReducer from './features/RoleInfo';

export default configureStore({
  reducer: {
    listHeaderSearch: listHeaderSearchReducer,
    hasPermission: userAuthorityReducer,
    RangeDateOfList: RangeDateOfListReducer,
    homeSearch: homeSearchReducer,
    roleSwitch: RoleSwitchReducer,
    nowSelectTabNameInList: NowSelectTabNameInListReducer,
    roleInfo: RoleInfoReducer
  },
  
  //解决redux更新数据无法传入Moment的问题；
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: false,
    })
})