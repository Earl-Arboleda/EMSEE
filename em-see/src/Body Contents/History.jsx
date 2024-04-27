import React, { useState, useEffect } from "react";
import "./History.css";
import Search from "./search.png";

const History = ({ emcState }) => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [sortCriteria, setSortCriteria] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    emcState();
    fetch("/Api/Transaction-history")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setFilteredData(data);
      })
      .catch((error) => console.error('Error fetching history:', error));
  }, []);

  useEffect(() => {
    sortData(sortOrder);
  }, [sortOrder]);

  const sortData = (order) => {
    const sortedData = [...filteredData].sort((a, b) => {
      return order === 'asc'
        ? new Date(a.borrowDateTime) - new Date(b.borrowDateTime)
        : new Date(b.borrowDateTime) - new Date(a.borrowDateTime);
    });

    setFilteredData(sortedData);
  };

  const handleCriteriaChange = (newCriteria) => {
    setSortCriteria(newCriteria);
    handleFilter(newCriteria);
  };

  const handleFilter = (criteria) => {
    let newData = [...data];
    if (criteria === 'Returned') {
      newData = data.filter((item) => item.returnDateTime !== null);
    } else if (criteria === 'Unreturned') {
      newData = data.filter((item) => item.returnDateTime === null);
    }
    setFilteredData(newData);
  };

  return (
    <>
      <div className='Sorting'>
        <div className="borrow-reserve-div"></div>
          <div className='dropdowns'>
            <label>
              Sort by:
              <select
                value={sortCriteria}
                onChange={(e) => handleCriteriaChange(e.target.value)}
              >
                <option value=''>All</option>
                <option value='Returned'>Returned</option>
                <option value='Unreturned'>Unreturned</option>
              </select>
            </label>
            <label>
              Order:
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value='desc'>Newest</option>
                <option value='asc'>Oldest</option>
              </select>
            </label>
          </div>
          <div className='body-search'>
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
      <div className="transaction-histories head">
        <div className="transaction-history-column long">Borrow Date</div>
        <div className="transaction-history-column">Client Name</div>
        <div className="transaction-history-column short">Client ID</div>
        <div className="transaction-history-column">Item Code</div>
        <div className="transaction-history-column">Borrow Incharge</div>
        <div className="transaction-history-column long">Return Date</div>
        <div className="transaction-history-column short">Status</div>
        <div className="transaction-history-column">Return Incharge</div>
      </div>
      <div className="outsidewrap history">
        <div className="transaction-histories body">
        {filteredData
          .filter((row) => {
            if (sortCriteria === 'Returned') {
              return row.returnDateTime !== null;
            } else if (sortCriteria === 'Unreturned') {
              return row.returnDateTime === null;
            } else {
              return true;
            }
          })
          .filter((row) => {
            return (
              (row.ItemName?.toLowerCase() || '').includes(searchInput.toLowerCase()) ||
              (row.clientId?.toLowerCase() || '').includes(searchInput.toLowerCase()) ||
              (row.ItemCode?.toLowerCase() || '').includes(searchInput.toLowerCase()) ||
              (row.Brand?.toLowerCase() || '').includes(searchInput.toLowerCase())
            );
          })
          .map((item,index) => (
            <div className="transaction-history-insidewrapper" key={index}>
              <div className="transaction-history-column long">{item.borrowDateTime}</div>
              <div className="transaction-history-column">{item.clientName}</div>
              <div className="transaction-history-column short">{item.clientId}</div>
              <div className="transaction-history-column">{item.itemCode}</div>
              <div className="transaction-history-column">{item.borrowIncharge}</div>
              <div className="transaction-history-column long">{item.returnDateTime ? item.returnDateTime : "Not Returned Yet"}</div>
              <div className="transaction-history-column short">{item.status}</div>
              <div className="transaction-history-column">{item.returnIncharge}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default History;
