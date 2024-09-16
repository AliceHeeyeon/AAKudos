import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getUsers, getAllUsers } from "./redux/thunks/userThunk";
import { getUpdatedUserInfo } from "./redux/thunks/authThunk";
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

//components
import Navbar from "./components/Navbar";

function App() {
  const dispatch = useDispatch();
  const storedUserId = localStorage.getItem("userId");

  useEffect(() => {
    // const storedUserId = localStorage.getItem("userId");
    // console.log(storedUserId);

    // if (storedUserId) {
    //   dispatch(getUpdatedUserInfo(storedUserId)).finally(() => {
    //     setLoading(false);
    //   });
    // } else {
    //   setLoading(false);
    // }
    const fetchData = async () => {
      dispatch(getUsers());
      dispatch(getAllUsers());
      dispatch(getUpdatedUserInfo(storedUserId));
    };
    fetchData();
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
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
