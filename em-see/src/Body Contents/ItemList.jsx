import React from "react";
import "./ItemList.css"
const ItemList = (props) => {
    return (
      <div className={`List ${props.className}`}>
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
      </div>
    );
  };

export default ItemList;

