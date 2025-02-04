import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess, loginFailure } from '../redux/store';
import { FaEye, FaEyeSlash, FaEnvelope } from 'react-icons/fa';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validateEmail = (value) => {
    if (!value) {
      setEmailError('Email is required');
    } else if (!/\S+@\S+\.\S+/.test(value)) {
      setEmailError('Invalid email format');
    } else {
      setEmailError('');
    }
  };

  const validatePassword = (value) => {
    if (!value) {
      setPasswordError('Password is required');
    } else {
      setPasswordError('');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    validateEmail(email);
    validatePassword(password);

    if (!email || !password || emailError || passwordError) return;
  
    try {
      const res = await axios.post('http://localhost:5000/api/users/login', { email, password });
  
      if (res.data.token) {
        dispatch(loginSuccess(res.data));
        navigate('/car-form', { state: { userId: res.data.userId } });
      } else {
        setPasswordError('Invalid email or password');
        dispatch(loginFailure('Invalid credentials.'));
      }
    } catch (err) {
      if (err.response) {
        
        if (err.response.status === 401) {
          setPasswordError('Incorrect password. Please try again.');
        } else if (err.response.data && err.response.data.message) {
          setPasswordError(err.response.data.message);
        } else {
          setPasswordError('Login failed. Please try again.');
        }
      } else {
        setPasswordError('Network error. Please check your connection.');
      }
      dispatch(loginFailure('Login failed.'));
    }
  };
  

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full sm:w-80">
        <h2 className="text-3xl font-semibold font-sedan text-center text-indigo-500 mb-6">Login</h2>

        <form onSubmit={handleLogin}>
          <div className="mb-4 relative">
            <label htmlFor="email" className="block text-sm font-medium text-indigo-500">Email</label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    validateEmail(e.target.value);
                  }}
                  className={`mt-2 p-3 w-full border rounded-3xl pr-10 transition-all duration-200 outline-indigo-500 ${
                    emailError ? 'border-red-500' : 'border-gray-300 hover:border-indigo-500'
                  }`}
                  placeholder="Enter your email"
                />
                  <span className="absolute inset-y-0 right-3 top-6 text-gray-600">
                    <FaEnvelope />
                  </span>
              </div>
                {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
          </div>
          
          <div className="mb-6 relative">
            <label htmlFor="password" className="block text-sm font-medium text-indigo-500">Password</label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  validatePassword(e.target.value);
                }}
                className={`mt-2 p-3 w-full border rounded-3xl pr-10 transition-all duration-200 outline-indigo-500 ${
                  passwordError ? 'border-red-500' : 'border-gray-300 hover:border-indigo-500'
                }`}
                placeholder="Enter your password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 top-3 text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-indigo-500 text-white font-semibold rounded-3xl hover:bg-indigo-800 transition duration-200"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
