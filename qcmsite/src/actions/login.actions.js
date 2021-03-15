import Axios from "axios";
import errorMessage from "../services/errorMessage";
import localStorage from "store";
import { SHOW_ALERT } from "./alert.actions";
/**
 * set user in the store
 * @param {*} payload
 */
export const SET_USER = (payload) => {
  localStorage.set("user", payload);
  return {
    type: "SET_USER",
    payload,
  };
};

export const DEL_USER = () => {
   
    localStorage.remove("user")
    return {
      type: "DEL_USER",
      payload:null,
    };
  };

/**
 * login action
 * @param {*} param0
 */
export const DO_LOGIN = ({ username, password, captcha }) => {
  return (dispatch, getState, { api = Axios.create }) => {
    api()
      .post("/userLogin", {
        identifier: username,
        password,
      })
      .then((result) => {
        dispatch(SET_USER(result.data));

        dispatch(
          SHOW_ALERT({
            show: true,
            message: "Bonjour " + result.data.fullname,
          })
        );

        setTimeout(() => {
          window.location.reload()
        }, 1000);
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
