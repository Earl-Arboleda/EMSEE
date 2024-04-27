import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import "./Login.css";
import LOGO from "./logo.png"

const Login = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const [Id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [accountState, setAccountState] = useState(false);
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
  
    const credentials = {
      Id: Id,
      password: password,
    };
  
    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
  
      if (response.ok) {
        const responseData = await response.json();
  
        if (responseData.message === 'Login successful') {
          const { FullName, UserId, Department, Role, State } = responseData.userData;
  
          const userData = {
            FullName,
            UserId,
            Department,
            Role,
            State,
          };
  
          setId(UserId);
  
          if (State === 'Initial') {
            setAccountState(!accountState);
          } else if (State === 'Changed') {
            toast.success('Login successful');
            navigate('/'); // Navigate after successful login
            onLoginSuccess(userData);
          }
        } else {
          toast.error(responseData.message);
        }
      } else {
        toast.error('Invalid credentials');
      }
    } catch (error) {
      toast.error('Error during login');
    }
  };
  

  const handleChangePass = (e) => {
    e.preventDefault();
    if (newPass === confirmPass) {
      const user = {
        userId: Id,
        password: newPass
      }
      
      fetch(`/login`, {
        method: 'PUT', 
        headers: {
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ user })
      })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to change password');
        }
        toast.success('Password changed successfully');
        setNewPass('');
        setConfirmPass('');
        setAccountState(false)
        setId('')
        setPassword('')
      })
      .catch((error) => {
        toast.error(error.message);
      });
    } else {
      toast.error('Password does not match');
    }
  }


  return (
    <>
      <ToastContainer />
      <div className="login-box">
        <img src={LOGO} alt="" />
        {accountState ? (
          <form className="login-form" onSubmit={handleChangePass}>
            <h3 className="login-title">Change Password</h3>
            <div className="form-group">
              <label className="form-label"> <p>New Password</p>
              <input
                type="password"
                className="form-input"
                value={newPass} 
                onChange={(e) => setNewPass(e.target.value)} 
              /></label>
            </div>
            <div className="form-group">
              <label className="form-label"><p>Confirm Password</p>
              <input
                type="password"
                className="form-input"
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
              /></label>
                            <a href="">Forgot your password</a>

            </div>
            <br/>
            <button type="submit" className="login-button">
              Submit
            </button>
          </form>
        ) : (
          <form className="login-form" onSubmit={handleLogin}>
            <h3 className="login-title">Login</h3>
            <div className="form-group">
              <label className="form-label"> <p>ID Number</p>
              <input
                type="text"
                className="form-input"
                value={Id} 
                onChange={(e) => setId(e.target.value)} 
              /></label>
            </div>
            <div className="form-group">
              <label className="form-label"><p>Password</p>
              <input
                type="password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              /></label>
              <a href="">Forgot your password</a>
            </div>
            <br/>

            <button type="submit" className="login-button">
              Login
            </button>
          </form>
        )}
      </div>
    </>
  );
};

export default Login;
