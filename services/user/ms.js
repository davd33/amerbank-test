const log = require('pino')()

const seneca = require('seneca')
  .use('basic')
  .use('entity')
  .use('user')
  .use('mesh')
  .ready(() => {
    log.info('Microservice USER running.')
  })
