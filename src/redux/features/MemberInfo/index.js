import { createSlice } from '@reduxjs/toolkit';

export const memberInfo = createSlice({
  name: 'memberInfo',
  initialState: {
    memberInfo: {
      name: '无',
      store: '无'
    }
  },
  reducers: {
    setMemberInfo: (state, {payload}) => {
      state.memberInfo = payload;
    }
  }
});

export const { setMemberInfo } = memberInfo.actions;

export default memberInfo.reducer;