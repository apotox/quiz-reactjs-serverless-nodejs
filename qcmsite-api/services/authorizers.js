const njwt = require("njwt");
const { verifyToken } = require("./jwt");


const generateIamPolicy = (effect, resource, data) => {
  let authResponse = {};

  // Define a user object that passes user data and other user informationd decoded from the Firebase token to the Lambda API handler
  let user = {};

  // Populate the API Gateway user principalId with the Firebase user id, or 'unavailable' if not returned from Firebase
  data ? (authResponse.principalId = data.id) : "unavailable";

  // Map values into context object passed into Lambda function, if data is present
  if (data) {
    user["email"] = data.email;
    user["id"] = data.id; 
    user["role"] = data.role || "student";
    authResponse.context = user;
  }

  if (effect && resource) {
    var policyDocument = {};
    policyDocument.Version = "2012-10-17";
    policyDocument.Statement = [];
    var statementOne = {};
    statementOne.Action = "execute-api:Invoke";
    statementOne.Effect = effect;
    statementOne.Resource = resource;
    policyDocument.Statement[0] = statementOne;
    authResponse.policyDocument = policyDocument;
  }

  return authResponse;
};

const rsaJwt = function (event, context) {
  if (!event.authorizationToken) {
    context.fail("Unauthorized"); // 401 status code
    return;
  }

  // If auhorizationToken is present, split on space looking for format 'Bearer <token value>'
  const tokenParts = event.authorizationToken.split(" ");
  const tokenValue = tokenParts[1];

  // Return from function if authorization header is not formatted properly
  if (!(tokenParts[0].toLowerCase() === "bearer" && tokenValue)) {
    context.fail("Unauthorized");
    return;
  }


  verifyToken(tokenValue, (err, decoded) => {
    if (err) {
      console.log("rsa jwt verification error", err);
      context.succeed(generateIamPolicy("Deny", event.methodArn, null));
    } else {
      context.succeed(generateIamPolicy("Allow", "*", decoded.body));
    }
  });
};

module.exports = {
  rsaJwt,
};