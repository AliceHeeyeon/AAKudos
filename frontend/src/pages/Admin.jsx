import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import DesktopMenu from "../components/DesktopMenu";
import { FaTrashCan } from "react-icons/fa6";
import { IoSearch } from "react-icons/io5";
import { IoFilter } from "react-icons/io5";

const baseUrl = import.meta.env.VITE_BASE_URL;
const Admin = () => {
  const [announcements, setAnnouncements] = useState([]);
  const users = useSelector((state) => state.user.list);
  console.log(users);

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/announcement`);
        setAnnouncements(response.data[0]);
      } catch (err) {
        console.error("Error fetching announcement:", err);
      }
    };
    fetchAnnouncement();
  }, []);

  useEffect(() => {
    if (users.length > 0) {
      [...users].sort((a, b) => a.Name.localeCompare(b.Name));
    }
  }, [users]);
  return (
    <div className="admin-page">
      <DesktopMenu />
      <div className="admin-contents">
        {/* Announcement Section (Admin only) */}
        <div className="admin-announcement-section">
          <div className="admin-announcement-header">
            <h3>Announcement</h3>
            <button>Add a new</button>
          </div>
          {announcements.map((announcement) => (
            <div key={announcement.Id} className="admin-announcement-item">
              <div>{announcement.Text}</div>
              <FaTrashCan className="admin-action-delete" />
            </div>
          ))}
        </div>

        {/* Team Section (Admin only) */}
        <div className="admin-team-section">
          <h3>Team</h3>

          {/* Filter Section */}
          <div className="admin-team-filter">
            <p>Filter by: </p>
            <div className="admin-team-filter-icons">
              <p>
                <IoSearch />
              </p>
              <p>
                <IoFilter />
              </p>
            </div>
          </div>

          <div className="admin-team-table-container">
            {/* Team Table Header */}
            <div className="admin-team-table-header">
              <div className="admin-team-header-name">Name</div>
              <div className="admin-team-header-email">Email</div>
              <div className="admin-team-header-role">Role</div>
              <div className="admin-team-header-permission">Permission</div>
              <div className="admin-team-header-action">Action</div>
            </div>

            {/* Team List */}
            {users.map((user) => (
              <div key={user.Id} className="admin-team-item">
                <div className="admin-team-name">{user.Name}</div>
                <div className="admin-team-email">{user.Email}</div>
                <div className="admin-team-role">{user.Role}</div>
                <div className="admin-team-permission">{user.Permission}</div>
                <div className="admin-action-delete">
                  <FaTrashCan />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
