import AXIOS from "../../config/axios";
import { LoggedInUser, Response } from "../../models/auth";
import { AUTH_SUCCESS } from "../auth/auth.actions";

export const USER_LOADING = "USER_LOADING";

export const GET_USER_SUCCESS = "GET_USER_SUCCESS";

export const GET_OTHER_USER_SUCCESS = "GET_OTHER_USER_SUCCESS";
export const USER_ERROR = "USER_ERROR";

export const USER_IMAGE_LOADING = "USER_IMAGE_LOADING";
export const UPDATE_USER_IMAGE_SUCCESS = "UPDATE_USER_IMAGE_SUCCESS";

export const UPDATE_USER_LOADING = "UPDATE_USER_LOADING";
export const UPDATE_USER_SUCCESS = "UPDATE_USER_SUCCESS";

export const ADD_USER_POST_SUCCESS = "ADD_USER_POST_SUCCESS";
export const DELETE_USER_POST_SUCCESS = "DELETE_USER_POST_SUCCESS";
export const EDIT_USER_POST_SUCCESS = "EDIT_USER_POST_SUCCESS";

export const UPDATE_NOTIFICATIONS = "UPDATE_NOTIFICATIONS";
export const UPDATE_NOTIFICATION = "UPDATE_NOTIFICATION";

export const getLoggedInUser = () => async (dispatch) => {
  dispatch({ type: USER_LOADING });
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      return dispatch({
        type: USER_ERROR,
        payload: { message: "Unauthenticated!" },
      });
    }
    const res: Response = await AXIOS.get("/user/current-user", {
      headers: { authorization: `Bearer ${token}` },
    });
    return dispatch({ type: GET_USER_SUCCESS, payload: res.data.user });
  } catch (error) {
    return dispatch({ type: USER_ERROR, payload: error.response.data });
  }
};

export const getUserDetail = (username: string) => async (dispatch) => {
  dispatch({ type: USER_LOADING });
  try {
    const res: Response = await AXIOS.get(`/user/other-user/${username}`);
    return dispatch({ type: GET_OTHER_USER_SUCCESS, payload: res.data });
  } catch (error) {
    return dispatch({ type: USER_ERROR, payload: error.response.data });
  }
};

interface UserDetail {
  bio: string;
  location: string;
  phone: string;
  website: string;
}

export const addMoreDetails =
  (detail: UserDetail, functionRef) => async (dispatch) => {
    dispatch({ type: UPDATE_USER_LOADING });
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        return dispatch({
          type: USER_ERROR,
          payload: { message: "Unauthenticated!" },
        });
      }
      const res: Response = await AXIOS.post("/auth/add-details", detail, {
        headers: { authorization: `Bearer ${token}` },
      });
      functionRef();
      return dispatch({ type: UPDATE_USER_SUCCESS, payload: res.data.details });
    } catch (error) {
      return dispatch({
        type: USER_ERROR,
        payload: error.response.data,
      });
    }
  };

export const uploadImage = (formData, token) => async (dispatch) => {
  dispatch({ type: USER_IMAGE_LOADING });
  try {
    const res: Response = await AXIOS.post("/auth/image-upload", formData, {
      headers: { authorization: `Bearer ${token}` },
    });
    const loggedInUser: LoggedInUser = JSON.parse(localStorage.getItem("user"));
    loggedInUser.imageUrl = res.data.imageUrl;
    localStorage.setItem("user", JSON.stringify(loggedInUser));
    dispatch({
      type: AUTH_SUCCESS,
      payload: loggedInUser,
    });
    return dispatch({ type: UPDATE_USER_IMAGE_SUCCESS, payload: res.data });
  } catch (error) {
    return dispatch({
      type: USER_ERROR,
      payload: error.response.data,
    });
  }
};

export const markAllAsRead = (token) => async (dispatch) => {
  dispatch({ type: USER_LOADING });
  try {
    await AXIOS.get(`notification/mark-as-read/all`, {
      headers: { authorization: `Bearer ${token}` },
    });
    return dispatch({ type: UPDATE_NOTIFICATIONS });
  } catch (error) {
    return dispatch({
      type: USER_ERROR,
      payload: error.response.data,
    });
  }
};

export const markAsRead = (token, notificationId) => async (dispatch) => {
  dispatch({ type: USER_LOADING });
  try {
    await AXIOS.get(`notification/mark-as-read/${notificationId}`, {
      headers: { authorization: `Bearer ${token}` },
    });
    return dispatch({ type: UPDATE_NOTIFICATION, payload: notificationId });
  } catch (error) {
    return dispatch({
      type: USER_ERROR,
      payload: error.response.data,
    });
  }
};
