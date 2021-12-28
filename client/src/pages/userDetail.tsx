import { Fragment, useEffect, useState } from "react";
import moment from "moment";

import {
  CreateNewFolderOutlined,
  Fingerprint,
  Language,
  Phone,
  RssFeed,
} from "@mui/icons-material";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import { Alert, CircularProgress } from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";

import { Box } from "@mui/system";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { getLoggedInUser, uploadImage } from "../store/user/user.actions";
import { clearError } from "../store/post/post.actions";

import { UserPost } from "../components/user/UserPost";
import { Post } from "../models/post";
import UpdateUser from "../components/user/UpdateUserModal";

import { UserData } from "../models/user";

const Input = styled("input")({
  display: "none",
});

export const UserDetail = () => {
  const user: UserData = useSelector((state: RootState) => state.user.user);
  const loading = useSelector((state: RootState) => state.user.loading);
  const imageUploadLoad = useSelector(
    (state: RootState) => state.user.imageLoading
  );
  const deletePostErr = useSelector(
    (state: RootState) => state.post.deletePostErr
  );
  const editPostErr = useSelector((state: RootState) => state.post.editPostErr);

  const [showMore, setShowMore] = useState(false);

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const userError = useSelector((state: RootState) => state.user.error);
  const userUpdateLoading = useSelector(
    (state: RootState) => state.user.userUpdateLoading
  );

  const [errors, setErrors] = useState<{
    bio?: string;
    phone?: string;
    location?: string;
    website?: string;
  }>(null);

  const [postErr, setPostErr] = useState(null);

  useEffect(() => {
    if (deletePostErr || editPostErr) {
      setPostErr(deletePostErr || editPostErr);
    }
  }, [deletePostErr, editPostErr]);

  useEffect(() => {
    if (userError) {
      setErrors(userError);
    }
  }, [userError]);

  const dispatch = useDispatch();

  const handleImageUpload = (e) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const image = e.target.files[0];
    const formData = new FormData();
    formData.append("image", image, image.name);
    dispatch(uploadImage(formData, token));
  };

  useEffect(() => {
    if (user) return;
    dispatch(getLoggedInUser());
  }, [user, dispatch]);

  if (user) {
    user.connections.followers = [];
  }

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress color="secondary" />
      </Box>
    );
  }

  return (
    <div className="mini-container">
      {postErr && (
        <Alert
          severity="error"
          sx={{
            position: "absolute",
            top: "64px",
            left: "30%",
            right: "30%",
            zIndex: "5",
          }}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setPostErr(null);
                dispatch(clearError());
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          {postErr.message}
        </Alert>
      )}
      {user && (
        <Fragment>
          <img
            src="http://picsum.photos/1000/300"
            alt="banner"
            className="banner"
          />

          <div className="user">
            <div className="user-image">
              <img
                src={user.imageUrl}
                alt={user.firstName}
                className="user-image"
              />
              <label htmlFor="icon-button-file" className="user-image-upload">
                <Input
                  accept="image/*"
                  id="icon-button-file"
                  type="file"
                  onChange={handleImageUpload}
                />
                <IconButton
                  color="inherit"
                  aria-label="upload picture"
                  component="span"
                  sx={{
                    background: "#636978",
                    color: "white",
                    padding: "0.4rem",
                    "&:hover": {
                      backgroundColor: `${
                        imageUploadLoad ? "#636978" : "#424449"
                      }`,
                      cursor: `${imageUploadLoad ? "default" : "pointer"}`,
                    },
                  }}
                >
                  {!imageUploadLoad ? (
                    <PhotoCamera sx={{ fontSize: "1.4rem" }} />
                  ) : (
                    <CircularProgress size={23} />
                  )}
                </IconButton>
              </label>
            </div>
            <h1>
              {user.firstName} {user.lastName}
            </h1>
            <p className="gray-text text-center">
              {user.bio ? user.bio : "Say something about yourself..."}
            </p>
          </div>
          <div className="user-content">
            <div className="col1">
              <div className="user-card">
                <h2>Intro</h2>
                <p className="align-center">
                  <RssFeed /> Followed by {user.connections.followers.length}{" "}
                  people
                </p>
                <p className="align-center">
                  <Language /> {user.website || "www.example.com"}
                </p>
                <p className="align-center">
                  <AlternateEmailIcon /> {user.email}
                </p>
                <p className="align-center">
                  <CreateNewFolderOutlined /> Created on{" "}
                  {moment(user.createdAt).format("MMM Do YY")}
                </p>
                {showMore && (
                  <Fragment>
                    <p className="align-center capital">
                      <Fingerprint /> {user.gender}
                    </p>
                    <p className="align-center">
                      <LocationOnOutlinedIcon />{" "}
                      {user.location || "Add location"}
                    </p>
                    <p className="align-center">
                      <Phone /> {user.phone || "Add Phone"}
                    </p>
                  </Fragment>
                )}
                <button onClick={handleClickOpen} className="card-button">
                  Update Profile
                </button>
                <button
                  onClick={() => {
                    setShowMore(!showMore);
                  }}
                  className="card-button"
                >
                  {showMore ? "Less Details" : "More Details"}
                </button>
              </div>
            </div>
            <div className="col2">
              <ul className="user-posts">
                {user.posts.map((ppost: Post, index) => (
                  <UserPost key={index} post={ppost} />
                ))}
              </ul>
            </div>
          </div>
        </Fragment>
      )}
      <UpdateUser
        open={open}
        handleClose={handleClose}
        user={user}
        errors={errors}
        setErrors={setErrors}
        loading={userUpdateLoading}
      />
    </div>
  );
};
