const { beforeAll } = require("@jest/globals");
const configs = require("../configs.test.json");
const dotenvJSON = require("../services/dotenvjson");

beforeAll((done) => {
  //console.log = jest.fn()
  dotenvJSON(configs);

  done();
});

beforeEach((done) => {
  done();
});

// require("./user/user.test");
// require("./auth/auth.test");
// require("./category/category.test");
// require("./qcm/qcm.test");

describe("tests", () => {
  test("init tests", (done) => { done()});
});

/** close db conn */
afterAll(async (done) => {
  // Closing the DB connection allows Jest to exit successfully.
  const mongoose = require("mongoose");
  await mongoose.disconnect();
  console.log("close database connection");
  done();
});
