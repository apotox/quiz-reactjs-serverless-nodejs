
const { expect } = require('@jest/globals');
const {rsaJwt} = require('../../services/authorizers')


describe("authorizer tests", () => {
  test("validate a token", (done) => {

    rsaJwt({
        authorizationToken: `Bearer ${process.env["TOKEN"]}`
    },{
        fail:(msg)=> done(new Error(msg)),
        succeed: (result)=>{

            //expect(result.context).toBeDefined()
            expect(result.context.role).toBeDefined()
            expect(result.context.id).toBe(process.env["UID"])
            done()
        }
    })




  });
});
