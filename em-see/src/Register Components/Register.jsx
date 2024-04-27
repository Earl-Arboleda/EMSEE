import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Register.css';

const Register = ({ isOpen, onClose, update }) => {
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('');
  const [department, setDepartment] = useState('');
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();

    // Prepare data for submission
    const registrationData = {
      fullName,
      role,
      department,
      userId,
      password,
    };

    try {
      // Make an HTTP POST request to the registration endpoint
      const response = await fetch('/Api/Register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData),
      });

      if (response.ok) {
        toast.success('Registration successful!');
        // Reset all input fields and select values
        setFullName('');
        setRole('');
        setDepartment('');
        setUserId('');
        setPassword('');
        onClose();
        update();
      } else {
        const errorMessage = await response.text();
        toast.error(`Registration failed: ${errorMessage}`);
      }
    } catch (error) {
      toast.error(`Error during registration: ${error.message}`);
    }
  };

  // Reset department and role when modal is closed
  useEffect(() => {
    if (!isOpen) {
      setDepartment('');
      setRole('');
    }
  }, [isOpen]);

  return (
    <div className={`register ${isOpen ? 'open' : ''}`}>
      <div className="register-content">
        <div className="register-label">
          <h3>Register</h3>
          <span onClick={() => onClose()}>&times;</span>
        </div>

        <form onSubmit={handleRegister}>
          <label>
            Full Name:
            <input
              type="text"
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </label>

          <label>
            Role:
            <select onChange={(e) => setRole(e.target.value)} value={role} required>
              <option value="" hidden>Select Role</option>
              <option value="Client">Client</option>
              <option value="Staff">EMC Staff</option>
              <option value="Admin">Admin</option>
            </select>
          </label>

          <label >
            Department:
            <select onChange={(e) => setDepartment(e.target.value)} value={department} required>
              <option value="" hidden>Select Department</option>
              <option value="CEAC">CEAC</option>
              <option value="CBA">CBA</option>
              <option value="CAS">CAS</option>
              <option value="CED">CED</option>
              <option value="GS/LAW">GS/LAW</option>
              <option value="Others">Other Offices</option>
            </select>
          </label>

          <label>
            User ID:
            <input
              type="text"
              id="userId"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
            />
          </label>

          <label>
            Password:
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          <div className="register-button-holder">
            <button className="register-button" type="submit">
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
