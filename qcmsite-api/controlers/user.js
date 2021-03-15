const { default: User } = require("../schemas/user");
const { generateToken } = require("../services/jwt");



const auth = async (identifier, password) => {
  let user = await User.findOne({
    username: `${identifier}`,
    password: md5(password),
  });

  if (!user) return null;

  let { email, role, username, _id } = user.View();

  let token = generateToken({
    email,
    id: _id,
    username,
    role,
  });

  return {
    token,
    email,
    role,
    username,
    _id,
  };
};


module.exports = {
  auth
}