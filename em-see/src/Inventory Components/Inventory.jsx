import React, { useEffect, useState } from 'react';
import './Inventory.css';
import './Table.css';
import '../Body Contents/Body.css'
import Popup from './Popup';
import { toast } from 'react-toastify';
import Search from "../Body Contents/search.png";
import Delete from './Delete';
import Confirmation from '../Confirmation';
import InventoryHistory from './History';
import LOGO from '../Login component/logo.png'

function Inventory({user, page}) {
  const [searchInput, setSearchInput] = useState('');
  const [data, setData] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [sortCriteria, setSortCriteria] = useState('item');
  const [sortOrder, setSortOrder] = useState('asc');
  const [sortItemName, setItemName] = useState('');
  const [historyModal, setHistoryModal] = useState(false);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [update, setUpdate] = useState(false);
 
  const openHistory = () => {
    setHistoryModal(!historyModal);
  }

  const closeHistory = () => {
    setHistoryModal(false)
  }

  const resetSelectItems = () => {
    setSelectedItems([])
    
  }
  
  const openDelete = () => {
    if(selectedItems.length === 0){
      toast.error("Select item/s to DELETE")
    }else{
      setDeleteOpen(!isDeleteOpen)
    }
  }

  const closeDelete = () => {
    setDeleteOpen(false);
    setUpdate(!update)
  }


  const openPopup = () => {
    setPopupOpen(!isPopupOpen);
    setUpdate(!update);
  };

  const closePopup = () => {
    setPopupOpen(false);
    setUpdate(true);
  };


  const sortData = (criteria, order) => {
    const sortedData = [...data].sort((a, b) => {
      let valueA, valueB;
      switch (criteria) {
        case 'brand':
          valueA = a.Brand ? a.Brand.toLowerCase() : '';
          valueB = b.Brand ? b.Brand.toLowerCase() : '';
          break;
        case 'item':
          valueA = a.ItemName ? a.ItemName.toLowerCase() : '';
          valueB = b.ItemName ? b.ItemName.toLowerCase() : '';
          break;
        case 'availability':
          valueA = a.Availability ? a.Availability.toLowerCase() : '';
          valueB = b.Availability ? b.Availability.toLowerCase() : '';
          break;
        case 'status':
          valueA = a.Status ? a.Status.toLowerCase() : '';
          valueB = b.Status ? b.Status.toLowerCase() : '';
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
    setData(sortedData);
  };
  useEffect(() => {
    sortData(sortCriteria, sortOrder);
  }, [sortCriteria, sortOrder]);



  useEffect(() => {
    fetch('/Api/Inventory')
      .then((res) => res.json())
      .then((data) => {setData(data);})
      .catch((error) => console.log('error', error));
  }, [update]);

  useEffect(() => {
    page();
    fetch('/Api/Inventory')
      .then((res) => res.json())
      .then((data) => {setData(data);})
      .catch((error) => console.log('error', error));
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setPopupOpen(false);
        setDeleteOpen(false);
        setHistoryModal(false)
      }
    };
  
      if (Popup || Delete || Confirmation || InventoryHistory) {
        document.addEventListener('keydown', handleKeyDown);
      }
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isPopupOpen]);


  
  // Use useEffect to log the updated selectedItems after rendering
  useEffect(() => {
    console.log(selectedItems);
  }, [selectedItems]);
  
  const selectAll = () => {
    setSelectedItems((prevSelectedItems) => {
      if (prevSelectedItems.length === data.length) {
        // If all items are already selected, deselect all
        return [];
      } else {
        // If not all items are selected, select all
        return data.map((item) => ({
          itemCode: item.ItemCode,
          imageURL: item.SerialCode,
          itemName: item.ItemName
        }));
      }
    });
  };
  
    const selectItem = (itemCode, itemName, SerialCode) => {
      setSelectedItems((prevSelectedItems) => {
        const updatedSelectedItems = [...prevSelectedItems];
         const itemObject = {itemCode, itemName, SerialCode};
        const itemIndex = updatedSelectedItems.findIndex((selectedItems) => itemObject.itemCode === selectedItems.itemCode);
    
        if (itemIndex !== -1) {
          // If already selected, deselect
          updatedSelectedItems.splice(itemIndex, 1);
        } else {
          // If not selected, select
          updatedSelectedItems.push({ itemCode, SerialCode, itemName });
        }
    
        return updatedSelectedItems;
      });
    };
    const uniqueData = [...new Set(data.map(item => item.ItemName))];


  return (
    <>
      <InventoryHistory isOpen={historyModal} onClose={closeHistory} update={update}/>
      <Delete isOpen={isDeleteOpen} resetSelectItems={resetSelectItems} user={user} onClose={closeDelete} selectedItems={selectedItems}/>
      <Popup isOpen={isPopupOpen} user={user} availableData={data} onClose={closePopup} update={setUpdate} />
      <div className="inventory">
          <div className="inv-label">
            <img src={LOGO} alt='Logo'/>
            <h1>Inventory</h1>
          </div>
          <div className='Sorting'>
          <div className="inventory-button">
    
    
        {user.Role === 'Admin' ? (
          <>      
          <button onClick={openPopup}>
          Add
        </button>
        
        <button onClick={openDelete} >
          Delete
        </button></>
        ):null}
        </div>
        <div className="inventory-history-button">
        <button className='inventory-history' onClick={openHistory}>History</button>
        </div>
      <div className='dropdowns'>
      <label   className='inventory-itemName'>
          Sort by:
          <select
          
            value={sortItemName}
            onChange={(e) => setItemName(e.target.value)}
          >
            <option value="">ALL</option>
           {uniqueData.map((itemName, index) => (
              <option value={itemName} key={index}>
                {itemName}
              </option>
            ))}
        

          </select>
        </label>

        <label>
          Sort by:
          <select
            value={sortCriteria}
            onChange={(e) => setSortCriteria(e.target.value)}
          >
            <option value='item'>Item Type</option>
            <option value='brand'>Brand</option>
            <option value='availability'>Availability</option>
            <option value='status'>Status</option>

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
      
      <div className='inventory-search'>
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
          <div className="inv-contents">
            <div className="head-wrapper">
            <InventoryList
            className="inv-header"
            check={() => selectAll(true)}
            isChecked={!data.length ? false : selectedItems.length === data.length}
            label1= "Item Type"
            label2= "Item Code"
            label3= "Serila Code"
            label4= "Brand"
            label5= "Availability"
            label6= "Status"
            label8= "Image"
            />
            </div>
            <div className="inv-wrapper">
             
                {data
                    .filter((row) => row.ItemName.toLowerCase().includes(sortItemName.toLowerCase()))
                    .filter((row) =>
                      row.ItemName.toLowerCase().includes(searchInput.toLowerCase()) ||
                      row.ItemCode.toLowerCase().includes(searchInput.toLowerCase()) ||
                      row.Brand.toLowerCase().includes(searchInput.toLowerCase())
                    )
                    .map((row, index) => (
                     <InventoryList
                     key={index}
                     className = "invlist-body"
                     check={() => selectItem(row.ItemCode, row.ItemName, row.SerialCode)}
                     isChecked={selectedItems.some(selectedItem => selectedItem.itemCode === row.ItemCode)}
                     label1={row.ItemName}
                     label2={row.ItemCode}
                     label3={row.SerialCode}
                     label4={row.Brand}
                     label5={row.Availability}
                     label6={row.Status}
                     label7={"/uploads/" + row.Image}
                     />
                    ))}
            
            </div>
          </div>
      </div>
    </>
  );
}

export default Inventory;


const InventoryList = (props) => {
  return(
    <div className={`InvList ${props.className}`} onDoubleClick={props.onDoubleClick}>
      <label>
          <input
            type="checkbox"
            checked={props.isChecked}
            onChange={() => props.check(props.itemCode)}
            />
      </label>
    <div >{props.label1}</div>
    <div >{props.label2}</div>
    <div >{props.label3}</div>
    <div >{props.label4}</div>
    <div >{props.label5}</div>
    <div >{props.label6}</div>
    <div >{props.label8}<img src={props.label7} alt="" /></div>

  </div>
  )
}