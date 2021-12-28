import { Alert, Skeleton } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import classes from "./LatestFeed.module.css";
import { FeedItem } from "./list-item/FeedItem";

export const LatestFeed = () => {
  const loading = useSelector((state: RootState) => state.feed.loading);
  const error = useSelector((state: RootState) => state.feed.error);
  const allFeeds = useSelector((state: RootState) => state.feed.allFeeds);

  if (loading) {
    return (
      <Skeleton
        variant="rectangular"
        width={270}
        height={400}
        sx={{ borderRadius: "15px" }}
      />
    );
  }

  if (error) {
    return (
      <Alert severity="error">An error occured while fetching data!</Alert>
    );
  }

  if (!allFeeds) {
    return <Alert severity="warning">Something went wrong!</Alert>;
  }

  return (
    <div className={classes.card}>
      <strong className="gray-text">{allFeeds.section}</strong>
      <ul className={classes.list}>
        {allFeeds.results.map((data, index) => (
          <FeedItem key={index} data={data} />
        ))}
      </ul>
    </div>
  );
};
