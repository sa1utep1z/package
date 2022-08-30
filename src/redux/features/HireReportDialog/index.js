import { createSlice } from '@reduxjs/toolkit';

export const HireReportDialog = createSlice({
  name: 'HireReportDialog',
  initialState: {
    showDialog: false,
    dialogComponent: ''
  },
  reducers: {
    openDialog: (state, {payload}) => {
      state.showDialog = true;
      state.dialogComponent = payload;
    },
    closeDialog: (state) => {
      state.showDialog = false;
      state.dialogComponent = '';
    }
  }
});

export const { openDialog, closeDialog } = HireReportDialog.actions;

export default HireReportDialog.reducer;