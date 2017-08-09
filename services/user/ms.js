const log = require('pino')()

const seneca = require('seneca')
  .use('basic')
  .use('entity')
  .use('user')
  .use('./plugin')
  .use('mesh', {
    pin: 'role:user,cmd:*',
    bases: ['127.0.0.1']
  })
  .ready(() => {
    log.info('Microservice USER running.')
  })
