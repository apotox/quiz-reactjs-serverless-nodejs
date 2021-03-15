import Axios from "axios";
import errorMessage from "../services/errorMessage";
import { SHOW_ALERT } from "./alert.actions";

export const SET_PROFILE = (payload) => ({
  type: "SET_PROFILE",
  payload,
});

export const LOAD_PROFILE = (username) => {
  return (dispatch, _, { api = Axios.create }) => {
    api()
      .get(`/user?limit=1&exact=true&searchIn=username&search=${username}`)
      .then((result) => {
        let { list } = result.data;

        if (list.length == 1) {
          dispatch(SET_PROFILE(list[0]));
        } else {
          throw new Error("NotFound!");
        }
      })
      .catch((err) => {
        dispatch(
          SHOW_ALERT({
            show: true,
            message: errorMessage(err),
          })
        );
      });
  };
};
//LOAD_ME
export const LOAD_ME = (cb) => {
  return (dispatch, _, { api = Axios.create }) => {
    api()
      .get(`/getMe`)
      .then((result) => {
        if (result.data) {
          cb(result.data);
        } else {
          throw new Error("NotFound!");
        }
      })
      .catch((err) => {
        dispatch(
          SHOW_ALERT({
            show: true,
            message: errorMessage(err),
          })
        );
      });
  };
};
