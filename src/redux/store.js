import { configureStore, createSlice } from '@reduxjs/toolkit';


const userSlice = createSlice({
  name: 'user',
  initialState: {
    isAuthenticated: false,
    userDetails: null,
    errorMessage: '',
  },
  reducers: {
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.userDetails = action.payload;
      state.errorMessage = '';
    },
    loginFailure: (state, action) => {
      state.isAuthenticated = false;
      state.userDetails = null;
      state.errorMessage = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.userDetails = null;
      state.errorMessage = '';
    },
  },
});


const carSlice = createSlice({
  name: 'car',
  initialState: {
    carDetails: null,
    errorMessage: '',
  },
  reducers: {
    addCarSuccess: (state, action) => {
      state.carDetails = action.payload;
      state.errorMessage = ''; 
    },
    addCarFailure: (state, action) => {
      state.errorMessage = action.payload; 
    },
  },
});


export const { loginSuccess, loginFailure, logout } = userSlice.actions;
export const { addCarSuccess, addCarFailure } = carSlice.actions;


export const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    car: carSlice.reducer,
  },
});
