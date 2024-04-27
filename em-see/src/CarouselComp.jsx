import React, { useEffect, useState } from 'react';
import './Carousel.css'; // Import the CSS file for styling

import LOGO from './Login component/logo.png';

const Carousel = ({page, menu}) => {


  useEffect(() => {
    page();
  },[])

  return (
    <>
      <div className="carousel">
        <div className="carousel-label">
          <img onClick={menu} src={LOGO} alt="EMC" />
          <h1>Home</h1>
        </div>
        <div className="carousel-container">
          {/* {img} */}
        </div>
      </div>
    </>
  );
};

export default Carousel;
