import classes from "./FeedItem.module.css";

export const FeedItem = ({ data }) => {
  return (
    <li className={classes.listItem}>
      <a href={data.url} target="_blank" rel="noopener noreferrer">
        {data.title}
      </a>
    </li>
  );
};
