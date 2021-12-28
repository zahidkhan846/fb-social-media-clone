import { applyMiddleware, combineReducers, createStore } from "redux";
import thunk from "redux-thunk";
import { authReducer } from "./auth/auth.reducer";
import { feedReducer } from "./feed/feed.reducer";
import { postReducer } from "./post/post.reducer";
import { userReducer } from "./user/user.reducer";

const rootReducer = combineReducers({
  auth: authReducer,
  feed: feedReducer,
  user: userReducer,
  post: postReducer,
});

export const store = createStore(rootReducer, applyMiddleware(thunk));

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
