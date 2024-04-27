import React, {useState, useEffect} from "react";
import "./UserProfile.css";

const UserProfile = ({ user, isOpen, onClose }) => {
    const [userHistory, setUserHistory] = useState([]);
    const userProfile = user;
    useEffect(() => {
        fetch(`/Api/User-history/${userProfile.UserId}`)
        .then((res) => res.json())
        .then((data) => setUserHistory(data))
        .catch((err) => console.log('Failed to fetch', err))
    }, [userProfile.UserId]);
    
    return (
        <div className={`user-profile ${isOpen ? 'open' : ''}`}>
            <div className="user-profile-content">
                <div className="user-profile-label">
                    <h1>User Profile</h1>
                    <span onClick={() => onClose()}>&times;</span>
                </div>
                <div className="user-information">
                    <h3>{user.FullName} ({user.UserId})</h3>
                    <p>{user.Role} {user.Department}</p>
                </div>
                <div className="user-transaction-history-label"><h1>Transaction History</h1></div>

                <div className="user-transaction-history">
                    
                    <div className="user-transaction head">
                        <div className="">Item Code</div>
                        <div className="">Borrow Date</div>
                        <div className="">Return Date</div>
                        <div className="">Status</div>
                    </div>
                    
                    <div className="user-transaction-body-wrapper">
                    {userHistory.length > 0 ? (
                    userHistory
                        .sort((a, b) => new Date(b.borrowDateTime) - new Date(a.borrowDateTime))
                        .map((item, index) => {
                            return (
                                <div className="user-transaction body" key={index}>
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
        </div>
    );
};


export default UserProfile;
