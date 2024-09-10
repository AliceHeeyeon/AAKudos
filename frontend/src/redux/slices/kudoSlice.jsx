import { createSlice } from "@reduxjs/toolkit";
import { newKudos } from "../thunks/kudoThunk";

const kudoSlice = createSlice({
  name: "kudo",
  initialState: { value: [], status: "idle", error: null },
  reducers: {
    addNewKudos(state, action) {
      state.value.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(newKudos.pending, (state) => {
        state.status = "loading";
      })
      .addCase(newKudos.fulfilled, (state, action) => {
        state.value.push(action.payload);
        state.status = "succeeded";
      })
      .addCase(newKudos.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { addNewKudos } = kudoSlice.actions;
export default kudoSlice;
