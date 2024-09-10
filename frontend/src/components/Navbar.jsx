import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { logout } from "../redux/slices/authSlice";
import Hamburger from "hamburger-react";
//components
import MobileMenu from "./MobileMenu";
//icons
import { RiLogoutCircleRLine } from "react-icons/ri";

const Navbar = () => {
  const [isOpen, setOpen] = useState(false);
  const userState = useSelector((state) => state.auth.user);
  const user = userState?.user;
  const userName = userState?.user?.[0]?.Name;
  const userRole = userState?.user?.[0]?.Role;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <nav id="nav">
      {/* Desktop */}
      <div className="nav-desktop">
        <div className="logo-box-desktop">
          <img src="./src/images/AA-logo.svg" alt="aa-logo" />
          <p className="logo-text-desktop">Staff Recognition</p>
        </div>

        {user && user.length > 0 && (
          <div className="login-info">
            <div className="user-info">
              <h4>{userName}</h4>
              <p>{userRole}</p>
            </div>
            <div className="logout-btn">
              <RiLogoutCircleRLine onClick={handleLogout} />
            </div>
          </div>
        )}
      </div>

      {/* Mobile */}
      <div className="nav-mobile">
        {user && (
          <div className="hamburger-menu-mobile">
            <Hamburger toggled={isOpen} toggle={setOpen} />
          </div>
        )}

        {!user && (
          <div className="logo-box-mobile">
            <img src="./src/images/logo.svg" alt="logo-mobile" />
          </div>
        )}

        {user && (
          <div className="login-info">
            <div className="user-info">
              <h4>{userName}</h4>
              <p>{userRole}</p>
            </div>
            <div className="logout-btn">
              <RiLogoutCircleRLine onClick={handleLogout} />
            </div>
          </div>
        )}
      </div>

      {isOpen && <MobileMenu toggled={isOpen} toggle={setOpen} />}
    </nav>
  );
};

export default Navbar;
