import React,  { useRef, useState, useEffect } from "react";
import "./ReportPage.css";
import { BarChart,LineChart, Line, Bar, XAxis, LabelList, YAxis, CartesianGrid, Tooltip, Legend, Cell, ResponsiveContainer } from 'recharts';
import PRINT from '../printer.png';
import {useReactToPrint} from 'react-to-print';

const TransactionHistory = () => {

  const [reqHistory, setReqHistory] = useState([]);
  const [departmentUsage, setDepartmentUsage] = useState({
    CAS: 0,
    CBA: 0,
    CED: 0,
    CEAC: 0,
    GSLAW: 0,
    Others: 0
  });
  const [lineData, setLineData] = useState([]);
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const [period, setPeriod] = useState("day");
  const [month, setMonth] = useState(''); 
  useEffect(() => {
      fetch('/Api/Reservation-reports')
      .then((res) => res.json())
      .then((data) => {
        // Convert fileDate to DateTime date type
        const parsedData = data.map(item => ({
          ...item,
          fileDate: new Date(item.fileDate)
        }));

        setReqHistory(parsedData);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const printRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  })
  useEffect(() => {
      const intervalCounts = {}; // Object to store counts per interval
  
      for (let hour = 0; hour < 24; hour++) {
          for (let minute = 0; minute <= 30; minute += 30) {
              if (hour === 23 && minute > 30) break; 
              const period = hour < 12 ? 'AM' : 'PM'; 
              const displayHour = hour % 12 || 12;
              const interval = `${displayHour}:${minute < 10 ? '0' : ''}${minute} ${period}`;
              intervalCounts[interval] = 0;
          }
      }
  
      reqHistory.forEach(item => {
          const fileDate = new Date(item.fileDate);
          const hour = fileDate.getHours();
          const minute = fileDate.getMinutes();
          let adjustedHour = hour;
          let adjustedMinute = minute;
  
          // Adjust the hour and minute if necessary
          if (hour === 23 && minute > 30) {
              adjustedHour = 23;
              adjustedMinute = 30;
          } else if (minute > 30) {
              adjustedMinute = 0;
              adjustedHour++;
          }

          const period = adjustedHour < 12 ? 'AM' : 'PM'; // Determine if AM or PM
          const displayHour = adjustedHour % 12 || 12; // Convert hour to 12-hour format
          const interval = `${displayHour}:${adjustedMinute >= 30 ? '30' : '00'} ${period}`;
          intervalCounts[interval]++;
      });
  
      const lineDataArray = Object.entries(intervalCounts).map(([interval, value]) => ({
          interval,
          value
      }));
  
      setLineData(lineDataArray);
  }, [reqHistory]);

  Date.prototype.getWeek = function() {
    const onejan = new Date(this.getFullYear(), 0, 1);
    return Math.ceil((((this - onejan) / 86400000) + onejan.getDay() + 1) / 7);
  };

  useEffect(() => {
    let monthValue;
    switch(month) {
      case "January":
          monthValue = 0;
          break;
      case "February":
          monthValue = 1;
          break;
      case "March":
          monthValue = 2;
          break;
      case "April":
          monthValue = 3;
          break;
      case "May":
          monthValue = 4;
          break;
      case "June":
          monthValue = 5;
          break;
      case "July":
          monthValue = 6;
          break;
      case "August":
          monthValue = 7;
          break;
      case "September":
          monthValue = 8;
          break;
      case "October":
          monthValue = 9;
          break;
      case "November":
          monthValue = 10;
          break;
      case "December":
          monthValue = 11;
          break;
      default:
          monthValue = null;
      break;
  }
  let periodicalCount = {
    CAS: 0,
    CBA: 0,
    CED: 0,
    CEAC: 0,
    GSLAW: 0,
    Others: 0
  };
  const currentDate = new Date();
  const currentDay = currentDate.getDate();
  const currentWeek = currentDate.getWeek();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
    switch(period){
      case "day":


        reqHistory.forEach(item => {
          const fileDate = new Date(item.fileDate);
          const fileDay = fileDate.getDate();
          const fileMonth = fileDate.getMonth();
          const fileYear = fileDate.getFullYear();

          if(fileDay === currentDay && fileMonth === currentMonth && fileYear === currentYear){
            switch(item.department){
              case 'CAS':
                periodicalCount.CAS++;
                break;
              case 'CED':
                periodicalCount.CED++;
                break;
              case 'CEAC':
                periodicalCount.CEAC++;
                break;
              case 'CBA':
                periodicalCount.CBA++;
                break;
              case 'GS/LAW':
                periodicalCount.GSLAW++;
                break;
              default:
                periodicalCount.Others++;
                break;
            }
          }
        })
        setDepartmentUsage(periodicalCount);

        break;
      case "week":
     
        reqHistory.forEach(item => {
          const fileDate = new Date(item.fileDate);
          const week = fileDate.getWeek()
          const month = fileDate.getMonth();
          const year = fileDate.getFullYear();
          if (week === currentWeek && month === currentMonth && year === currentYear ) {
            switch (item.department) {
              case 'CAS':
                periodicalCount.CAS++;
                break;
              case 'CED':
                periodicalCount.CED++;
                break;
              case 'CEAC':
                periodicalCount.CEAC++;
                break;
              case 'CBA':
                periodicalCount.CBA++;
                break;
              case 'GS/LAW':
                periodicalCount.GSLAW++;
                break;
              default:
                periodicalCount.Others++;
                break;
            }
          }    
        });
        setDepartmentUsage(periodicalCount);
        break;
      case '7days':
        reqHistory.forEach(item => {
          const  today = new Date().getDate();
          const sevenDays = new Date()
          sevenDays.setDate(sevenDays.getDate() - 7)
          const seventhDay = sevenDays.getDate()
          const sevenDayFiles = item.fileDate.getDate();
          if(sevenDayFiles <= today && sevenDayFiles >= seventhDay){
            switch(item.department){
              case 'CAS':
                periodicalCount.CAS++;
                break;
              case 'CED':
                periodicalCount.CED++;
                break;
              case 'CEAC':
                periodicalCount.CEAC++;
                break;
              case 'CBA':
                periodicalCount.CBA++;
                break;
              case 'GS/LAW':
                periodicalCount.GSLAW++;
                break;
              default:
                periodicalCount.Others++;
                break;
            }
          }

          setDepartmentUsage(periodicalCount);

        })
        break;
      case "month":

        reqHistory.forEach(item => {
          const month = item.fileDate.getMonth();
          const year = item.fileDate.getFullYear();
          
          if (month === currentMonth && year === currentYear) {
            switch(item.department){
              case 'CAS':
                periodicalCount.CAS++;
                break;
              case 'CED':
                periodicalCount.CED++;
                break;
              case 'CEAC':
                periodicalCount.CEAC++;
                break;
              case 'CBA':
                periodicalCount.CBA++;
                break;
              case 'GS/LAW':
                periodicalCount.GSLAW++;
                break;
              default:
                periodicalCount.Others++;
                break;
            }
          }
        });
        setDepartmentUsage(periodicalCount);
        break;
      case "year":
            reqHistory.forEach(item => {
            const year = item.fileDate.getFullYear();
            const month = item.fileDate.getMonth();
            if(monthValue === null){
            if (year === currentYear) {
              switch(item.department){
                case 'CAS':
                  periodicalCount.CAS++;
                  break;
                case 'CED':
                  periodicalCount.CED++;
                  break;
                case 'CEAC':
                  periodicalCount.CEAC++;
                  break;
                case 'CBA':
                  periodicalCount.CBA++;
                  break;
                case 'GS/LAW':
                  periodicalCount.GSLAW++;
                  break;
                default:
                  periodicalCount.Others++;
                  break;
              }
            }}else if(monthValue === month){

                switch(item.department){
                  case 'CAS':
                    periodicalCount.CAS++;
                    break;
                  case 'CED':
                    periodicalCount.CED++;
                    break;
                  case 'CEAC':
                    periodicalCount.CEAC++;
                    break;
                  case 'CBA':
                    periodicalCount.CBA++;
                    break;
                  case 'GS/LAW':
                    periodicalCount.GSLAW++;
                    break;
                  default:
                    periodicalCount.Others++;
                    break;
                }
              
            }
          });
       
        setDepartmentUsage(periodicalCount);
        break;
      default:
    }
  }, [period, reqHistory, month]);

  useEffect(() => {
    setMonth('')
  }, [period])

  const departmentData = Object.entries(departmentUsage).map(([name, value]) => ({
    name,
    value
  }));

  const reorderedData = [
    ...departmentData.filter(entry => entry.name === "CAS"),
    ...departmentData.filter(entry => entry.name === "CBA"),
    ...departmentData.filter(entry => entry.name === "CEAC"),   
    ...departmentData.filter(entry => entry.name === "CED"),
    ...departmentData.filter(entry => entry.name === "GSLAW"),
    ...departmentData.filter(entry => entry.name === "Others"),
  ];

  const data = [
    {
      name: 'Page A',
      uv: 4000,
      pv: 2400,
      amt: 2400,
    },
    {
      name: 'Page B',
      uv: 3000,
      pv: 1398,
      amt: 2210,
    },
    {
      name: 'Page C',
      uv: 2000,
      pv: 9800,
      amt: 2290,
    },
    {
      name: 'Page D',
      uv: 2780,
      pv: 3908,
      amt: 2000,
    },
    {
      name: 'Page E',
      uv: 1890,
      pv: 4800,
      amt: 2181,
    },
    {
      name: 'Page F',
      uv: 2390,
      pv: 3800,
      amt: 2500,
    },
    {
      name: 'Page G',
      uv: 3490,
      pv: 4300,
      amt: 2100,
    },
  ];
  return (
    <div className="transaction-history">
      <div ref={printRef} className="reservation-summary">
        <div className="reservation-summary-label">
         
          <div className="summary-periods">
          <label>
            Period:
            <select value={period} onChange={(e) => setPeriod(e.target.value)}>
              <option value="day">Day</option>
              <option value="week">Week</option>
              <option value="7days">Last 7 days</option>
              <option value="month">Month</option>
              <option value="year">Year</option>
            </select>
          </label>
          <label>
            {period === "year" ? (
              <>
              Month:
              <select value={month} onChange={(e) => setMonth(e.target.value)}>
                <option value="">All</option>
                {monthNames.map((item, index) => {
                  return <option key={index} value={item}>{item}</option>;
                })}

              </select>
              </>
            ):(null)}
       
          </label>
          </div>
          <h1>Departmental Reservation Bar Graph</h1>
          <div className="print-options" onClick={handlePrint}>
            <button>
              <img src={PRINT} alt="print" />
            </button>
          </div>
        </div>
          <ResponsiveContainer width="100%" height={400} >  
          <BarChart
  data={reorderedData}
  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="name" />
  <YAxis ticks={[0, 5, 10, 15, 20 ,25, 30]}/>
  <Tooltip  />
  <Legend
    verticalAlign="bottom"
    height={36}
    payload={reorderedData.map((entry, index) => ({
      value: entry.name,
      type: 'rect',
      color: ["#ff3860", "#00BF63", "#3468C0", "#F8E559", "#A367B1", "#FF9800"][index % 6]
    }))}
  />
  <Bar dataKey="value" barSize={150}>
    {reorderedData.map((entry, index) => (
      <Cell key={`cell-${index}`} fill={
        ["#ff3860", "#00BF63", "#3468C0", "#F8E559", "#A367B1", "#FF9800"][index % 6]
      } />
    ))}
    <LabelList dataKey="value" position="top" />
  </Bar>
</BarChart>

          </ResponsiveContainer>
  
      </div>
 
    </div>
  );
};

export default TransactionHistory;
