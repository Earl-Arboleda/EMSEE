import React from "react";
import Admin from "./Admin";
import {
 FiSettings,
 FiShield,
 FiBell,
} from "react-icons/fi";
import "./Settings.css";
import Register from "./Register";

const Settings = () => {
 const handleButtonClick = (setting) => {
    // Implement logic for handling button click based on the setting
    console.log(`Button for ${setting} clicked`);
 };

 return (
    <div className="settings-interface">
      {/* <h2>Settings</h2>
      <a href="#" onClick={(e) => { e.preventDefault(); handleButtonClick('General'); }}>
        <FiSettings />
        <span>General</span>
      </a>
      <a href="#" onClick={(e) => { e.preventDefault(); handleButtonClick('Security'); }}>
        <FiShield />
        <span>Security</span>
      </a>
      <a href="#" onClick={(e) => { e.preventDefault(); handleButtonClick('Notifications'); }}>
        <FiBell />
        <span>Notifications</span>
      </a> */}
      {/* Add more links as needed */}
      <Register/>
    </div>
 );
};

export default Settings;