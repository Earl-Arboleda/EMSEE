import { useState,useEffect } from "react";
import "./Popup.css";
import { toast } from "react-toastify";
import Confirmation from "../Confirmation"; 

const Delete = ({selectedItems,resetSelectItems, isOpen, onClose, user}) => {
    const [deleteInfo, setDeleteInfo] = useState([]);
    const [confirmationOpen, setConfirmationOpen] = useState(false)

    const closeDelete = () => {
        setDeleteInfo([]);
        resetSelectItems();
        onClose();
    }


    const handleDelete = (itemCode, reason) => {
        const presentIndex = deleteInfo.findIndex(item => item.ItemCode === itemCode);
    
        if (presentIndex === -1) {
            setDeleteInfo(prevDeleteReason => ([
                ...prevDeleteReason,
                { ItemCode: itemCode, Purpose: reason }
            ]));
        } else {
            setDeleteInfo(prevDeleteReason => prevDeleteReason.map(item => {
                if (item.ItemCode === itemCode) {
                    return { ...item, Purpose: reason };
                }
                return item;
            }));
        }
    };
    
    const handleDeleteItem = async (deleteInfo) => {
        console.log('Deleting Items', deleteInfo)
        try {
            const response = await fetch(`/Api/DeleteItems/${user.FullName}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(deleteInfo),
            });
    
            if (response.ok) {
                toast.success('Items deleted successfully');
                setDeleteInfo([])
                closeDelete()
            } else {
                const errorMessage = await response.text();
                toast.error('Error deleting items: ' + errorMessage);
            }
        } catch (error) {
            toast.error('Fetch error: ' + error.message);
        }
    };
    
    

    const openConfirmation = () => {
        const hasEmptyReason = selectedItems.length === deleteInfo.length;
        if (!hasEmptyReason) {
            toast.error("Select reasons for all items to DELETE");
        } else {
            setConfirmationOpen(true);
        }
    } 

    const closeConfirmation = () => {
        setConfirmationOpen(false)
    }

    const confirmDelete = () => {
        handleDeleteItem(deleteInfo);
        closeConfirmation();
    }


    useEffect(() => {
        const handleKeyDown = (event) => {
          if (event.key === 'Escape') {
            setConfirmationOpen(false);
          }
        };
    
        if (Confirmation) {
          document.addEventListener('keydown', handleKeyDown);
        }
    
        return () => {
          document.removeEventListener('keydown', handleKeyDown);
        };
      }, [confirmationOpen]);
    return(
        <>
       <Confirmation isOpen={confirmationOpen} onClose={closeConfirmation} method={'Delete'} confirmHandler={confirmDelete} ></Confirmation>
        <div className={`popup ${isOpen ? 'open':''}`}>
            <div className="delete-content">
                <div className="delete-head">
                    <h3>Delete Item</h3>
                    <span onClick={closeDelete}>&times;</span>
                </div>
                <div className="delete-body">
          
                    <div className="deleting-item">
                        <div className="delete-item-container">
                            <div className="delete-item"><p>ITEM CODE</p> <p>REASON  </p></div>
                            <div className="delete-wrapper">
                            {selectedItems.map((item, index) => 
                                {  return(
                            <div className="delete-item head" key={index}>{item.itemCode}
                            
                            <select defaultValue={''} value={deleteInfo[item.ItemCode]} required onChange={(e) => handleDelete(item.itemCode, e.target.value)}>
                                    <option value="" hidden >SELECT</option>
                                    <option value="BROKEN">BROKEN</option>
                                    <option value="LOST">LOST</option>
\                                    <option value="RETIRE">RETIRE</option>
                                </select>
                            </div>
                            )}
                            )}
                            </div>
                        </div>
                  
                        <div className="delete-button">
                        <button onClick={openConfirmation}>Delete</button>
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}
export default Delete;