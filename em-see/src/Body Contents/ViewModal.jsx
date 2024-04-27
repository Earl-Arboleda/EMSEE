import React from 'react';
import './ViewModal.css';

const View = ({ isOpen, onClose,value1,value2, image, value3, value4, value5, label1, label2,label3,label4, label5 }) => {
  return (
    <>
      <div className={`view-modal ${isOpen ? 'active' : ''}`}>
        <div className="view-modal-detail">
          <h3>Item Preview</h3>
          <div className="view-container">
        <div className="label-div"> <p>{label1}:</p> {value1}
          <p>{label2}:</p> {value2}
          <p>{label3}:</p> {value3}
          <p>{label4}:</p> {value4}
          <p>{label5}:</p> {value5}</div>
          
         <div className="img-div"><img src={image} alt="" /></div>
         </div>
         
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </>
  );
}

export default View;
