import React, { Fragment } from "react";

import { Badge, IconButton, Menu, Tooltip } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { Box } from "@mui/system";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import { Notification } from "../../models/user";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import classes from "./Notification.module.css";
import moment from "moment";
import { markAllAsRead, markAsRead } from "../../store/user/user.actions";
import DoneAllTwoToneIcon from "@mui/icons-material/DoneAllTwoTone";
import { useHistory } from "react-router";

export const Notifications = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const dispatch = useDispatch();
  const history = useHistory();

  const handleMarkAllAsRead = () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    if (!user) return;
    dispatch(markAllAsRead(token));
  };

  const handleClearNotification = (notificationId) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    if (!user) return;
    dispatch(markAsRead(token, notificationId));
  };

  return (
    <Fragment>
      <IconButton size="large" color="primary" onClick={handleClick}>
        <Badge
          badgeContent={
            user?.notifications.filter((n: Notification) => n.read === false)
              .length
          }
          color="error"
        >
          <NotificationsIcon />
        </Badge>
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
        {user &&
        user.notifications.filter((n: Notification) => n.read === false)
          .length === 0 ? (
          <div className={classes.noNotification}>
            <DoneAllTwoToneIcon /> <p>No Notifications.</p>
          </div>
        ) : (
          <div className={`${classes.notification} ${classes.flexEnd}`}>
            <button className={classes.button} onClick={handleMarkAllAsRead}>
              See All
            </button>
          </div>
        )}
        {user &&
          user.notifications
            .filter((n) => n.read === false)
            .map((n: Notification) => (
              <div key={n.nId} className={classes.notification}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "2rem",
                    justifyContent: "space-between",
                  }}
                >
                  <Box
                    sx={{
                      flex: "1",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: ".5rem",
                        marginBottom: ".5rem",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        handleClearNotification(n.nId);
                        history.push(`/posts/${n.postId}`);
                        handleClose();
                      }}
                    >
                      {n.type === "like" ? (
                        <FavoriteBorderIcon />
                      ) : (
                        <ChatBubbleOutlineIcon />
                      )}
                      <p>
                        {n.type === "like" ? "Liked" : "Commented"} by{" "}
                        <strong>@{n.sender}</strong>
                      </p>
                    </Box>
                    <p className={classes.flexEnd}>
                      {moment(n.createdAt).fromNow()}
                    </p>
                  </Box>
                  <Tooltip title="Mark as Read" placement="top">
                    <button
                      className={classes.buttonDot}
                      onClick={() => handleClearNotification(n.nId)}
                    ></button>
                  </Tooltip>
                </Box>
              </div>
            ))}
      </Menu>
    </Fragment>
  );
};
