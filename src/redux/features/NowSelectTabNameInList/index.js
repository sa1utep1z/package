import { createSlice } from '@reduxjs/toolkit';

export const nowSelectTabNameInList = createSlice({
  name: 'selectTabName',
  initialState: {
    tabName: ''
  },
  reducers: {
    setTabName: (state, {payload}) => {
      state.tabName = payload;
    }
  }
});

export const { setTabName } = nowSelectTabNameInList.actions;

export default nowSelectTabNameInList.reducer;