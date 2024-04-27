import React from "react";
import { useState, useEffect } from "react";
import "./UserManagement.css"
import Search from "../Body Contents/search.png";
import Register from "./Register";
import Confirmation from "../Confirmation";
import { toast } from "react-toastify";
import UserProfile from "./UserProfile";
import LOGO from '../Login component/logo.png';
import BatchRegister from './BatchRegister'

const UserManagement = ({page, openMenu}) => {
    const [sortCriteria, setSortCriteria] = useState('role');
    const [sortOrder, setSortOrder] = useState('asc');
    const [userData, setUserData] = useState([]);
    const [searchInput, setSearchInput] = useState('');
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [register, setRegister] = useState(false);
    const [update, setUpdate] = useState(false);
    const [confirmation,setConfirmation] = useState(false)
    const [userProfile, setUserProfile] = useState(false);
    const [vieweProfile, setVieweProfile] = useState({});
    const [batchReg, setBatchReg] = useState(false);


    const openUserProfile = (user) => {
        setVieweProfile(user)
        setUserProfile(!userProfile)
    }

    const confirmationOpen = () => {
        if(selectedUsers.length === 0){
            toast.error('Select at least one User')
        }else{
            setConfirmation(!confirmation)
        }
    }
    useEffect(() => {
        page();
      },[])
    const openRegister = () => {
        setRegister(!register)
    }

    useEffect(() => {
        fetch('/Api/User-management')
            .then((res) => res.json())
            .then((data) => setUserData(data))
            .catch((error) => console.log('Error fetching data', error))
    }, []);
    useEffect(() => {
        fetch('/Api/User-management')
            .then((res) => res.json())
            .then((data) => setUserData(data))
            .catch((error) => console.log('Error fetching data', error))
    }, [update]);

    const deleteUser = (user) => {
        fetch('/Api/Delete-user', {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(user)
        }).then(response => {
            if(response.ok){
                setSelectedUsers([]); // Reset selected users
                setUpdate(prevUpdate => !prevUpdate); // Toggle update to trigger useEffect
                toast.success('User/s deleted successfully')
            }
        }).catch(error => console.error('Error deleting user:', error));
    };
    

    const confirmHandler = () => {
        deleteUser(selectedUsers)
        setConfirmation(false)
    }
const sortData = (criteria, order) => {
    const sortedData = [...userData].sort((a, b) => {
        let valueA, valueB;
        switch (criteria) {
            case 'Department':
                valueA = a.Department ? a.Department.toLowerCase() : '';
                valueB = b.Department ? b.Department.toLowerCase() : '';
                break;
            case 'Role':
                valueA = a.Role ? a.Role.toLowerCase() : '';
                valueB = b.Role ? b.Role.toLowerCase() : '';
                break;
            default:
                break;
        }
        // Check if valueA or valueB is undefined
        if (typeof valueA === 'undefined') valueA = '';
        if (typeof valueB === 'undefined') valueB = '';
        return order === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
    });
    setUserData(sortedData);
};

    useEffect(() => {
        sortData(sortCriteria, sortOrder);
    }, [sortCriteria, sortOrder]);

    const selectUser = (userId) => {
        setSelectedUsers(prevSelectedUsers => {
            if (prevSelectedUsers.includes(userId)) {
                return prevSelectedUsers.filter(id => id !== userId);
            } else {
                return [...prevSelectedUsers, userId];
            }
        });
    };

    
    const selectAll = () => {
        setSelectedUsers(prevSelectedItems => {
            if (prevSelectedItems.length === userData.length) {
                // If all items are already selected, deselect all
                return [];
            } else {
                // If not all items are selected, select all
                return userData.map(item => item.UserId);
            }
        });
    };
    
    
    useEffect(() => {
        const handleKeyDown = (event) => {
          if (event.key === 'Escape') {
            setRegister(false);
            setUserProfile(false);
          }
        };
      
        if (register || userProfile) {
          document.addEventListener('keydown', handleKeyDown);
        }
      
        return () => {
          document.removeEventListener('keydown', handleKeyDown);
        };
      }, [register, userProfile]);
    return(
        <>
        <BatchRegister isOpen={batchReg} onClose={() => setBatchReg(false)} update={() => setUpdate(!update)}/>
        <Confirmation isOpen={confirmation} confirmHandler={confirmHandler} onClose={() => setConfirmation(!confirmation)} />
        <UserProfile user={vieweProfile}isOpen={userProfile} onClose={() => setUserProfile(false)}/>
        <Register isOpen={register} onClose={() => setRegister(false)} update={() => setUpdate(!update)}/>
        <div className="userManagement">
            <div className="user-label">
                <img onClick={() => openMenu()} className="touchScreen" src={LOGO} alt="EMC" />
                <img className="desktop" src={LOGO} alt="EMC" />
                <h1>User Management</h1>
            </div>
            <div className="user-table">
                <div className="user-table-header">
                    <div className='Sorting'>   
                        <div className='register-delete-div'>
                            <button onClick={() => setBatchReg(!batchReg)}>Batch Register</button>
                            <button onClick={openRegister}>Register</button>
                            <button onClick={confirmationOpen} >Delete</button>
                        </div>
                        <div className="search-sort-container">
                        <div className='dropdowns'>
                            <label>
                            Sort by:
                            <select
                                value={sortCriteria}
                                onChange={(e) => setSortCriteria(e.target.value)}
                            >
                                <option value='Department'>Department</option>
                                <option value='Role'>Role</option>
                            </select>
                            </label>
                            <label>
                            Order:
                            <select
                                value={sortOrder}
                                onChange={(e) => setSortOrder(e.target.value)}
                            >
                                <option value='asc'>Ascending</option>
                                <option value='desc'>Descending</option>
                            </select>
                            </label>
                        </div>
                        <div className='user-search'>
                            <form>
                                <input
                                className='search'
                                type='text'
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                />
                                <button type='submit'>
                                <img src={Search} alt="search" />
                                </button>
                            </form>
                            </div>
                
                    </div>
                    </div>
                    <div className="user-table-body-header">
                        <input
                        onChange={selectAll}
                        checked={selectedUsers.length === userData.length} 
                        type="checkbox"></input>
                        <div className="head">Full Name</div>
                        <div className="head">User ID</div>
                        <div className="head">Department</div>
                        <div className="head">Role</div>
                    </div>
                </div>
                <div className="user-table-body">
                    <div className="user-table-body-wrapper">
                {userData.filter(user => 
                    user.FullName.toLowerCase().includes(searchInput.toLowerCase()) ||
                    user.UserId.toString().includes(searchInput.toLowerCase())
                ).map(user => (
                    <div onDoubleClick={() => openUserProfile(user)} className="user-entry" key={user.UserId}>
                        <input 
                            type="checkbox"
                            checked={selectedUsers.includes(user.UserId)}
                            onChange={() => selectUser(user.UserId)}
                        />
                        <div></div>
                        <div className="bode">{user.FullName}</div>
                        <div className="bode">{user.UserId}</div>
                        <div className="bode">{user.Department}</div>
                        <div className="bode">{user.Role}</div>
                    </div>
                ))}
                </div>
                </div>
            </div>
        </div>
        </>
    )
}
export default UserManagement;