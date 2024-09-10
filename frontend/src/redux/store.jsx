import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice.jsx";
import userSlice from "./slices/userSlice.jsx";
import kudoSlice from "./slices/kudoSlice.jsx";

const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    user: userSlice.reducer,
    kudo: kudoSlice.reducer,
  },
});

export default store;
