import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
//icons
import { FaMedal } from "react-icons/fa";
import { FaRankingStar } from "react-icons/fa6";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";

const baseUrl = import.meta.env.VITE_BASE_URL;
const KudosBoard = () => {
  const users = useSelector((state) => state.user.allList);
  const [kudosMessages, setKudosMessages] = useState([]);
  //const [users, setUsers] = useState([]);
  const [kudosRanking, setKudosRanking] = useState([]);
  const [sendersRanking, setSendersRanking] = useState([]);
  const [filterType, setFilterType] = useState("monthly");

  useEffect(() => {
    const fetchKudosMessage = async () => {
      try {
        const messageResponse = await axios.get(`${baseUrl}/api/message`);
        //const userResponse = await axios.get(`${baseUrl}/api/user`);

        setKudosMessages(messageResponse.data[0]);
        //setUsers(userResponse.data[0]);
      } catch (err) {
        console.error(err);
      }
    };
    fetchKudosMessage();
  }, []);

  useEffect(() => {
    if (filterType === "monthly") {
      calculateTopKudos("monthly");
    } else if (filterType === "yearly") {
      calculateTopKudos("yearly");
    }
  }, [kudosMessages, users, filterType]);

  const findUserNameById = (userId) => {
    const user = users.find((u) => u.Id === parseInt(userId));
    return user ? { name: user.Name, role: user.Role } : "UnKnown";
  };

  const calculateTopKudos = (type) => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();

    let filteredMessages = [];

    if (type === "monthly") {
      filteredMessages = kudosMessages.filter((message) => {
        const createdAtDate = new Date(message.CreatedAt);

        return (
          createdAtDate.getFullYear() == currentYear &&
          createdAtDate.getMonth() == currentMonth
        );
      });
    } else if (type === "yearly") {
      filteredMessages = kudosMessages.filter((message) => {
        const createdAtDate = new Date(message.CreatedAt);
        return createdAtDate.getFullYear() === currentYear;
      });
    }

    const authorCount = {};
    filteredMessages.forEach((message) => {
      if (authorCount[message.AuthorId]) {
        authorCount[message.AuthorId]++;
      } else {
        authorCount[message.AuthorId] = 1;
      }
    });

    const recipientCount = {};
    filteredMessages.forEach((message) => {
      if (recipientCount[message.TargetId]) {
        recipientCount[message.TargetId]++;
      } else {
        recipientCount[message.TargetId] = 1;
      }
    });

    const topAuthors = Object.entries(authorCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);

    const topRecipients = Object.entries(recipientCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);

    setSendersRanking(topAuthors);
    setKudosRanking(topRecipients);
  };
  <FaMedal />;
  return (
    <div className="kudos-board page">
      <div className="kudos-board-contents">
        <div className="kudos-leaderboard">
          <h2>
            <FaRankingStar />
            Kudos Leaderboard
          </h2>
          <FormControl sx={{ m: 1, width: 130 }}>
            <InputLabel>Time Period</InputLabel>
            <Select
              value={filterType}
              label="Time Period"
              onChange={(e) => setFilterType(e.target.value)}
            >
              <MenuItem value={"monthly"}>Monthly</MenuItem>
              <MenuItem value={"yearly"}>Yearly</MenuItem>
            </Select>
          </FormControl>

          {kudosRanking.length > 0 ? (
            <div className="kudos-leaderboard-list">
              {kudosRanking.map(([targetId, count], index) => {
                const { name, role } = findUserNameById(targetId);
                return (
                  <div
                    className="leaderboard-item"
                    key={targetId}
                    style={index === 0 ? { backgroundColor: "#ffc78f" } : {}}
                  >
                    <p className="leaderboard-rank">
                      {index === 0 ? <FaMedal /> : index + 1}
                    </p>
                    <p className="leaderboard-name">
                      {name}
                      <span>{role}</span>
                    </p>
                    <p className="leaderboard-kudos-count">
                      {count} {count === 1 ? "Kudo" : "Kudos"}
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <p>No data available for this period</p>
          )}
        </div>

        <div className="senders-leaderboard">
          <h3>
            <WorkspacePremiumIcon />
            Amazing Senders
          </h3>
          {sendersRanking.length > 0 ? (
            <div className="senders-leaderboard-list">
              {sendersRanking.map(([targetId, count], index) => {
                const { name, role } = findUserNameById(targetId);
                return (
                  <div className="senders-item" key={targetId}>
                    <p
                      className="senders-rank"
                      style={index === 0 ? { backgroundColor: "#ffc78f" } : {}}
                    >
                      {index + 1}
                    </p>
                    <p className="senders-name">
                      {name}
                      <span>{role}</span>
                    </p>
                    <p className="senders-post-count">
                      {count} {count === 1 ? "Post" : "Posts"}
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <p>No data available for this period</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default KudosBoard;
