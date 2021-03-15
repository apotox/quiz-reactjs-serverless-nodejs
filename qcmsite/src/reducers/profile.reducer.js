const initState = {
    message:"",
    profile: null
  };
  
  export default (state = initState, { type, payload }) => {
    switch (type) {
      case "SET_PROFILE":
        return {
          ...state,
          profile: payload
        };
     
  
      default:
        return state;
    }
  };
  