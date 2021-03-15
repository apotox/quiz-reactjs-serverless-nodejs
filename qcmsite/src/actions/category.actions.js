import Axios from "axios";
import errorMessage from "../services/errorMessage";
import { SHOW_ALERT } from "./alert.actions";
import { OPEN_DIALOG } from "./dialog.actions";

export const SET_CATEGORIES_LIST = (payload) => ({
  type: "SET_CATEGORIES_LIST",
  payload,
});

export const LOAD_CATEGORIES_LIST = ({ limit = 25, skip = 0, query = "" }) => {
  return (dispatch, _, { api = Axios.create }) => {
    api()
      .get(
        `/indexCategory?searchIn=label&search=${query}&limit=${limit}&skip=${skip}`
      )
      .then((result) => {
        dispatch(SET_CATEGORIES_LIST(result.data));
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

export const LOAD_ALL_CATEGORIES = (cb) => {
  return (dispatch, _, { api = Axios.create }) => {
    api()
      .get(`/indexCategory?limit=${100}`)
      .then((result) => {
        cb(result.data.list);
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

export const LOAD_CATEGORIE = (id, cb) => {
  return (dispatch, _, { api = Axios.create }) => {
    api()
      .get(`/indexCategory?exact=true&searchIn=_id&search=${id}`)
      .then((result) => {
        cb(result.data.list[0]);
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

export const SAVE_CATEGORIE = (payload) => {
  return (dispatch, _, { api = Axios.create }) => {
    api()
      .post(`/createCategory`, payload)
      .then((_) => {
        
        dispatch(OPEN_DIALOG({
          content:'Matière ajouté avec succés',
          title:'Message',
          className:'validation',
          actions:[],
          noCancel: true
        }))


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

export const UPDATE_CATEGORIE = (payload, id) => {
  return (dispatch, _, { api = Axios.create }) => {
    api()
      .put(`/updateCategory?id=${id}`, payload)
      .then((result) => {
        //console.log("result", result);
        dispatch(OPEN_DIALOG({
          content:'La matière est mis a jour avec succés',
          title:'Message',
          className:'validation',
          actions:[],
          noCancel: true
        }))

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

export const DELETE_CATEGORY_BY_ID = (id, cb) => {
  return (dispatch, _, { api = Axios.create }) => {
    api()
      .delete(`/deleteCategory/?id=${id}`)
      .then((_) => {
        dispatch(
          SHOW_ALERT({
            show: true,
            message: "La Matière est supprimée",
          })
        );

        // dispatch(LOAD_REQUESTS_LIST())
        cb();
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
