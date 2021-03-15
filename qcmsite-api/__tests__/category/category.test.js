const shortid = require("shortid");
const api = require("../../endpoints");

describe("Category tests", () => {
  test("create", (done) => {

    const tmpLabel = `category of .. ${shortid.generate()}`;
    api.category
      .create(
        {
          httpMethod: "POST",
          queryStringParameters: {},
          requestContext: {
            authorizer: {
              claims:{
                role: "admin",
                id: process.env["ADMIN_UID"],
              }
            },
          },
          body: JSON.stringify({
            label: tmpLabel,
            description: "bla bla bla",
          }),
        },
        {}
      )
      .then((result) => {
        expect(result.statusCode).toBe(200);
        let parsed = JSON.parse(result.body);
        expect(parsed.id).toBeDefined();
        process.env["CATEGORY_ID"] = parsed.id;

        done();
      })
      .catch(done);
  });


  test("update", (done) => {
    api.category
      .update(
        {
          httpMethod: "PUT",
          queryStringParameters: {
              id: process.env["CATEGORY_ID"]
          },
          requestContext: {
            authorizer: {
              claims:{
              role: "admin",
              id: process.env["ADMIN_UID"],
              }
            },
          },
          body: JSON.stringify({
            label: `category of .. ${shortid.generate()}`,
            description: "bla bla bla 2",
          }),
        },
        {}
      )
      .then((result) => {
        expect(result.statusCode).toBe(200);
        let parsed = JSON.parse(result.body);
        expect(parsed.description).toBe("bla bla bla 2")
        done();
      })
      .catch(done);
  });


  

  
});
