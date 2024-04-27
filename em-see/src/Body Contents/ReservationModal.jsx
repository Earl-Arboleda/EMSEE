import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ReservationModal.css';

const ReservationModal = ({ isOpen, onClose, user, setReserve }) => {
  const [addedItems, setAddedItems] = useState([]);
  const [data, setData] = useState([]);
  const [reservistId, setReservistId] = useState('');
  const [resUser, setResUser] = useState({ FullName: '', UserId: '' });
  const [resUserName, setResUserName] = useState();
  const [dateTime, setDateTime] = useState('');
  const [purpose, setPurpose] = useState('');
  const [contact, setContact] = useState('');
  const [formattedDate, setFormattedDate] = useState('');
  const [formattedEnd, setFormattedEnd] = useState('');
  const [department, setDepartment] = useState('');
  const [eventVenue, setEventVenue] = useState('Classroom');
  const currentDate = new Date().toISOString().slice(0, -8); // Get current date and time in YYYY-MM-DDTHH:MM format
  const [itemCategory, setItemCategories] = useState([])
  const [customVenue, setCustomVenue] = useState(false);

  const closeModal = () => {
    
    setReservistId('');
    setResUserName('');
    setFormattedDate('');
    setFormattedEnd('');
    setPurpose('');
    setContact('');
    setEventVenue('Classroom');
    setReserve(false);
  }

  useEffect(() => {
    fetch('/Api/Inventory')
        .then((res) => res.json())
        .then((data) => {
            setData(data);
            // Extract unique ItemNames using Set
            const uniqueItemNames = new Set(data.map((item) => item.ItemName));
            // Convert Set back to an array
            setItemCategories(Array.from(uniqueItemNames));
        })
        .catch((error) => console.error('Error fetching inventory:', error));
}, []);

const handleVenueChange = (e) => {
  const selectedValue = e.target.value;
  if (selectedValue === 'Others') {
    setEventVenue('');

    setCustomVenue(!customVenue);
  } else {
    setEventVenue(selectedValue);
  }
};

  const invalidRequest = (e) => {
    e.preventDefault();
    if(user.Role === "Admin" || user.Role === "Staff"){
      if(!reservistId || !resUserName || !purpose || !contact || !formattedDate || !formattedEnd || !department || !eventVenue){
        toast.error("Please fill in all required fields");
      }else{
        handleSubmit(e);
      }
    }else if(user.Role === "Client") {
      if(!user.FullName || !user.UserId || !purpose || !contact || !formattedDate || !formattedEnd || !department || !eventVenue) {
      toast.error("Please fill in all required fields");
    } else {
      handleSubmit(e);
    }}
  } 


  const handleChangeEventDate = (event) => {
    const newDateTime = event.target.value;
 
    setFormattedDate(newDateTime);
    setFormattedEnd('')
  };
  const handleChangeEventEnd = (event) => {
    const newEndTime = event.target.value;
    
    setFormattedEnd(newEndTime)
  };


  useEffect(() => {
    if(reservistId.length > 5 && reservistId.length < 11){
    fetch(`/Api/ClientId/${reservistId}`)
      .then((res) => res.json())
      .then((data) => setResUser(data))
      .catch((error) => console.log("error", error))
      }
  }, [reservistId]);

  useEffect(() => {
    setResUserName(resUser.FullName)
  },[resUser])

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (addedItems.length === 0 || addedItems.some((item) => item.item === '')) {
      toast.error('Please select at least one item before submitting.');
      return;
    }
    
    let formValues;
    if(user.Role === "Admin"){
      formValues =  {
        clientName: resUserName,
        clientId: reservistId,
        purpose: purpose,
        department: department,
        venue: eventVenue, 
        eventDate: formattedDate,
        eventEnd: formattedEnd,
        contactInfo: contact,
      };
    }else{
      formValues =  {
        clientName: user.FullName,
        clientId: user.UserId,
        purpose: purpose,
        department: department,
        venue: eventVenue, 
        eventDate: formattedDate,
        eventEnd: formattedEnd,
        contactInfo: contact,
      };
    }

    const itemsData = addedItems.map((addedItem) => ({
      item: addedItem.item,
      quantity: addedItem.quantity,
    }));

    const requestData = { ...formValues, items: itemsData };
    console.log(requestData)
    try {
      const response = await fetch('/Api/submitReservation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      closeModal()
      onClose();
      setReserve(false);

      setAddedItems([]);

      toast.success('Form submitted successfully');
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Error submitting form:', error.message || 'An error occurred');
    } 
    };


  const handleAddItem = () => {
    setAddedItems((prevItems) => [
      ...prevItems,
      { item: '', quantity: 1 },
    ]);
  };

  const handleRemoveItem = () => {
    setAddedItems((prevItems) => prevItems.slice(0, -1));
  };

  const handleItemChange = (index, key, value) => {
    setAddedItems((prevItems) =>
      prevItems.map((item, i) =>
        i === index ? { ...item, [key]: value } : item
      )
    );
  };

  useEffect(() => {
    if (!isOpen) {
      setDepartment('');
    }
  }, [isOpen]);


  return (
    <div className={`reservation-modal ${isOpen ? 'open' : ''}`} >
      <div className="reservation-modal-content">
        <div className="reservation-modal-label">
        <h3>Reservation Form</h3>
        <span onClick={closeModal}>&#10006;</span>
        </div>
       
      
        
        
        <div className="reserve-container">
          <div className='reserve-wrapper'>
        <form >
          <div className="label-group">
              <label>
            Client Id:
            {user && user.Role === 'Admin' || user.Role === 'Staff'? (
              <input
                type="text"
                name="clientId"
                required
                value={reservistId}
                maxLength={10}
                onChange={(e) => setReservistId(e.target.value)}
                />
            ) : (
              <div className='label-div'>
                <input type="text" className='client-fields' required disabled value={user.UserId} style={{border:"none", backgroundColor:"#fff"}} />
              </div>
            )}
          </label>
          <label>
            Client Name: <br/>
            {user && user.Role === "Admin" || user.Role === "Staff" ? (
              <input type="text" disabled required value={!reservistId ? ("Enter Client Id"):(resUserName ? (resUserName) : ('User not found'))} style={{border:"none"}} />
            ):(
              <input type="text" disabled required value={user.FullName} style={{border:"none", backgroundColor:"#fff"}} />
            )}
          
  
          </label>
          </div>
          <div className="label-group">
          <label>
            Purpose:
            <input type="text" name="purpose" required onChange={(e) => setPurpose(e.target.value)} value={purpose} />
          </label>
          <label>
            Contact No:
            <input type="text" name="contactInfo" required value={contact} onChange={(e) => setContact(e.target.value)} />
          </label>
          </div>
          <div className="label-group">
          <label>
            Department:
            <select
              name="department" 
              onChange={(e) => setDepartment(e.target.value)}
               required
              value={department}
            > 
              <option value="" hidden>Select</option>
              <option value="CAS">CAS</option>
              <option value="CBA">CBA</option>
              <option value="CEAC">CEAC</option>
              <option value="CED">CED</option>
              <option value="GS/LAW">GS/LAW</option>
              <option value="Others">Other offices</option>
            </select>
          </label>
          <label>
            Venue:
            {customVenue ? (<input type='text' value={eventVenue} onChange={handleVenueChange}/>):(
            <select
            name="venue" 
            
            onChange={handleVenueChange}
             required
            value={eventVenue}
          >
            <option value="Classrooms">Classroom</option>
            <option value="Gym">Gymnasium</option>
            <option value="RS">Reviewing Stand</option>
            <option value="AVR3">AVR 3</option>
            <option value="AVR4">AVR 4</option>
            <option value="BRC Dining">BRC Dining Hall</option>
            <option value="SMC">SMC Hall</option>
            <option value="BRC">BRC Hall</option>
            <option value="Alumni Hall">Alumni Center</option>
            <option value="Function Hall">GS Function Hall</option>
            <option value="Off Campus">Off Campus</option>
            <option value="Others">Others</option>
          </select>
            )}

          </label>
  
          </div>

          <div className="label-group">
            <label>
              Reservation Date:
              <input type="datetime-local" name="eventDate" min={currentDate} required value={formattedDate} onChange={handleChangeEventDate} />
            </label>
            <label>
              Until:
              <input type="datetime-local" name="eventDate" min={formattedDate} required value={formattedEnd} onChange={handleChangeEventEnd} disabled={!formattedDate ? true:''} />
            </label>
          </div>
          
        </form> 

        <div className="reserved-items">
          <div className="reserved-items-buttons">
          <button onClick={handleAddItem}>Add</button>
          <button className='remove' onClick={handleRemoveItem} >Remove</button>
          </div>
          <div className="item-wrapper">
          <div className="item-field">
            {addedItems.map((addedItem, index) => (
              <div className="item-request" key={index}>
                <select
                  value={addedItem.item}
                  onChange={(e) =>
                    handleItemChange(index, 'item', e.target.value)
                  }
                >
                  <option value="" disabled hidden>Select Item</option>
                  {itemCategory.map((item) => {
                      return(
                        <option value={item}>{item}</option>
                      )
                  })}
                </select>
                <input
                  type="number"
                  min={1}
                  value={addedItem.quantity}
                  onChange={(e) =>
                    handleItemChange(index, 'quantity', e.target.value)
                  }
                />
              </div>
            ))}
          </div>
          </div>
          
        </div>
        </div>
        </div>
        <div className="submit-btn-div">
            <button onClick={invalidRequest}>Submit</button>
        </div>
      </div>
    </div>
  );
};

export default ReservationModal;
