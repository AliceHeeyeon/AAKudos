import axios from "axios"
import { useEffect, useState } from "react"
import { formatDistanceToNow, parseISO } from "date-fns";

const baseUrl = import.meta.env.VITE_BASE_URL;
const Announcement = () => {
    const [announcements, setAnnouncements] = useState([])
    useEffect(() => {
        const fetchAnnouncement = async() => {
            try {
                const response = await axios.get(`${baseUrl}/api/announcement`)
                setAnnouncements(response.data[0])
                console.log(response.data);
                
            } catch(err) {
                console.error("Error fetching kudos messages:", err)
            }
        }
        fetchAnnouncement();

    },[])

    const timeAgo = (dateString) => {
        const date = parseISO(dateString);
        return formatDistanceToNow(date, { addSuffix: true });
    };
  return (
    <div className="announcement">
        <h5>Announcement</h5>
        {announcements.map((announcement, index) => (
            <div key={index} className="announcement-message">
                <p>{announcement.Text}</p>
                <span>{timeAgo(announcement.CreatedAt)} ago</span>
            </div>
        ))}
    </div>
  )
}

export default Announcement
