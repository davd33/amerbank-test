let Seneca = require('seneca')
let Lab = require('lab')
let Code = require('code')

let lab = exports.lab = Lab.script()
let describe = lab.describe
let it = lab.it
let expect = Code.expect

function test_seneca(fin) {

  return Seneca({log: 'test'})
    .test(fin)
    .use('basic')
    .use('entity')
    .use('user')
}

/**
 * That test is a simple example to show how to test microservices.
 * However the 'seneca-user' module is already covered.
 */
describe('user', {timeout: 10000}, function () {

  it('will not log in if no users exist', function (fin) {
    let seneca = test_seneca(fin)

    seneca
      .act('role:user,cmd:login',
        {
          email: 'e@mail',
          password: 'test-user-password'
        },
        (ignore, result) => {
          expect(result.ok).to.equal(false)
        }
      )
      .ready(fin)
  })

})
