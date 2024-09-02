import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { login } from "../redux/thunks/authThunk";
import { updateValidationErrors } from "../redux/slices/authSlice";
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

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const [showPassword, setShowPassword] = useState(false);
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, validationErrors } = useSelector(state => state.auth);

  //Form validation
  const validateField = (name, value) => {
    let error = '';

    switch (name) {
        case 'email': 
            if(!value) {
                error = "Email is required";
            } else if(!/\S+@\S+\.\S+/.test(value)) {
                error = "Email is invalid"
            } else if (!value.endsWith('@aa.net.nz')) { 
              error = "Only AA email addresses are allowed";
            }
            break;
        case 'password':
            if (!value) {
                error = "Password is required";
            } else if (value.length < 6) {
                error = "Password must be at least 6 characters"
            }
            break;
        default:
            break;
    }
    return error;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setFormData({
        ...formData,
        [name]: value,
    });
    dispatch(updateValidationErrors({
        ...validationErrors,
        [name]: error,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(formData))
  };

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const preventDefault = (e) => {
    e.preventDefault();
  };

  return (
    <div className="login page">
        <div className="page-container">
            <h4>Welcome, Team AA</h4>
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
                            onChange={handleChange}
                            error={!!validationErrors.email}
                        />
                    </FormControl>

                    <FormControl fullWidth  className="form-input">
                        <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            value={formData.password}
                            onChange={handleChange}
                            error={!!validationErrors.password}
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
                    <button disabled={loading}>Login</button>
                </div>

                <div className="link-to-login">
                    <p>Haven't created an account yet?</p>
                    <span
                        onClick={() => navigate('/signup')}
                    >
                        Signup
                    </span>
                </div>

                <div className="error-message">
                    {error && <div className="error"><PiWarningFill />{error}</div>}
                    {validationErrors.email && <div className="error"><PiWarningFill />{validationErrors.email}</div>}
                    {validationErrors.password && <div className="error"><PiWarningFill />{validationErrors.password}</div>}
                </div>


            </Box>
        </div>
    </div>
   
  )
}

export default Login
