import { FC, Fragment, useEffect, useState } from "react";
import moment from "moment";

import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ShareIcon from "@mui/icons-material/Share";
import { Avatar, Button } from "@mui/material";
import { ChatBubble, Favorite } from "@mui/icons-material";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import * as PostAction from "./../../store/post/post.actions";

import { UserData } from "../../models/user";
import { Post } from "../../models/post";

import DropDown from "../user-interface/DropDown";
import { Comments } from "./Comments";

import { useHistory } from "react-router";
import { Link } from "react-router-dom";

import classes from "./SinglePost.module.css";

interface PostItem {
  post: Post;
}

const SinglePost: FC<PostItem> = ({ post }: PostItem): JSX.Element => {
  const loggedInUser = useSelector(
    (state: RootState) => state.auth.loggedInUser
  );
  const editPostLoading = useSelector(
    (state: RootState) => state.post.editPostLoading
  );
  const deletePostLoading = useSelector(
    (state: RootState) => state.post.deletePostLoading
  );
  const currPostId = useSelector((state: RootState) => state.post.currPostId);

  const user: UserData = useSelector((state: RootState) => state.user.user);

  const [liked, setLiked] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    if (
      user &&
      user.likes.length > 0 &&
      user.likes.find((like) => like.postId === post.postId)
    ) {
      setLiked(true);
    } else {
      setLiked(false);
    }
  }, [loggedInUser, user, post.postId]);

  const history = useHistory();
  const dispatch = useDispatch();

  const handleLike = (postId: string) => {
    const token = localStorage.getItem("token");
    if (!token) {
      history.push("/auth");
      return;
    }
    dispatch(PostAction.likePost(token, postId, setLiked));
  };

  const handleUnlike = (postId: string) => {
    const token = localStorage.getItem("token");
    dispatch(PostAction.unlikePost(token, postId, setLiked));
  };

  const handleOpenComments = () => {
    setOpen(true);
    dispatch(PostAction.getComments(post.postId));
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Fragment>
      <li
        className={classes.listItem}
        style={{
          opacity: `${
            deletePostLoading && currPostId === post.postId ? "0.5" : "1"
          }`,
          background: `${
            editPostLoading && currPostId === post.postId
              ? "#f5d16e2f"
              : "white"
          }`,
        }}
      >
        <header className={classes.postHeader}>
          <div className={classes.headerContent}>
            <Avatar alt={post.createdBy} src={post.creatorImageUrl} />
            <p>
              <strong>
                <Link
                  className={classes.link}
                  to={
                    loggedInUser?.username !== post.createdBy
                      ? `/other-user/${post.createdBy}`
                      : `/${loggedInUser.username}`
                  }
                >
                  {post.creatorFullName}
                </Link>
              </strong>{" "}
              <span className={classes.userInfo}>
                @{post.createdBy} &#183; {moment(post.createdAt).fromNow()}
              </span>
            </p>
          </div>
          {loggedInUser && loggedInUser.username === post.createdBy && (
            <DropDown data={post} />
          )}
        </header>
        <main>
          <Link to={`/posts/${post.postId}`}>
            <p className={classes.postContent}>{post.content}</p>
            <div className={classes.contentFooter}>
              <p className={classes.likeCommCount}>
                <Favorite fontSize="small" color="primary" />
                <span>{post.likeCount}</span>
              </p>
              <p className={classes.likeCommCount}>
                <ChatBubble fontSize="small" color="secondary" />
                <span>{post.commentCount}</span>
              </p>
            </div>
          </Link>
        </main>
        <footer className={classes.buttonGroup}>
          {liked ? (
            <Button
              fullWidth
              color="primary"
              onClick={() => handleUnlike(post.postId)}
              startIcon={<Favorite />}
            >
              Unlike
            </Button>
          ) : (
            <Button
              fullWidth
              color="primary"
              onClick={() => handleLike(post.postId)}
              startIcon={<FavoriteBorderIcon />}
            >
              Like
            </Button>
          )}
          <Button
            fullWidth
            color="secondary"
            onClick={handleOpenComments}
            startIcon={<ChatBubbleOutlineIcon />}
          >
            Comment
          </Button>
          <Button
            fullWidth
            color="info"
            onClick={() => {}}
            startIcon={<ShareIcon />}
          >
            Share
          </Button>
        </footer>
      </li>
      <Comments open={open} handleClose={handleClose} postId={post.postId} />
    </Fragment>
  );
};

export default SinglePost;
