import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import './Reserved.css';
import Release from "./Release";
import View from "./ViewModal";
import Calendar from "./ReservationCalendar";

const Reserved = ({user, emcState}) => {
  const [reservedData, setReservedData] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedDate, setSelectedDate] = useState()
  const [releaseOpen, setReleaseOpen] = useState(false);
  const [isViewOpen, setViewOpen] = useState(false);
  const [update, setUpdate] = useState(false);

  useEffect(() => {
    emcState();
    if(selectedDate){const dateComponents = selectedDate.split('/');
    const reformattedDate = dateComponents.join('-');
    fetch(`/Api/Reserved/${reformattedDate}`)
      .then((res) => res.json())
      .then((data) => {
        const groupedData = groupReservationData(data);
        setReservedData(groupedData);
      })
      .catch((error) => console.log('Error fetching Reserved data:', error));}
  }, [selectedDate, update]);
  
  const groupReservationData = (data) => {
    const groupedData = {};
  
    data.forEach((reservation) => {
      const {
        eventDate,
        eventEnd,
        clientId,
        clientName,
        eventName,
        venue,
        status,
        ...reservationData
      } = reservation;
      const key = `${clientName} ${clientId} - ${eventName},  ${venue} - (${eventDate} - ${eventEnd})`;
      if (!groupedData[key]) {
        groupedData[key] = [];
      }
      // Include status in each reservation object
      groupedData[key].push({
        eventDate,
        eventEnd,
        clientId,
        clientName,
        eventName,
        venue,
        status, // Include status here
        ...reservationData,
      });
    });
  
    const groupedArray = Object.entries(groupedData).map(([key, value]) => ({
      eventGroup: key,
      reservations: value,
      // Include status here
      status: value[0].status, // Assuming status is the same for all reservations in the group
    }));
    return groupedArray;
  };

  
  const openReleaseModal = (group) => {
    setSelectedItems(group)
    setReleaseOpen(!releaseOpen)
 
  };

  const closeReleaseModal = () => {
    setUpdate(!update)
    setReleaseOpen(false);
  };
  
 
  const handleSelectDate = (date) => {
    setSelectedDate(date)
  }
  const handleReturn = () => {
    setReservedData([])
    setSelectedDate()
  }

  return (
    <>
      <Release
        isOpen={releaseOpen}
        onClose={closeReleaseModal}
        selectedItems={selectedItems}
      />
      <Calendar clickedDate={handleSelectDate} exitClicked={handleReturn}>
        <div className="reserved-view">
          <div className="grouped-reserve">
            {reservedData.length === 0 ? <h3 className="No-reservation">No Reservation Today</h3>:
            reservedData.map((group, groupIndex) => (
              <div className="group-container" key={groupIndex} onClick={() => openReleaseModal(group)}>
                <div>
                <h3>{group.eventGroup}</h3>
                <ul>
                  {group.reservations.filter((item) => item.eventDate.includes(selectedDate.toString())).map((reservation, reservationIndex) => (
                    <li key={reservationIndex}>
                      {reservation.ItemCode}
                    </li>
                  ))}
                </ul>
                </div>
                <div className="group-container-status">
                  <h3 className={`status-color-${group.status}`}>{group.status}</h3>
                  
                </div>
                
              </div>
            ))}
          


          </div>
        </div>
      </Calendar>
    </>
  );
};

export default Reserved;
