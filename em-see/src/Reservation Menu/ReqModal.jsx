import React from 'react';
import './ReqModal.css';
import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';
import Confirmation from '../Confirmation';

const ReqModal = ({ isOpen, onClose, selectedRequest,update, user  }) => {
    const [confirmationOpen, setConfirmation] = useState(false)
    const [data, setData] = useState([])
    const [method, setMethod] = useState('');
    const [addedItems, setAddedItems] = useState([{ item: '' , quantity: '' }]);
    

    useEffect(() => {
      fetch('/Api/Available')
        .then((res) => res.json())
        .then((data) => setData(data))
        .catch((error) => console.log('error', error));
    }, [update]);
    

    useEffect(() => {
      const handleKeyDown = (event) => {
        if (event.key === 'Escape') {
          closeConfirmation();
        }
      };
  
      if (confirmationOpen) {
        document.addEventListener('keydown', handleKeyDown);
      }
  
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }, [confirmationOpen]);

    if (!isOpen || !selectedRequest) {
    return null;
  }
  
  const handleClose = () => {
    setAddedItems([{ item: '', quantity: '' }]);
    onClose(false);
    update();
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...addedItems];
    updatedItems[index][field] = value;
    setAddedItems(updatedItems);
  };

  const handleAddItem = () => {
    setAddedItems([...addedItems, { item: '', quantity: '' }]);
  };

  const handleRemoveItem = (index) => {
    const updatedItems = [...addedItems];
    updatedItems.splice(index, 1);
    setAddedItems(updatedItems);
  };

  const deleteRequest = () => {
    fetch('/Api/Reservation-reject', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...selectedRequest, Incharge: user.FullName
      }),
    });
    toast.success('Request has been rejected')
    closeConfirmation();
    update();
    

  }

  


  const handleReserveConfirmation =(e)=> {
    e.preventDefault();
    setConfirmation(!confirmationOpen);
    setMethod('Reserve')

  }


  const handleRejectConfirmation =(e)=> {
    e.preventDefault();
    setConfirmation(!confirmationOpen);
    setMethod('Reject')


  }

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const reservationData = {
      reservation: selectedRequest.resevationId,
      clientName: selectedRequest.clientName,
      clientId: selectedRequest.clientId,
      eventName: selectedRequest.eventName,
      venue: selectedRequest.venue,
      eventDate: selectedRequest.eventDate,
      eventEnd: selectedRequest.eventEnd,
      contactNo: selectedRequest.contactNo,
      ItemName: selectedRequest.itemType,
      Incharge: user.FullName,
      ItemCode: addedItems.map((item) => item.item),
    };

    try {
        const response = await fetch('/Api/Reservations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(reservationData),
        });
      
        if (response.ok) {
          toast.success('Item Reserved successfully');
          
          setAddedItems([{ item: '', quantity: '' }]);
          closeConfirmation();
          onClose(false);
          update();
          } else {
          toast.error('Item Reservation Failed');
          }  
      } catch (error) {
        console.error('Fetch error:', error);
      }
    }

  const closeConfirmation = () => {
    setConfirmation(false)
    setMethod('')
  }

  const confirmHandler = (e) => {
    if(method === 'Reserve'){
      handleFormSubmit(e);
      onClose();
      setMethod('')

    }else if(method === 'Reject'){
      deleteRequest();
      onClose();
      setMethod('')

    }
  }


  return (

    <>
    <Confirmation
    isOpen={confirmationOpen}
    onClose={closeConfirmation}
    confirmHandler={confirmHandler}
    method={method}
    />
    <div className="req-modal">
      <div className="req-modal-container">
        <div className="req-modal-label">  
        <p>Reservation Request</p>
        <span onClick={handleClose}>&times;</span>
        </div>

      
        <form onSubmit={(e) => handleReserveConfirmation(e)}>
          <div className="reserve-list-item-container">
          <table>
            <tbody>
              <tr>
                <td><p>Client Name: </p></td>
                <td><p>{selectedRequest.clientName}</p></td>
              </tr>
              <tr>
                <td><p>Client Id: </p></td>
                <td><p>{selectedRequest.clientId}</p></td>
              </tr>
              <tr>
                <td><p>Purpose: </p></td>
                <td><p>{selectedRequest.eventName}</p></td>
              </tr>
              <tr>
                <td><p>Venue: </p></td>
                <td><p>{selectedRequest.venue}</p></td>
              </tr>
              <tr>
                <td><p>Event Date:</p></td>
                <td><p>{selectedRequest.eventDate}</p></td>
              </tr>
              <tr>
                <td><p>Event Due:</p></td>
                <td><p>{selectedRequest.eventEnd}</p></td>
              </tr>
              <tr>
                <td><p>Contact:</p></td>
                <td><p>{selectedRequest.contactNo}</p></td>
              </tr>
              <tr>
                <td><p>Item:</p></td>
                <td><p>{selectedRequest.itemType}</p></td>
              </tr>
              <tr>
                <td><p>Quantity:</p></td>
                <td><p>{selectedRequest.itemQuant}</p></td>
              </tr>
            </tbody>
          </table>
        <div className="reserve-item-selection">
        <span>Reserve Items:</span>
        <div className="reserve-item-container">
                    {addedItems.map((addedItem, index) => (
                      <div className="request-select" key={index}>
                        <select
                          value={addedItem.item}
                          onChange={(e) => handleItemChange(index, 'item', e.target.value)}
                          required
                        >
                          <option value="" hidden disabled>Select Item</option>
                          {data.filter((item) => item.ItemName === selectedRequest.itemType).length === 0 ? (
                                  <option disabled>No item available</option>
                              ) : (
                                  data.filter((item) => item.ItemName === selectedRequest.itemType).map((item) => (
                                      <option key={item.ItemId} value={item.ItemCode}>
                                          {item.ItemCode}
                                      </option>
                                  ))
                              )}


                        </select>
                        <button className='remove-button' type="button" onClick={() => handleRemoveItem(index)}>
                          Remove
                        </button>
                      </div>
                    ))}
                    <button className='add-button' type="button" onClick={handleAddItem}>
                      Add
                    </button>
                    </div>
        </div>
        </div>
          <div className="req-button-holder">
            <button className='req-reject' onClick={(e) => handleRejectConfirmation(e)}>Reject</button>
            <button type="submit">Submit</button>
          </div>
        </form>
        
      </div>
    </div>
    </>
  );
};


export default ReqModal;
