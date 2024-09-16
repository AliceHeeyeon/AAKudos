import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {
  signupRequest,
  signupSuccess,
  signupFailure,
  loginRequest,
  loginSuccess,
  logout,
} from "../slices/authSlice";

const baseUrl = import.meta.env.VITE_BASE_URL;

export const signup = createAsyncThunk(
  "auth/signup",
  async ({ email, name, role, joinDate, password, dob }, { dispatch }) => {
    try {
      dispatch(signupRequest());
      const response = await axios.post(
        `${baseUrl}/api/user/signup`,
        {
          email,
          name,
          role,
          joinDate,
          password,
          dob,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      dispatch(signupSuccess(response.data));
    } catch (error) {
      dispatch(signupFailure(error.message));
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(loginRequest());
      const response = await axios.post(`${baseUrl}/api/user/login`, {
        email,
        password,
      });
      console.log(response.data);
      if (response.data) {
        const user = response.data.user;
        console.log(user);

        localStorage.setItem("userData", JSON.stringify(user));
        localStorage.setItem("userId", JSON.stringify(user.Id));
        dispatch(loginSuccess(user));
        return user;
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        console.log(error.response);
        console.log(error.message);

        return rejectWithValue(error.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const getUpdatedUserInfo = createAsyncThunk(
  "auth/getuser",
  async (Id, { dispatch }) => {
    try {
      const response = await axios.get(`${baseUrl}/api/user/${Id}`);
      console.log(response.data[0]);

      return response.data[0];
    } catch (err) {
      console.error(err.message);
    }
  }
);
