import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    list: [],
    status: "",
    loginUser: "",
  },
  reducers: {
    getUsersRequest(state, action) {
      state.list = action.payload;
    },
    updateUsersInfo(state) {
      state.status = "success";
    },
    setLoginUserInfo(state, action) {
      state.loginUser = action.payload;
    },
  },
});

export const { getUsersRequest, updateUsersInfo, setLoginUserInfo } =
  userSlice.actions;
export default userSlice;
