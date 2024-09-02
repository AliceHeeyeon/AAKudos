import { createSlice } from '@reduxjs/toolkit'

const authSlice = createSlice({
    name: "auth",
    initialState: {
        isAuthenticated: false,
        user: null,
        loading: false,
        error: null
    },
    reducers: {
        signupRequest(state) {
            state.loading = true;
            state.error = null;
        },
        signupSuccess(state, action) {
            state.loading = false;
            state.user = action.payload;
            state.isAuthenticated = true;
        },
        signupFailure(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        loginRequest(state) {
            state.loading = true;
            state.error = null;
        },
        loginSuccess(state, action) {
            state.loading = false;
            state.user = action.payload;
            state.isAuthenticated = true;
        },
        loginFailure(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        logout(state) {
            state.isAuthenticated = false;
            state.user = null;
        }
    }
})

export const {
    signupRequest, 
    signupSuccess,
    signupFailure,
    loginRequest,
    loginSuccess,
    loginFailure,
    logout
} = authSlice.actions;
export default authSlice;