const Request = (props) => {
    
    return(
        <div className="request" onDoubleClick={props.onDoubleClick}>
            <table>
                <tr>
                    <td><p>{props.clientId}</p></td>
                    <td><p>{props.clientName}</p></td>
                    <td><p>{props.contactInfo}</p></td>
                    <td><p>{props.purpose}</p></td>
                    <td><p>{props.venue}</p></td>
                    <td><p>{props.eventDate}</p></td>
                 
                    <td><p>{props.item}</p></td>
                    <td><p>{props.quantity}</p></td>
                </tr>
            </table>
        </div>
    )
}
export default Request;