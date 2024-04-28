import React, { useState, useEffect } from 'react';
import './Return.css';
import Confirmation from '../Confirmation';
import { toast } from 'react-toastify';

const Return = ({ isOpen, onClose, selectedItems, update, user , clearSelection  }) => {
  const [conditions, setConditions] = useState({});
  const [method, setMethod] = useState('');
  const [confirmation, setCofirmation] = useState(false);
  const [returnItem, setReturnItem] = useState([])

  const openConfirmation = (e) => {
    e.preventDefault();
    const returnItems = selectedItems.map(item => ({
      returnItemCode: item.itemCode,
      condition: conditions[item.itemCode],
      inchargeName: user.FullName
    }));
    setMethod('Return');
    setReturnItem(returnItems)
    setCofirmation(!confirmation);
  }

  const closeConfirmation = (e) => {
    e.preventDefault();
    setCofirmation(false)
    setReturnItem([])
  }

  useEffect(() => {
    const initialConditions = {};
    selectedItems.forEach(item => {
      initialConditions[item.itemCode] = "Good";
    });
    setConditions(initialConditions);
  }, [selectedItems]);

  const handleConditionChange = (itemId, condition) => {
    setConditions(prevConditions => ({
      ...prevConditions,
      [itemId]: condition
    }));
  };
  console.log("Return Items",returnItem)

  const handleReceive = async (item) => {
    setCofirmation(false)

    try {
        const requests = item.map(async (returnItem) => {
            const { returnItemCode, condition, inchargeName } = returnItem;
            if (!returnItemCode || !condition) {
                console.error("selectedItem or condition is undefined:", returnItem);
                return;
            }
            const putResponse = await fetch(`/Api/Available/${returnItemCode}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({condition, inchargeName }),
            });
            if (!putResponse.ok) {
                console.error(`Failed to update inventory for item with ItemCode ${returnItemCode}.`);
                return;
            }
        });
        await Promise.all(requests);
        toast.success("Item returned successfuly")
        update();
        onClose();
        setReturnItem([]);
        clearSelection();
    } catch (error) {
        console.error("Error receiving item:", error);
    }
};


  console.log("User Name", user.FullName)

  return (
    <>
    <Confirmation isOpen={confirmation} onClose={(e) => {closeConfirmation(e)}} confirmHandler={(e) => handleReceive(returnItem)} method={method}/>
      <div className={`return-modal ${isOpen ? 'active' : ''}`}>
        <div className="return-modal-detail">
          <div className="return-head">
            <h3>Return Item</h3>
            <span onClick={onClose}>&times;</span>
          </div>
          <div className="return-container">
            <div className="return-items">
              <div className='list-header'>
                <p>ITEM</p>
                <p>CONDITION</p>
              </div>
              <ul>
                {selectedItems.map((item) => (
                  <li key={item.itemCode}>
                    <p>{item.itemCode}</p> 
                    <select value={conditions[item.itemCode]} onChange={(e) => handleConditionChange(item.itemCode, e.target.value)}>
                      <option value="Good">Good</option>
                      <option value="Broken">Broken</option>
                      <option value="Missing">Missing</option>
                    </select>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="return-button-holder">
            <button onClick={(e) => openConfirmation(e)}>Receive</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Return;
