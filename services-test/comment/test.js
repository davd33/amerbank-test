let Seneca = require('seneca')
let Lab = require('lab')
let Code = require('code')

let lab = exports.lab = Lab.script()
let describe = lab.describe
let it = lab.it
let expect = Code.expect

function test_seneca(fin) {

  return Seneca({log: 'test', timeout: 90000})
    .test(fin)
    .use('basic')
    .use('entity')
    .use(`../../services/comment/plugin.js`)
    .add('role:user,cmd:auth', function (msg, reply) {
      if (msg.token === 'test-token')
        reply(null, {ok: true, user: {userRole: 'Admin'}})
      else
        reply(null, {ok: false})
    })
}

describe('comment', function () {

  it('will save', function (fin) {
    let seneca = test_seneca(fin)

    seneca
      .act('role:comment,cmd:save',
        {
          comment: 'my comment is a cool comment',
          email: 'e@mail',
          token: 'test-token',
          parent: false
        },
        (ignore, result) => {
          expect(result.ok).to.equal(true)
        }
      )
      .ready(fin)
  })

  it('will not save if user is not authenticated', function (fin) {
    let seneca = test_seneca(fin)

    seneca
      .act('role:comment,cmd:save',
        {
          comment: 'my comment is a cool comment',
          email: 'e@mail',
          token: 'no-token',
          parent: false
        },
        (ignore, result) => {
          expect(result.ok).to.equal(false)
        }
      )
      .ready(fin)
  })

  it('will reply to a comment', function (fin) {
    let seneca = test_seneca(fin)

    seneca
      .act('role:comment,cmd:save',
        {
          comment: 'my comment is a cool comment',
          email: 'e@mail',
          token: 'test-token',
          parent: false
        },
        (ignore, first) => {

          expect(first.ok).to.equal(true)

          seneca.act('role:comment,cmd:approve',
            {
              token: 'test-token',
              id: first.data.id
            },
            (ignore, approvedResult) => {

              expect(approvedResult.ok).to.equal(true)

              seneca.act('role:comment,cmd:save',
                {
                  comment: 'my comment is a reply to a cool comment',
                  email: 'e@mail',
                  token: 'test-token',
                  parent: first.data.id
                },
                (ignore, second) => {
                  expect(second.ok).to.equal(true)
                  expect(second.data.parent).to.equal(first.data.id)
                }
              )
            })
        }
      )
      .ready(fin)
  })

  it('will not reply to a non approved comment', function (fin) {
    let seneca = test_seneca(fin)

    seneca
      .act('role:comment,cmd:save',
        {
          comment: 'my comment is a cool comment',
          email: 'e@mail',
          token: 'test-token',
          parent: false
        },
        (ignore, first) => {

          expect(first.ok).to.equal(true)

          seneca.act('role:comment,cmd:save',
            {
              comment: 'my comment is a reply to a cool comment',
              email: 'e@mail',
              token: 'test-token',
              parent: first.data.id
            },
            (ignore, second) => {
              expect(second.ok).to.equal(false)
            }
          )
        }
      )
      .ready(fin)
  })

})
