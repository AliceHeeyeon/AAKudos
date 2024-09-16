import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getUsersRequest, getAllUsersRequest } from "../slices/userSlice";

const baseUrl = import.meta.env.VITE_BASE_URL;
export const getUsers = createAsyncThunk(
  "user/getusers",
  async (_, { dispatch }) => {
    try {
      const response = await axios.get(`${baseUrl}/api/user`);
      dispatch(getUsersRequest(response.data[0]));
    } catch (err) {
      console.error(err.message);
    }
  }
);

export const getAllUsers = createAsyncThunk(
  "user/allusers",
  async (_, { dispatch }) => {
    try {
      const response = await axios.get(`${baseUrl}/api/user/allusers`);
      dispatch(getAllUsersRequest(response.data[0]));
    } catch (err) {
      console.error(err.message);
    }
  }
);

export const deletUser = createAsyncThunk(
  "user/deleteuser",
  async (Id, { dispatch }) => {
    try {
      console.log(Id);
      await axios.delete(`${baseUrl}/api/user/${Id}/deleteuser`);
      dispatch(getUsers());
    } catch (err) {
      console.error(err.message);
    }
  }
);

export const changeUserPermisson = createAsyncThunk(
  "user/changepermission",
  async ({ Id, Permission }, { dispatch }) => {
    try {
      await axios.patch(`${baseUrl}/api/user/${Id}/changepermission`, {
        Permission,
      });
      dispatch(updateUsersInfo());
      dispatch(getUsers());
    } catch (err) {
      console.error(err.message);
    }
  }
);

export const editUser = createAsyncThunk(
  "user/edituser",
  async ({ userId, profile }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `${baseUrl}/api/user/${userId}/edituser`,
        {
          Name: profile.fullName,
          Email: profile.email,
          Role: profile.role,
          JoinDate: profile.dateOfEmployment,
          DOB: profile.dateOfBirth,
        }
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const changePassword = createAsyncThunk(
  "user/changepassword",
  async ({ userId, password }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `${baseUrl}/api/user/${userId}/changepassword`,
        {
          Password: password.current,
          NewPassword: password.new,
        }
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
