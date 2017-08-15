const Server = require('../../apis/front/front-api').server

const Lab = require('lab')
const Nock = require('nock')
const Code = require('code')

const lab = exports.lab = Lab.script()
const describe = lab.describe
const it = lab.it
const expect = Code.expect

describe('Server', {timeout: 2000}, function () {

  it('sends "list comments" request to microservices', function (fin) {

    let gateAPI = Nock('http://mock-api-url')
      .post('/comment/list', {
        token: 'test-token'
      })
      .reply(200, {
        ok: true
      })

    Server.inject({
      method: 'POST',
      url: '/api/comment/list',
      payload: {
        token: 'test-token'
      }
    }, function (response) {
      expect(response.result.ok).to.equal(true)
      gateAPI.isDone()

      fin()
    })
  })

  it('sends "save comment" request to microservices', function (fin) {

    let gateAPI = Nock('http://mock-api-url')
      .post('/comment/save', {
        token: 'test-token'
      })
      .reply(200, {
        ok: true
      })

    Server.inject({
      method: 'POST',
      url: '/api/comment/save',
      payload: {
        token: 'test-token'
      }
    }, function (response) {
      expect(response.result.ok).to.equal(true)
      gateAPI.isDone()

      fin()
    })
  })
})
