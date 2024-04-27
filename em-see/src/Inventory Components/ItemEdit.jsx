import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { CSSTransition } from 'react-transition-group';
import './Popup.css';

const Edit = ({ isOpen, onClose, update, selectedItemCode }) => {
  const options = ["Available", "Borrowed", "Reserved"];
  const status = ["Functional", "Faulty", "Missing"];
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [data, setData] = useState([]);
  const [item, setItem] = useState({
    ItemName: '',
    ItemCode: '',
    SerialCode: '',
    Brand: '',
    Availability: 'Available',
    Status: 'Functional',
  });

  const cancelAdd = () => {
    setItem({
      ItemName: '',
      ItemCode: '',
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImageSrc(imageUrl);
    }
  };

  useEffect(() => {
    console.log("Item Selected:", selectedItemCode);
  }) 


  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('ItemName', item.ItemName);
    formData.append('ItemCode', item.ItemCode);
    formData.append('SerialCode', item.SerialCode);
    formData.append('Brand', item.Brand);
    formData.append('Availability', item.Availability);
    formData.append('Status', item.Status);
    if (selectedFile) {
      formData.append('FileImage', selectedFile);
    }

    try {
      const response = await fetch('1http://localhost:5000/Inventory', {
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


  return (
    <CSSTransition
      in={isOpen}
      timeout={300}
      classNames="popup"
      unmountOnExit
    >
      <div className="popup">
        <div className="popup-content">
          <div className="inventory-popup-label"><p>Add Item</p></div>
      
          <span className="close-btn" onClick={onClose}>
            &times;
          </span>
         
              <form onSubmit={handleSubmit}>
              <div className="parent-container">
                  <div className="child-container1">
                    <div className="upload">
                      <div className="image">
                        {imageSrc && <img src={imageSrc} alt="Uploaded" />}
                      </div>
                      <label id="Image"><p>Upload Image:</p>
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
                  <div className="child-container2">
                    <label id="ItemName"><p>Item Name:</p>
                    <select   
                        id="ItemName"
                        name="ItemName"
                        value={item.ItemName}
                        onChange={handleInput}>
                    <option value="">Select Item</option>
                  <option value="Hdmi">Hdmi</option>
                  <option value="Speaker">Speaker</option>
                  <option value="Sound-System">Sound System</option>
                  <option value="Projector">Projector</option>
                  <option value="Microphone">Microphone</option>
                  <option value="Remote">Remote</option>
                  <option value="Extension">Extension</option>
                    </select>
                    </label>
                    <label id="ItemCode"><p>Item Code:</p> 
                    <input
                      id="ItemCode"
                      type="text"
                      name="ItemCode"
                      value={item.ItemCode}
                      onChange={handleInput}
                      required
                      placeholder="Item Code"
                    /></label>
                    <label id="SerialCode"> <p>Serial Code:</p>
                    <input
                      id="SerialCode"
                      type="text"
                      name="SerialCode"
                      value={item.SerialCode}
                      onChange={handleInput}
                      required
                      placeholder="Serial Code"
                    /></label>
                    <label id="Brand"> <p>Brand:</p>
                    <input
                      id="Brand"
                      type="text"
                      name="Brand"
                      value={item.Brand}
                      onChange={handleInput}
                      placeholder="Brand"
                    /></label>
                  </div>
                </div>
                <div className="dropdowns">
                  <div className="dd1">
                    <label id="Status"> <p>Status</p>
                    <select
                      id="Status"
                      name="Status"
                      value={item.Status}
                      onChange={handleInput}
                    >
                      {status.map((stat, index) => (
                        <option key={index} value={stat}>
                          <p>{stat}</p>
                        </option>
                      ))}
                    </select>
                    </label>
                  </div>
                  <div className="dd2">
                    <label id="Availability"> <p>Availability</p>
                    <select
                      id="Availability"
                      name="Availability"
                      value={item.Availability}
                      onChange={handleInput}
                    >
                      {options.map((option, index) => (
                        <option key={index} value={option}>
                          <p>{option}</p>
                        </option>
                      ))}
                    </select>
                    </label>
                  </div>
                </div>
                <div className="form-buttons">
                  <button onClick={() => { onClose(); cancelAdd(); }}>Cancel</button>
                  <button type='submit'>Submit</button>
                
                </div>
              </form>
            </div>
          </div>

    </CSSTransition>
  );
};


export default Edit;
