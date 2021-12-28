import { FC, Fragment } from "react";
import AppBarComponent from "../app-bar/AppBar";

const Layout: FC = ({ children }) => {
  return (
    <Fragment>
      <AppBarComponent />
      <div style={style}>{children}</div>
    </Fragment>
  );
};

export default Layout;

const style = {
  margin: "64px auto 0 auto",
  maxWidth: "1200px",
};
