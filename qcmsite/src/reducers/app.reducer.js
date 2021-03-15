const initState = {
  title: "VTC CITY FORMATIONS",
  user: null,
  connected: false,
  loading: false,
  listusers: [],
  listrequests: [],
  listqcms: [],
  listcategories: [],
  
  totalUsers:0,
  totalQcms:0,
  totalCategories:0,
  totalRequests:0,
};

export default (state = initState, { type, payload }) => {
  switch (type) {
    case "SET_USER":
      return {
        ...state,
        user: payload,
        connected: payload != null,
      };
    case "DEL_USER":
      return {
        ...state,
        user: null,
        connected: false,
      };
    case "SET_LOADING":
      return {
        ...state,
        loading: payload,
      };

    case "SET_USERS_LIST":
      return {
        ...state,
        listusers: payload.list,
        totalUsers: payload.total
      };
    case "SET_CATEGORIES_LIST":
      return {
        ...state,
        listcategories: payload.list,
        totalCategories: payload.total
      };

    case "SET_QCMS_LIST":
      return {
        ...state,
        listqcms: payload.list,
        totalQcms: payload.total
      };

    case "SET_REQUESTS_LIST":
      return {
        ...state,
        listrequests: payload.list,
        totalRequests: payload.total
      };

    default:
      return state;
  }
};
