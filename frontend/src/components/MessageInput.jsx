import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { newKudos } from "../redux/thunks/kudoThunk";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

const MessageInput = ({ open, setOpen }) => {
  const dispatch = useDispatch();
  const handleClose = () => setOpen(false);
  const users = useSelector((state) => state.user.list);
  const { error, status } = useSelector((state) => state.kudo);
  const [validationErrors, setValidationErrors] = useState(null);
  const [formData, setFormData] = useState({
    AuthorId: "",
    TargetId: "",
    Content: "",
  });

  useEffect(() => {
    const authorString = localStorage.getItem("user");
    const author = JSON.parse(authorString);
    setFormData({ ...formData, ["AuthorId"]: author.user[0].Id });
  }, []);

  //mui drop down menu style
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: 48 * 4.5 + 8,
        width: 300,
      },
    },
  };

  const handleChange = (name, value) => {
    console.log(name, value);

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = () => {
    if (!formData.TargetId) {
      setValidationErrors("Please select an employee to give kudos to");
      return;
    } else if (!formData.Content) {
      setValidationErrors("Please provide a reason for giving kudos");
      return;
    }
    dispatch(newKudos(formData));
  };

  useEffect(() => {
    if (status === "succeeded") {
      setOpen(false);
    }
  }, [status, setOpen]);

  return (
    <div id="modal-message">
      <Dialog open={open} onClose={handleClose}>
        <DialogContent>
          <InputLabel id="demo-simple-select-helper-label">
            Who do you want to recognize?
          </InputLabel>
          <Select
            labelId="demo-simple-select-helper-label"
            id="demo-simple-select-helper"
            value={formData.TargetId}
            onChange={(e) => handleChange("TargetId", e.target.value)}
            input={<OutlinedInput label="Name" />}
            MenuProps={MenuProps}
          >
            {users.map((user) => (
              <MenuItem key={user.Id} value={user.Id}>
                {user.Name} ({user.Role})
              </MenuItem>
            ))}
          </Select>

          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            placeholder="Why do you kudos to him/her?"
            type="text"
            fullWidth
            multiline
            variant="standard"
            onChange={(e) => handleChange("Content", e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" onClick={handleSubmit}>
            Submit
          </Button>
        </DialogActions>
        {error && <div className="error-messageinput">{error}</div>}
        {validationErrors && (
          <div className="error-messageinput">{validationErrors}</div>
        )}
      </Dialog>
    </div>
  );
};
export default MessageInput;
