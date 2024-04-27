import "./App.css"

const Confirmation = ({isOpen, onClose, confirmHandler, method}) => {
    
 

    return(
        <div className={`confirmation-modal ${isOpen ? 'open':''} `}>
            <div className="confirmation-body">
              <span>Are you sure to <i><u><b>{method}</b></u></i>?</span>   
              <div className="confirmation-button">
              <button onClick={onClose} className="cancel">Cancel</button>
              <button onClick={(e) => confirmHandler(e)} className="confirm">Confirm</button>
              </div>
              
              
            </div>
        </div>
    )
}

export default Confirmation;