import { Avatar, Button } from "@mui/material";
import classes from "./CreatePost.module.css";
import { Box } from "@mui/system";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { FormEvent, useEffect, useState } from "react";
import { createNewPost } from "../../store/post/post.actions";
import { Loading } from "../user-interface/Loading";
import { LoggedInUser } from "../../models/auth";
import { UserData } from "../../models/user";

function CreatePost() {
  const loggedInUser: LoggedInUser = useSelector(
    (state: RootState) => state.auth.loggedInUser
  );
  const user: UserData = useSelector((state: RootState) => state.user.user);

  const loading = useSelector((state: RootState) => state.post.addPostLoading);

  const [content, setContent] = useState("");

  const dispatch = useDispatch();

  const [isValid, setIsValid] = useState(false);
  useEffect(() => {
    if (content.length === 0) {
      setIsValid(false);
    } else {
      setIsValid(true);
    }
  }, [content.length]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!loggedInUser) return;
    const token = localStorage.getItem("token");
    if (!token) return;
    if (!user) return;
    dispatch(createNewPost(content, token));
    setContent("");
  };

  return (
    <Box className={classes.createPost} sx={{ marginTop: "1rem" }}>
      <form onSubmit={handleSubmit}>
        <Box
          sx={{ display: "flex", gap: "0.5rem", margin: "0.25rem 0 0.5rem 0" }}
        >
          <>
            <Avatar alt={loggedInUser?.fullName} src={loggedInUser?.imageUrl} />
          </>
          <Box sx={{ flex: 1 }}>
            <textarea
              className={classes.textArea}
              name="create-post"
              id="create-post"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={2}
              placeholder="Whats happening..."
            ></textarea>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          {loading ? (
            <Box
              sx={{
                height: "36px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                overflow: "hidden",
              }}
            >
              <Loading />
            </Box>
          ) : (
            <Button
              disabled={loading || !loggedInUser || !isValid}
              type="submit"
              color="secondary"
              variant="outlined"
              sx={{
                borderRadius: "2rem",
              }}
            >
              Post
            </Button>
          )}
        </Box>
      </form>
    </Box>
  );
}

export default CreatePost;
