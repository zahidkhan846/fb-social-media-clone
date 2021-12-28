import jwtDecode from "jwt-decode";
import AXIOS from "../../config/axios";
import { LoggedInUser, Response } from "../../models/auth";
import { GET_USER_SUCCESS } from "../user/user.actions";

export const AUTH_START = "AUTH_START";
export const AUTH_SUCCESS = "AUTH_SUCCESS";
export const AUTH_ERROR = "AUTH_ERROR";

export const LOGOUT_USER = "LOGOUT_USER";

export const authStart = (pathName, data, history: any) => async (dispatch) => {
  dispatch({ type: AUTH_START });
  try {
    const res: Response = await AXIOS.post(`/auth/${pathName}`, data);
    localStorage.setItem("token", res.data.token);
    const decodedToken: any = jwtDecode(res.data.token);
    const expirationTime = +decodedToken.exp * 1000;
    const logoutTime = expirationTime - new Date().getTime();
    try {
      // getting the user data with this token
      const userRes: Response = await AXIOS.get("/user/current-user", {
        headers: { authorization: `Bearer ${res.data.token}` },
      });
      const { email, firstName, lastName, imageUrl, userId, username } =
        userRes.data.user;
      // craeting a use
      const loggedInUser: LoggedInUser = {
        email,
        fullName: `${firstName} ${lastName}`,
        imageUrl,
        expirationTime,
        userId,
        username,
      };
      // store user in loacl storage
      localStorage.setItem("user", JSON.stringify(loggedInUser));
      // call autologout after token expiration
      dispatch(autoLogout(logoutTime, history));
      // redirecting user
      history.replace("/");
      dispatch({ type: GET_USER_SUCCESS, payload: userRes.data.user });
      return dispatch({
        type: AUTH_SUCCESS,
        payload: loggedInUser,
      });
    } catch (error) {
      return dispatch({ type: AUTH_ERROR, payload: error.response.data });
    }
  } catch (error) {
    return dispatch({ type: AUTH_ERROR, payload: error.response.data });
  }
};

export const autoLogin = (history) => async (dispatch) => {
  const loggedInUser: LoggedInUser = JSON.parse(localStorage.getItem("user"));
  const token: string = localStorage.getItem("token");

  if (!loggedInUser && !token) {
    return dispatch({ type: "DO_NOTHING" });
  }

  if (new Date().getTime() > loggedInUser.expirationTime) {
    return dispatch(logoutUser(history));
  }

  const updatedLogoutTime = loggedInUser.expirationTime - new Date().getTime();
  dispatch(autoLogout(updatedLogoutTime, history));
  return dispatch({ type: AUTH_SUCCESS, payload: loggedInUser });
};

export const logoutUser = (history) => (dispatch) => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  history.replace("/");
  return dispatch({ type: LOGOUT_USER });
};

let timer = null;

const autoLogout = (time: number, history) => (dispatch) => {
  timer = setTimeout(() => {
    clearTimer();
    dispatch(logoutUser(history));
  }, time);
};

const clearTimer = () => {
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
};
