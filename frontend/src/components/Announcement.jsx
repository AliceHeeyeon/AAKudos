import axios from "axios";
import { useEffect, useState } from "react";
import { formatDistanceToNow, parseISO } from "date-fns";
import CampaignIcon from "@mui/icons-material/Campaign";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

const baseUrl = import.meta.env.VITE_BASE_URL;
const Announcement = () => {
  const [announcements, setAnnouncements] = useState([]);
  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/announcement`);
        setAnnouncements(response.data[0]);
      } catch (err) {
        console.error("Error fetching kudos messages:", err);
      }
    };
    fetchAnnouncement();
  }, []);

  const timeAgo = (dateString) => {
    const date = parseISO(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  };
  return (
    <div className="announcement">
      <div className="title-box">
        <CampaignIcon />
        <h5>Announcement</h5>
      </div>
      <Swiper
        pagination={{
          dynamicBullets: true,
        }}
        modules={[Pagination]}
        className="mySwiper"
      >
        {announcements.map((announcement, index) => (
          <SwiperSlide key={index} className="announcement-message">
            <p>{announcement.Text}</p>
            <span>{timeAgo(announcement.CreatedAt)} ago</span>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Announcement;
