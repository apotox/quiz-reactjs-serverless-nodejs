const initState = {
    message:"",
    show:false
  };
  
  export default (state = initState, { type, payload }) => {
    switch (type) {
      case "SHOW_ALERT":
        return {
          ...state,
          message: payload.message,
          show: payload.show
        };
     
  
      default:
        return state;
    }
  };
  