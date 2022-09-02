import { createSlice } from '@reduxjs/toolkit';
import moment from 'moment';

export const RangeDateOfTrend = createSlice({
  name: 'RangeDateOfTrend',
  initialState: {
    startDate: moment().weekday(0).format('YYYY-MM-DD'),
    endDate: moment().weekday(6).format('YYYY-MM-DD')
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

export const { setStartDate, setEndDate } = RangeDateOfTrend.actions;

export default RangeDateOfTrend.reducer;