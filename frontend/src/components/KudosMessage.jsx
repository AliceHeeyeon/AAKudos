import axios from "axios"
import { useEffect, useState } from "react"

const baseUrl = import.meta.env.VITE_BASE_URL;
const KudosMessage = () => {
    const [kudosMessages, setKudosMessages] = useState([])
    const [users, setUsers] = useState([])
    useEffect(() => {
        const fetchMessages = async() => {
        try {
            const response = await axios.get(`${baseUrl}/api/message`)
            setKudosMessages(response.data[0])
            console.log(response.data);
            
        } catch(err) {
            console.error("Error fetching kudos messages:", err)
        }
        }

        const fetchUsers = async() => {
        try {
            const response = await axios.get(`${baseUrl}/api/user`)
            setUsers(response.data[0])
            console.log(response.data);
            
        } catch(err) {
            console.error("Error fetching kudos messages:", err)
        }
        }
        fetchMessages();
        fetchUsers();
    },[])
    const getUserNameById = (id) => {
        const user = users.find(user => user.Id === id )
        return user ? user.Name : "Unknown user"
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
    
        //Time format
        const timeOptions = { hour: 'numeric', minute: 'numeric', hour12: true };
        const timeString = date.toLocaleTimeString('en-US', timeOptions);
    
        //Date format
        const dateOptions = { month: 'long', day: 'numeric' };
        const dateStringFormatted = date.toLocaleDateString('en-US', dateOptions);
    
        return `${timeString} | ${dateStringFormatted}`;
    };
  return (
    <div className="recognition-feed">
        <div className="section-title">
        <h3>Recognition Feed</h3>
        <button>Add a New</button>
        </div>
        
        {kudosMessages.map((msg) => (
        <div key={msg.Id} className="recognition-list">
        <div className="message-box" >
            <div className="message-name">
                <div className="name">
                    <p className="author">{getUserNameById(msg.AuthorId)}  </p>
                    <span>recognized</span>
                    <p className="target">{getUserNameById(msg.TargetId)}</p>
                </div>
            <div className="message-content">
                <p>{msg.Content}</p>
            </div>
            <div className="message-time">
                <p>{formatDate(msg.CreatedAt)}</p>
            </div>
            </div>
            
        </div>
        </div>
        ))}
        
    </div>
  )
}

export default KudosMessage
