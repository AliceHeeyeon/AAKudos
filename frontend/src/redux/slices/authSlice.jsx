import { createSlice } from '@reduxjs/toolkit'
import { login } from '../thunks/authThunk';

let userFromLocalStorage = JSON.parse(localStorage.getItem('user'))

const authSlice = createSlice({
    name: "auth",
    initialState: {
        isAuthenticated: !!userFromLocalStorage,
        user: userFromLocalStorage || null,
        loading: false,
        error: null,
        validationErrors: {}
    },
    reducers: {
        signupRequest(state) {
            state.loading = true;
            state.error = null;
            state.validationErrors = {};
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
        updateValidationErrors(state, action) {
            state.validationErrors = action.payload
        },
        clearValidationErrors(state) {
            state.validationErrors = {}
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
            localStorage.removeItem('user');
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = false,
                state.error = action.payload
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.isAuthenticated =false;
                state.error = action.payload;
            })
    },
})

export const {
    signupRequest, 
    signupSuccess,
    signupFailure,
    updateValidationErrors,
    clearValidationErrors,
    loginRequest,
    loginSuccess,
    loginFailure,
    logout
} = authSlice.actions;
export default authSlice;