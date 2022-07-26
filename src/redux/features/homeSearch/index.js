import { createSlice } from '@reduxjs/toolkit';

export const homeSearch = createSlice({
  name: 'homeSearch',
  initialState: {
    canSearch: false
  },
  reducers: {
    openHomeSearch: (state) => {
      state.canSearch = true;
    },
    closeHomeSearch: (state) => {
      state.canSearch = false;
    }
  }
});

export const { openHomeSearch, closeHomeSearch } = homeSearch.actions;

export default homeSearch.reducer;