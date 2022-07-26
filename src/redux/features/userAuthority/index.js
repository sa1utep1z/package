import { createSlice } from '@reduxjs/toolkit';

export const userAuthority = createSlice({
  name: 'user',
  initialState: {
    isAdministrators: true
  },
  reducers: {
    openPermission: (state) => {
      state.isAdministrators = true;
    },
    closePermission: (state) => {
      state.isAdministrators = false;
    }
  }
});

export const { openPermission, closePermission } = userAuthority.actions;

export default userAuthority.reducer;