import AXIOS from "../../config/axios";

export const GET_ALL_FEEDS_START = "GET_ALL_FEEDS_START";
export const GET_ALL_FEEDS_SUCCESS = "GET_ALL_FEEDS_SUCCESS";
export const GET_ALL_FEEDS_ERROR = "GET_ALL_FEEDS_ERROR";

export const loadFeeds = () => (dispatch) => {
  dispatch({
    type: GET_ALL_FEEDS_START,
  });
  AXIOS.get(
    "https://api.nytimes.com/svc/topstories/v2/technology.json?api-key=P7qf57O9UqZJpq3JAjAD0CeLTN1BC8KO"
  )
    .then((res) =>
      dispatch({
        type: GET_ALL_FEEDS_SUCCESS,
        payload: res.data,
      })
    )
    .catch((error) =>
      dispatch({
        type: GET_ALL_FEEDS_ERROR,
        payload: error.response,
      })
    );
};
