const Server = require('../../apis/front/front-api').server

const Lab = require('lab')
const Nock = require('nock')
const Code = require('code')

const lab = exports.lab = Lab.script()
const describe = lab.describe
const it = lab.it
const expect = Code.expect

describe('Server', {timeout: 2000}, function () {

  it('sends "log in" request to microservices', function (fin) {

    let gateAPI = Nock('http://mock-api-url')
      .post('/user/login', {
        email: encodeURIComponent('e@mail'),
        password: 'user-pass'
      })
      .reply(200, {
        ok: true,
        login: {},
        user: {userRole: 'Admin'}
      })

    Server.inject({
      method: 'POST',
      url: '/api/user/login',
      payload: {
        email: 'e@mail',
        password: 'user-pass'
      }
    }, function (response) {
      console.log(response.result)
      expect(response.result.ok).to.equal(true)
      gateAPI.isDone()

      fin()
    })
  })
})
