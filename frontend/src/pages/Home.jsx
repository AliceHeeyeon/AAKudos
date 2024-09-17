//components
import KudosMessage from "../components/KudosMessage";
import Announcement from "../components/Announcement";
import Celebration from "../components/Celebration";
import Navbar from "../components/Navbar";

import { useNavigate } from "react-router";
import { useEffect } from "react";
import { logout } from "../redux/slices/authSlice";
import { useDispatch } from "react-redux";

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const storedUserId = localStorage.getItem("userId");

  useEffect(() => {
    if (!storedUserId) {
      navigate("/");
      dispatch(logout());
    }
  }, [storedUserId, navigate]);

  return (
    <>
      <Navbar />
      <div className="home page">
        <div className="home-contents">
          <div className="notice-board">
            <Announcement />
            <Celebration />
          </div>
          <KudosMessage />
        </div>
      </div>
    </>
  );
};

export default Home;
