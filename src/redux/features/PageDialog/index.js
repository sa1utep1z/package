import { createSlice } from '@reduxjs/toolkit';

export const PageDialog = createSlice({
  name: 'PageDialog',
  initialState: {
    showDialog: false,
    dialogTitle: '',
    dialogComponent: '',
    rightArea: {
      title: '',
      press: () => {}
    }
  },
  reducers: {
    openDialog: (state, {payload}) => {
      state.showDialog = true;
      state.dialogComponent = payload;
    },
    closeDialog: (state) => {
      state.showDialog = false;
    },
    setTitle: (state, {payload}) => {
      state.dialogTitle = payload;
    },
    setRightArea: (state, {payload}) => {
      state.rightArea = payload;
    }
  }
});

export const { openDialog, closeDialog, setTitle, setRightArea } = PageDialog.actions;

export default PageDialog.reducer;