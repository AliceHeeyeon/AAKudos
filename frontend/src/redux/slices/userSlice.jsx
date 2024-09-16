import { createSlice } from "@reduxjs/toolkit";
import { editUser, changePassword } from "../thunks/userThunk";

const userSlice = createSlice({
  name: "user",
  initialState: {
    list: [],
    allList: [],
    status: "",
    message: "",
  },
  reducers: {
    getUsersRequest(state, action) {
      state.list = action.payload;
    },
    getAllUsersRequest(state, action) {
      state.allList = action.payload;
    },
    updateUsersInfo(state) {
      state.status = "success";
    },
    resetStatus(state) {
      state.status = "";
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(editUser.fulfilled, (state, action) => {
        state.status = "success";
        state.message = "User data updated successfully!";
      })
      .addCase(editUser.rejected, (state, action) => {
        state.status = "error";
        state.message = action.payload || "Failed to update user data";
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.status = "success";
        state.message = "Password updated successfully!";
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.status = "error";
        state.message = action.payload || "Failed to update password";
      });
  },
});

export const {
  getUsersRequest,
  getAllUsersRequest,
  updateUsersInfo,
  resetStatus,
} = userSlice.actions;
export default userSlice;
