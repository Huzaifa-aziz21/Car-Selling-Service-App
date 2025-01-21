import { configureStore, createSlice } from '@reduxjs/toolkit';

// Create a slice for user authentication
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

// Create a slice for car form data
const carSlice = createSlice({
  name: 'car',
  initialState: {
    carDetails: null,
    errorMessage: '',
  },
  reducers: {
    addCarSuccess: (state, action) => {
      state.carDetails = action.payload;
      state.errorMessage = ''; // Clear any error message if submission is successful
    },
    addCarFailure: (state, action) => {
      state.errorMessage = action.payload; // Set error message in case of failure
    },
  },
});

// Export actions for both user and car slices
export const { loginSuccess, loginFailure, logout } = userSlice.actions;
export const { addCarSuccess, addCarFailure } = carSlice.actions;

// Configure the Redux store with the reducers from both slices
export const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    car: carSlice.reducer,
  },
});
