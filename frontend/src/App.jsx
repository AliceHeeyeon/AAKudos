import { HashRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getUsers } from "./redux/thunks/userThunk";
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

//components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import announcementSlice from "./redux/slices/announcementSlice";

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchData = async () => {
      dispatch(getUsers());
      //dispatch(getAnnouncement());
    };
    fetchData();
  }, []);

  return (
    <div className="App">
      <HashRouter>
        <Navbar />
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
      </HashRouter>
    </div>
  );
}

export default App;
