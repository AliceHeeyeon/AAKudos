import { createSlice } from "@reduxjs/toolkit";

const announcementSlice = createSlice({
  name: "announcement",
  initialState: {
    list: [],
    isLoading: false,
  },
  reducers: {
    getAnnouncementRequest(state, action) {
      state.list = action.payload;
    },
    addNewAnnouncement(state, action) {
      state.list = [...state.list, action.payload];
    },
    removeAnnouncement: (state, action) => {
      state.list = state.list.filter(
        (announcement) => announcement.Id !== action.payload
      );
    },
  },
});

export const {
  getAnnouncementRequest,
  addNewAnnouncement,
  removeAnnouncement,
} = announcementSlice.actions;
export default announcementSlice;
