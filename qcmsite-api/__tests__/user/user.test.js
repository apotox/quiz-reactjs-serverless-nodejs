const api = require("../../endpoints");

describe("user tests", () => {
  test("create a request", (done) => {
    api.user
      .create(
        {
          httpMethod: "POST",
          queryStringParameters: {},
          requestContext: {},
          body: JSON.stringify({
            email:
              "test" + Math.random().toString(36).substring(7) + "a@gmail.com",
            mobile: "0795980831",
            firstname: "safi",
            lastname: "bouhentala",
            wilaya: "batna",
            password: "123456789"
          }),
        },
        {}
      )
      .then((result) => {
        expect(result.statusCode).toBe(200);
        let parsed = JSON.parse(result.body);
        expect(parsed.uid).toBeDefined();

        process.env["USERNAME"] = parsed.username;
        process.env["UID"] = parsed.uid;
        done();
      })
      .catch((err) => {
        done(err);
      });
  });


  

  test("admin is required to accept a request", (done) => {
    api.user
      .acceptUser(
        {
          httpMethod: "POST",
          queryStringParameters: {},
          requestContext: {},
          body: JSON.stringify({
            uid: process.env["UID"],
          }),
        },
        {}
      )
      .then((result) => {
        expect(result.statusCode).toBe(401);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  test("accept a request", (done) => {
    api.user
      .acceptUser(
        {
          httpMethod: "POST",
          queryStringParameters: {},
          requestContext: {
            authorizer: {
              claims:{
              role: "admin",
              }
            },
          },
          body: JSON.stringify({
            uid: process.env["UID"],
          }),
        },
        {}
      )
      .then((result) => {
        expect(result.statusCode).toBe(200);
        let parsed = JSON.parse(result.body);
        expect(parsed.uid).toBe(process.env["UID"]);
        expect(parsed.isActive).toBe(true);

        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  test("reset a password", (done) => {
    api.user
      .resetPassword(
        {
          httpMethod: "PUT",
          queryStringParameters: {
            id: process.env["UID"],
          },
          requestContext: {
            authorizer: {
              claims:{
              role: "admin",
              }
            },
          },
          body: {},
        },
        {}
      )
      .then((result) => {
        expect(result.statusCode).toBe(200);
        let parsed = JSON.parse(result.body);
        expect(parsed.uid).toBe(process.env["UID"]);

        expect(parsed.newpassword).toBeDefined();
        process.env["newpassword"] = parsed.newpassword;

        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  test("login", (done) => {
    api.user
      .login(
        {
          httpMethod: "PUT",
          queryStringParameters: {},
          requestContext: {},
          body: JSON.stringify({
            identifier: process.env["USERNAME"],
            password: process.env["newpassword"],
          }),
        },
        {}
      )
      .then((result) => {
        expect(result.statusCode).toBe(200);
        let parsed = JSON.parse(result.body);

        expect(parsed.token).toBeDefined();
        process.env["TOKEN"] = parsed.token;

        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  test("get list of users (limit 1)", (done) => {
    api.user
      .index(
        {
          httpMethod: "GET",
          queryStringParameters: {
            skip: 0,
            limit: 1,
            search: "bou"
          },
          requestContext: {
            authorizer: {
              claims:{
              role: "admin",
              }
            }
          },
          body: {},
        },
        {}
      )
      .then((result) => {
        expect(result.statusCode).toBe(200);
        let parsed = JSON.parse(result.body);
        expect(parsed.list).toBeDefined();
        expect(parsed.list.length).toBe(1);

        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  test("create an admin", (done) => {

    const email = "test" + Math.random().toString(36).substring(7) + "a@gmail.com";
    console.log("admin email",email)
    api.user
      .create(
        {
          httpMethod: "POST",
          queryStringParameters: {
            
          },
          requestContext: {},
          body: JSON.stringify({
            email,
            mobile: "0795980835",
            firstname: "admin",
            lastname: "bouhentala",
            wilaya: "batna",
            password: "123456789",
            role: "admin"
          }),
        },
        {}
      )
      .then((result) => {
        expect(result.statusCode).toBe(200);
        let parsed = JSON.parse(result.body);
        expect(parsed.uid).toBeDefined();
        console.log("username",parsed.username)
        process.env["ADMIN_USERNAME"] = parsed.username;
        process.env["ADMIN_UID"] = parsed.uid;
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  //google
  test("delete a user", (done) => {
    api.user
      .destroy(
        {
          httpMethod: "DELETE",
          queryStringParameters: {
            id: process.env["UID"],
          },
          requestContext: {
            authorizer: {
              claims:{
              role: "admin",
              }
            },
          },
          body: {},
        },
        {}
      )
      .then((result) => {
        expect(result.statusCode).toBe(200);
        let parsed = JSON.parse(result.body);

        expect(parsed.n).toBe(1);

        done();
      })
      .catch((err) => {
        done(err);
      });
  });
});
