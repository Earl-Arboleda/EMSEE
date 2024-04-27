import { useEffect, useState } from "react"
import "./ReactivationModal.css"
import { toast } from "react-toastify";
const Reactivation = ({itemDetails, isOpen, onClose, update}) => {
    const handleReactivation = (e) => {
        e.preventDefault();
        const item = {
            historyId: itemDetails.HistoryId,
            itemCode: itemDetails.itemCode,
        };
    
        fetch("/Api/Reactivation", {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(item),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to reactivate item');
            }
            return response.json();
        })
        .then(data => {
            toast.success('Item reactivated successfully:', data);
            update();
            onClose();
        })
        .catch(error => {
            toast.error('Error reactivating item:', error);
        });
    };
    
    return(
        <div className={`reactivation-modal ${isOpen ? 'open':''}`}>
            <div className="reactivation-content">
                <div className="reactivation-label">
                    <h3>Reactivate Item?</h3>
                    <span onClick={onClose}>&times;</span>
                </div>
                <div className="reactivation-body">
                    <table>
                        <thead>
                        <tr>
                            <th>HISTORY ID</th>
                            <th>ITEM NAME</th>
                            <th>ITEM CODE</th>
                            <th>SERIAL CODE</th>
                            <th>STATUS</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>{itemDetails.HistoryId}</td>
                            <td>{itemDetails.itemName}</td>
                            <td>{itemDetails.itemCode}</td>
                            <td>{itemDetails.serialCode}</td>
                            <td>{itemDetails.Purpose}</td>
                        </tr>
                        </tbody>
                       
                    </table>
            
                </div>
                <div className="reactivation-button">
                    <button onClick={handleReactivation}>Reactivate</button>
                </div>
            </div>
        </div>
    )
}

export default Reactivation;