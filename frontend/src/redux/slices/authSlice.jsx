import { createSlice } from "@reduxjs/toolkit";
import { login, getUpdatedUserInfo } from "../thunks/authThunk";
import { saveStateToLocalStorage } from "../localStorageUtils";

let userFromLocalStorage = JSON.parse(localStorage.getItem("user"));
let userIdFromLocalStorage = localStorage.getItem("userId");

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isAuthenticated: !!userFromLocalStorage,
    userData: userFromLocalStorage || null,
    userId: userIdFromLocalStorage || null,
    loading: false,
    error: null,
    validationErrors: {},
  },
  reducers: {
    signupRequest(state) {
      state.loading = true;
      state.error = null;
      state.validationErrors = {};
    },
    signupSuccess(state, action) {
      state.loading = false;
      state.userData = action.payload;
      state.isAuthenticated = true;
    },
    signupFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    updateValidationErrors(state, action) {
      state.validationErrors = action.payload;
    },
    clearValidationErrors(state) {
      state.validationErrors = {};
    },
    loginRequest(state) {
      state.loading = true;
      state.error = null;
    },
    loginSuccess(state, action) {
      state.loading = false;
      state.isAuthenticated = true;
      state.error = null;
      state.userData = action.payload;
    },
    loginFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.userData = null;
      state.userId = null;
      state.loading = false;
      state.error = null;
      state.validationErrors = {};
      localStorage.removeItem("userData");
      localStorage.removeItem("userId");
      console.log("logout is active");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.error = null;
        state.userData = action.payload;

        saveStateToLocalStorage(action.payload);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.payload;
      })
      .addCase(getUpdatedUserInfo.fulfilled, (state, action) => {
        state.userData = action.payload;
        saveStateToLocalStorage(state.user);
      })
      .addCase(getUpdatedUserInfo.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUpdatedUserInfo.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to load user information.";
      });
  },
});

export const {
  signupRequest,
  signupSuccess,
  signupFailure,
  updateValidationErrors,
  clearValidationErrors,
  loginRequest,
  loginSuccess,
  loginFailure,
  logout,
} = authSlice.actions;
export default authSlice;
