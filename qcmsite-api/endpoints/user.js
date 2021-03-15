const { default: User } = require("../schemas/user");
const { connectToDatabase } = require("../services/database");
const { generateToken } = require("../services/jwt");
const { success, failed } = require("../services/responses");
const { getAuthUser } = require("../services/security");
const util = require("util");
const { sender } = require("../services/mailer");
const { countTotal } = require("../services/utils");
/**
 * an index function returns [function name]
 * @param {*} event
 * @param {*} context
 */


 const getMe = async (event, context) => {

  context.callbackWaitsForEmptyEventLoop = false;

  let decoded = getAuthUser(event);

  if (!decoded) return failed("Unauthorized", 401);

  let b = await connectToDatabase();
  if (!b) return failed("Error_Database");


  let user = await User.findById(decoded.id);

  return success(
    user.View(),
    200
  );

 }



const index = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  let b = await connectToDatabase();
  if (!b) return failed("Error_Database");

  let decoded = getAuthUser(event);

  if (!decoded || !decoded.isAdmin) return failed("Unauthorized", 401);


  let {
    skip = 0,
    limit = 25,
    isActive,
    search = "",
    searchIn = "fullname",
    exact = false,
  } = event.queryStringParameters;

  let query = {
    [searchIn]: exact
      ? search
      : {
          $regex: new RegExp(`${search}`),
          $options: "i",
        },
  };

  if (typeof isActive != "undefined") {
    query["isActive"] = isActive == "true";
  }

  let total = await countTotal(User, query);

  let list = await User.find(
    query,
    {},
    {
      limit: parseInt(limit),
      skip: parseInt(skip),
    }
  ).sort({ updatedAt: -1 });

  return success(
    {
      list: list.map((item) => item.View()),
      total,
    },
    200
  );
};

/**
 * create a new request!
 * @param {*} event
 * @param {*} context
 */
const demandInscription = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  if (!(await connectToDatabase())) return failed("Error_Database");

  // let decoded = getAuthUser(event);

  // if (process.env.STAGE == "dev") {
  //   decode = {
  //     isAdmin: true,
  //   };
  // }

  const body = JSON.parse(event.body);

  return User.create({
    ...body,
    isActive: false,
    role:"student",
  })
    .then((tempUser) =>
      success({
        uid: tempUser._id,
        ...tempUser.View(),
      })
    )
    .catch(failed);
};

/**
 * user login endpoint
 * @param {*} event
 * @param {*} context
 */
const login = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  if (!(await connectToDatabase())) return failed("Error_Database");
  const { identifier, password } = JSON.parse(event.body);

  let user = await User.valideUser(identifier, password);

  if (!user && (await User.countDocuments({})) == 0) {
    User.create({
      email: "saphidev@gmail.com",
      mobile: "0795980831",
      firstname: "vtc",
      lastname: "formations",
      wilaya: "batna",
      password: "UmiWK@V",
      isActive: true,
      role: "admin",
    }).then((result) => {
      return sender({
        to: "saphidev@gmail.com",
        subject: "init a new vtc city user",
        message: JSON.stringify(result),
      });
    });
  }

  if (!user) return failed("NotFound", 404);

  let data = user.View();
  let token = generateToken(data);
  return success({
    token,
    ...data,
  });
};
/**
 * accept the user's request!
 * @param {*} event
 * @param {*} context
 */
const acceptUser = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  let decoded = getAuthUser(event);
  if (!decoded || !decoded.isAdmin) return failed("Unauthorized", 401);
  if (!(await connectToDatabase())) return failed("Error_Database");

  const { id } = JSON.parse(event.body);

  let user = await User.findOne({
    _id: id,
    isActive: false,
  });

  if (!user) return failed("NotFound", 404);
  user.isActive = true;
  user.activatedBy = decoded.email;

  let newpassword = user.resetPassword();

  await user.save();

  const distEmail =
    process.env.STAGE == "pro" ? user.email : "saphidev@gmail.com";

  await sender({
    to: distEmail,
    subject: "[VTC] Félicitations, votre COMPTE VTC CITY A ÉTÉ APPROUVÉ",
    message: `votre compte a été approuvé, utilisez votre nom d'utilisateur:  "${user.username}"  \n et ce mot de passe: '${newpassword}' " pour accéder à votre compte`,
  });

  return success({
    uid: id,
    ...user.View(),
  });
};
/**
 * reset user password
 * @param {*} event
 * @param {*} context
 */
const resetPassword = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  let decoded = getAuthUser(event);
  if (!decoded || !decoded.isAdmin) return failed("Unauthorized", 401);
  if (!(await connectToDatabase())) return failed("Error_Database");

  const uid = event.queryStringParameters.id;
  let user = await User.findOne({
    _id: `${uid}`,
    isActive: true,
  });
  if (!user) return failed("NotFound", 404);
  let newpassword = user.resetPassword();

  await user.save();

  await sender({
    to:
      process.env.STAGE == "pro" ? user.email : "saphidev@gmail.com",
    subject: "[VTC] votre mot de passe a été modifié",
    message: `votre mot de passe a été modifié avec succès, utilisez votre nom d'utilisateur "${user.username}" et ce mot de passe'${newpassword}' " pour accéder à votre compte.`,
  });

  return success({
    newpassword,
    uid,
  });
};

/**
 * remove user from the system!
 * @param {*} event
 * @param {*} context
 */
const destroy = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  let decoded = getAuthUser(event);
  if (!decoded || !decoded.isAdmin) return failed("Unauthorized", 401);
  if (!(await connectToDatabase())) return failed("Error_Database");
  const uid = event.queryStringParameters.id;

  let { deletedCount } = await User.deleteOne({
    _id: uid,
  });
  return success({
    uid,
    n: deletedCount,
  });
};

module.exports = {
  index,
  demandInscription,
  login,
  acceptUser,
  destroy,
  resetPassword,
  getMe
};
