import * as feeds from "./feed.action";

interface AuthState {
  allFeeds: any;
  loading: boolean;
  error: any;
}

const initialState: AuthState = {
  allFeeds: null,
  loading: true,
  error: null,
};

export const feedReducer = (state = initialState, action) => {
  switch (action.type) {
    case feeds.GET_ALL_FEEDS_START:
      return {
        ...state,
        loading: true,
      };
    case feeds.GET_ALL_FEEDS_SUCCESS:
      return {
        ...state,
        loading: false,
        allFeeds: action.payload,
      };
    case feeds.GET_ALL_FEEDS_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};
