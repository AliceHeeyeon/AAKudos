import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {
  getUsersRequest,
  updateUsersInfo,
  setLoginUserInfo,
} from "../slices/userSlice";

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

export const loginUserInfo = () => (dispatch) => {
  const user = localStorage.getItem("user");
  if (user) {
    const parsedUser = JSON.parse(user);
    dispatch(setLoginUserInfo(parsedUser));
  }
};
