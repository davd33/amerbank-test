const log = require('pino')()

const seneca = require('seneca')
  .use('basic')
  .use('entity')
  .use('./plugin')
  .use('mesh', {
    pin: 'role:comment,cmd:*',
    bases: ['127.0.0.1']
  })
  .ready(() => {
    log.info('Microservice COMMENT running.')
  })
