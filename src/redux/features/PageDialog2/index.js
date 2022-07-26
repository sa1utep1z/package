import { createSlice } from '@reduxjs/toolkit';

export const PageDialog2 = createSlice({
  name: 'PageDialog2',
  initialState: {
    showDialog: false,
    dialog2Hidden: false,
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
    },
    setDialog2Hidden: (state, {payload}) => {
      state.dialog2Hidden = payload;
    }
  }
});

export const { openDialog, closeDialog, setTitle, setRightArea, setDialog2Hidden } = PageDialog2.actions;

export default PageDialog2.reducer;