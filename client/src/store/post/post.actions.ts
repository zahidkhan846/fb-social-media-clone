import AXIOS from "../../config/axios";
import { Response } from "../../models/auth";
import * as User from "../user/user.actions";
import * as Post from "./post.action.types";

export const getAllPosts = () => async (dispatch) => {
  dispatch({ type: Post.POST_LOADING });
  try {
    const res = await AXIOS.get("/post/posts");
    return dispatch({ type: Post.SET_POSTS, payload: res.data });
  } catch (error) {
    return dispatch({
      type: Post.SET_POSTS_ERROR,
      payload: error.response.data,
    });
  }
};

export const createNewPost =
  (content: string, token: string) => async (dispatch) => {
    dispatch({ type: Post.ADD_POST_LOADING });
    try {
      const res = await AXIOS.post(
        "/post/add-post",
        { content },
        {
          headers: { authorization: `Bearer ${token}` },
        }
      );
      dispatch({ type: User.ADD_USER_POST_SUCCESS, payload: res.data });
      return dispatch({ type: Post.ADD_POST_SUCCESS, payload: res.data });
    } catch (error) {
      return dispatch({
        type: Post.ADD_POST_ERROR,
        payload: error.response.data,
      });
    }
  };

export const deleteSelectedPost =
  (id: string, token: string) => async (dispatch) => {
    dispatch({ type: Post.DELETE_POST_LOADING, payload: id });
    try {
      const res: Response = await AXIOS.delete(`/post/posts/${id}/delete`, {
        headers: { authorization: `Bearer ${token}` },
      });
      dispatch({ type: User.DELETE_USER_POST_SUCCESS, payload: id });
      return dispatch({
        type: Post.DELETE_POST_SUCCESS,
        payload: { ...res.data, postId: id },
      });
    } catch (error) {
      return dispatch({
        type: Post.DELETE_POST_ERROR,
        payload: error.response.data,
      });
    }
  };

export const editSelectedPost =
  (content: string, postId: string, token: string) => async (dispatch) => {
    dispatch({ type: Post.EDIT_POST_LOADING, payload: postId });
    try {
      const res: Response = await AXIOS.put(
        `/post/edit-post/${postId}`,
        { content },
        {
          headers: { authorization: `Bearer ${token}` },
        }
      );
      dispatch({
        type: User.EDIT_USER_POST_SUCCESS,
        payload: { postId, content },
      });
      return dispatch({
        type: Post.EDIT_POST_SUCCESS,
        payload: { ...res.data, content, postId },
      });
    } catch (error) {
      return dispatch({
        type: Post.EDIT_POST_ERROR,
        payload: error.response.data,
      });
    }
  };

export const likePost =
  (token: string, postId: string, fn: Function) => async (dispatch) => {
    dispatch({ type: Post.POST_ACTIVITY_LOADING });
    try {
      const res: Response = await AXIOS.get(`/post/posts/${postId}/like`, {
        headers: { authorization: `Bearer ${token}` },
      });
      fn(true);
      return dispatch({
        type: Post.POST_LIKE_SUCCESS,
        payload: { updatedPost: res.data, postId },
      });
    } catch (error) {
      return dispatch({
        type: Post.POST_ACTIVITY_ERROR,
        payload: error.response.data,
      });
    }
  };

export const unlikePost =
  (token: string, postId: string, fn: Function) => async (dispatch) => {
    dispatch({ type: Post.POST_ACTIVITY_LOADING, payload: postId });
    try {
      const res: Response = await AXIOS.get(`/post/posts/${postId}/unlike`, {
        headers: { authorization: `Bearer ${token}` },
      });
      fn(false);
      return dispatch({
        type: Post.POST_UNLIKE_SUCCESS,
        payload: { updatedPost: res.data, postId },
      });
    } catch (error) {
      return dispatch({
        type: Post.POST_ACTIVITY_ERROR,
        payload: error.response.data,
      });
    }
  };

export const clearError = () => (dispatch) => {
  return dispatch({ type: Post.CLEAR_ERROR });
};

export const getComments = (postId) => async (dispatch) => {
  dispatch({ type: Post.POST_ACTIVITY_LOADING, payload: postId });
  try {
    const res: Response = await AXIOS.get(`/post/posts/${postId}`);
    return dispatch({
      type: Post.SET_ALL_COMMENTS,
      payload: res.data,
    });
  } catch (error) {
    return dispatch({
      type: Post.POST_ACTIVITY_ERROR,
      payload: error.response.data,
    });
  }
};

export const createComment =
  (postId: string, token: string, content: string) => async (dispatch) => {
    try {
      const res: Response = await AXIOS.post(
        `/post/posts/${postId}/comment`,
        { content },
        {
          headers: { authorization: `Bearer ${token}` },
        }
      );
      dispatch({ type: Post.UPDATE_POST, payload: postId });
      return dispatch({
        type: Post.ADD_NEW_COMMENT,
        payload: res.data,
      });
    } catch (error) {
      return dispatch({
        type: Post.POST_ACTIVITY_ERROR,
        payload: error.response.data,
      });
    }
  };

export const deleteComment =
  (token: string, commentId: string, postId: string) => async (dispatch) => {
    try {
      const res: Response = await AXIOS.delete(
        `/post/posts/${postId}/${commentId}/delete`,
        {
          headers: { authorization: `Bearer ${token}` },
        }
      );
      return dispatch({
        type: Post.DELETE_COMMENT,
        payload: { message: res.data.message, postId, commentId },
      });
    } catch (error) {
      return dispatch({
        type: Post.POST_ACTIVITY_ERROR,
        payload: error.response.data,
      });
    }
  };

export const getSelectedPost = (postId) => async (dispatch) => {
  dispatch({ type: Post.POST_ACTIVITY_LOADING, payload: postId });
  try {
    const res: Response = await AXIOS.get(`/post/posts/${postId}`);
    return dispatch({
      type: Post.SET_ALL_COMMENTS,
      payload: res.data,
    });
  } catch (error) {
    return dispatch({
      type: Post.POST_ACTIVITY_ERROR,
      payload: error.response.data,
    });
  }
};
