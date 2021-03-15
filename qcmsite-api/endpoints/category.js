const { merge } = require("lodash");
const Category = require("../schemas/category").default;
const { connectToDatabase } = require("../services/database");


const { success, failed } = require("../services/responses");
const { getAuthUser } = require("../services/security");
const {countTotal} = require('../services/utils')
/**
 * get a category
 * @param {*} event
 * @param {*} context
 */
const index = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  let decoded = getAuthUser(event);
  if (!decoded) return failed("Unauthorized", 401);
  if (!(await connectToDatabase())) return failed("Error_Database");
  let {
    skip = 0,
    limit = 25,
    search = "",
    searchIn = "label",
    exact = false,
  } = event.queryStringParameters;
  //query
  let query = {
    [searchIn]: exact
      ? search
      : {
          $regex: new RegExp(`${search}`),
          $options: "i",
        },
  };


  let total = await countTotal(Category,query)


  
  let list = await Category.find(
    query,
    {},
    {
      limit: parseInt(limit),
      skip: parseInt(skip),
    }
  ).sort({ createdAt: -1 });

  return success(
    {
      list: list.map((item) => item.View()),
      total 
    },
    200
  );
};
/**
 * create a new category
 * @param {*} event
 * @param {*} context
 */
const create = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  let decoded = getAuthUser(event);
  if (!decoded || !decoded.isAdmin) return failed("Unauthorized", 401);
  if (!(await connectToDatabase())) return failed("Error_Database");

  const body = JSON.parse(event.body);

  let item = await Category.create({
    ...body,
  });

  return success({
    ...item.View(),
  });
};
/**
 * update a category by Id
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

  return Category.findById(id)
    .then((old) => merge(old, body))
    .then((old) => old.save())
    .then(success)
    .catch((err) => failed(err.message));
};
/**
 * remove a category
 * @param {*} event
 * @param {*} context
 */
const destroy = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  let decoded = getAuthUser(event);
  if (!decoded || !decoded.isAdmin) return failed("Unauthorized", 401);
  if (!(await connectToDatabase())) return failed("Error_Database");

  const id = event["queryStringParameters"]["id"];

  return Category.deleteOne({
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
