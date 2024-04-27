const TRow = (props) => {
    return (
      <tr onDoubleClick={props.openModal}>
        <th>
          <input
            className="checkbox"
            type="checkbox"
            checked={props.isChecked}
            onChange={props.onCheckboxChange}
          />
        </th>
        
        <th>{props.itemName}</th>
        <th>{props.itemNumber}</th>
        <th>{props.serialNumber}</th>
        <th>{props.brand}</th>
        <th>{props.availability}</th>
        <th>{props.status}</th>
        <th>
          <img src={props.imgURL} alt=" " />
        </th>
      </tr>
    );
  };
  
  export default TRow;
  