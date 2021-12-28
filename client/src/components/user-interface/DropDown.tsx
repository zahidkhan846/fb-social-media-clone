import { IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";

import React, { FC, useState } from "react";
import { Post } from "../../models/post";
import { useDispatch } from "react-redux";
import {
  deleteSelectedPost,
  editSelectedPost,
} from "../../store/post/post.actions";

interface DropDownType {
  data?: Post;
}

const DropDown: FC<DropDownType> = (props) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const [openDialog, setDialogOpen] = React.useState(false);
  const [content, setContent] = useState(props.data.content || "");

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const dispatch = useDispatch();

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    setDialogOpen(true);
    handleClose();
  };

  const handleUpdatePost = () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    dispatch(editSelectedPost(content, props.data.postId, token));
    handleCloseDialog();
  };

  const handleDelete = () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    if (props.data.postId) {
      dispatch(deleteSelectedPost(props.data.postId, token));
    }
    handleClose();
  };

  return (
    <div>
      <IconButton
        id="basic-button"
        aria-controls="basic-menu"
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem onClick={handleEdit}>Edit</MenuItem>
        <MenuItem onClick={handleDelete}>Delete</MenuItem>
      </Menu>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Update Post</DialogTitle>
        <DialogContent>
          <TextField
            sx={{ width: "450px" }}
            margin="dense"
            label="Content"
            type="text"
            fullWidth
            variant="filled"
            multiline
            maxRows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ padding: "0 24px 24px 0" }}>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleUpdatePost} variant="outlined">
            Edit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DropDown;
