'use strict';

const Log = require('pino')()
const Hapi = require('hapi')
const Boom = require('boom')
const Req = require('request')

const ServiceUrl = process.env.MS_API_URL;

if (!ServiceUrl) {
  Log.info('Missing env variable: MS_API_URL - url to the gate microservice');
  process.exit(1);
}

// Initiate Hapi Server
const server = exports.server = new Hapi.Server();
server.connection({
  routes: {
    cors: true
  },
  port: 4222
});

// LOGIN
server.route({
  method: 'POST',
  path: '/api/user/login',
  handler: loginHandler
})

// REGISTER
server.route({
  method: 'POST',
  path: '/api/user/register',
  handler: registerHandler
})

// SAVE COMMENT
server.route({
  method: 'POST',
  path: '/api/comment/save',
  handler: commentSaveHandler
})

// LIST COMMENTS
server.route({
  method: 'POST',
  path: '/api/comment/list',
  handler: commentListHandler
})

// APPROVE COMMENT
server.route({
  method: 'POST',
  path: '/api/comment/approve',
  handler: commentApproveHandler
})

server.start((err) => {
  if (err) throw err
  Log.info('Server running at:', server.info.uri)
})

function validateUser(email, password, done) {
  Req.post(
    ServiceUrl + '/user/login',
    {form: {email: email, password: password}},
    (err, res) => {
      if (err) Boom.badRequest(err.message)

      let body = JSON.parse(res.body)

      if (body.ok) {
        return done({ok: true, account: body.login, role: body.user.userRole})
      } else {
        return done({ok: false, why: body.why})
      }
    }
  )
}

function registerUser(done) {
  return (err, res) => {
    if (err) return Boom.badRequest(err.message)

    let body = JSON.parse(res.body)

    if (body.ok) {
      return done({ok: true, user: body.user})
    } else {
      return done({ok: false, why: body.why})
    }
  }
}

function genericCB(done) {
  return (err, res) => {
    if (err) return Boom.badRequest(err.message)

    let body = JSON.parse(res.body)

    if (body.ok) {
      return done({ok: true, data: body.data})
    } else {
      return done({ok: false, why: body.why})
    }
  }
}

/**
 * Handles login. Returns object with 'ok' boolean to true
 * when login succeeds.
 * @param request
 * @param reply
 * @returns {*}
 */
function loginHandler(request, reply) {
  if (request.auth.isAuthenticated) return reply({ok: true})

  let email = encodeURIComponent(request.payload.email)
  let password = encodeURIComponent(request.payload.password)

  validateUser(email, password, data => {
    if (!data.ok) return reply({why: data.why})

    return reply(data)
  })
}

function registerHandler(request, reply) {

  let payload = {
    email: encodeURIComponent(request.payload.email),
    password: encodeURIComponent(request.payload.password),
    role: encodeURIComponent(request.payload.role)
  }

  Req.post(
    ServiceUrl + '/user/register',
    {form: payload},
    registerUser(registerData => {
      if (!registerData.ok) return reply({why: registerData.why})

      validateUser(payload.email, payload.password, validateData => {
        if (!validateData.ok) return reply({why: validateData.why})

        return reply({ok: true})
      })
    })
  )
}

function commentSaveHandler(request, reply) {

  let payload = {
    token: encodeURIComponent(request.payload.token),
    comment: encodeURIComponent(request.payload.comment),
    email: encodeURIComponent(request.payload.email),
    parent: encodeURIComponent(request.payload.parent)
  }

  Req.post(
    ServiceUrl + '/comment/save',
    {form: payload},
    genericCB(data => {
      if (!data.ok) return reply({why: data.why})
      return reply(data)
    })
  )
}

function commentListHandler(request, reply) {

  let payload = {
    token: encodeURIComponent(request.payload.token)
  }

  Req.post(
    ServiceUrl + '/comment/list',
    {form: payload},
    genericCB(data => {
      if (!data.ok) return reply({why: data.why})
      return reply(data)
    })
  )
}

function commentApproveHandler(request, reply) {

  let payload = {
    token: encodeURIComponent(request.payload.token),
    id: encodeURIComponent(request.payload.id)
  }

  Req.post(
    ServiceUrl + '/comment/approve',
    {form: payload},
    genericCB(data => {
      if (!data.ok) return reply({why: data.why})
      return reply(data)
    })
  )
}
