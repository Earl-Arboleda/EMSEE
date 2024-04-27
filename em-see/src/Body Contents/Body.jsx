import React, { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import "./Body.css";
import LOGO from "../Login component/logo.png"
import Cards from './Cards';
import View from './ViewModal';
import BorrowModal from './BorrowModal';
import { toast } from 'react-toastify';
import ReservationModal from './ReservationModal';
import ItemList from "./ItemList";
import ListIcon from "../SVG/list.svg";
import AppIcon from "../SVG/apps.svg";
import Search from "./search.png";
import UP from "./up.png";
import DOWN from "./down.png"

const Available = ({ user, setUpdate, update, emcState, Reserve, setReserve}) => {
  const [display, setDisplay] = useState(true);
  const [data, setData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [sortCriteria, setSortCriteria] = useState('brand');
  const [sortOrder, setSortOrder] = useState('asc');
  const [isViewOpen, setViewOpen] = useState(false);
  const [isReserveOpen, setReserveOpen] = useState(false);
  const [isBorrowActive, setBorrowActive] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  const [categories, setCategories] = useState([])
  const [expandCat, setExpandCat] = useState();
  const toggleExpand = (index) => {
    setExpandCat(prevExpandCat => {
      const newExpandCat = [...prevExpandCat];
      newExpandCat[index] = !newExpandCat[index];
      return newExpandCat;
    });
  };
  
  useEffect(() => {
    setExpandCat(Array(categories.length).fill(false))
  },[categories])

  useEffect(() => {

      setReserveOpen(Reserve);// Why is this useEffect not re rendering even though the dependency is changing value
  }, [Reserve]);
  
  // const makePutRequest = async (ava) => {
  //   try {
  //     const res = await fetch('/Body/Available', {
  //       method: 'PUT',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(ava),
  //     });

  //     if (res.ok) {
  //       return true; 
  //     } else {
  //       const errorText = await res.text();
  //       console.error('Error text:', errorText);
  //       return false; // Indicate failure
  //     }
  //   } catch (error) {
  //     console.error('Error:', error.message);
  //     return false; // Indicate failure
  //   }
  // };

  useEffect(() => {
    // Group and count items based on ItemName
    const groupedData = data.reduce((acc, item) => {
      const itemName = item.ItemName;
      if (!acc[itemName]) {
        acc[itemName] = { count: 1, items: [item] };
      } else {
        acc[itemName].count++;
        acc[itemName].items.push(item);
      }
      return acc;
    }, {});

    // Convert object back to array
    const groupedItemsArray = Object.entries(groupedData).map(([itemName, data]) => ({
      itemName,
      count: data.count,
      items: data.items
    }));

    setCategories(groupedItemsArray);
  }, [data]);
  const openView = (item) => {
    setSelectedItem(item);
    setViewOpen(true);
  };

  const closeView = () => {
    setViewOpen(false);
  };

  const selectAll = () => {
  setSelectedItems((prevSelectedItems) => {
    if (prevSelectedItems.length === data.length) {
      // If all items are already selected, deselect all
      return [];
    } else {
      // If not all items are selected, select all
      return data.map((item) => ({
        itemCode: item.ItemCode,
        imageURL: item.Image,
        itemName: item.ItemName
      }));
    }
  });
};

  const selectItem = (itemCode, imageURL, itemName) => {
    setSelectedItems((prevSelectedItems) => {
      const updatedSelectedItems = [...prevSelectedItems];
       const itemObject = {itemCode, imageURL, itemName};
      const itemIndex = updatedSelectedItems.findIndex((selectedItems) => itemObject.itemCode === selectedItems.itemCode);
  
      if (itemIndex !== -1) {
        // If already selected, deselect
        updatedSelectedItems.splice(itemIndex, 1);
      } else {
        // If not selected, select
        updatedSelectedItems.push({ itemCode, imageURL, itemName });
      }
  
      return updatedSelectedItems;
    });
  };

  const toggleSelect = (itemCode, imageURL, itemName) => {
    setSelectedItems((prevSelectedItems) => {
      const isItemAlreadySelected = prevSelectedItems.some(
        (item) => item.itemCode === itemCode
      );
  
      if (isItemAlreadySelected) {
        // If already selected, deselect
        const updatedSelectedItems = prevSelectedItems.filter(
          (item) => item.itemCode !== itemCode
        );
        return updatedSelectedItems;
      } else {
        // If not selected, select
        return [...prevSelectedItems, { itemCode, imageURL,itemName }];
      }
    });
  };

  const sortData = (criteria, order) => {
    const sortedData = [...data].sort((a, b) => {
      let valueA, valueB;

      switch (criteria) {
        case 'brand':
          valueA = a.Brand ? a.Brand.toLowerCase() : '';
          valueB = b.Brand ? b.Brand.toLowerCase() : '';
          break;
        case 'alphabet':
          valueA = a.ItemCode ? a.ItemCode.toLowerCase() : '';
          valueB = b.ItemCode ? b.ItemCode.toLowerCase() : '';
          break;
        case 'type':
          valueA = a.ItemName ? a.ItemName.toLowerCase() : '';
          valueB = b.ItemName ? b.ItemName.toLowerCase() : '';
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

  const handleBorrowClick = () => {
    if(selectedItems.length === 0){
      toast.error("Select item")
    }else{
      setBorrowActive(!isBorrowActive);
    }
    
  };

  const handleBorrowSubmit = async (e, formData) => {
    e.preventDefault();
    const { clientName ,clientId, inchargeName } = formData;
    const successfullySubmittedItemCodes = [];
    try {
      const requests = [];
      selectedItems.forEach((Item) => {
        const transactionData = {
          itemImage: Item.imageURL,
          itemCode: Item.itemCode,
          itemName: Item.itemName,
          clientId: clientId,
          clientName: clientName,
          inchargeName,
        };
        requests.push(
          fetch('/Api/Borrow', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(transactionData),
          })
        );
      });
      await Promise.all(requests);
      requests.length = 0;


      // Wait for all PUT requests to complete
      await Promise.all(requests);

      setUpdate();
      setSelectedItems([]);
      toast.success('Transactions submitted successfully');
    } catch (error) {
      console.error('Error submitting transactions:', error);
      toast.error('Error submitting transactions:', error.message || 'An error occurred');
    }
  };

  useEffect(() => {
        fetch('/Api/Available')
            .then((res) => res.json())
            .then((data) => setData(data))
            .catch((error) => console.log('error', error));
}, [update]);

useEffect(() => {
  emcState();
  fetch('/Api/Available')
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((error) => console.log('error', error));
}, []);
useEffect(() => {
  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      setBorrowActive(false);
      setReserve(false)
    }
  };

  if (isBorrowActive || isReserveOpen) {
    document.addEventListener('keydown', handleKeyDown);
  }

  return () => {
    document.removeEventListener('keydown', handleKeyDown);
  };
}, [isBorrowActive, isReserveOpen]);
  return (
    <>
    <View
      onClose={closeView}
      isOpen={isViewOpen}
      image={selectedItem ? '/uploads/' + selectedItem.Image : ''}
      label1="Item Name"
      label2="Item Code"
      label3="Serial Code"
      label4="Brand"
      label5="Availability"
      value1={selectedItem ? selectedItem.ItemName : ''}
      value2={selectedItem ? selectedItem.ItemCode : ''}
      value3={selectedItem ? selectedItem.SerialCode : ''}
      value4={selectedItem ? selectedItem.Brand : ''}
      value5={selectedItem ? selectedItem.Availability : ''}
    />

      <ReservationModal
        isOpen={isReserveOpen}
        onClose={() => setReserveOpen(false)}
        user={user}
        setReserve={(param) => setReserve(param)}
      />
      <button className="mobile-res-button" onClick={() => setReserve(true)}>Reserve</button>

      <div className='Sorting'>
       
        <div className='borrow-reserve-div'>
          <>
          {user && user.Role === "Admin" || user.Role === "Staff" ? (
            <button
            onClick={handleBorrowClick}
          >
            Borrow
          </button>
          ):(
            null
          )}
          <button onClick={() => setReserve(true)}>Reserve</button>
          </>


        </div>
    
        <div className='dropdowns'>
          {user.Role !== 'Client' ? (
                    <button className="sort-Icon"   onClick={() => setDisplay(!display)}>{!display ? (<img src={ListIcon} alt="" />):(<img src={AppIcon} alt="" />)}</button>
          ):null}

          <label>
            Sort by:
            <select
              value={sortCriteria}
              onChange={(e) => setSortCriteria(e.target.value)}
            >
              <option value='brand'>Brand</option>
              <option value='alphabet'>Item Code</option>
               <option value='type'>Item Type</option>
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
      <div className="outsidewrap">
      {user.Role !== 'Client' ?(
    display ? (
    <>
    <div className="desktop-size">
      <ItemList
        check={() => selectAll(true)}
        isChecked={!data.length ? false : selectedItems.length === data.length}
        className="itemList-header"
        label1="Item Code"
        label2="Item Name"
        label3="Brand"
        label4="Serial Code"
        label5="Availability"
        label6="Status"
      />
      <div className='wrapper'>
        {data.length > 0 ? (
          data.filter((row) => {
            return (
              (row.ItemName?.toLowerCase() || '').includes(searchInput.toLowerCase()) ||
              (row.ItemCode?.toLowerCase() || '').includes(searchInput.toLowerCase()) ||
              (row.Brand?.toLowerCase() || '').includes(searchInput.toLowerCase())
            );
          }).map((item) => (
            <ItemList
              key={item.ItemCode} // Use a unique identifier as the key
              isChecked={selectedItems.some(selectedItem => selectedItem.itemCode === item.ItemCode)}
              check={() => selectItem(item.ItemCode, item.Image, item.ItemName)}
              label1={item.ItemCode}
              label2={item.ItemName}
              label3={item.Brand}
              label4={item.SerialCode}
              label5={item.Availability}
              label6={item.Status}
            />
          ))
        ) : (
          <div className="no-data">NO ITEM AVAILABLE</div>
        )}
      </div>
      </div>
      <div className="mobile-size">
      <div className="client-wrapper">
    <div className='client-display'>
    {categories
        .filter(row => (row.itemName?.toLowerCase() || '').includes(searchInput.toLowerCase()))
        .map((item, index) => (
          <div key={index} className={`client-category-group ${expandCat[index] ? 'open' : ''}`}>
          <div onClick={() => toggleExpand(index)} className="client-side">
            <div>{item.itemName} : {item.count}</div>
            
            <span>
              {expandCat[index] ? <img src={UP} alt="up" /> : <img src={DOWN} alt="down" />}
            </span>
          </div>
          <div className={`client-expand ${expandCat[index] ? 'open':''}`}>
          <div className="client-expand-header">
              <p>ITEM CODE</p>
              <p>AVAILABILITY</p> 
            </div>
            {expandCat[index] &&
              item.items.map((row, idx) => (
                <div key={idx} className="client-expand-body">
                  {row.ItemCode}
                  <p>Available</p>
                </div>
              ))}
          </div>
        </div>
        ))}
   </div>
  </div>
      </div>
    </>
  ) : (
    <div className='wrapper'>
      {data.length > 0 ? (
        data.map((item) => (
          <div className='row' key={item.ItemId}>
            <Cards
              imgUrl={'/uploads/' + item.Image}
              label1={item.ItemName}
              label2='Item Code'
              label2value={item.ItemCode}
              label3='Brand'
              label3value={item.Brand}
              isSelected={selectedItems.some(selectedItem => selectedItem.itemCode === item.ItemCode)}
              onSelect={() => toggleSelect(item.ItemCode, item.Image, item.ItemName)}
              button={() => openView(item)}
              label='View'
            />
          </div>
        ))
      ) : (
        <div className="no-data">NO ITEM AVAILABLE</div>
      )}
    </div>
  )
):(
  <div className="client-wrapper">
    <div className='client-display'>
    {categories
        .filter(row => (row.itemName?.toLowerCase() || '').includes(searchInput.toLowerCase()))
        .map((item, index) => (
          <div key={index} className={`client-category-group ${expandCat[index] ? 'open' : ''}`}>
          <div onClick={() => toggleExpand(index)} className="client-side">
            <div>{item.itemName} : {item.count}</div>
            
            <span>
              {expandCat[index] ? <img src={UP} alt="up" /> : <img src={DOWN} alt="down" />}
            </span>
          </div>
          <div className={`client-expand ${expandCat[index] ? 'open':''}`}>
          <div className="client-expand-header">
              <p>ITEM CODE</p>
              <p>AVAILABILITY</p> 
            </div>
            {expandCat[index] &&
              item.items.map((row, idx) => (
                <div key={idx} className="client-expand-body">
                  {row.ItemCode}
                  <p>Available</p>
                </div>
              ))}
          </div>
        </div>
        ))}
   </div>
  </div>

)}

       </div>

      <BorrowModal
        isOpen={isBorrowActive}
        onClose={() => setBorrowActive(false)}
        borrowList={selectedItems}
        user={user}
        onSubmit={handleBorrowSubmit}
        setUpdate={(e) => setUpdate(e)}
      />
    </>
  );
};



const Body = ({ user, page, emcState, Reserve, menu }) => {
  const [active, setActive] = useState('available');

  useEffect(() => {
    setActive(emcState);
  }, [emcState]);

  useEffect(() => {
    page();
  },[])

  const handleMenuClick = () => {
    menu();
  };

  return (
    <>
      <div className="body">
        <div className="body-label">
        <img onClick={handleMenuClick} src={LOGO} alt="Logo" />

          {user.Role === 'Client' ? (
              <span>{user.FullName}</span>

          ) : (     
            <h1>EMC</h1>  
          )}
        </div>

        <div className="body-mid-features">
          <div className="emc-container">
            <Link to="">
              <button className={active === 'available' ? 'active' : ''}>Available</button>
            </Link>
            {user.Role === 'Admin' || user.Role === 'Staff' ? (
              <>
                <Link to="Reserved" className="reserved">
                  <button className={active === 'reserved' ? 'active' : ''}>Reserved</button>
                </Link>
                <Link to="Borrowed" className="borrowed">
                  <button className={active === 'borrowed' ? 'active' : ''}>Borrowed</button>
                </Link>
                <Link to="History">
                  <button className={active === 'history' ? 'active' : ''}>History</button>
                </Link>
              </>
            ) : (
              <button className="mobile-reserve" onClick={() => Reserve()}>
                Reserve
              </button>
            )}
          </div>
        </div>

        <div className="list">
          <Outlet />
        </div>
      </div>
    </>
  );
};


export { Available, Body};
