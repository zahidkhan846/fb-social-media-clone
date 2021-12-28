import { PostState } from "../../models/post";
import * as PostActions from "./post.action.types";

const initialState: PostState = {
  loading: false,
  error: null,
  posts: [],
  singlePost: null,

  addPostLoading: false,
  addPostErr: null,

  deletePostLoading: false,
  deletePostErr: null,

  editPostLoading: false,
  editPostErr: null,

  activityOnPostLoading: false,
  activityOnPostErr: null,

  currPostId: null,
  message: null,
};

export const postReducer = (
  state = initialState,
  action: { type: string; payload?: any }
) => {
  let index;
  let updatedPosts;
  switch (action.type) {
    case PostActions.POST_LOADING:
      return {
        ...state,
        loading: true,
      };
    case PostActions.SET_POSTS:
      return {
        ...state,
        loading: false,
        posts: action.payload,
      };
    case PostActions.SET_POSTS_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case PostActions.DELETE_POST_LOADING:
      return {
        ...state,
        deletePostLoading: true,
        currPostId: action.payload,
      };
    case PostActions.DELETE_POST_SUCCESS:
      return {
        ...state,
        deletePostLoading: false,
        posts: state.posts.filter(
          (post) => post.postId !== action.payload.postId
        ),
      };
    case PostActions.DELETE_POST_ERROR:
      return {
        ...state,
        deletePostErr: action.payload,
        deletePostLoading: false,
      };
    case PostActions.ADD_POST_LOADING:
      return {
        ...state,
        addPostLoading: true,
      };
    case PostActions.ADD_POST_SUCCESS:
      return {
        ...state,
        addPostLoading: false,
        posts: [
          { ...action.payload, key: action.payload.postId },
          ...state.posts,
        ],
      };
    case PostActions.ADD_POST_ERROR:
      return {
        ...state,
        addPostErr: action.payload,
        addPostLoading: false,
      };

    case PostActions.EDIT_POST_LOADING:
      return {
        ...state,
        editPostLoading: true,
        currPostId: action.payload,
      };
    case PostActions.EDIT_POST_SUCCESS:
      index = state.posts.findIndex((p) => p.postId === action.payload.postId);
      updatedPosts = [...state.posts];
      updatedPosts[index].content = action.payload.content;
      return {
        ...state,
        editPostLoading: false,
        posts: updatedPosts,
      };
    case PostActions.EDIT_POST_ERROR:
      return {
        ...state,
        editPostLoading: false,
        editPostErr: action.payload,
      };

    case PostActions.POST_ACTIVITY_LOADING:
      return {
        ...state,
        activityOnPostLoading: true,
        currPostId: action.payload,
      };
    case PostActions.POST_LIKE_SUCCESS:
      updatedPosts = [...state.posts];
      index = updatedPosts.findIndex((p) => p.postId === action.payload.postId);
      updatedPosts[index].likeCount = action.payload.updatedPost.likeCount;
      return {
        ...state,
        activityOnPostLoading: false,
        posts: updatedPosts,
      };
    case PostActions.POST_UNLIKE_SUCCESS:
      updatedPosts = [...state.posts];
      index = updatedPosts.findIndex((p) => p.postId === action.payload.postId);
      updatedPosts[index].likeCount = action.payload.updatedPost.likeCount;
      return {
        ...state,
        activityOnPostLoading: false,
        posts: updatedPosts,
      };
    case PostActions.POST_ACTIVITY_ERROR:
      return {
        ...state,
        activityOnPostLoading: false,
        activityOnPostErr: action.payload,
      };

    case PostActions.CLEAR_ERROR:
      return {
        ...state,
        error: null,
        addPostErr: null,
        deletePostErr: null,
        editPostErr: null,
        activityOnPostErr: null,
        message: null,
      };
    case PostActions.SET_ALL_COMMENTS:
      return {
        ...state,
        singlePost: action.payload,
        activityOnPostLoading: false,
      };
    case PostActions.ADD_NEW_COMMENT:
      return {
        ...state,
        singlePost: {
          ...state.singlePost,
          commentCount: state.singlePost.commentCount + 1,
          comments: [...state.singlePost.comments, action.payload],
        },
      };
    case PostActions.UPDATE_POST:
      updatedPosts = [...state.posts];
      index = updatedPosts.findIndex((p) => p.postId === action.payload);
      updatedPosts[index].commentCount = updatedPosts[index].commentCount + 1;
      return {
        ...state,
        posts: updatedPosts,
      };
    case PostActions.DELETE_COMMENT:
      updatedPosts = [...state.posts];
      index = updatedPosts.findIndex((p) => p.postId === action.payload.postId);
      updatedPosts[index].commentCount = updatedPosts[index].commentCount - 1;
      return {
        ...state,
        posts: updatedPosts,
        singlePost: {
          ...state.singlePost,
          commentCount: state.singlePost.commentCount - 1,
          comments: state.singlePost.comments.filter(
            (c) => c.commentId !== action.payload.commentId
          ),
        },
        message: action.payload.message,
      };
    default:
      return state;
  }
};
