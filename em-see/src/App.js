// App.js

import React, { useState, useEffect } from 'react';
import './App.css';
import './App.scss';
import { Route, Routes } from 'react-router-dom';
import Carousel from './CarouselComp';
import { Available, Body} from './Body Contents/Body';
import Header from './Header';
import Borrow from './Body Contents/Borrowed';
import Reserved from './Body Contents/Reserved';
import Login from './Login component/LoginPage';
import { ToastContainer } from 'react-toastify';
import Inventory from './Inventory Components/Inventory';
import ReservationRequest from './Reservation Menu/ReservationReq';
import UserManagement from './Register Components/UserManagement';
import History from './Body Contents/History';
import Report from './Report';
import EquipmentInv from './Report Components/EquipmentInventory';
import TransactionHistory from './Report Components/TransactionHistory';
import User from './user';
import ExampleComponent from './Sample';
function App() {
  const [user, setUser] = useState(() => {
    const storedUserData = localStorage.getItem('userData');
    return storedUserData ? JSON.parse(storedUserData) : null;
  });

  const [update, setUpdate] = useState(false);
  const [page, setPage] = useState('home');
  const [emcState, setEmcState] = useState('available');
  const [isLoggedIn, setLoggedIn] = useState(!!user);
  const [reserve, setReserve] = useState(false)
  const [menu, setMenu] = useState(false)
  
  useEffect(() => {
    localStorage.setItem('userData', JSON.stringify(user));
    localStorage.setItem('isLoggedIn', JSON.stringify(isLoggedIn));
  }, [user, isLoggedIn]);


  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setLoggedIn(true);
  };
  const handleLogout = () => {
    setUser(null);
    setLoggedIn(false);
  };
  return (
    <div className='App'>
      {!isLoggedIn && <Login onLoginSuccess={handleLoginSuccess} />}
      {isLoggedIn && (
        <div className='App-header-body'>
          <ToastContainer />
          <Header  user={user} menu={menu} setMenu={() => setMenu(false)} page={page} Logout={handleLogout} />
         
          <div className='app-content' onClick={menu ? (() => setMenu(false)):null}>
          <Routes>
            <Route path='/' index element={<Carousel menu={() => setMenu(!menu)}  page={() => setPage('home')} />} />
            <Route path='/Body/*' element={<Body user={user} menu={() => setMenu(!menu)} emcState={emcState} Reserve={() => setReserve(!reserve)}  page={()=> setPage('emc')}/>}>
              <Route
                index
                element={<Available user={user} emcState={() => setEmcState('available')} setReserve={(param) => setReserve(param)} Reserve={reserve} active update={update} setUpdate={(e) => setUpdate(!update)} />}
              />
              <Route
                path='Reserved'
                element={<Reserved user={user} update={update}  emcState={() => setEmcState('reserved')} setUpdate={(e) => setUpdate(!update)}/>}
              />
              <Route
                path='Borrowed'
                element={<Borrow user={user} update={update}  emcState={() => setEmcState('borrowed')} setUpdate={(e) => setUpdate(!update)}/>}
              />
              <Route 
                path='History'
                element={<History user={user} update={update} emcState={() => setEmcState('history')}  setUpdate={(e) => setUpdate(!update)}/>} />
            </Route>
            <Route
              path='/Inventory'
              element={<Inventory user={user} update={update}  page={()=> setPage('inventory')}  setUpdate={(e) => setUpdate(!update)} />}
            />
            <Route
              path='/Reservation'
              element={<ReservationRequest user={user} page={()=> setPage('reservation')} update={update}  setUpdate={(e) => setUpdate(!update)} />}
            />
            <Route path='/Report/*' element={<Report page={() => setPage('report')}/>}>
              <Route index element={ <EquipmentInv />} />
              <Route path='TransactionHistory' element={ <TransactionHistory />}/>
            </Route>
            <Route path='/Settings' element={<UserManagement page={() => setPage('user')} openMenu={() => setMenu(!menu)} />} />
            <Route
              path='/User'
              element={<User user={user} page={() => setPage('user')} menu={() => setMenu(!menu)}/>}
            />
          </Routes>
        </div>
        </div>
      )}
    </div>
  );
}

export default App;
