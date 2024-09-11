import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  deletAnnouncement,
  getAnnouncement,
  addAnnouncement,
} from "../redux/thunks/announcementThunk";
import { deletUser } from "../redux/thunks/userThunk";
import DesktopMenu from "../components/DesktopMenu";

//MUI Alert
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
//Icons
import { FaTrashCan } from "react-icons/fa6";
import { IoSearch } from "react-icons/io5";
import { IoFilter } from "react-icons/io5";

const Admin = () => {
  const users = useSelector((state) => state.user.list);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    AuthorId: "",
    Text: "",
  });
  const [announcements, setAnnouncements] = useState([]);
  const [open, setOpen] = useState(false);
  const [openInput, setOpenInput] = useState(false);
  const [selectedUser, setSelectedUser] = useState({
    Id: null,
    Name: "",
  });
  const announcementsList = useSelector((state) => state.announcement.list);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    dispatch(getAnnouncement());
  }, [dispatch]);

  useEffect(() => {
    setAnnouncements(announcementsList);
  }, [announcementsList]);

  useEffect(() => {
    const authorString = localStorage.getItem("user");
    const author = JSON.parse(authorString);
    setFormData({ ...formData, ["AuthorId"]: author.user[0].Id });
  }, []);

  const handleChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
    if (!formData.Text) {
      setError("Please enter the content of the announcement");
      setIsLoading(false);
      return;
    }
    dispatch(addAnnouncement(formData));

    //Set Timeout to wait to update state after adding announcement
    setTimeout(() => {
      dispatch(getAnnouncement());
      setAnnouncements(announcementsList);
      setIsLoading(false);
    }, 50);
    setOpenInput(false);
  };

  const handleClickOpen = (Id, Name) => {
    setSelectedUser({ Id, Name });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setOpenInput(false);
    setFormData((prevData) => ({
      ...prevData,
      Text: "",
    }));
    setError(null);
  };

  const handleDelete = () => {
    setOpen(false);
    dispatch(deletUser(selectedUser.Id));
  };

  const handleDeleteAnnouncement = (announcementId) => {
    dispatch(deletAnnouncement(announcementId)).then(() => {
      dispatch(getAnnouncement());
    });
  };

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
            <button onClick={() => setOpenInput(true)}>Add a new</button>
          </div>

          {isLoading ? (
            <p>Loading announcements...</p>
          ) : (
            announcements.map((announcement) => (
              <div key={announcement.Id} className="admin-announcement-item">
                <div>{announcement.Text}</div>
                <FaTrashCan
                  className="admin-action-delete"
                  onClick={() => handleDeleteAnnouncement(announcement.Id)}
                />
              </div>
            ))
          )}
        </div>

        {openInput && (
          <div>
            <Dialog open={openInput} onClose={handleClose}>
              <DialogContent>
                <TextField
                  autoFocus
                  required
                  margin="dense"
                  id="name"
                  placeholder="What info you want to share with all?"
                  type="text"
                  fullWidth
                  multiline
                  variant="standard"
                  onChange={(e) => handleChange("Text", e.target.value)}
                  style={{ width: 50 + "vw" }}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button type="submit" onClick={handleSubmit}>
                  Submit
                </Button>
              </DialogActions>
              {error && <div className="error-announcementInput">{error}</div>}
            </Dialog>
          </div>
        )}

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
                  <FaTrashCan
                    onClick={() => handleClickOpen(user.Id, user.Name)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Alert popup */}
      {open && (
        <>
          <Button variant="outlined" onClick={handleClickOpen}>
            Open alert dialog
          </Button>
          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {`Permanently delete ${selectedUser.Name}?`}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                {`This action cannot be undone. Are you sure you want to delete ${selectedUser.Name}?`}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button onClick={handleDelete}>Delete</Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </div>
  );
};

export default Admin;
