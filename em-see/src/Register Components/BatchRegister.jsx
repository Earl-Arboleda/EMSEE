import React, { useEffect, useState } from 'react';
import './BatchRegister.css';
import Papa from 'papaparse';
import Confirmation from '../Confirmation';
import { toast } from 'react-toastify';

const BatchRegister = ({ isOpen, onClose, update }) => {
    const [csvData, setCsvData] = useState([]);
    const [confirmation, setConfirmation] = useState(false);
    const [roles, setRole] = useState('')
    useEffect(() => {
        if (csvData.length > 0 && csvData[csvData.length - 1].UserId === null) {
            setCsvData(prevData => prevData.slice(0, -1));
        }
    }, [csvData]);
    const handleBatchRegister = async () => {
        const registeredUsers = csvData.map((row, index) => ({
            userId: row.UserId,
            fullName: row.FullName,
            department: row.Department,
            role: roles[index] ? roles[index] : 'Client'
        }));
    
        console.log('Registered Users:', registeredUsers);
    
        try {
            const response = await fetch('/Api/BatchRegister', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(registeredUsers),
            });
    
            if (response.ok) {
                toast.success('Batch registered successfully');
                setConfirmation(false);
                update()
                setCsvData([])
                onClose()
            } else {
                console.error('Failed to register:', response.statusText);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };
    const handleClose = () => {
        setCsvData([])
        onClose()
    }
    
    const readFile = (file) => {
        Papa.parse(file, {
            header: true,
            dynamicTyping: true,
            complete: (result) => {
                setCsvData(result.data);
                // You can process the parsed CSV data here
                console.log('Parsed CSV Data:', result.data);
            },
            error: (error) => {
                console.error('Error parsing CSV:', error);
            }
        });
    };

    const handleDrop = (event) => {
        event.preventDefault();
        event.stopPropagation();

        const file = event.dataTransfer.files[0];
        readFile(file);
    };

    const handleDragOver = (event) => {
        event.preventDefault();
        event.stopPropagation();
    };
    const handleRoleChange = (index, value) => {
        const newRoles = [...roles];
        newRoles[index] = value;
        setRole(newRoles);
    }
    

    return (
        <>
        <Confirmation isOpen={confirmation} onClose={() => setConfirmation(false) } method="Register" confirmHandler={handleBatchRegister}/>
        <div className={`batch-reg ${isOpen ? 'open' : ''}`}>
            <div className="batch-reg-modal">
                <div className="batch-reg-label">
                    <h1>Batch Register</h1>
                    <span onClick={handleClose}>&times;</span>
                </div>
                <div className="csv-upload">
                    {csvData.length === 0 ? (
                        <div
                            className="drag-drop-field"
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                        >
                            <p>Drag and drop your CSV file here, or click to select file</p>
                            <input
                                type="file"
                                style={{ display: 'none' }}
                                onChange={(event) => readFile(event.target.files[0])}
                            />
                            <button onClick={() => document.querySelector('input[type=file]').click()}>
                                Select File
                            </button>
                        </div>
                    ) : (
                        <div className='csv-filled'>
                            <h2>Parsed CSV Data:</h2>
                            <ul style={{padding:'0px'}}>
                                    <li>        
                                        <div className="csv-parsed head">
                                            <div className="">User ID</div>
                                            <div className="">Full Name</div>
                                            <div className="">Department</div>
                                            <div className="">Role</div>
                                        </div>
                                    </li>
                                <div className="ul-wrapper">
                                {csvData.map((row, index) => (
                                    <li key={index}>
                                        <div className="csv-parsed">
                                            <div className="">{row.UserId}</div>
                                            <div className="">{row.FullName}</div>
                                            <div className="">{row.Department}</div>
                                            <div className="">
                                                <select value={roles[index]} onChange={(e) => handleRoleChange(index, e.target.value)}>
                                                    <option value="Client" >Client</option>
                                                    <option value='Staff'>EMC Staff</option>
                                                    <option value='Admin'>Admin</option>
                                                </select>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                                </div>
                            </ul>
                            <div className="csv-submit-holder">
                                <button onClick={() => setConfirmation(!confirmation)}>Register</button>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
        </>
    );
}

export default BatchRegister;
