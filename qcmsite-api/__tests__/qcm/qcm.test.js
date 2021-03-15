const api = require("../../endpoints");
const shortid = require('shortid')
describe("QCM tests", () => {
  test("create", (done) => {

    const question =  `question .. ${shortid.generate()}`;


    api.qcm.create(
      {
        httpMethod: "POST",
        queryStringParameters: {},
        requestContext: {
            authorizer:{
              claims:{
                role: "admin",
                id: process.env["ADMIN_UID"]
              }
            }
        },
        body: JSON.stringify({
          question,
          valid:[false,false,true,true],
          suggestions: ['A- bla bla bla','B- bla bla bla','C- bla bla bla','D- bla bla bla'],
          note: 'just a note 2',
          category: process.env["CATEGORY_ID"],
          createdBy: process.env["ADMIN_UID"]
        }),
      },
      {}
    ).then((result) => {
        expect(result.statusCode).toBe(200);
        let parsed = JSON.parse(result.body);
        expect(parsed.id).toBeDefined();
        expect(parsed.categoryLabel).not.toBe("")

        expect(parsed.question).toBe(question)
        process.env["QCM_ID"] = parsed.id;
        done();
      })
      .catch((err) => {
        done(err);
      });

  });



  test("update", (done) => {
    api.qcm
      .update(
        {
          httpMethod: "PUT",
          queryStringParameters: {
              id: process.env["QCM_ID"]
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
            valid: [true,false,true,false],
          }),
        },
        {}
      )
      .then((result) => {
        expect(result.statusCode).toBe(200);
        let parsed = JSON.parse(result.body);
        expect(parsed.valid).toStrictEqual([true,false,true,false])
        done();
      })
      .catch(done);
  });


  test("search qcm by category id", (done) => {
    api.qcm
      .index(
        {
          httpMethod: "GET",
          queryStringParameters: {
              search: process.env["CATEGORY_ID"],
              exact: true
          },
          requestContext: {
            authorizer: {
              claims:{
              role: "student"
              }
            },
          },
          body: {}
        },
        {}
      )
      .then((result) => {
        expect(result.statusCode).toBe(200);
        let parsed = JSON.parse(result.body);
        expect(parsed.list.length).toBe(1)
        done();
      })
      .catch(done);
  });


  test("remove a category", (done) => {
    api.category
      .destroy(
        {
          httpMethod: "DELETE",
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
          body: {},
        },
        {}
      )
      .then((result) => {
        expect(result.statusCode).toBe(200);
        let parsed = JSON.parse(result.body);
        expect(parsed.n).toBe(1)
        done();
      })
      .catch(done);
  });

  // test("remove a qcm by id", (done) => {
  //   api.qcm
  //     .destroy(
  //       {
  //         httpMethod: "DELETE",
  //         queryStringParameters: {
  //             id: process.env["QCM_ID"]
  //         },
  //         requestContext: {
  //           authorizer: {
  //             claims:{
  //             role: "admin",
  //             id: process.env["ADMIN_UID"],
  //             }
  //           },
  //         },
  //         body: {},
  //       },
  //       {}
  //     )
  //     .then((result) => {
  //       expect(result.statusCode).toBe(200);
  //       let parsed = JSON.parse(result.body);
  //       expect(parsed.n).toBe(1)
  //       done();
  //     })
  //     .catch(done);
  // });
});
