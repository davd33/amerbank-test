const Seneca = require('seneca')

Seneca({tag: 'rgb', log: 'silent'})
  .use('mesh', {
    monitor: true
  })
