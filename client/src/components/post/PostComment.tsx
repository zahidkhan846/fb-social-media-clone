import { Avatar } from "@mui/material";
import moment from "moment";
import { FC } from "react";
import { Comment } from "../../models/post";
import classes from "./SinglePost.module.css";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { deleteComment } from "../../store/post/post.actions";
import { LoggedInUser } from "../../models/auth";
import { RootState } from "../../store";

interface CommentComponent {
  key: string;
  comment: Comment;
  postId: string;
}

export const PostComment: FC<CommentComponent> = ({ comment, postId }) => {
  const loggedInUser: LoggedInUser = useSelector(
    (state: RootState) => state.auth.loggedInUser
  );

  const dispatch = useDispatch();
  const history = useHistory();

  const handleDelete = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      history.push("/auth");
      return;
    }
    dispatch(deleteComment(token, comment.commentId, postId));
  };

  return (
    <li className={classes.commentList}>
      <header>
        <div className={classes.commentHeader}>
          <div className={classes.commenter}>
            <Avatar
              sx={{ width: 24, height: 24 }}
              src={comment.creatorImageUrl}
            />
            <h4>{comment.fullName}</h4>
          </div>
          <p className={classes.username}>
            @{comment.createdBy} &#183; {moment(comment.createdAt).fromNow()}
          </p>
        </div>
        {loggedInUser?.username === comment.createdBy ? (
          <IconButton
            aria-label="delete"
            size="small"
            color="warning"
            onClick={handleDelete}
          >
            <DeleteIcon fontSize="inherit" />
          </IconButton>
        ) : null}
      </header>
      <main>
        <p className={classes.commentContent}>{comment.content}</p>
      </main>
    </li>
  );
};
