import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { CSSTransition } from 'react-transition-group';
import './Popup.css';
import empty from "./Nofile.webp";
import Confirmation from "../Confirmation";

const Popup = ({ isOpen, onClose, user, update, ItemCode, availableData }) => {
  const options = ["AVAILABLE", "BORROWED", "RESERVED"];
  const status = ["FUNCTIONAL", "FAULTY", "MISSING"];
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [method, setMethod] = useState('');
  const [itemCode, setItemCode] = useState();
  const [itemNumber, setItemNumber] = useState(0);
  const [itemName, setItemName] = useState()
  const [serialNumber, setSerialNumber] = useState('');
  const [item, setItem] = useState({
    SerialCode: '',
    Brand: '',
    Availability: 'Available',
    Status: 'Functional',
  });

  const [customItem, setCustomItem] = useState(false);

  const handleItemChange = (e) => {
      const selectedValue = e.target.value;
      if (selectedValue === 'Add') {
          // Clear the custom item input field when "Add" is selected
          setCustomItem(!customItem);
      } else {
          setItemName(selectedValue);
      }
  };

  const handleCustomItemChange = (e) => {
      setItemName(e.target.value.toUpperCase());
  };

  const cancelAdd = () => {
      setItemName('');
      setItemCode('');
      setItem({
      
      SerialCode: '',
      Brand: '',
      Availability: 'Available',
      Status: 'Functional',
    });
  };


  const handleInput = (e) => {
    e.persist();
    setItem({ ...item, [e.target.name]: e.target.value });
};


useEffect(() => {
  if (!availableData) return; 
  const filteredData = availableData.filter(item => item.ItemName.toUpperCase() === itemName);
  const itemCodes = filteredData.map(item => item.ItemCode);
  const itemNumbers = [];
  itemCodes.forEach(code => {
    const numbersInCode = code.match(/\d+/g);
    if (numbersInCode) {
      numbersInCode.forEach(number => {
        itemNumbers.push(parseInt(number));
      });
    }

  });
  itemNumbers.sort((a, b) => a - b);
  const lastItem = itemNumbers[itemNumbers.length - 1];
  if(lastItem){
    setItemNumber(lastItem);

  }else{
    setItemNumber(0)

  }

}, [itemName, availableData]);

useEffect(() => {
  setItemCode(itemName ? (itemName + " - " + (itemNumber + 1)):(''))
  console.log("Item Code:", itemCode)

},[itemNumber,itemName])



  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImageSrc(imageUrl);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append('ItemName', itemName);
    formData.append('ItemCode', itemCode);
    formData.append('SerialCode', serialNumber.toUpperCase());
    if (item) {
      formData.append('Brand', item.Brand.toUpperCase());
      formData.append('Availability', item.Availability);
      formData.append('Status', item.Status);
    }
    formData.append('FileImage', selectedFile);
    formData.append('Incharge', user.FullName)
  
    try {
      const response = await fetch('/Api/Inventory', {
        method: 'POST',
        body: formData,
      });
  
      if (response.ok) {
        toast.success('Data submitted successfully');
        cancelAdd();
        setSelectedFile(null);
        setImageSrc(null);
        onClose();
      } else {
        toast.error('Error submitting data');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error submitting data');
    }
  };
  
  const openSubmitConfirmation = (e) => {
    e.preventDefault()
      setConfirmationOpen(!confirmationOpen)
      setMethod('Submit')
  } 



  const closeConfirmation = () => {
    setConfirmationOpen(false)
    setMethod('')
  }

  const confirmationHandler = (e) => {
      handleSubmit(e);
      closeConfirmation();
      update();
  }
  return (

    <>
    <Confirmation
        isOpen={confirmationOpen}
        onClose={closeConfirmation}
        confirmHandler={confirmationHandler}
        method={method}
    />
      <div className={`popup ${isOpen ? 'open': ''}`}>
        <div className="popup-content">
          <div className="inventory-popup-label">
            <h3>Add Item</h3>
          <span className="close-btn" onClick={onClose}>
            &times;
          </span>
          </div>
              <form onSubmit={(e) => openSubmitConfirmation(e)}>
              <div className="parent-container">
              <div className="child-container">
                <label id="ItemName">Item Type:
            

            {customItem ? (
                <input
                    type="text"
                    placeholder="Enter custom item"
                    value={itemName}
                    onChange={handleCustomItemChange}
                />
            ):(    <select
              id="ItemName"
              name="ItemName"
              value={itemName}
              onChange={handleItemChange}>
              <option value="" hidden>Select Item</option>
              <option value="HDMI">HDMI</option>
              <option value="SPEAKER">SPEAKER</option>
              <option value="SOUND-SYSTEM">SOUND SYSTEM</option>
              <option value="PROJECTOR">PROJECTOR</option>
              <option value="MICROPHONE">MICROPHONE</option>
              <option value="REMOTE">REMOTE</option>
              <option value="EXTENSION">EXTENSION</option>
              <option value="Add">Add</option>
          </select>)}

                    </label>
                
                  <div className="dd1">
                    <label id="Status">Status
                    <select
                      id="Status"
                      name="Status"
                      value={item.Status}
                      onChange={handleInput}
                    >
                      {status.map((stat, index) => (
                        <option key={index} value={stat}>
                          {stat}
                        </option>
                      ))}
                    </select>
                    </label>
                  </div>
                  <div className="dd2">
                    <label id="Availability">Availability
                    <select
                      id="Availability"
                      name="Availability"
                      value={item.Availability}
                      onChange={handleInput}
                    >
                      {options.map((option, index) => (
                        <option key={index} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    </label>
                  </div>
                </div>

                  <div className="child-container">
                  
                    <label id="ItemCode">Item Code:
                    <input
                      id="ItemCode"
                      type="text"
                      name="ItemCode"
                      defaultValue={itemCode}
                      readOnly
                      disabled
                      required
                      placeholder="Item Code"
                    /></label>
                    <label id="SerialCode">Serial Code:
                    <input
                      id="SerialCode"
                      type="text"
                      name="SerialCode"
                      value={serialNumber}
                      onChange={(e) => setSerialNumber(e.target.value)}
                      required
                      placeholder="Serial Code"
                    /></label>
                  <label id="Brand">Brand:
                    <input
                      id="Brand"
                      type="text"
                      name="Brand"
                      value={item.Brand}
                      onChange={handleInput}
                      placeholder="Brand"
                    /></label>
                  </div>

             
               
                <div className="child-container">
                    <div className="upload">
                      <div className="image">
                        {imageSrc ? (<img src={imageSrc} alt=''/>):(<img src={empty} alt=''/>)}
                      </div>
                      <label id="Image">Upload Image:
                      <input
                        id="Image"
                        type="file"
                        name="Image"
                        onChange={handleFileChange}
                        accept="image/*"
                      />
                      </label>
                    </div>
                  </div>
                  </div>
                <div className="form-buttons">
                  <button className='cancel' onClick={() => { onClose(); cancelAdd(); }}>Cancel</button>
                  <button type='submit'>Submit</button>
                
                </div>
              </form>
            </div>
          </div>
          </>
  );
};


export default Popup;
