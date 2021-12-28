import { Fragment, useEffect, useState } from "react";
import { Alert, Grid, Snackbar } from "@mui/material";

import CreatePost from "../components/post/CreatePost";
import SinglePost from "../components/post/SinglePost";
import BasicModal from "../components/user-interface/BasicModal";

import UserCard from "../components/user/UserCard";
import Sidebar from "../components/sidebar/Sidebar";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { clearError, getAllPosts } from "../store/post/post.actions";
import { Post } from "../models/post";
import { DummyComponent } from "../components/user-interface/DummyElement";

function HomePage() {
  const getPostsErr = useSelector((state: RootState) => state.post.error);
  const addPostErr = useSelector((state: RootState) => state.post.addPostErr);
  const editPostErr = useSelector((state: RootState) => state.post.editPostErr);
  const deletePostErr = useSelector(
    (state: RootState) => state.post.deletePostErr
  );

  const posts: Post[] = useSelector((state: RootState) => state.post.posts);
  const loading = useSelector((state: RootState) => state.post.loading);
  const message = useSelector((state: RootState) => state.post.message);

  const [errors, setErrors] = useState(null);

  const dispatch = useDispatch();

  useEffect(() => {
    if (getPostsErr || addPostErr || deletePostErr || editPostErr) {
      setErrors(getPostsErr || addPostErr || deletePostErr || editPostErr);
    }
  }, [getPostsErr, addPostErr, deletePostErr, editPostErr]);

  useEffect(() => {
    if (posts.length === 0) {
      dispatch(getAllPosts());
    }
  }, [dispatch, posts.length]);

  return (
    <Fragment>
      {errors && (
        <BasicModal
          open={!!errors}
          handleClose={() => {
            setErrors(null);
            dispatch(clearError());
          }}
          title="An error occured"
          message={errors.message}
        />
      )}
      <Grid container>
        <Grid item sm={3} xs={12}>
          <UserCard />
        </Grid>
        <Grid item sm={6} xs={12}>
          <CreatePost />
          {loading && <DummyComponent />}
          {posts.length > 0 && (
            <ul className="posts-list">
              {posts.map((post) => (
                <SinglePost post={post} key={post.postId} />
              ))}
            </ul>
          )}
        </Grid>
        <Grid item sm={3} xs={12}>
          <Sidebar />
        </Grid>
      </Grid>
      {message && (
        <Snackbar
          open={!!message}
          autoHideDuration={6000}
          onClose={() => {
            dispatch(clearError());
          }}
        >
          <Alert
            onClose={() => {
              dispatch(clearError());
            }}
            severity="success"
            sx={{ width: "100%" }}
          >
            {message}
          </Alert>
        </Snackbar>
      )}
    </Fragment>
  );
}

export default HomePage;
