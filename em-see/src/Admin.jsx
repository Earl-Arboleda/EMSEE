import Register from "./Register";
import {route, routes, Link} from "react-router-dom";


const Admin = () => {
    return(
        <>
        <Link to="/Register">
        <button>Add User</button>
        </Link>

        </>
    )
}
export default Admin;