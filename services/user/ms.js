const seneca = require('seneca')()
  .use('basic')
  .use('entity')
  .use('user')
  .ready(() => {
    console.log(`Seneca is ready!`)
  })