import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';
import { signupRequest, signupSuccess, signupFailure, loginRequest, loginSuccess, loginFailure, logout } from "../slices/authSlice";

const baseUrl = import.meta.env.VITE_BASE_URL;
export const signup = createAsyncThunk(
    'auth/signup',
    async({ email, name, role, joinDate, password, dob }, {dispatch}) => {
        try {
            dispatch(signupRequest());
            const response = await axios.post(`${baseUrl}/api/user/signup`, {
                email,
                name,
                role,
                joinDate,
                password,
                dob,
            },
            {
                headers: {
                  'Content-Type': 'application/json',
                },
            })
            dispatch(signupSuccess(response.data))
        } catch(error) {
            dispatch(signupFailure(error.message))
        }
    }
)

export const login = createAsyncThunk(
    'auth/login',
    async({ email, password }, { dispatch }) => {
        try {
            dispatch(loginRequest());
            const response = await axios.post(`${baseUrl}/api/login`, {
                email, 
                password
            })
            dispatch(loginSuccess(response.data))
        } catch(error) {
            dispatch(loginFailure(error.message))
        }
    }
)
