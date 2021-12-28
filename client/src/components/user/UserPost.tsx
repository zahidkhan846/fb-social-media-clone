import { FC } from "react";
import moment from "moment";

import { Avatar } from "@mui/material";
import { Box } from "@mui/system";

import { useSelector } from "react-redux";
import { RootState } from "../../store";

import { Post } from "../../models/post";

import DropDown from "../user-interface/DropDown";

import { ChatBubble, Favorite } from "@mui/icons-material";

import classes from "./User.module.css";

interface UserPostComp {
  key: number;
  post: Post;
}

export const UserPost: FC<UserPostComp> = ({ post }) => {
  const deleteLoading = useSelector(
    (state: RootState) => state.post.deletePostLoading
  );
  const loggedInUser = useSelector(
    (state: RootState) => state.auth.loggedInUser
  );
  const postId = useSelector((state: RootState) => state.post.currPostId);
  const editLoading = useSelector(
    (state: RootState) => state.post.editPostLoading
  );

  return (
    <li
      className={classes.userPostList}
      style={{
        opacity: `${deleteLoading && postId === post.postId ? "0.5" : "1"}`,
        background: `${
          editLoading && postId === post.postId ? "#f5d16e2f" : "white"
        }`,
      }}
    >
      <header className={classes.userPostHeader}>
        <Box sx={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Avatar src={post.creatorImageUrl} />
          <p>
            <strong>{post.creatorFullName}</strong>{" "}
            <span className={classes.userInfo}>
              @{post.createdBy}
              <span> &#183; </span>
              {moment(post.createdAt).fromNow()}
            </span>
          </p>
        </Box>
        {loggedInUser?.username === post.createdBy && <DropDown data={post} />}
      </header>
      <main className={classes.postContent}>
        <p>{post.content}</p>
      </main>
      <footer className={classes.contentFooter}>
        <p className={classes.likeCommCount}>
          <Favorite fontSize="small" color="primary" />
          <span>{post.likeCount}</span>
        </p>
        <p className={classes.likeCommCount}>
          <ChatBubble fontSize="small" color="secondary" />
          <span>{post.commentCount}</span>
        </p>
      </footer>
    </li>
  );
};
