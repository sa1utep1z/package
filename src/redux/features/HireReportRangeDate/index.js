import { createSlice } from '@reduxjs/toolkit';
import moment from 'moment';

export const HireReportRangeDate = createSlice({
  name: 'HireReportRangeDate',
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

export const { setStartDate, setEndDate } = HireReportRangeDate.actions;

export default HireReportRangeDate.reducer;