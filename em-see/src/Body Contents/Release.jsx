import "./Reserved.css";
import { useEffect, useState } from "react";
import Confirmation from "../Confirmation";
import { toast } from "react-toastify";

const Release = ({ isOpen, onClose, selectedItems, confirmDelete }) => {
    const [confirmationOpen, setConfirmationOpen] = useState(false);
    const [confirmationMethod, setConfirmationMethod] = useState('');
    const [value, setValue] = useState([])
    const [resId, setResId] = useState([])
    const [state, setState] = useState('')
    useEffect(() => {
        if (selectedItems && selectedItems.reservations) {
            setValue(selectedItems.reservations);
        }
        setState(selectedItems.status)
    }, [selectedItems]);

    useEffect(() => {
        if (value.length > 0) {
            setResId(value.map((item) => item.reservationId));
        }
    }, [value]);

    const closeRelease = () => {
        setResId([])
        setValue([])
        onClose();
    }

    const closeConfirmation = () => {
        setConfirmationOpen(false);
    }
    
    const handleCancel = () => {
        setConfirmationMethod('Cancel')
        setConfirmationOpen(!confirmationOpen)
    }

    const handleRelease = () => {
        setConfirmationMethod('Release');
        setConfirmationOpen(!confirmationOpen);
    }
    const handleReturn = () => {
        setConfirmationMethod('Recieve');
        setConfirmationOpen(!confirmationOpen)
    }



    const handleConfirmRelease = (data) => {
        fetch(`/Api/ReleaseItems`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => {
            if (response.ok) {
                toast.success('Reservation successfully released');
                setValue([])
                closeRelease()
            } else {
                toast.error('Error in releasing reservation');
            }
        })
        .catch(error => {
            toast.error('Error in releasing reservation');
        });
    };
    
    const handleConfirmReturn = (data) => {
        fetch(`/Api/ReturnItems`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => {
            if (response.ok) {
                toast.success('Reservation successfully returned');
                setValue([])
                closeRelease()
            } else {
                toast.error('Error in returning reservation');
            }
        })
        .catch(error => {
            toast.error('Error in releasing reservation');
        });
    };
    const handleConfirmCancel = (data) => {
        fetch(`/Api/CancelItems`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => {
            if (response.ok) {
                toast.success('Reservation successfully returned');
                setValue([])
                closeRelease()
            } else {
                toast.error('Error in returning reservation');
            }
        })
        .catch(error => {
            toast.error('Error in releasing reservation');
        });
    };

    const confirmHandler = (e) => {
        if (confirmationMethod === "Release") {
            handleConfirmRelease(resId);
            closeConfirmation();
        } else if (confirmationMethod === "Cancel") {
            handleConfirmCancel(resId)
            closeConfirmation();
        } else if (confirmationMethod === 'Recieve'){
            handleConfirmReturn(resId);
            closeConfirmation();

        }
    }
    return (
        <>
            <Confirmation
                isOpen={confirmationOpen}
                onClose={closeConfirmation}
                confirmHandler={confirmHandler}
                method={confirmationMethod} />

            <div className={`release ${isOpen ? 'open' : ''}`}>
                
                <div className="release-content">
                    <div className="reservation-info">
                    <div className="release-head">
                        <h1>Release/Return Item</h1>
                        <span onClick={() => closeRelease()}>&times;</span>
                    </div>
                    <div className="release-items">
                        <div className="release-items-header">
                        <div className="release-items-head">Item Code</div>
                        <div className="release-items-head">Event</div>
                        <div className="release-items-head">Venue</div>
                        <div className="release-items-head">Client Name</div>
                        </div>
                        <div className="release-items-body-wrapper">
                        {value.map((item, index) => {
                            return(
                            <div key={index} className="release-items-body">      
                            <div >{item.ItemCode}</div>
                            <div>{item.eventName}</div>
                            <div>{item.venue}</div>
                            <div>{item.clientName}</div>
                            </div>
                            ) 
                        })}
                        </div>
                    </div>
                    </div>
                    {state === 'Pending' ? 
                    <div className="release-buttons">
                        <button className="reserve-item-delete" onClick={handleCancel}>Cancel</button>
                        <button className="reserve-item-release" onClick={handleRelease}>Release</button>
                    </div>:
                    <div className="release-buttons">
                        <button className="reserve-item-release" onClick={handleReturn}>Recieve</button>
                    </div>
                    }
                </div>
            </div>
        </>
    );
}

export default Release;
