import { UserState } from "../../models/user";
import * as userActions from "./user.actions";

const initialState: UserState = {
  user: null,
  loading: false,
  error: null,

  otherUser: null,

  imageLoading: false,
  userUpdateLoading: false,
};

export const userReducer = (state = initialState, action) => {
  let copyOfUser;
  let copyOfUserPost;
  let index;
  switch (action.type) {
    case userActions.USER_LOADING:
      return {
        ...state,
        loading: true,
      };
    case userActions.GET_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        user: action.payload,
      };
    case userActions.GET_OTHER_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        otherUser: action.payload,
      };
    case userActions.USER_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,

        imageLoading: false,
        userUpdateLoading: false,
      };
    case userActions.UPDATE_USER_LOADING:
      return {
        ...state,
        userUpdateLoading: true,
      };
    case userActions.UPDATE_USER_SUCCESS:
      return {
        ...state,
        userUpdateLoading: false,
        user: { ...state.user, ...action.payload },
      };
    case userActions.USER_IMAGE_LOADING:
      return {
        ...state,
        imageLoading: true,
      };
    case userActions.UPDATE_USER_IMAGE_SUCCESS:
      copyOfUser = { ...state.user };
      copyOfUser.imageUrl = action.payload.imageUrl;
      return {
        ...state,
        imageLoading: false,
        user: copyOfUser,
      };
    case userActions.DELETE_USER_POST_SUCCESS:
      copyOfUserPost = state.user.posts.filter(
        (p) => p.postId !== action.payload
      );
      return {
        ...state,
        user: { ...state.user, posts: copyOfUserPost },
      };
    case userActions.ADD_USER_POST_SUCCESS:
      copyOfUserPost = [...state.user.posts];
      copyOfUserPost.unshift(action.payload);
      return {
        ...state,
        user: { ...state.user, posts: copyOfUserPost },
      };
    case userActions.EDIT_USER_POST_SUCCESS:
      copyOfUserPost = [...state.user.posts];
      index = copyOfUserPost.findIndex(
        (post) => post.postId === action.payload.postId
      );
      copyOfUserPost[index].content = action.payload.content;
      return {
        ...state,
        user: { ...state.user, posts: copyOfUserPost },
      };
    case userActions.UPDATE_NOTIFICATIONS:
      copyOfUser = { ...state.user };
      copyOfUser.notifications = [];
      return {
        ...state,
        user: copyOfUser,
      };
    case userActions.UPDATE_NOTIFICATION:
      copyOfUser = { ...state.user };
      index = copyOfUser.notifications.findIndex(
        (n) => n.nId === action.payload
      );
      copyOfUser.notifications[index].read = true;
      return {
        ...state,
        user: copyOfUser,
      };
    default:
      return state;
  }
};
