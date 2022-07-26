import { createSlice } from '@reduxjs/toolkit';
import moment from 'moment';

export const rangeDateOfList = createSlice({
  name: 'rangeDate',
  initialState: {
    startDate: moment(),
    endDate: moment()
  },
  reducers: {
    setStartDate: (state, {payload}) => {
      state.startDate = payload;
    },
    setEndDate: (state, {payload}) => {
      state.endDate = payload;
    }
  }
});

export const { setStartDate, setEndDate } = rangeDateOfList.actions;

export default rangeDateOfList.reducer;