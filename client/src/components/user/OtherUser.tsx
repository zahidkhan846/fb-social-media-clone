import { Fragment, useEffect, useState } from "react";

import moment from "moment";

import { RootState } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import { getUserDetail } from "../../store/user/user.actions";

import { useParams } from "react-router";

import { Post } from "../../models/post";
import { UserPost } from "./UserPost";

import { Box } from "@mui/system";

import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import { CreateNewFolderOutlined, Language } from "@mui/icons-material";
import { Fingerprint, Phone } from "@mui/icons-material";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import { CircularProgress } from "@mui/material";

export const OtherUser = () => {
  const otherUser = useSelector((state: RootState) => state.user.otherUser);
  const loading = useSelector((state: RootState) => state.user.loading);

  const [showMore, setShowMore] = useState(false);

  const dispatch = useDispatch();
  const { username } = useParams<{ username: string }>();

  useEffect(() => {
    dispatch(getUserDetail(username));
  }, [dispatch, username]);

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
      {otherUser && (
        <Fragment>
          <img
            src="http://picsum.photos/1000/300"
            alt="banner"
            className="banner"
          />

          <div className="user">
            <div className="user-image">
              <img
                src={otherUser.imageUrl}
                alt={otherUser.firstName}
                className="user-image"
              />
            </div>
            <h1>
              {otherUser.firstName} {otherUser.lastName}
            </h1>
            <p className="gray-text text-center">
              {otherUser.bio
                ? otherUser.bio
                : "Say something about yourself..."}
            </p>
          </div>
          <div className="user-content">
            <div className="col1">
              <div className="user-card">
                <h2>Intro</h2>
                <p className="align-center">
                  <Language /> {otherUser.website || "www.example.com"}
                </p>
                <p className="align-center">
                  <AlternateEmailIcon /> {otherUser.email}
                </p>
                <p className="align-center">
                  <CreateNewFolderOutlined /> Created on{" "}
                  {moment(otherUser.createdAt).format("MMM Do YY")}
                </p>
                {showMore && (
                  <Fragment>
                    <p className="align-center capital">
                      <Fingerprint /> {otherUser.gender}
                    </p>
                    <p className="align-center">
                      <LocationOnOutlinedIcon />{" "}
                      {otherUser.location || "Add location"}
                    </p>
                    <p className="align-center">
                      <Phone /> {otherUser.phone || "Add Phone"}
                    </p>
                  </Fragment>
                )}
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
                {otherUser.posts.map((post: Post, index) => (
                  <UserPost key={index} post={post} />
                ))}
              </ul>
            </div>
          </div>
        </Fragment>
      )}
    </div>
  );
};
