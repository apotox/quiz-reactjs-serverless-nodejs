const initState = {
  content: "",
  actions: [],
  show: false,
  noCancel: false
};

export default (state = initState, { type, payload = {} }) => {
  const { content,title,className = "",noCancel = false, actions = [] } = payload || {};
  switch (type) {
    case "OPEN_DIALOG":
      return {
        ...state,
        content,
        title,
        className,
        noCancel,
        show: true,
        actions,
      };
    case "CLOSE_DIALOG":
      return {
        ...state,
        show: false,
        title:"",
        className: "",
        noCancel: false,
        actions: [],
      };

    default:
      return state;
  }
};
