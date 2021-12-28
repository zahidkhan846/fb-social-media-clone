import { useEffect } from "react";

import { Route, Switch, useHistory } from "react-router";
import AuthPage from "./pages/auth";

import { ThemeProvider } from "@mui/material/styles";
import { theme } from "./config/mui";

import { AuthRoute } from "./utils/AuthRoute";

import { useDispatch } from "react-redux";
import { getLoggedInUser } from "./store/user/user.actions";
import { loadFeeds } from "./store/feed/feed.action";
import { autoLogin } from "./store/auth/auth.actions";

import { UserDetail } from "./pages/userDetail";
import ForgotCred from "./components/auth/ForgotCred";
import Layout from "./components/layout/Layout";
import HomePage from "./pages/home";
import { OtherUser } from "./components/user/OtherUser";
import { PostDetail } from "./pages/postDetail";

function App() {
  const dispatch = useDispatch();

  const history = useHistory();

  useEffect(() => {
    dispatch(loadFeeds());
    dispatch(autoLogin(history));
  }, [dispatch, history]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    dispatch(getLoggedInUser());
  }, [dispatch]);

  return (
    <ThemeProvider theme={theme}>
      <Layout>
        <Switch>
          <Route path="/" exact component={HomePage} />
          <AuthRoute path="/auth" component={AuthPage} />
          <AuthRoute path="/signup" component={AuthPage} />
          <Route path="/:username" exact component={UserDetail} />
          <Route path="/other-user/:username" exact component={OtherUser} />
          <Route path="/posts/:postId" exact component={PostDetail} />
          <Route path="/forgot-cred" component={ForgotCred} />
        </Switch>
      </Layout>
    </ThemeProvider>
  );
}

export default App;
