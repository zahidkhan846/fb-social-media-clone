import { Box } from "@mui/system";
import { Avatar, Button, CircularProgress, Dialog } from "@mui/material";
import * as PostAction from "./../../store/post/post.actions";
import { ChatBubble, Favorite } from "@mui/icons-material";

import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { RootState } from "../../store";
import classes from "./SinglePost.module.css";
import { PostComment } from "./PostComment";

export const Comments = ({ open, handleClose, postId }) => {
  const commLoading = useSelector(
    (state: RootState) => state.post.activityOnPostLoading
  );
  const singlePost = useSelector((state: RootState) => state.post.singlePost);

  const currPostId = useSelector((state: RootState) => state.post.currPostId);

  const [content, setContent] = useState("");

  const dispatch = useDispatch();

  const handleCreateComment = () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    dispatch(PostAction.createComment(postId, token, content));
    setContent("");
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <div className={classes.commentDiv}>
        {singlePost && singlePost.postId === currPostId && (
          <div className={classes.selectedPost}>
            <div className={classes.heading}>
              <Avatar src={singlePost.creatorImageUrl} />
              <h4>{singlePost.creatorFullName}</h4>
              <p className={classes.userInfo}>
                @{singlePost.createdBy} &#183;{" "}
                {moment(singlePost.createdAt).fromNow()}
              </p>
            </div>
            <p className={classes.selectedPostContent}>{singlePost.content}</p>
            <div className={classes.contentFooter}>
              <p className={classes.likeCommCount}>
                <Favorite fontSize="small" color="primary" />
                <span>{singlePost.likeCount}</span>
              </p>
              <p className={classes.likeCommCount}>
                <ChatBubble fontSize="small" color="secondary" />
                <span>{singlePost.commentCount}</span>
              </p>
            </div>
          </div>
        )}
        {commLoading && currPostId === postId && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CircularProgress />
          </Box>
        )}
        <ul>
          {singlePost &&
            singlePost.postId === currPostId &&
            singlePost.comments.map((comment) => (
              <PostComment
                key={comment.commentId}
                comment={comment}
                postId={singlePost.postId}
              />
            ))}
        </ul>
        <div className={classes.mt1}>
          <input
            className={classes.commentInput}
            type="text"
            placeholder="Write a comment..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <div className={classes.btnGroup}>
          <Button color="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="outlined" onClick={handleCreateComment}>
            Create
          </Button>
        </div>
      </div>
    </Dialog>
  );
};
