import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { signup } from "../redux/thunks/authThunk";
import { PiWarningFill } from "react-icons/pi";
//MUI Form element 
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const Signup = () => {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    role: '',
    joinDate: null,
    password: '',
    dob: null
  })
 
  const [showPassword, setShowPassword] = useState(false);
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector(state => state.auth);

  const handleChange = (e) => {
    console.log(e.target.name, e.target.value); 
    setFormData({
        ...formData,
        [e.target.name]: e.target.value,
    })
  }

  const handleDateChange = (name, value) => {
    setFormData({
        ...formData,
        [name]: value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData)
    dispatch(signup(formData))
  };

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const preventDefault = (e) => {
    e.preventDefault();
  };

  return (
    <div className="signup page">
        <h4>Create an account</h4>
        <Box
            component="form"
            noValidate
            autoComplete="off"
            onSubmit={handleSubmit}
        >   
            <div className="user-input-box">
                <FormControl fullWidth  className="form-input" variant="outlined">
                    <TextField 
                        label="Email" 
                        name="email" 
                        value={formData.email}
                        onChange={handleChange}/>
                </FormControl>

                <FormControl fullWidth  className="form-input" variant="outlined">
                    <TextField 
                        label = "Full Name"
                        name = "name"
                        value = {formData.name}
                        onChange = {handleChange}
                    />
                </FormControl>

                <FormControl fullWidth className="form-input">
                    <InputLabel>Role</InputLabel>
                    <Select
                        name = "role"
                        value={formData.role}
                        label="Role"
                        onChange={handleChange}
                    >
                    <MenuItem value={"Sales"}>Sales</MenuItem>
                    <MenuItem value={"Tech"}>Tech</MenuItem>
                    <MenuItem value={"Administrator"}>Administrator</MenuItem>
                    <MenuItem value={"Designer"}>Designer</MenuItem>
                    <MenuItem value={"Operation Administrator"}>Operation Administrator</MenuItem>
                    <MenuItem value={"Project Manager"}>Project Manager</MenuItem>
                    <MenuItem value={"Dispatch"}>Dispatch</MenuItem>
                    <MenuItem value={"System"}>System Manager</MenuItem>
                    </Select>
                </FormControl>

                <FormControl fullWidth className="form-input">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker 
                            label="Join Date" 
                            value={formData.joinDate}
                            onChange={(newValue) => handleDateChange('joinDate', newValue)}
                        />
                    </LocalizationProvider>
                </FormControl>
        
                <FormControl fullWidth  className="form-input">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker 
                            label="DOB"
                            value={formData.dob}
                            onChange={(newValue) => handleDateChange('dob', newValue)}
                        />
                    </LocalizationProvider>
                </FormControl>

                <FormControl fullWidth  className="form-input">
                    <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                    <OutlinedInput
                        id="outlined-adornment-password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={handleChange}
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
            </div>

            <div className="submit-btn-box">
                <button disabled={loading}>Sign up</button>
            </div>

            <div className="link-to-login">
                <p>Already have an account?</p>
                <span
                    onClick={() => navigate('/login')}
                >
                    Login
                </span>
            </div>

            <div className="error-message">
                {error && <div className="error"><PiWarningFill />{error}</div>}
            </div>

        </Box>
    </div>
   
  )
}

export default Signup

