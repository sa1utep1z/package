import { createSlice } from '@reduxjs/toolkit';

export const PageDialog3 = createSlice({
  name: 'PageDialog3',
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

export const { openDialog, closeDialog, setTitle, setRightArea } = PageDialog3.actions;

export default PageDialog3.reducer;