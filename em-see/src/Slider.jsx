
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Slider({body, inventory}) {

  let prevOpen = false;
  
  const [isBtnClicked, setIsBtnClicked] = useState(false);
  const [isOpen, setIsOpen] = useState(prevOpen);

  const handleClick = () => {
    setIsOpen(prevOpen => !prevOpen);
  };
  const toggleBtnClick = () => {
    setIsBtnClicked(!isBtnClicked);
  };

  



  return (
    <div>
      <div className={`btn ${isBtnClicked ? 'click' : ''}`} onClick={toggleBtnClick}>
      <div id="nav-icon3" className={isOpen ? 'open' : ''} onClick={handleClick}>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>      </div>
      <nav className={`sidebar ${isBtnClicked ? 'show' : ''}`}>
        <div className="text">EM-See</div>
        <ul>
          <Link to='/'>
          <button className='sideBtn' onClick={body}>EMC</button>
          </Link>
          <Link to='/Inventory'>
          <button className='sideBtn' onClick={inventory}>Inventory</button>
          </Link>
          <button className='sideBtn'>Reservations</button>
          <Link to='/Login'><button className='sideBtn'>Login</button></Link>
        </ul>
      </nav>
    </div>
  );
}

export default Slider;
