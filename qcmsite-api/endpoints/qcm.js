const { merge, assign } = require("lodash");
const { default: Qcm } = require("../schemas/qcm");
const { connectToDatabase } = require("../services/database");
const { success, failed } = require("../services/responses");
const { getAuthUser } = require("../services/security");
const { countTotal } = require("../services/utils");

const index = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  let decoded = getAuthUser(event);
  if (!decoded) return failed("Unauthorized", 401);
  if (!(await connectToDatabase())) return failed("Error_Database");

  let {
    skip = 0,
    limit = 25,
    search = "",
    searchIn = "question",
    exact = false,
    category,
    sortDir = '-1',
    sortBy = 'createdAt'
  } = event.queryStringParameters;
  let query = {
    [searchIn]: exact
      ? search
      : {
          $regex: new RegExp(`${search}`),
          $options: "i",
        },
  };

  if (category) {
    query["category"] = category;
  }

  let total = await countTotal(Qcm, query);


  //find list of qcms
  let list = await Qcm.find(
    query,
    {},
    {
      limit: parseInt(limit),
      skip: parseInt(skip),
    }
  ).sort({ [sortBy]: parseInt(sortDir) });

  return success(
    {
      list: list.map((item) => item.View()),
      total,
    },
    200
  );
};

/**
 * CREATE NEW QCM
 * @param {*} event
 * @param {*} context
 */
const create = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  let decoded = getAuthUser(event);
  if (!decoded || !decoded.isAdmin) return failed("Unauthorized", 401);
  if (!(await connectToDatabase())) return failed("Error_Database");

  const body = JSON.parse(event.body);

  let qcm = await Qcm.create({
    ...body,
  });

  return success({
    ...qcm.View(),
  });
};
/**
 * update QCM objcet
 * @param {*} event
 * @param {*} context
 */
const update = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  let decoded = getAuthUser(event);
  if (!decoded || !decoded.isAdmin) return failed("Unauthorized", 401);
  if (!(await connectToDatabase())) return failed("Error_Database");

  const id = event["queryStringParameters"]["id"];
  const body = JSON.parse(event.body);

  return Qcm.findById(id)
    .then((old) => assign(old, body))
    .then((old) => old.save())
    .then((result) => success(result))
    .catch((err) => failed(err.message));
};
/**
 * delete a QCM
 * @param {*} event
 * @param {*} context
 */
const destroy = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  let decoded = getAuthUser(event);
  if (!decoded || !decoded.isAdmin) return failed("Unauthorized", 401);
  if (!(await connectToDatabase())) return failed("Error_Database");

  const id = event["queryStringParameters"]["id"];

  return Qcm.deleteOne({
    _id: id,
  })
    .then((d) =>
      success({
        n: d.deletedCount,
      })
    )
    .catch((err) => failed(err.message, 400));
};

module.exports = {
  create,
  destroy,
  update,
  index,
};
