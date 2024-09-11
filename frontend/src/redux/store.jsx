import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice.jsx";
import userSlice from "./slices/userSlice.jsx";
import kudoSlice from "./slices/kudoSlice.jsx";
import announcementSlice from "./slices/announcementSlice.jsx";

const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    user: userSlice.reducer,
    kudo: kudoSlice.reducer,
    announcement: announcementSlice.reducer,
  },
});

export default store;
