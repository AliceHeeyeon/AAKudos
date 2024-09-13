import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice.jsx";
import userSlice from "./slices/userSlice.jsx";
import kudoSlice from "./slices/kudoSlice.jsx";
import announcementSlice from "./slices/announcementSlice.jsx";
import {
  saveStateToLocalStorage,
  loadStateFromLocalStorage,
} from "./localStorageUtils.jsx";

const persistedState = loadStateFromLocalStorage();

const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    user: userSlice.reducer,
    kudo: kudoSlice.reducer,
    announcement: announcementSlice.reducer,
  },
  preloadedState: {
    user: persistedState?.loginUser ? persistedState : undefined,
  },
});

store.subscribe(() => {
  saveStateToLocalStorage(store.getState().user);
});

export default store;
