import { createSlice } from '@reduxjs/toolkit';

export const roleSwitch = createSlice({
  name: 'roleSwitch',
  initialState: {
    role: 'RESIDENT'
  },
  reducers: {
    setRole: (state, {payload}) => {
      state.role = payload;
    }
  }
});

export const { setRole } = roleSwitch.actions;

export default roleSwitch.reducer;