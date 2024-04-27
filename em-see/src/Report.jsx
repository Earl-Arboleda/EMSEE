import './Report.css';
import { useEffect, useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import LOGO from './Login component/logo.png'

const Report= ({page}) => {
    const [active, setActive] = useState("tab1");
    useEffect(() => {
        page();
    },[]);

    const handleButtonClick = (button) => {
        setActive(button);
      };
    return(
        <div className="report">
            <div className="report-label">
                <img src={LOGO} alt="EMC" />
                <h1>Report</h1>
            </div>
            <div className="report-table">
                <div className="report-button-container">
                <Link to="">
                <button
                    onClick={() => handleButtonClick("tab1")}
                    className={active === "tab1" ? "active" : ""}>
                  <p >Equipment Inventory & Status</p>
                </button >
                </Link>
        
                <Link to="TransactionHistory">
                <button
                    onClick={() => handleButtonClick("tab2")}
                    className={active === "tab2" ? "active" : ""}>
                <p>Equipment Utilization & Transaction History</p>
                </button>
                </Link>
                </div>
                <div className="report-table-view">
                    <Outlet/>
                </div>
            </div>
        </div>
    )
}

export default Report;