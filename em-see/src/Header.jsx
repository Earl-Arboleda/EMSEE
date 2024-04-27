import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import "./Header.css";
import { Player } from '@lordicon/react';
import HOME from './system-regular-41-home.json';
import EMC from './system-regular-40-add-card.json';
import INVENTORY from './system-regular-44-folder.json';
import RESERVATION from './system-regular-23-calendar.json';
import LOGIN from './system-regular-8-account.json';
import REPORT from './system-regular-16-assessment.json';
import LOGO from './Login component/logo.png';

export default function Header({ user, Logout, page, menu, setMenu }) {

  const [activeButton, setActiveButton] = useState(page);
  const [menuOpen, setMenuOpen] = useState(false)
  useEffect(() => {
    setMenuOpen(menu)
  }, [menu])
  useEffect(() => {
    setActiveButton(page);
  },[page])

  const logOutFunc = () => {
    setMenu(false)
    Logout();
  }

  return (
    <div  className={`header ${menuOpen ? 'open':''}`}  >
      <div className="navbar">
          <div className="navbar-brand">
        
              {menuOpen ? <img className='image-half' onClick={() => setMenu(false)} src={LOGO} alt='EMC'/>:null}       
          </div>
          
      <div className="navbar-options">
            <ul>
          
              <li className="nav-item">
                <Link to="/">
                  <button
                    style={{ backgroundColor: activeButton === 'home' ? '#fff' : '#fff',
                    boxShadow: activeButton === 'home' ? '0px 1px 1px 1px #00cc00' : 'none'

                  }}
                  >
                    <div className="nav-logo">
                    <Player
                      icon={HOME}
                      style={{ width: '24px', height: '24px'}}
                      colorize={ activeButton === 'home' ? '#00cc00' : '#333'}

                    />
                    </div>
                    
                    <p style={{ color: activeButton === 'home' ? '#00cc00' : '#333' }}>Home</p>
                  </button>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/Body">
                <button
                    style={{ backgroundColor: activeButton === 'emc' ? '#fff' : '#fff',
                    boxShadow: activeButton === 'emc' ? '0px 1px 1px 1px #00cc00' : 'none'
                   }}

                  >
                    <div className="nav-logo">
                    <Player
                      icon={EMC}
                      style={{ width: '50px', height: '50px'}}
                      colorize={ activeButton === 'emc' ? '#00cc00' : '#333'}

                    />
                    </div>
                  <p style={{ color: activeButton === 'emc' ? '#00cc00' : '#333' }}>EMC</p>
                  </button>
                </Link>
              </li>
              <li className="nav-item User">
                <Link to="/User">
                  <button
                    style={{ backgroundColor: activeButton === 'user' ? '#fff' : '#fff',
                    boxShadow: activeButton === 'user' ? '0px 1px 1px 1px #00cc00' : 'none'

                  }}
                  >
                     <div className="nav-logo">
                <Player
                      icon={LOGIN}
                      style={{ width: '50px', height: '50px' }}
                      colorize={ activeButton === 'user' ? '#00cc00' : '#333'}
                    />
                    </div>
                    <p style={{ color: activeButton === 'user' ? '#00cc00' : '#333' }}>Profile</p>
                  </button>
                </Link>
              </li>
              {user.Role === "Admin" ? (
        <>
          <li className="nav-item Inventory">
            <Link to="/Inventory">
              <button
                style={{
                  backgroundColor: activeButton === 'inventory' ? '#fff' : '#fff',
                  boxShadow: activeButton === 'inventory' ? '0px 1px 1px 1px #00cc00' : 'none'
                }}
              >
                <div className="nav-logo">
                  <Player
                    icon={INVENTORY}
                    style={{ width: '50px', height: '50px'}}
                    colorize={ activeButton === 'inventory' ? '#00cc00' : '#333'}
                  />
                </div>
                <p style={{ color: activeButton === 'inventory' ? '#00cc00' : '#333' }}>Inventory</p>
              </button>
            </Link>
          </li>
          <li className="nav-item Reservation">
            <Link to="/Reservation">
              <button
                style={{
                  backgroundColor: activeButton === 'reservation' ? '#fff' : '#fff',
                  boxShadow: activeButton === 'reservation' ? '0px 1px 1px 1px #00cc00' : 'none'
                }}
              >
                <div className="nav-logo">
                  <Player
                    icon={RESERVATION}
                    style={{ width: '50px', height: '50px' }}
                    colorize={ activeButton === 'reservation' ? '#00cc00' : '#333'}
                  />
                </div>
                <p style={{ color: activeButton === 'reservation' ? '#00cc00' : '#333' }}>Reservation</p>
              </button>
            </Link>
          </li>
          <li className="nav-item Report">
            <Link to="/Report">
            <button
                style={{ backgroundColor: activeButton === 'report' ? '#fff' : '#fff',
                boxShadow: activeButton === 'report' ? '0px 1px 1px 1px #00cc00' : 'none'
              }}
              >
                <div className="nav-logo">
                <Player
                  icon={REPORT}
                  style={{ width: '50px', height: '50px' }}
                  colorize={ activeButton === 'report' ? '#00cc00' : '#333'}
                />
                </div>
                <p style={{ color: activeButton === 'report' ? '#00cc00' : '#333' }}>Report</p>
              </button>
            </Link>
          </li>
          <li className="nav-item Settings">
            <Link to="/Settings">
              <button
                style={{
                  backgroundColor: activeButton === 'user' ? '#fff' : '#fff',
                  boxShadow: activeButton === 'user' ? '0px 1px 1px 1px #00cc00' : 'none'
                }}
                >
                <div className="nav-logo">
              <Player
                    icon={LOGIN}
                    style={{ width: '50px', height: '50px' }}
                    colorize={ activeButton === 'user' ? '#00cc00' : '#333'}
                  />
                  </div>
                <p style={{ color: activeButton === 'user' ? '#00cc00' : '#333' }}>Users</p>
                </button>
            </Link>
          </li>
        </>
      ) : (
        user.Role === 'Staff' ? (
          <>
            <li className="nav-item Inventory">
              <Link to="/Inventory">
                <button
                  style={{
                    backgroundColor: activeButton === 'inventory' ? '#fff' : '#fff',
                    boxShadow: activeButton === 'inventory' ? '0px 1px 1px 1px #00cc00' : 'none'
                  }}
                >
                  <div className="nav-logo">
                    <Player
                      icon={INVENTORY}
                      style={{ width: '50px', height: '50px'}}
                      colorize={ activeButton === 'inventory' ? '#00cc00' : '#333'}
                    />
                  </div>
                  <p style={{ color: activeButton === 'inventory' ? '#00cc00' : '#333' }}>Inventory</p>
                </button>
              </Link>
            </li>
            <li className="nav-item Reservation">
              <Link to="/Reservation">
                <button
                  style={{
                    backgroundColor: activeButton === 'reservation' ? '#fff' : '#fff',
                    boxShadow: activeButton === 'reservation' ? '0px 1px 1px 1px #00cc00' : 'none'
                  }}
                >
                  <div className="nav-logo">
                    <Player
                      icon={RESERVATION}
                      style={{ width: '50px', height: '50px' }}
                      colorize={ activeButton === 'reservation' ? '#00cc00' : '#333'}
                    />
                  </div>
                  <p style={{ color: activeButton === 'reservation' ? '#00cc00' : '#333' }}>Reservation</p>
                </button>
              </Link>
            </li>
            {/* Add other Staff specific navigation items here */}
          </>
        ) : null
      )}
              
            </ul>
 
          </div>
          <div className="Login"> 
            <p className='userName'>{user.FullName}</p>
            <button onClick={logOutFunc}>
            Log Out

            </button>
          </div>
      
        </div>
   
    </div>
  );
}
