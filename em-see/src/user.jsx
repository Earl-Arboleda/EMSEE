import React, {useState, useEffect} from "react";

import LOGO from './Login component/logo.png'
import "./user.css"
const User = ({user,page, menu}) => {
    const [userHistory, setUserHistory] = useState([]);
    const [reqHistory, setReqHistory] = useState([]);
    const [userTab, setUserTab] = useState('history');
    const userProfile = user;
    useEffect(() => {
        fetch(`http://localhost:5000/User-history/${userProfile.UserId}`)
        .then((res) => res.json())
        .then((data) => setUserHistory(data))
        .catch((err) => console.log('Failed to fetch', err))
    }, [userProfile.UserId]);

    useEffect(() => {
        fetch(`http://localhost:5000/Request-summary/${userProfile.UserId}`)
        .then((res) => res.json())
        .then((data) => setReqHistory(data))
        .catch((err) => console.log('failed to fetch', err))
    },[userTab])

    useEffect(() => {
        page();
      },[])
    const handleMenuClick = () => {
        menu();
      };
    
    return(
        <div className="profile-page">
            <div className="profile-page-label">
                <img src={LOGO} alt="EMC" onClick={handleMenuClick} />
                <h1>User Profile</h1>
            </div>
            <div className="profile-info">
                <div className="personal-info">
                    <h3>{user.FullName} ({user.UserId})</h3>
                    <p>{user.Department} {user.Role}</p>
                </div>
                <div className="profile-transaction">
                    <div className="transaction-reservation-button">
                        <button style={userTab === 'history' ? {borderBottom: '2px solid #00cc00', fontWeight:'bold'}:null} onClick={() => setUserTab('history')}>Transactions History</button>
                        <button style={userTab === 'request' ? {borderBottom: '2px solid #00cc00', fontWeight:'bold'}:null} onClick={() => setUserTab('request')}>Reservation Request</button>
                    </div>
                    {userTab === 'history' ? (
                             <div className="transaction-wrapper">
                
                             <div className="profile-transaction-history">            
                                 <div className="personal-transaction head">
                                     <div className="">Item Code</div>
                                     <div className="">Borrow Date</div>
                                     <div className="">Return Date</div>
                                     <div className="">Status</div>
                                 </div>
                                 
                                 <div className="personal-transaction-body-wrapper">
                                 {userHistory.length > 0 ? (
                                 userHistory
                                     .sort((a, b) => new Date(b.borrowDateTime) - new Date(a.borrowDateTime))
                                     .map((item, index) => {
                                         return (
                                             <div className="personal-transaction body" key={index}>
                                                 <div className="">{item.itemCode}</div>
                                                 <div className="">{item.borrowDateTime}</div>
                                                 <div className="">{item.returnDateTime ? item.returnDateTime : "Unreturned"}</div>
                                                 <div className="">{item.status ? item.status : "N/A"}</div>
                                             </div> 
                                         );
                                     })
                             ) : (<div style={{display:"flex", justifyContent:'center'}}>No Transaction History</div>)}
         
                                 </div>
                             </div>
                             </div>
                    ):(
                    <div className="request-summary">
                        <div className="request-history-head">
                            <div>Event Name</div>
                            <div>Event Date</div>
                            <div>Item Code</div>
                            <div>Status</div>
                        </div>
                        <div className="request-history-body-wrapper">
                            {reqHistory.length > 0 ? (reqHistory.map((item, index) => {
                                return(
                                    <div className="request-history-body" key={index}>
                                    <div>{item.eventName}</div>
                                    <div>{item.eventDate}</div>
                                    <div>{item.itemName}</div>
                                    <div>{item.status}</div>
                                    </div>
                                )
                            })):(<div style={{display:"flex", justifyContent:'center'}}>No Reservation Request History</div>)}
                        </div>
                    </div>
                    )}
               
                
                </div>
            </div>
        </div>
        
    )
}
export default User;