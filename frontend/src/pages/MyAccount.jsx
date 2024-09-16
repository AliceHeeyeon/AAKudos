import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { getUpdatedUserInfo } from "../redux/thunks/authThunk";
import { logout } from "../redux/slices/authSlice";
import { editUser, changePassword } from "../redux/thunks/userThunk";
import { resetStatus } from "../redux/slices/userSlice";
import {
  TextField,
  Select,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
  CircularProgress,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";

const MyAccount = () => {
  const userData = useSelector((state) => state.auth.userData);
  const user = userData ? userData[0] : "";
  const userId = user.Id;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    email: "",
    fullName: "",
    role: "",
    dateOfEmployment: "",
    dateOfBirth: "",
  });
  const [password, setPassword] = useState({
    current: "",
    new: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const { status, message } = useSelector((state) => state.user);

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const preventDefault = (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    if (user?.Id) {
      dispatch(getUpdatedUserInfo(user.Id));
    }
  }, [dispatch, user?.Id]);

  useEffect(() => {
    const formatDate = (date) => {
      const targetDate = new Date(date);
      const year = targetDate.getFullYear();
      const month = (targetDate.getMonth() + 1).toString().padStart(2, "0");
      const day = targetDate.getDate().toString().padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    setProfile({
      email: user.Email || "",
      fullName: user.Name || "",
      role: user.Role || "",
      dateOfEmployment: formatDate(user.JoinDate) || "",
      dateOfBirth: formatDate(user.DOB) || "",
    });

    setLoading(false);
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({
      ...profile,
      [name]: value,
    });
  };

  const handleChangePassword = (e) => {
    const { name, value } = e.target;
    setPassword({
      ...password,
      [name]: value,
    });
  };

  const handleSubmit = () => {
    dispatch(editUser({ userId, profile }));
    console.log("Updated profile:", userId, profile);
  };

  const handleChangePasswordSubmit = () => {
    if (password.new.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    dispatch(changePassword({ userId, password }));

    if (status === "success") {
      navigate("/login");
      dispatch(logout());
    }
  };
  console.log(status);

  const clearError = () => {
    setError("");
    dispatch(resetStatus());
  };

  useEffect(() => {
    if (status === "error") {
      setError(message);
    } else if (status === "success") {
      setError("");
    }
  }, [status, message]);

  useEffect(() => {
    dispatch(resetStatus());
    setError("");
  }, []);

  if (loading) {
    return (
      <div className="loading-spinner">
        <CircularProgress />
      </div>
    );
  }
  return (
    <div className="myaccount page">
      <div className="myaccount-contents">
        <h2>My Profile</h2>
        <form>
          {/* Email */}
          <FormControl fullWidth margin="normal">
            <TextField
              label="Email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              fullWidth
            />
          </FormControl>

          {/* Full Name */}
          <FormControl fullWidth margin="normal">
            <TextField
              label="Full Name"
              name="fullName"
              value={profile.fullName}
              onChange={handleChange}
              fullWidth
            />
          </FormControl>

          {/* Role */}
          <FormControl fullWidth margin="normal">
            <InputLabel>Role</InputLabel>
            <Select
              label="Role"
              name="role"
              value={profile.role}
              onChange={handleChange}
              fullWidth
            >
              <MenuItem value="Sales">Sales</MenuItem>
              <MenuItem value="Tech">Tech</MenuItem>
              <MenuItem value="Administrator">Administrator</MenuItem>
              <MenuItem value="Designer">Designer</MenuItem>
              <MenuItem value="Operation Administrator">
                Operation Administrator
              </MenuItem>
              <MenuItem value="Project Manager">Project Manager</MenuItem>
              <MenuItem value="Dispatch">Dispatch</MenuItem>
              <MenuItem value="System">System Manager</MenuItem>
            </Select>
          </FormControl>

          {/* Date of Employment */}
          <FormControl fullWidth margin="normal">
            <TextField
              label="Date of Employment"
              name="dateOfEmployment"
              type="date"
              value={profile.dateOfEmployment}
              onChange={handleChange}
              fullWidth
            />
          </FormControl>

          {/* Date of Birth */}
          <FormControl fullWidth margin="normal">
            <TextField
              label="Date of Birth"
              name="dateOfBirth"
              type="date"
              value={profile.dateOfBirth}
              onChange={handleChange}
              fullWidth
            />
          </FormControl>

          {/* Submit Button */}
          <div className="align-button-right">
            <Button
              className="form-button-style"
              variant="contained"
              onClick={handleSubmit}
            >
              Update Profile
            </Button>
          </div>
        </form>

        <h2 className="myaccount-title-password">Change Password</h2>
        <form>
          {/* Current Password */}
          <FormControl fullWidth margin="normal">
            <InputLabel htmlFor="current-password">Current Password</InputLabel>
            <OutlinedInput
              id="current-password"
              name="current"
              type={showPassword ? "text" : "password"}
              value={password.current}
              onChange={handleChangePassword}
              onClick={clearError}
              autoComplete="current-password"
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={preventDefault}
                    onMouseUp={preventDefault}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
            />
          </FormControl>

          {/* New Password */}
          <FormControl fullWidth margin="normal">
            <InputLabel htmlFor="new-password">New Password</InputLabel>
            <OutlinedInput
              id="new-password"
              name="new"
              type={showPassword ? "text" : "password"}
              value={password.new}
              onChange={handleChangePassword}
              onClick={clearError}
              autoComplete="new-password"
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle new-password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={preventDefault}
                    onMouseUp={preventDefault}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
            />
          </FormControl>
          {error && <div className="error-changePassword error">{error}</div>}

          {/* Submit Button */}
          <div className="align-button-right">
            <Button
              className="form-button-style updatePasswordBtn"
              variant="contained"
              onClick={handleChangePasswordSubmit}
            >
              Update Password
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default MyAccount;
