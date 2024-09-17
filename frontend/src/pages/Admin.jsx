import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  deletAnnouncement,
  getAnnouncement,
  addAnnouncement,
} from "../redux/thunks/announcementThunk";
import { deletUser, changeUserPermisson } from "../redux/thunks/userThunk";
import { getUpdatedUserInfo } from "../redux/thunks/authThunk";
//MUI Alert
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import { Select } from "@mui/material";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Stack from "@mui/material/Stack";
//Icons
import { FaTrashCan } from "react-icons/fa6";
//component
import Navbar from "../components/Navbar";

const Admin = () => {
  const storedUserId = localStorage.getItem("userId");
  const users = useSelector((state) => state.user.list);
  const loginUser = useSelector((state) => state.auth.userData);
  const author = loginUser ? loginUser[0] : null;
  const updateStatus = useSelector((state) => state.user.status);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    AuthorId: "",
    Text: "",
  });

  const [open, setOpen] = useState(false);
  const [openInput, setOpenInput] = useState(false);
  const [selectedUser, setSelectedUser] = useState({
    Id: null,
    Name: "",
  });
  const announcements = useSelector((state) => state.announcement.list);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  //User search and filter
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [permissions, setPermissions] = useState({});
  const [showAlert, setShowAlert] = useState("");

  useEffect(() => {
    dispatch(getUpdatedUserInfo(storedUserId));
    dispatch(getAnnouncement());
  }, [dispatch, storedUserId]);

  useEffect(() => {
    if (author) {
      setFormData((prevData) => ({
        ...prevData,
        AuthorId: author.Id,
      }));
    }
    if (users.length > 0) {
      [...users].sort((a, b) => a.Name.localeCompare(b.Name));
    }
    setIsLoading(false);
  }, [author, users]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

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
    try {
      await dispatch(addAnnouncement(formData));
      await dispatch(getAnnouncement());

      setIsLoading(false);
      setOpenInput(false);
    } catch (error) {
      setError("Failed to add announcement");
      setIsLoading(false);
    }
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

  const handleDeleteUser = () => {
    setOpen(false);
    dispatch(deletUser(selectedUser.Id));
  };

  const handleDeleteAnnouncement = (announcementId) => {
    dispatch(deletAnnouncement(announcementId)).then(() => {
      dispatch(getAnnouncement());
    });
  };

  const handleChangeUserPermission = (id) => {
    const userPermission = permissions[id];
    dispatch(
      changeUserPermisson({
        Id: id,
        Permission: userPermission === "1",
      })
    );
    console.log(updateStatus);

    if (updateStatus === "success") {
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 2000);
    }
  };

  const handlePermissionChange = (id, value) => {
    setPermissions((prevPermissions) => ({
      ...prevPermissions,
      [id]: value,
    }));
  };

  // useEffect(() => {
  //   if (users.length > 0) {
  //     [...users].sort((a, b) => a.Name.localeCompare(b.Name));
  //   }
  // }, [users]);

  const filteredUsers = users
    .filter((user) =>
      user.Name.toLowerCase().includes(searchTerm.toLocaleLowerCase())
    )
    .filter((user) => (roleFilter ? user.Role === roleFilter : true));

  return (
    <>
      <Navbar />
      <div className="admin page">
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
                {error && (
                  <div className="error-announcementInput">{error}</div>
                )}
              </Dialog>
            </div>
          )}

          {/* Team Section (Admin only) */}
          <div className="admin-team-section">
            <h3>Team</h3>

            {/* Filter Section */}
            <div className="admin-team-filter">
              <div className="admin-team-search">
                <TextField
                  size="small"
                  placeholder="Search by Name"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="admin-team-role-filter">
                <Select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  displayEmpty
                  size="small"
                >
                  <MenuItem value="">All Roles</MenuItem>
                  <MenuItem value="Sales">Sales</MenuItem>
                  <MenuItem value="Tech">Tech</MenuItem>
                  <MenuItem value="Administrator">Administrator</MenuItem>
                  <MenuItem value="Designer">Designer</MenuItem>
                  <MenuItem value="Operation Administrator">
                    Operation Administrator
                  </MenuItem>
                  <MenuItem value="Project Manager">Project Manager</MenuItem>
                  <MenuItem value="Dispatch">Dispatch</MenuItem>
                </Select>
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
              {filteredUsers.map((user) => (
                <div key={user.Id} className="admin-team-item">
                  <div className="admin-team-name">{user.Name}</div>
                  <div className="admin-team-email">{user.Email}</div>
                  <div className="admin-team-role">{user.Role}</div>
                  <div className="admin-team-permission">
                    <FormControl id="permission-selector" fullWidth>
                      <Select
                        value={
                          permissions[user.Id] || (user.Permission ? "1" : "0")
                        }
                        onChange={(e) =>
                          handlePermissionChange(user.Id, e.target.value)
                        }
                        size="small"
                      >
                        <MenuItem value="1">Admin</MenuItem>
                        <MenuItem value="0">Member</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                  <div className="admin-action">
                    <button onClick={() => handleChangeUserPermission(user.Id)}>
                      SAVE
                    </button>
                    <FaTrashCan
                      onClick={() => handleClickOpen(user.Id, user.Name)}
                    />
                  </div>
                </div>
              ))}
            </div>
            {showAlert && (
              <Stack id="success-alert" sx={{ width: "100%" }} spacing={2}>
                <Alert variant="filled" severity="success">
                  <AlertTitle>Success</AlertTitle>
                  Permission updated successfully!
                </Alert>
              </Stack>
            )}
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
                <Button onClick={handleDeleteUser}>Delete</Button>
              </DialogActions>
            </Dialog>
          </>
        )}
      </div>
    </>
  );
};

export default Admin;
