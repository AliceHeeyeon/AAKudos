import { useSelector } from "react-redux";
import { formatDistanceToNow, parseISO } from "date-fns";
import CampaignIcon from "@mui/icons-material/Campaign";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

const Announcement = () => {
  const announcements = useSelector((state) => state.announcement.list);

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
        {announcements && announcements.length > 0 ? (
          announcements.map((announcement, index) => (
            <SwiperSlide key={index} className="announcement-message">
              <p>{announcement.Text}</p>
              <span>{timeAgo(announcement.CreatedAt)} ago</span>
            </SwiperSlide>
          ))
        ) : (
          <p>No announcement available</p>
        )}
      </Swiper>
    </div>
  );
};

export default Announcement;
