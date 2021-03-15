const getAuthUser = (event) => {
  if (!event.requestContext.authorizer) return null;

  let ret = {
    isAdmin:false,
    email:""
  }


  ret = {
    ...event.requestContext.authorizer,
    isAdmin: event.requestContext.authorizer.role == "admin",
  }

  return ret;
};

module.exports = {
  getAuthUser,
};
