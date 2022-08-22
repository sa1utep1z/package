import { createSlice } from '@reduxjs/toolkit';

export const roleInfo = createSlice({
  name: 'roleInfo',
  initialState: {
    roleInfo: []
  },
  reducers: {
    setRoleInfo: (state, {payload}) => {
      state.roleInfo = payload;
    }
  }
});

export const { setRoleInfo } = roleInfo.actions;

export default roleInfo.reducer;