import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    list: [],
  },
  reducers: {
    getUsersRequest(state, action) {
      state.list = action.payload;
    },
  },
});

export const { getUsersRequest } = userSlice.actions;
export default userSlice;
