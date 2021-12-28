import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

import Button from "@mui/material/Button";
import { TextField } from "@mui/material";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { addMoreDetails } from "../../store/user/user.actions";

export default function UpdateUser({
  open,
  handleClose,
  user,
  errors,
  setErrors,
  loading,
}) {
  const [bio, setBio] = useState(user?.bio || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [location, setLocation] = useState(user?.location || "");
  const [website, setWebsite] = useState(user?.website || "");

  const dispatch = useDispatch();

  const handleSubmit = () => {
    if (bio.length > 20) return;
    dispatch(addMoreDetails({ bio, phone, location, website }, handleClose));
  };

  const textInputStyle = {
    "&:hover": {},
    mb: 1,
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle className="colorful-text">
        Say More about yourself...
      </DialogTitle>
      <DialogContent>
        <TextField
          error={!!errors?.bio}
          helperText={errors?.bio || "Maximum 20 charcters allowed."}
          onBlur={() => {
            setErrors((prevState) => {
              return { ...prevState, bio: "" };
            });
          }}
          id="standard-basic"
          label="Bio"
          variant="filled"
          name="bio"
          fullWidth
          sx={textInputStyle}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />
        <TextField
          error={!!errors?.website}
          helperText={errors?.website}
          onBlur={() => {
            setErrors((prevState) => {
              return { ...prevState, website: "" };
            });
          }}
          id="standard-basic"
          label="Website"
          variant="filled"
          name="website"
          fullWidth
          sx={textInputStyle}
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
        <TextField
          error={!!errors?.phone}
          helperText={errors?.phone}
          onBlur={() => {
            setErrors((prevState) => {
              return { ...prevState, phone: "" };
            });
          }}
          id="standard-basic"
          label="Phone"
          variant="filled"
          name="phone"
          fullWidth
          sx={textInputStyle}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <TextField
          error={!!errors?.location}
          helperText={errors?.location}
          onBlur={() => {
            setErrors((prevState) => {
              return { ...prevState, location: "" };
            });
          }}
          id="standard-basic"
          label="Location"
          variant="filled"
          name="location"
          fullWidth
          sx={textInputStyle}
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </DialogContent>
      <DialogActions sx={{ padding: "0 24px 20px 0" }}>
        <Button color="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="outlined" disabled={loading} onClick={handleSubmit}>
          {loading ? "Updating..." : "Update"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
