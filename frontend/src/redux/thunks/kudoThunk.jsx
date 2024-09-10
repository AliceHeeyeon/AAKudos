import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { addNewKudos } from "../slices/kudoSlice";

const baseUrl = import.meta.env.VITE_BASE_URL;
export const newKudos = createAsyncThunk(
  "kudo/addNewKudos",
  async (formData, { dispatch }) => {
    try {
      const response = await axios.post(`${baseUrl}/api/message`, formData);
      dispatch(addNewKudos(response.data[0]));
      return response.data[0];
    } catch (err) {
      console.error("Error:", err.message);
      throw err;
    }
  }
);
