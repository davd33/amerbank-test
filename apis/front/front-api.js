'use strict';

const Log = require('pino')()
const Hapi = require('hapi')
const CookieAuth = require('hapi-auth-cookie')
const Boom = require('boom')
const Req = require('request')
const uuidv1 = require('uuid/v1')

const ServiceUrl = process.env.MS_API_URL;

if (!ServiceUrl) {
  Log.info('Missing env variable: MS_API_URL - url to the gate microservice');
  process.exit(1);
}

// Initiate Hapi Server
const server = new Hapi.Server();
server.connection({
  routes: {
    cors: true
  },
  port: 4222
});

server.register(CookieAuth, err => {

  if (err) throw err

  const cache = server.cache({segment: 'sessions', expiresIn: 3 * 24 * 60 * 60 * 1000});
  server.app.cache = cache;

  server.auth.strategy('session', 'cookie', true, {
    cookie: 'amerbank-test',
    password: 'Amerbank01-Test12-Cookie93-Password78',
    isSecure: false,
    validateFunc: validateCookie(cache)
  })

  // LOGIN
  server.route({
    method: 'POST',
    path: '/api/user/login',
    config: {
      handler: loginHandler,
      auth: {
        mode: 'try'
      }
    }
  })

  // REGISTER
  server.route({
    method: 'POST',
    path: '/api/user/register',
    config: {
      handler: registerHandler,
      auth: {
        mode: 'try'
      }
    }
  })

  server.start((err) => {
    if (err) throw err
    Log.info('Server running at:', server.info.uri)
  })

})

function validateCookie(cache) {
  return (request, session, done) => {
    cache.get(session.sid, (err, cached) => {

      if (err) return done(err, false)

      if (!cached) return done(null, false)

      return done(null, true, cached.account)
    });
  }
}

function validateUser(email, password, done) {
  Req.post(
    ServiceUrl + '/user/login',
    {form: {email: email, password: password}},
    (err, res) => {
      if (err) Boom.badRequest(err.message)

      let body = JSON.parse(res.body)

      if (body.ok) {
        return done({ok: true, account: body.login})
      } else {
        return done({ok: false, why: body.why})
      }
    }
  )
}

function registerUser(done) {
  return (err, res) => {
    if (err) return Boom.badRequest(err.message)
    if (res.body === '') return Boom.badRequest('body_empty')

    let body = JSON.parse(res.body)

    if (body.ok) {
      return done({ok: true, user: body.user})
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

    const sid = uuidv1()
    request.server.app.cache.set(sid, {account: data.account}, 0, err => {
      if (err) return reply(err)

      request.cookieAuth.set({sid: sid})
      return reply({account: data.account})
    })
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

        const sid = uuidv1()
        request.server.app.cache.set(sid, {account: validateData.account}, 0, err => {
          if (err) return reply(err)

          request.cookieAuth.set({sid: sid})
          return reply({ok: true})
        })
      })
    })
  )
}
