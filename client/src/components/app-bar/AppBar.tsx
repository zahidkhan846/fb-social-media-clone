import React from "react";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Avatar, Button, Menu, MenuItem } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import AccountCircle from "@mui/icons-material/AccountCircle";
import LockOpenIcon from "@mui/icons-material/LockOpen";

import Logo from "../../assets/fb-clone.png";

import { Link } from "react-router-dom";
import { useHistory } from "react-router";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { logoutUser } from "../../store/auth/auth.actions";

import { LoggedInUser } from "../../models/auth";
import { Notifications } from "./Notifications";

export default function AppBarComponent() {
  const loggedInUser: LoggedInUser = useSelector(
    (state: RootState) => state.auth.loggedInUser
  );

  let displayName = "User";

  if (loggedInUser) {
    displayName =
      loggedInUser.fullName.split(" ")[0][0] +
      loggedInUser.fullName.split(" ")[1][0];
  }

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const history = useHistory();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutUser(history));
    handleClose();
  };

  return (
    <AppBar sx={{ background: "#1f1c1c" }}>
      <Toolbar>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <Avatar src={Logo} />
          <Typography
            className="colorful-text-light"
            variant="h6"
            component="h1"
          >
            Facechat
          </Typography>
        </Box>

        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{ display: { xs: "none", md: "flex" } }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            {loggedInUser && <Notifications />}
            <Button
              variant="outlined"
              component={Link}
              to="/"
              startIcon={<HomeIcon />}
            >
              Home
            </Button>
            {loggedInUser ? (
              <Button
                variant="outlined"
                id="basic-button"
                aria-controls="basic-menu"
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleClick}
                startIcon={<AccountCircle />}
              >
                {displayName}
              </Button>
            ) : (
              <Button
                variant="outlined"
                component={Link}
                to="/auth"
                startIcon={<LockOpenIcon />}
              >
                Login
              </Button>
            )}
          </Box>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <MenuItem
              onClick={() => {
                history.push(`/${loggedInUser.username}`);
                handleClose();
              }}
            >
              My Account
            </MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
