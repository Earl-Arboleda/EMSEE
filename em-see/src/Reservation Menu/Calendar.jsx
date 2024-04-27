import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import './Calendar.css';
import "./ReservationReq.css";

const Calendar = ({ children, dateSelect, requestCount, exitClicked }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isClicked, setClick] = useState(true);
  const [countData, setCountData] = useState([]);
  const [selectedDay, setSelectedDay] = useState();
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const currentDay = new Date().toLocaleDateString()

  useEffect(() => {
    setClick(!isClicked)
  },[exitClicked])


  useEffect(() => {
    fetch(`/Api/RequestCount`)
    .then(res => res.json())
    .then(data => setCountData(data))
    .catch(error => toast.error(error))
  },[])

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getMonthData = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const totalDays = getDaysInMonth(selectedDate);
    const data = [];

    let day = 1;
    for (let i = 0; i < 6; i++) {
      const week = [];
      for (let j = 0; j < 7; j++) {
        if (i === 0 && j < firstDayOfMonth) {
          week.push('');
        } else if (day <= totalDays) {
          const currentDate = new Date(year, month, day);
          week.push(currentDate.toLocaleDateString());
          day++;
        } else {
          week.push('');
        }
      }
      data.push(week);
    }

    return data;
  };

  const handlePrevMonth = () => {
    const prevMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1);
    setSelectedDate(prevMonth);
  };

  const handleNextMonth = () => {
    const nextMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1);
    setSelectedDate(nextMonth);
  };

  const handleSelectDate = (day) => {
    const newSelectedDate = new Date(day);
    dateSelect(newSelectedDate.toLocaleDateString());
    setClick(!isClicked);
  };


  return (
    <div className='custom-calendar'>
        {!isClicked ?
      <div className="custom-calendar-header">
      <button onClick={handlePrevMonth}>Prev</button>
            <h2>{monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}</h2>
            <button onClick={handleNextMonth}>Next</button>
            </div>
 : null
        }


      <div className={`custom-day ${isClicked ? 'open' : ''}`}>
        {isClicked ?
          children:
          <>
            <table>
              <thead>
                <tr>
                  {weekdays.map((day) => (
                    <th key={day}>{day}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {getMonthData().map((week, index) => (
                  <tr key={index}>
                    {week.map((day, index) =>{ 
                     return (
                      <td onClick={() => handleSelectDate(day)} style={{border: currentDay === day ? '2px solid #00cc00': '', color: currentDay === day ? '#00cc00':''}}  key={index}>{day ? new Date(day).getDate() : ''} <br/>{countData[day] ?<>{countData[day]} Request</> :''}</td>
                    )})}
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        }
      </div>


    </div>
  );
}

export default Calendar;
