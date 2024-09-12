import axios from "axios";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { useEffect, useState } from "react";
import MessageInput from "./MessageInput";
import { useSelector } from "react-redux";

const baseUrl = import.meta.env.VITE_BASE_URL;
const KudosMessage = () => {
  const [kudosMessages, setKudosMessages] = useState([]);
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const messagePerPage = 5;
  const users = useSelector((state) => state.user.list);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/message`);
        setKudosMessages(response.data[0]);
      } catch (err) {
        console.error("Error fetching kudos messages:", err);
      }
    };

    fetchMessages();
  }, [kudosMessages]);

  const sortedMessages = kudosMessages
    .slice()
    .sort((a, b) => new Date(b.CreatedAt) - new Date(a.CreatedAt));

  const paginatedMessage = sortedMessages.slice(
    (page - 1) * messagePerPage,
    page * messagePerPage
  );

  const handlePageChange = (e, value) => {
    setPage(value);
  };

  const getUserNameById = (id) => {
    const user = users.find((user) => user.Id === id);
    return user ? user.Name : "Unknown user";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);

    //Time format
    const timeOptions = { hour: "numeric", minute: "numeric", hour12: true };
    const timeString = date.toLocaleTimeString("en-US", timeOptions);

    //Date format
    const dateOptions = { month: "long", day: "numeric" };
    const dateStringFormatted = date.toLocaleDateString("en-US", dateOptions);

    return `${timeString} | ${dateStringFormatted}`;
  };

  const handleModalOpen = () => {
    setOpen(true);
  };

  return (
    <div className="recognition-feed-component">
      <div className="section-title">
        <h3>Recognition Feed</h3>
        <button onClick={handleModalOpen}>Add a New</button>
      </div>
      {open && <MessageInput open={open} setOpen={setOpen} />}

      <div className="message-container">
        {paginatedMessage.map((msg) => (
          <div key={msg.Id} className="recognition-list">
            <div className="message-box">
              <div className="message-name">
                <div className="name">
                  <p className="author">{getUserNameById(msg.AuthorId)} </p>
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
        <Stack id="feed-pagination" spacing={2}>
          <Pagination
            count={Math.ceil(kudosMessages.length / messagePerPage)}
            page={page}
            onChange={handlePageChange}
          />
        </Stack>
      </div>
    </div>
  );
};

export default KudosMessage;
