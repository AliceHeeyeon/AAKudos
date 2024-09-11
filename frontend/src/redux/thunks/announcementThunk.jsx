import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {
  getAnnouncementRequest,
  addNewAnnouncement,
  removeAnnouncement,
} from "../slices/announcementSlice";

const baseUrl = import.meta.env.VITE_BASE_URL;
export const getAnnouncement = createAsyncThunk(
  "user/getannouncement",
  async (_, { dispatch }) => {
    try {
      const response = await axios.get(`${baseUrl}/api/announcement`);
      dispatch(getAnnouncementRequest(response.data[0]));
    } catch (err) {
      console.error(err.message);
    }
  }
);

export const deletAnnouncement = createAsyncThunk(
  "user/deleteannouncement",
  async (Id, { dispatch }) => {
    try {
      await axios.delete(`${baseUrl}/api/announcement/${Id}`);
      dispatch(removeAnnouncement(Id));
    } catch (err) {
      console.error(err.message);
    }
  }
);

export const addAnnouncement = createAsyncThunk(
  "user/addannouncement",
  async (formData, { dispatch }) => {
    try {
      const response = await axios.post(
        `${baseUrl}/api/announcement`,
        formData
      );
      dispatch(addNewAnnouncement(response.data[0]));
    } catch (err) {
      console.error("Error:", err.message);
      dispatch(setLoading(false));
      throw err;
    }
  }
);
