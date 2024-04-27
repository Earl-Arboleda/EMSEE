import React, { useState } from 'react';
import './ReservationCalendar.css';

function Calendar({ children, clickedDate, exitClicked }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isClicked, setClick] = useState(false);
  const [selectedDay, setSelectedDay] = useState();
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

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
          week.push(day);
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
    const newSelectedDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day);
    clickedDate(newSelectedDate.toLocaleDateString());
    setClick(!isClicked);
  };

  const handleReturn = () => {
    setClick(!isClicked)
    exitClicked();
  }

  return (
    <div className='reservation-calendar'>
      <div className="reservation-calendar-header">
        {isClicked ? <button onClick={handleReturn}>Return</button> : null}
        {!isClicked ?
          <>
            <button onClick={handlePrevMonth}>Prev</button>
            <h2>{monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}</h2>
            <button onClick={handleNextMonth}>Next</button>
          </> : null
        }

      </div>

      <div className={`reservation-day ${isClicked ? 'open' : ''}`}>
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
                    {week.map((day, index) => (
                      <td onClick={() => handleSelectDate(day)} key={index}>{day}</td>
                    ))}
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
