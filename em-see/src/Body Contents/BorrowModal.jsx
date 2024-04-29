import React, { useEffect, useState } from 'react';
import "./BorrowModal.css";
import { toast } from 'react-toastify';

const BorrowModal = ({ user, isOpen, onClose, borrowList, setUpdate }) => {
  const [inchargeName, setInchargeName] = useState(user.FullName);
  const [borrowerId, setBorrowerId] = useState('');
  const [clientInfo, setclientInfo] = useState(
    { FullName: '', UserId: '' }
  );
  const [clientName, setclientName] = useState()
  useEffect(() => {
    if(borrowerId.length > 5 && borrowerId.length < 11){
      fetch(`/Api/ClientId/${borrowerId}`)
      .then((res) => res.json())
      .then((data) => { setclientInfo(data)
      setclientName(clientInfo.FullName)})
      .catch((error) => console.log("error", error))
    }
  }, [borrowerId]);

  useEffect(() => {
    setclientName(clientInfo.FullName)
  },[clientInfo])
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (clientInfo === null) {
      toast.error("Invalid User");
    } else {
      const information = {
        inchargeName,
        clientId: clientInfo.UserId,
        clientName: clientInfo.FullName,
        items: borrowList,
      };
  
      try {
        const response = await fetch('/Api/Borrow', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(information),
        });
  
        if (response.ok) {
          toast.success('Items borrowed successfully.');
          setBorrowerId('');
          setUpdate();
          onClose();
        }else{
          throw new Error('Failed to borrow items. Please try again.');

        }
  

      } catch (error) {
        console.error('Error submitting transactions:', error);
        toast.error(error.message || 'An error occurred');
      }
    }
  };
  
  console.log(borrowList)

  return (
    <div className={`borrow-modal ${isOpen ? 'open' : ''}`} >
      <div className="borrow-modal-content">
        <div className="borrow-modal-label">
        <h3>Borrow Items</h3>
        <span className="borrow-close" onClick={onClose}>&times;</span>
        </div>
        <div className="borrow-flex">
          <div className="borrow-flex-column">
            <form className="borrow-form">
              <p>Client Information:</p>
              <div className="form-div">

                <label className="borrow-label">
                  Client's Id:
                  <input
                    type="text"
                    value={borrowerId}
                    onChange={(e) => setBorrowerId(e.target.value)}
                    className="borrow-input"
                  />
                </label>
                <label className="borrow-label">
                  Client Name:
                  <br />
                  <input
                    className='fixed-inputs'
                    type="text"
                    value={!borrowerId ? ("Enter Client Id"):(clientName ? (clientName || "User not found") : ('User not found'))}
                    disabled
                    required
                  />
                </label>

                <label className="borrow-label">
                  Incharge:
                  <br />
                  <input className='fixed-inputs' type="text" value={inchargeName} disabled />
                </label>
              </div>
            </form>
            <div className='selected-items'>
              <p>Selected Items:</p>
              <ul className="borrow-ul">
                {borrowList.map((item) => (
                  <li key={item.itemCode}>
                    {item.itemCode}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="borrow-button-holder">
            <button type="submit" className="borrow-button" onClick={{handleSubmit}} disabled={!clientName}>Submit</button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default BorrowModal;
