import Axios from "axios";
import errorMessage from "../services/errorMessage";
import { SHOW_ALERT } from "./alert.actions";
export const SET_USERS_LIST = (payload) => ({
  type: "SET_USERS_LIST",
  payload,
});

export const SET_REQUESTS_LIST = (payload) => ({
  type: "SET_REQUESTS_LIST",
  payload,
});

export const LOAD_USERS_LIST = ({
  limit = 25,
  skip = 0,
  searchIn = "fullname",
  query = "",
}) => {
  return (dispatch, _, { api = Axios.create }) => {
    api()
      .get(
        `/user?isActive=true&search=${query}&searchIn=${searchIn}&limit=${limit}&skip=${skip}`
      )
      .then((result) => {
        dispatch(SET_USERS_LIST(result.data));
      })
      .catch((err) => {
        dispatch(
          SHOW_ALERT({
            message: errorMessage(err),
            show: true,
          })
        );
      });
  };
};
export const LOAD_REQUESTS_LIST = ({ limit = 10, skip = 0, query = "" } = {}) => {
  return (dispatch, _, { api = Axios.create }) => {
    api()
      .get(`/user?isActive=false&search=${query}&limit=${limit}&skip=${skip}`)
      .then((result) => {
        dispatch(SET_REQUESTS_LIST(result.data));
      })
      .catch((err) => {
        dispatch(
          SHOW_ALERT({
            message: errorMessage(err),
            show: true,
          })
        );
      });
  };
};

export const ACCEPT_REQUEST = (id) => {
  return (dispatch, _, { api }) => {
    api()
      .put(`/acceptUser`,{
        id
      })
      .then((_) => {
        dispatch(SHOW_ALERT({
          message: "La demande a été validée !",
          show: true,
        }));

        dispatch(LOAD_REQUESTS_LIST())
      })
      .catch((err) => {
        dispatch(
          SHOW_ALERT({
            message: err.message,
            show: true,
          })
        );
      });
  };
};

export const RESET_USER_PASSWORD = (id) => {
  return (dispatch, _, { api }) => {
    api()
      .put(`/resetPassword?id=${id}`,{})
      .then((_) => {
        dispatch(SHOW_ALERT({
          message: "Le mot de passe a été mis à jour !",
          show: true,
        }));

      })
      .catch((err) => {
        dispatch(
          SHOW_ALERT({
            message: err.message,
            show: true,
          })
        );
      });
  };
};

export const SET_LOADING = (payload) => ({
  type: "SET_LOADING",
  payload,
});
