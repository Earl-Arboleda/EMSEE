import React from 'react';
import './Cards.css';

const Cards = (props) => {
  return (
    <div onClick={props.onSelect} className={`card ${props.isSelected ? 'selected' : ''}`}>
      <div className="card-detail">
      <input
          type="checkbox"
          checked={!!props.isSelected}
          className="card-checkbox"
          onChange={props.onSelect}
        />
        <img src={props.imgUrl} alt="" />

        <div className="details">
          <p>{props.label1}</p>
          <p>{props.label2}: <br/> <u>{props.label2value}</u></p>
          <p>{props.label3}:{props.label3value}</p>
        </div>
      </div>

      <div className="btns">
        <button onClick={props.button}>{props.label}</button>
      </div>
      </div>
  );
};

export default Cards;
