import { createSlice } from '@reduxjs/toolkit';

export const PageDialog = createSlice({
  name: 'PageDialog',
  initialState: {
    showDialog: false,
    dialogHidden: false,
    dialogTitle: '',
    dialogComponent: '',
    leftArea: {
      title: '',
      press: () => {}
    },
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
    setLeftArea: (state, {payload}) => {
      state.leftArea = payload;
    },
    setRightArea: (state, {payload}) => {
      state.rightArea = payload;
    },
    setDialogHidden: (state, {payload}) => {
      state.dialogHidden = payload;
    }
  }
});

export const { openDialog, closeDialog, setTitle, setLeftArea, setRightArea, setDialogHidden } = PageDialog.actions;

export default PageDialog.reducer;