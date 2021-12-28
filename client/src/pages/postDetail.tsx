import { FC, FormEvent, useEffect, useState } from "react";

import { Post, SinglePost } from "../models/post";
import { LoggedInUser } from "../models/auth";

import Sidebar from "../components/sidebar/Sidebar";
import UserCard from "../components/user/UserCard";
import DropDown from "../components/user-interface/DropDown";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import {
  createComment,
  deleteComment,
  getAllPosts,
  getSelectedPost,
} from "../store/post/post.actions";

import { useHistory, useParams } from "react-router";

import { Avatar, CircularProgress, IconButton } from "@mui/material";
import { Box } from "@mui/system";
import { ChatBubble, Favorite } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";

import moment from "moment";
import classes from "../components/post/SinglePost.module.css";

export const PostDetail: FC<Post> = () => {
  const post: SinglePost = useSelector(
    (state: RootState) => state.post.singlePost
  );
  const loading = useSelector(
    (state: RootState) => state.post.activityOnPostLoading
  );
  const loggedInUser: LoggedInUser = useSelector(
    (state: RootState) => state.auth.loggedInUser
  );

  const posts: Post[] = useSelector((state: RootState) => state.post.posts);

  const [content, setContent] = useState("");

  const { postId } = useParams<{ postId: string }>();

  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    if (post && post.postId === postId) return;
    dispatch(getSelectedPost(postId));
  }, [dispatch, postId, post]);

  useEffect(() => {
    if (posts.length === 0) {
      dispatch(getAllPosts());
    }
  }, [dispatch, posts.length]);

  const handleDelete = (id) => {
    if (posts.length === 0) return;
    const token = localStorage.getItem("token");
    if (!token) {
      history.push("/auth");
    }
    dispatch(deleteComment(token, id, postId));
  };

  const handleCreateComment = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (posts.length === 0) return;
    const token = localStorage.getItem("token");
    if (!token) {
      history.push("/auth");
      return;
    }
    dispatch(createComment(postId, token, content));
    setContent("");
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "45vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div className="post-detail">
      <UserCard />
      {post && (
        <div className="single-post">
          <header>
            <div className="post-user">
              <Avatar src={post.creatorImageUrl} />
              <p>
                <strong>{post.creatorFullName}</strong>{" "}
                <span className="gray-text">
                  @{post.createdBy} &#183; {moment(post.createdAt).fromNow()}
                </span>
              </p>
            </div>
            {loggedInUser?.username === post.createdBy ? (
              <DropDown data={post} />
            ) : null}
          </header>
          <main>
            <p className="post-content">{post.content}</p>
          </main>
          <footer>
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
            <h4>Comments</h4>
            <ul className="comments">
              {post.comments.map((c) => (
                <li key={c.commentId}>
                  <div>
                    <header>
                      <div className="post-user">
                        <Avatar src={c.creatorImageUrl} />
                        <p>
                          <strong>{c.fullName}</strong>{" "}
                          <span className="gray-text">
                            @{c.createdBy} &#183;{" "}
                            {moment(c.createdAt).fromNow()}
                          </span>
                        </p>
                      </div>
                      {loggedInUser?.username === c.createdBy ? (
                        <IconButton
                          aria-label="delete"
                          size="small"
                          color="warning"
                          onClick={() => {
                            handleDelete(c.commentId);
                          }}
                        >
                          <DeleteIcon fontSize="inherit" />
                        </IconButton>
                      ) : null}
                    </header>
                    <main>
                      <p className="post-content">{c.content}</p>
                    </main>
                  </div>
                </li>
              ))}
            </ul>
            <form
              onSubmit={handleCreateComment}
              style={{ marginTop: "0.5rem" }}
            >
              <input
                className={classes.commentInput}
                type="text"
                placeholder="Write a comment..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </form>
          </footer>
        </div>
      )}
      <Sidebar />
    </div>
  );
};
