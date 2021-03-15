const nJwt = require("njwt");
const util = require("util");

const generateToken = ({ email, id, role }) => {
  var claims = {
    email,
    id,
    iss: "saphy.net",
    role
  };

  const jwt = nJwt.create(claims, process.env.JWT_SECRET);
  jwt.setExpiration()
  return jwt.compact();
};

const verifyToken = (token, callback) => {
  nJwt.verify(token, process.env.JWT_SECRET, callback);
};

const extractUser = async (headers) => {



  if(!headers) return null
  let auth = headers["Authorization"];

  if (!auth) {
    return null;
  }
  let token = auth.split(" ")[1];


  return new Promise((resolve, error) => {
    verifyToken(token, (err, decoded) => {
      if (!err) {
        resolve(decoded.body);
      } else {
        error(err);
      }
    });
  });
};

module.exports = {
  generateToken,
  verifyToken,
  extractUser,
};