import { createSlice } from '@reduxjs/toolkit';

export const PageDialog = createSlice({
  name: 'PageDialog',
  initialState: {
    showDialog: false,
    dialogTitle: '',
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
    },
    setTitle: (state, {payload}) => {
      state.dialogTitle = payload;
    }
  }
});

export const { openDialog, closeDialog, setTitle } = PageDialog.actions;

export default PageDialog.reducer;