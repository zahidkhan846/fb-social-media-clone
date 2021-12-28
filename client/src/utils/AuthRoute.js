import { useSelector } from "react-redux";
import { Redirect, Route } from "react-router";

export const AuthRoute = ({ component: Component, ...routeProps }) => {
  const loggedInUser = useSelector((state) => state.auth.loggedInUser);

  return (
    <Route
      {...routeProps}
      render={(props) =>
        loggedInUser ? <Redirect to="/" /> : <Component {...props} />
      }
    />
  );
};
