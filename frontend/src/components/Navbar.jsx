import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { logout } from "../redux/slices/authSlice";
import { getUpdatedUserInfo } from "../redux/thunks/authThunk";
import Hamburger from "hamburger-react";
//components
import MobileMenu from "./MobileMenu";

//MUI menu
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isOpen, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const userData = useSelector((state) => state.auth.userData);
  const user = userData ? userData[0] : "";
  const userName = user ? user.Name : "";
  const userRole = user ? user.Role : "";
  const storedUserId = localStorage.getItem("userId");

  useEffect(() => {
    dispatch(getUpdatedUserInfo(storedUserId));
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const handleSettingMenuClick = (path) => {
    navigate(path);
    setAnchorEl(null);
  };

  return (
    <>
      {user && (
        <nav id="nav">
          <div className="nav-menu">
            <div className="logo_and_menu_container">
              <div
                className="logo-box-desktop cursor-pointer"
                onClick={() => navigate("/")}
              >
                <img src="./src/images/AA-logo.svg" alt="aa-logo" />
              </div>

              <div className="hamburger-menu">
                <Hamburger toggled={isOpen} toggle={setOpen} />
              </div>

              <div className="desktop-menu">
                <ul>
                  <li className="cursor-pointer" onClick={() => navigate("/")}>
                    <p>Home</p>
                  </li>
                  <li
                    className="cursor-pointer"
                    onClick={() => navigate("/kudosboard")}
                  >
                    <p>Kudos Board</p>
                  </li>
                  <li
                    className="cursor-pointer"
                    onClick={() => navigate("/saleschart")}
                  >
                    <p>Sales Chart</p>
                  </li>
                  <li
                    className="cursor-pointer"
                    onClick={() => navigate("/anniversary")}
                  >
                    <p>Anniversary</p>
                  </li>
                </ul>
              </div>
            </div>

            <div className="login-info">
              <Button
                id="demo-positioned-button"
                aria-controls={open ? "demo-positioned-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleClick}
              >
                <div className="user-info" style={{ color: "white" }}>
                  <h4>{userName}</h4>
                  <p>{userRole}</p>
                </div>
              </Button>
              <Menu
                id="demo-positioned-menu"
                aria-labelledby="demo-positioned-button"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
              >
                <MenuItem onClick={() => handleSettingMenuClick("/myaccount")}>
                  My Account
                </MenuItem>
                {user.Permission && (
                  <MenuItem onClick={() => handleSettingMenuClick("/admin")}>
                    Admin
                  </MenuItem>
                )}
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </div>
          </div>

          {isOpen && <MobileMenu toggled={isOpen} toggle={setOpen} />}
        </nav>
      )}
    </>
  );
};

export default Navbar;
