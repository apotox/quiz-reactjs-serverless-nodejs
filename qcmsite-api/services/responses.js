const headers = {
  "Access-Control-Allow-Headers": "*",
  "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT,DELETE",
  "Access-Control-Allow-Origin": "*",
};

const success = (entity, statusCode = 200) => {
  if (entity) {
    return {
      headers,
      statusCode,
      body: JSON.stringify(entity),
    };
  } else {
    if (typeof entity == "null") throw new Error("NotFound");

    return {
      headers,
      statusCode: 202,
      body: "",
    };
  }
};

const failed = (error, statusCode = 400) => {
  

  let errorType = (() => {
    if (typeof error == "object") {
      if (error.message) {
        return error.message;
      }

      if (error.code) {
        return error.code;
      }

      if (error.errorMessage) {
        return error.errorMessage;
      }

      return "UnknownError";
    } else {
      return error;
    }
  })();

  // if(errorType.indexOf('E11000') > 0){
  //   errorType = "duplicated"
  // }

  
  return {
    headers,
    statusCode: error.status || statusCode,
    body: JSON.stringify({ failed: true, message: errorType }),
  };
};

const cors = () => {
  return {
    headers,
    statusCode: 200,
    body: "",
  };
};

module.exports = {
  headers,
  success,
  failed,
  cors,
};
