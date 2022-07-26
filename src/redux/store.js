import { configureStore } from '@reduxjs/toolkit';

import listHeaderSearchReducer from './features/listHeaderSearch';
import userAuthorityReducer from './features/userAuthority';
import RangeDateOfListReducer from './features/RangeDateOfList';
import homeSearchReducer from './features/homeSearch';

export default configureStore({
  reducer: {
    listHeaderSearch: listHeaderSearchReducer,
    hasPermission: userAuthorityReducer,
    RangeDateOfList: RangeDateOfListReducer,
    homeSearch: homeSearchReducer
  },
  
  //解决redux更新数据无法传入Moment的问题；
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: false,
    })
})