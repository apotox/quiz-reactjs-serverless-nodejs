import thunk from "redux-thunk";
import axios from "axios";
import appReducer from "./reducers/app.reducer";
import alertReducer from "./reducers/alert.reducer";
import profileReducer from "./reducers/profile.reducer";
import dialogReducer from "./reducers/dialog.reducer";
import { SET_USER } from "./actions/login.actions";
import localStorage from "store";
import { SET_LOADING } from "./actions/app.actions";
const { combineReducers, createStore, applyMiddleware } = require("redux");

const reducers = combineReducers({
  appReducer,
  alertReducer,
  profileReducer,
  dialogReducer,
});

let axiosInstance = null;

let currentUser = localStorage.get("user");
// if(!currentUser){
//   window.location.href="/"
// }

let timer;
const api = () => {
  if (!axiosInstance) {
    axiosInstance = axios.create({
      baseURL: process.env[`REACT_APP_${process.env.NODE_ENV}_ENDPOINT`],
    });

    axiosInstance.interceptors.request.use((req) => {
      store.dispatch(SET_LOADING(true));

      if (timer) clearTimeout(timer);
      timer = setTimeout(() => store.dispatch(SET_LOADING(false)), 10000);

      return req;
    });

    axiosInstance.interceptors.response.use((res) => {
      store.dispatch(SET_LOADING(false));

      return res;
    });
  }

  axiosInstance.defaults.headers.common["Authorization"] = currentUser
    ? `bearer ${currentUser.token}`
    : null;
  return axiosInstance;
};

export const store = createStore(
  reducers,
  applyMiddleware(thunk.withExtraArgument({ api }))
);

store.dispatch(SET_USER(currentUser));
