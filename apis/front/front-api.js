'use strict';

const Hapi = require('hapi');
const Boom = require('boom');
const Req = require('request');
const Passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

const ServiceUrl = process.env.MS_API_URL;

if (!ServiceUrl) {
  console.log('Missing env variable: MS_API_URL - url to the gate microservice');
  process.exit(1);
}

Passport.use(new LocalStrategy(function (username, password, done) {
  Req.post(
    ServiceUrl + '/user/add',
    {form: {username: username, password: password}},
    (err, res) => {

      let body = JSON.parse(res.body)
      let alreadyExistsMsg = `Username already exists`

      if (body.message.includes(alreadyExistsMsg)) {
        return reply(Boom.badRequest(alreadyExistsMsg));
      }

      return reply({message: "user successfully added"})
    }
  );
}))

// Create a server with a host and port
const server = new Hapi.Server();
server.connection({
  routes: {
    cors: true
  },
  port: 4222
});

// ROUTE: add new user
server.route({
  method: 'POST',
  path: '/api/user/add',
  handler: function (request, reply) {
    Passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/login'
    })
  }
});

// Start the server
server.start((err) => {

  if (err) {
    throw err;
  }
  console.log('Server running at:', server.info.uri);
});
