const log = require('pino')()
const Hapi = require('hapi')
const Seneca = require('seneca')
const Web = require('seneca-web')
const WebAdapter = require('seneca-web-adapter-hapi')
const Routes = require('./routes')

let config = {
  routes: Routes,
  adapter: WebAdapter,
  context: (() => {
    let server = new Hapi.Server()
    server.connection({ port: 4333 })
    return server
  })()
}

let seneca = Seneca()
  .use('basic')
  .use('entity')
  .use('./plugin')
  .use(Web, config)
  .use('mesh', {
    isbase: true,
  })
  .ready(() => {
    let server = seneca.export('web/context')()

    server.start(() => {
      log.info(`Server started on: ${server.info.uri}`)
    })
  })
