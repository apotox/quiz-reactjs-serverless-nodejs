export const SHOW_ALERT = (payload) => {
  return (dispatch) => {
    dispatch({
      type: "SHOW_ALERT",
      payload,
    });

    setTimeout(() => {
      dispatch({
        type: "SHOW_ALERT",
        payload: {
          show: false,
          message: "",
        },
      });
    }, 3000);
  };
};
