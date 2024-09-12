import { useState, useEffect } from "react";
import DesktopMenu from "../components/DesktopMenu";
import { useSelector } from "react-redux";
import {
  TextField,
  Select,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
} from "@mui/material";

const MyAccount = () => {
  const [profile, setProfile] = useState({
    email: "user@example.com",
    fullName: "John Doe",
    role: "Tech",
    dateOfEmployment: "2022-01-01",
    dateOfBirth: "1990-06-15",
  });
  const [password, setPassword] = useState({
    current: "",
    new: "",
  });

  const loginUser = useSelector((state) => state.user.loginUser);
  console.log(loginUser);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({
      ...profile,
      [name]: value,
    });
  };

  const handleSubmit = () => {
    console.log("Updated profile:", profile);
  };

  return (
    <div className="myaccount page">
      <DesktopMenu />
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
            <TextField
              label="Current Password"
              name="current-password"
              value={password.current}
              onChange={handleChange}
              fullWidth
            />
          </FormControl>

          {/* New Password */}
          <FormControl fullWidth margin="normal">
            <TextField
              label="New Password"
              name="new-password"
              value={password.new}
              onChange={handleChange}
              fullWidth
            />
          </FormControl>

          {/* Submit Button */}
          <div className="align-button-right">
            <Button
              className="form-button-style updatePasswordBtn"
              variant="contained"
              onClick={handleSubmit}
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
