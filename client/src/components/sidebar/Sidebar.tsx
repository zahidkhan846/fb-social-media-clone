import { Typography } from "@mui/material";
import { Box } from "@mui/system";

import { LatestFeed } from "../latest-feed/LatestFeed";
import { SearchComponent } from "../user-interface/Search";

const Sidebar = () => {
  return (
    <Box sx={{ marginTop: "1rem", marginLeft: "1rem" }}>
      <SearchComponent />
      <Typography
        sx={{ margin: "0.5rem 0" }}
        variant="h6"
        component="h2"
        className="colorful-text"
      >
        Whats Happening
      </Typography>
      <Box>
        <LatestFeed />
      </Box>
    </Box>
  );
};

export default Sidebar;
