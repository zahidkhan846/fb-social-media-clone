import {
  CardContent,
  CardMedia,
  IconButton,
  LinearProgress,
  Tooltip,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { FC } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import EditIcon from "@mui/icons-material/Edit";
import { Link } from "react-router-dom";

const UserCard: FC = () => {
  const user = useSelector((state: RootState) => state.auth.loggedInUser);
  const loading = useSelector((state: RootState) => state.auth.loading);

  if (loading) {
    return <LinearProgress color="inherit" />;
  }

  return (
    <Box sx={{ marginTop: "1rem", marginRight: "1rem" }}>
      {user && (
        <Box
          sx={{
            background:
              "linear-gradient(0deg, rgba(237,35,10,0.2) 0%, rgba(241,207,9,0.2) 100%)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: "0.5rem",
            paddingTop: "1.5rem",
            borderRadius: "20px",
            color: "black",
            boxShadow: "0 0 4px 0 rgba(0, 0, 0, 0.1)",
          }}
        >
          <Box sx={{ position: "relative" }}>
            <CardMedia
              component="img"
              image={user.imageUrl}
              alt={user.fullName}
              sx={{
                borderRadius: "50%",
                height: "180px",
                width: "180px",
                border: "5px solid black",
              }}
            />
            <Tooltip title="Edit Profile" placement="top">
              <IconButton
                component={Link}
                to={`/${user.username}`}
                sx={{
                  position: "absolute",
                  bottom: "10px",
                  right: "10px",
                  backgroundColor: "#646060",
                  "&:hover": {
                    backgroundColor: "#424449",
                  },
                }}
              >
                <EditIcon color="primary" fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
          <CardContent>
            <Typography
              sx={{ textAlign: "center", fontWeight: "600" }}
              gutterBottom
              variant="h5"
              component="div"
            >
              {user.fullName}
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.25rem",
              }}
            >
              <VerifiedUserIcon sx={{ fontSize: "1.2rem" }} />
              <Typography variant="body2">@{user.username}</Typography>
            </Box>
          </CardContent>
        </Box>
      )}
    </Box>
  );
};

export default UserCard;
