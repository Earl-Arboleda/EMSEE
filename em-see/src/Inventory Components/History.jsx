import { useEffect, useState } from "react";
import "./InventoryHistory.css";
import Reactivation from "./ReactivationModal";

const InventoryHistory = ({isOpen, onClose, update}) => {
    const [displayHistory, setDisplayHistory] = useState([]);
    const [historyState, setHistoryState] = useState(true); 
    const [addHistory, setAddHistory] = useState([]);
    const [reactivation,setReactivation] = useState(false);
    const [reactItem, setReactItem] = useState({});
    const [updates, setUpdate] = useState(false);

    useEffect(() => {
        fetch('/Api/Inventory-history')
        .then((res) => res.json())
        .then((data) => setDisplayHistory(data))
        .catch((error) => console.log('error', error));

    },[updates])

    useEffect(() => {
        fetch('/Api/Add-history')
        .then((res) => res.json())
        .then((data) => setAddHistory(data))
        .catch((error) => console.log('error', error))
    },[updates])

    const handleReactivation = (item) => {
        setReactItem(item)
        setReactivation(!reactivation)
        console.log('It is clicked', reactivation)
    }
    
    return(
        <>
        <Reactivation itemDetails={reactItem} isOpen={reactivation} onClose={() => setReactivation(false)} update={() => setUpdate(!updates)}/>
        <div className={`history-modal ${isOpen? 'open':''}`}>
        <div className="history-content">
            <div className="history-header">
                <button className={`inventory-header-button ${historyState ? 'open':''}` } onClick={(e) => setHistoryState(true)} >ADD HISTORY</button>
                <button className={`inventory-header-button ${historyState ? '': 'open'}`} onClick={(e) => setHistoryState(false)}>DELETE HISTORY</button>
            <span onClick={onClose}>&times;</span>

            </div>
                {historyState ? (
                        <>
                        <div className="inventory-history-entry head">
                            <div className="history-column">ITEM CODE</div>
                            <div className="history-column">ITEM NAME</div>
                            <div className="history-column">SERIAL CODE</div>
                            <div className="history-column">ADD DATE</div>
                            <div className="history-column">PERSON INCHARGE</div>
                        </div>
                        <div className="inventory-history-wrapper">
                            {addHistory.map((item,index) => {
                                return(
                                    <div className="inventory-history-entry" key={index}>
                                    <div className="history-column">{item.itemCode}</div>
                                    <div className="history-column">{item.itemName}</div>
                                    <div className="history-column ">{item.serialCode}</div>
                                    <div className="history-column">{item.dateTime}</div>
                                    <div className="history-column ">{item.incharge}</div>
                                </div>
                                )
                            })}
                        </div>
                        </>
                    ):
                    (
                        <>
                    <div className="inventory-history-entry head ">
                        <div className="history-column">ITEM CODE</div>
                        <div className="history-column">ITEM NAME</div>
                        <div className="history-column ">SERIAL CODE</div>
                        <div className="history-column">REASON</div>
                        <div className="history-column long">DELETION DATE</div>
                        <div className="history-column long">PERSON INCHARGE</div>
                    </div>
                    <div className="inventory-history-wrapper" >
                       { displayHistory.map((item,index) => {
                            return (
                                <div className="inventory-history-entry" key={index} onClick={() => handleReactivation(item)}>
                                    <div className="history-column">{item.itemCode}</div>
                                    <div className="history-column">{item.itemName}</div>
                                    <div className="history-column ">{item.serialCode}</div>
                                    <div className="history-column">{item.Purpose}</div>

                                    <div className="history-column long">{item.DateTime}</div>
                                    <div className="history-column long">{item.PersonIncharge}</div>
                                </div>
                            
                            );
                            
                        })
                        }
                        </div>
                        </>
                    )
                    }

        
        </div>
        </div>
        </>

    );
}

export default InventoryHistory;