import React, { useState, useEffect } from "react";
import { toast } from 'react-toastify';
import Cards from "./Cards";
import "./Borrowed.css";
import "./Body.css";
import View from "./ViewModal";
import Return from "./Return";
import ListIcon from "../SVG/list.svg";
import AppIcon from "../SVG/apps.svg";
import ItemList from "./ItemList";
import Search from "./search.png";

const Borrow = ({user, update, setUpdate, emcState}) => {
    const [display, setDisplay] = useState(true);
    const [borrowedData, setBorrowedData] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [isViewOpen, setViewOpen] = useState(false);
    const [searchInput, setSearchInput] = useState('');
    const [sortCriteria, setSortCriteria] = useState('brand');
    const [sortOrder, setSortOrder] = useState('asc');
    const [returnModal, setReturnModal] = useState(false);


    const openReturnModal = (e) => {
      e.preventDefault();
      if(selectedItems.length === 0){
        toast.error("Select item")
      }else{
        setReturnModal(!returnModal)
      }
    }


    useEffect(() => {
      fetch("/Api/Borrowed")
        .then((res) => res.json())
        .then((data) => setBorrowedData(data))
        .catch((error) =>
          console.log("Error fetching borrowed data:", error)
        );
    }, [update]);
    
    useEffect(() => {
      emcState();
      fetch("/Api/Borrowed")
        .then((res) => res.json())
        .then((data) => setBorrowedData(data))
        .catch((error) =>
          console.log("Error fetching borrowed data:", error)
        );
    }, []);
  
    const toggleSelect = (item) => {
      const updatedSelectedItems = [...selectedItems];
      if (updatedSelectedItems.includes(item)) {
        const index = updatedSelectedItems.indexOf(item);
        updatedSelectedItems.splice(index, 1);
      } else {
        updatedSelectedItems.push(item);
      }
      setSelectedItems(updatedSelectedItems);
    };
  
    const sortData = (criteria, order) => {
      const sortedData = [...borrowedData].sort((a, b) => {
        let valueA, valueB;
        switch (criteria) {
          case 'time':
            valueA = a.datetime ? a.datetime.toLowerCase() : '';
            valueB = b.datetime ? b.datetime.toLowerCase() : '';
            break;
          case 'incharge':
            valueA = a.inchargeName ? a.inchargeName.toLowerCase() : '';
            valueB = b.inchargeName ? b.inchargeName.toLowerCase() : '';
            break;
          case 'type':
            valueA = a.itemName ? a.itemName.toLowerCase() : '';
            valueB = b.itemName ? b.itemName.toLowerCase() : '';
            break;
          default:
            break;
        }
        valueA = valueA || '';
        valueB = valueB || '';
        if (order === 'asc') {
          return valueA.localeCompare(valueB, undefined, { sensitivity: 'base' });
        } else {
          return valueB.localeCompare(valueA, undefined, { sensitivity: 'base' });
        }
      });
      setBorrowedData(sortedData);
    };
  
    useEffect(() => {
      sortData(sortCriteria, sortOrder);
    }, [sortCriteria, sortOrder]);
  
    const openView = (item) => {
      setSelectedItem(item);
      setViewOpen(true);
    };
  
    const closeView = () => {
      setViewOpen(false);
    };
  
    const selectAll = () => {
      setSelectedItems((prevSelectedItems) => {
        if (prevSelectedItems.length === borrowedData.length) {
          return [];
        } else {
          return borrowedData.map((item)=> item);
        }
      });
    };
    
    const selectItem = (item) => {
      setSelectedItems((prevSelectedItems) => {
        const updatedSelectedItems = [...prevSelectedItems];
        if (updatedSelectedItems.includes(item)) {
          const index = updatedSelectedItems.indexOf(item);
          updatedSelectedItems.splice(index, 1);
        } else {
          updatedSelectedItems.push(item);
        }
        return updatedSelectedItems;
      });
    };
  

  
    
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setReturnModal(false)    
      }
    };
  
    if (returnModal) {
      document.addEventListener('keydown', handleKeyDown);
    }
  
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [returnModal]);


  return (
    <>
    
         {isViewOpen && (
        <View
        onClose={closeView}
        isOpen={isViewOpen}
        image={'http://localhost/uploads/' + selectedItem.image}
        label1="Item Code"
        label2="Borrower Name"
        label3="Borrower Id"
        label4="Person Incharge"
        label5="Borrow Date"
        value1={selectedItem.itemCode}
        value2={selectedItem.clientName}
        value3={selectedItem.schoolId}
        value4={selectedItem.inchargeName}
        value5={selectedItem.datetime}
      />
      )}
     <Return
        isOpen={returnModal}
        onClose={() => setReturnModal(false)}
        selectedItems={selectedItems}
        user={user}
        update={(e) => setUpdate(e)}
        clearSelection={(e) => {setSelectedItems([])}}
      />

      <div className='Sorting'>
        
          <div className="borrow-reserve-div">
          <button onClick={(e) => openReturnModal(e)}>
          Receive
        </button>
          </div>
          <div className='dropdowns'>
        <button className="sort-Icon"   onClick={() => setDisplay(!display)}
>
            {display ? (<img src={AppIcon} alt="" />):(<img src={ListIcon} alt="" />)}</button>
          <label>
            Sort by:
            <select
              value={sortCriteria}
              onChange={(e) => setSortCriteria(e.target.value)}
            >
              <option value='type'>Item Type</option>
              <option value='incharge'>Incharge</option>
               <option value='date'>Borrow Date</option>
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
                 <div className="search-sort-container">
   
        
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
        </div>
    <div className="outsidewrap">
      
        {display  ? (
          <>
            <ItemList
              isChecked={!borrowedData.length ? false : selectedItems.length === borrowedData.length}
              check={() => selectAll()}
              className="itemList-header"
              label1="Item Code"
              label2="Item Name"
              label3="Borrower's ID"
              label4="Borrower's Name"
              label5="Borrowing Date"
              label6="Incharge"
            />  
            <div className="wrapper">
            {borrowedData.length > 0 ? (
  borrowedData
    .filter((row) =>
      row.clientName.toLowerCase().includes(searchInput.toLowerCase()) ||
      row.itemCode.toLowerCase().includes(searchInput.toLowerCase()) ||
      row.schoolId.toString().toLowerCase().includes(searchInput.toLowerCase())
    )
    .sort((a, b) => new Date(b.datetime) - new Date(a.datetime)) // Sorting by borrow date, from biggest to smallest
    .map((item) => (
      <ItemList
        key={item.itemCode}  // Make sure to use a unique key for each item
        isChecked={selectedItems.includes(item)}
        check={() => selectItem(item)}
        label1={item.itemName}
        label2={item.itemCode}
        label3={item.schoolId}
        label4={item.clientName}
        label5={item.datetime}
        label6={item.inchargeName}
      />  
    ))
) : (
  <div className="no-data">NO ITEM AVAILABLE</div>
)}

          
          </div>
          </>
          
        ):(
          <div className="wrapper">
            {borrowedData.map((item) => (
            <div className="row" key={item.itemCode}>
              <Cards
                imgUrl={"http://localhost:5000/uploads/" + item.image}
                label1={item.itemName}
                label2="Item Code"
                label2value={item.itemCode}
                label3="Borrower"
                label3value={item.clientName}
                label="View"
                isSelected={selectedItems.includes(item)}
                onSelect={() => toggleSelect(item)}
                button={() => openView(item)}
              
              />
            </div>
            ))}
          </div>
        
        )}
       </div> 

       </>
  
  );
};

export default Borrow;
