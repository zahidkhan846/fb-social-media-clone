import { AuthState } from "../../models/auth";
import * as authActions from "./auth.actions";

const initialState: AuthState = {
  token: null,
  loggedInUser: null,
  loading: false,
  error: null,
};

export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case authActions.AUTH_START:
      return {
        ...state,
        loading: true,
      };
    case authActions.AUTH_SUCCESS:
      return {
        ...state,
        loading: false,
        loggedInUser: action.payload,
      };
    case authActions.AUTH_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case authActions.LOGOUT_USER:
      return {
        ...state,
        loggedInUser: null,
        token: null,
        error: null,
        loading: false,
      };
    default:
      return state;
  }
};
