import { createSlice } from '@reduxjs/toolkit';

export const listHeaderSearch = createSlice({
  name: 'search',
  initialState: {
    canSearch: false
  },
  reducers: {
    openListSearch: (state) => {
      state.canSearch = true;
    },
    closeListSearch: (state) => {
      state.canSearch = false;
    }
  }
});

export const { openListSearch, closeListSearch } = listHeaderSearch.actions;

export default listHeaderSearch.reducer;