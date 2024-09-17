import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUsers, getAllUsers } from "./redux/thunks/userThunk";
import { getUpdatedUserInfo } from "./redux/thunks/authThunk";
import { getAnnouncement } from "./redux/thunks/announcementThunk";
import "./css/App.css";

//pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import KudosBoard from "./pages/KudosBoard";
import SalesChart from "./pages/SalesChart";
import Anniversary from "./pages/Anniversary";
import Admin from "./pages/Admin";
import MyAccount from "./pages/MyAccount";

function App() {
  const dispatch = useDispatch();
  const storedUserId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchData = async () => {
      dispatch(getUsers());
      dispatch(getAllUsers());
      dispatch(getAnnouncement());
      if (storedUserId) {
        dispatch(getUpdatedUserInfo(storedUserId));
      }
    };
    fetchData();
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* if we have a user show home, else go to login */}
          <Route path="/" element={storedUserId ? <Home /> : <Login />} />
          {/* <Route path="/" element={<Home />} /> */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/kudosboard" element={<KudosBoard />} />
          <Route path="/saleschart" element={<SalesChart />} />
          <Route path="/anniversary" element={<Anniversary />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/myaccount" element={<MyAccount />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
