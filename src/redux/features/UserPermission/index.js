import { createSlice } from '@reduxjs/toolkit';

export const UserPermission = createSlice({
  name: 'UserPermission',
  initialState: {
    permission: []
  },
  reducers: {
    setUserPermission: (state, {payload}) => {
      state.permission = payload;
    }
  }
});

export const { setUserPermission } = UserPermission.actions;

export default UserPermission.reducer;