import { createSlice } from '@reduxjs/toolkit';

import handleLocalStorage from './../utils/handleLocalStorage';
import handleAuthToken from './../utils/handleAuthToken';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    isLoading: true,
    currentUser: null,
  },
  reducers: {
    setLoadingCurrentUser: (state, action) => {
      state.isLoading = action.payload;
    },
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
    removeCurrentUser: (state) => {
      handleLocalStorage.remove('accessToken');
      handleAuthToken();
      state.currentUser = null;
    },
  },
});

export const { setCurrentUser, removeCurrentUser, setLoadingCurrentUser } =
  userSlice.actions;

export default userSlice.reducer;
