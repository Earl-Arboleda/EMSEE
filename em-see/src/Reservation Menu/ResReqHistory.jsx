import "./ResReqHistory.css";
import {useEffect, useState, useRef } from "react";
import PRINT from '../printer.png';
import { useReactToPrint } from "react-to-print";


const ResReqHistory = ({isOpen, onClose}) => {
    const [data, setData] = useState([]);
    useEffect(() => {
        fetch('/Api/Reservation-request-history')
        .then((res) => res.json())
        .then((data) => setData(data))
        .catch((error) => console.log('error', error));
    },[])
    const printRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => printRef.current,
      })
    return(
        <div className={`resReqHistory ${isOpen ? 'open' : ''}`}>
            <div className="resReqHistory-modal">
                <div className="resReqHistory-label">
                    <button onClick={handlePrint}><img src={PRINT} alt="" /></button>
                    <h3>Reservation Request History</h3>
                    <span onClick={onClose}>&times;</span>
                </div>
                <div className="resReqHistory-body">
                    <div ref={printRef} className="resReqHistory-table">
                        <div className="resReqHistory-header">
                            <div className="resReqHistory-column short">EVENT NAME</div>
                            <div className="resReqHistory-column short">EVENT VENUE</div>
                            <div className="resReqHistory-column long">EVENT DATE</div>
                            <div className="resReqHistory-column short">ITEM NAME</div>
                            <div className="resReqHistory-column short">QUANTITY</div>
                            <div className="resReqHistory-column long">CLIENT NAME</div>
                            <div className="resReqHistory-column short">CLIENT ID</div>    
                            <div className="resReqHistory-column short">DEPARTMENT</div>
                            <div className="resReqHistory-column long">FILING DATE</div>
                            <div className="resReqHistory-column short">STATUS</div>
                            <div className="resReqHistory-column long">INCHARGE</div>
                            <div className="resReqHistory-column long">PROCESSING DATE</div>
                        </div>
                        <div className="resReqHistory-contents">
                            {data.map((item, index) => {
                                return(
                                    <div className="resReqHistory-wrapper" key={index}>
                                        <div className="resReqHistory-column short">{item.eventName}</div> 
                                        <div className="resReqHistory-column short">{item.venue}</div>   
                                        <div className="resReqHistory-column long">{item.eventDate}</div>  
                                        <div className="resReqHistory-column short">{item.itemType}</div>  
                                        <div className="resReqHistory-column short">{item.itemQuant}</div>  
                                        <div className="resReqHistory-column long">{item.clientName}</div>  
                                        <div className="resReqHistory-column short">{item.clientId}</div>  
                                        <div className="resReqHistory-column short">{item.department}</div>  
                                        <div className="resReqHistory-column long">{item.fileDate}</div>
                                        <div className="resReqHistory-column short">{item.status}</div>    
                                        <div className="resReqHistory-column long">{item.incharge}</div>  
                                        <div className="resReqHistory-column long">{item.processingDate}</div>  
                                    </div>
                                )
                              
                            })}
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}   

export default ResReqHistory;