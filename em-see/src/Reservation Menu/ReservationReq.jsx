import React, { useState, useEffect } from 'react';
import ReqModal from './ReqModal';
import "./ReservationReq.css";
import "./ResList.css";
import Search from "../Body Contents/search.png"
import "../Body Contents/Body.css"
import ResReqHistory from './ResReqHistory';
import LOGO from '../Login component/logo.png';
import Calendar from './Calendar';

const ReservationRequest = ({user, page}) => {
 const [data, setData] = useState([]);
 const [selectedRequest, setSelectedRequest] = useState(null);
 const [isRequestOpen, setRequestOpen] = useState(false);
 const [searchInput, setSearchInput] = useState('');
 const [sortCriteria, setSortCriteria] = useState('eventDate');
 const [sortOrder, setSortOrder] = useState('asc');
 const [resReqModal, setResReqModal] = useState(false)
 const [update, setUpdate] = useState(false);
 const [selectedDate, setSelectedDate] = useState('');
 const [groupedByDay, setGroupByDay] = useState([])
 const [click, setClick] = useState(false)

 useEffect(() => {
  page();
  const dateComponents = selectedDate.split('/');
  const reformattedDate = dateComponents.join('-');  
  fetch(`/Api/reservationRequest/${reformattedDate}`)
    .then((res) => {
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
      return res.json();
    })
    .then((data) => setData(data))
    .catch((error) => console.log('Error fetching data:', error));
}, [selectedDate, update, ]);

console.log(data)
 const sortData = (criteria, order) => {
    const sortedData = [...data].sort((a, b) => {
      let valueA, valueB;

      switch (criteria) {
        case 'eventDate':
          valueA = a.eventDate ? a.eventDate.toLowerCase() : '';
          valueB = b.eventDate ? b.eventDate.toLowerCase() : '';
          break;
        case 'department':
          valueA = a.department ? a.department.toLowerCase() : '';
          valueB = b.department ? b.department.toLowerCase() : '';
          break;
        case 'item':
          valueA = a.itemType ? a.itemType.toLowerCase() : '';
          valueB = b.itemType ? b.itemType.toLowerCase() : '';
          break;
        case 'venue':
          valueA = a.venue ? a.venue.toLowerCase() : '';
          valueB = b.venue ? b.venue.toLowerCase() : '';
          break;
        default:
          break;
      }

      if (order === 'asc') {
        return valueA.localeCompare(valueB);
      } else {
        return valueB.localeCompare(valueA);
      }
   });

    setData(sortedData);
  };

  useEffect(() => {
    sortData(sortCriteria, sortOrder);
  }, [sortCriteria, sortOrder]);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
};
 const handleRequestClick = (request) => {
  // e.preventDefault();
    setSelectedRequest(request);
    setRequestOpen(true);
  };

 const handleRequestClose = () => {
    setRequestOpen(false);
 };


 useEffect(() => {
  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      handleRequestClose();
      setResReqModal(false)
    }
  };

  if (isRequestOpen || resReqModal) {
    document.addEventListener('keydown', handleKeyDown);
  }

  return () => {
    document.removeEventListener('keydown', handleKeyDown);
  };
}, [isRequestOpen, resReqModal]);

 return (
  <>
    <ReqModal
            isOpen={isRequestOpen}
            onClose={handleRequestClose}
            selectedRequest={selectedRequest}
            update={(e) => setUpdate(!update)}
            user={user}
          />
    <ResReqHistory isOpen={resReqModal} onClose={(e) => setResReqModal(false)}/>
    <div className="reservation-request-body">
    <div className="request-label">
          <img src={LOGO} alt="" />
          <h1>Reservation Request</h1>
        </div>
    <Calendar dateSelect={handleDateSelect} requestCount={groupedByDay} exitClicked={click}>
        <div className='custom-calendar-header'>
        <button onClick={() => setClick(!click)} >Return</button>
        <h2>{selectedDate}</h2>
        <button onClick={(e) => setResReqModal(!resReqModal)}>History</button>
        </div>
        


        <div className="reservation-view">
          <div className="request-table-header">
            <ResList
              className="res-header"
              label1= "Event"
              label2= "Event Date"
              label3= "Event Venue"
              label4= "Event Due"
              label5= "Client Id"
              label6= "Department"
              label7= "Contact"
              label8= "Item"
              label9= "Quantity"
            />
          </div>
        
          <div className="request-table-body">
  { data.sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate)) // Sorting by eventDate, from nearest to current date
  .map((item, index) => (
    <ResList
      key={index}
      className="reslist-body"
      label1={item.eventName}
      label2={item.eventDate}
      label3={item.venue}
      label4={item.eventEnd}
      label5={item.clientId}
      label6={item.department}
      label7={item.contactNo}
      label8={item.itemType}
      label9={item.itemQuant}
      onDoubleClick={() => handleRequestClick(item)}
    />
  ))}

          </div>
        </div>      
    </Calendar>
    </div>

    </>
 );
};
const ResList = (props) => {
  return (
    <div className={`Reslist ${props.className}`} onClick={props.onDoubleClick}>
      <div className='long'>{props.label1}</div>
      <div className='long'>{props.label2}</div>
      <div className='long'>{props.label4}</div>
      <div className='fixed'>{props.label3}</div>
      <div className='short'>{props.label5}</div>
      <div className='short'>{props.label6}</div>
      <div className='fixed'>{props.label7}</div>
      <div className='fixed'>{props.label8}</div>
      <div className='short'>{props.label9}</div>
    </div>
  );
};

export default ReservationRequest;