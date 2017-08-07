let Hapi = require('hapi')
let Seneca = require('seneca')
let Web = require('seneca-web')
let Routes = require('./routes')

let config = {
  routes: Routes,
  adapter: require('seneca-web-adapter-hapi'),
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
  .ready(startMesh)

function startMesh() {

  let server = this.export('web/context')()

  server.start(() => {
    console.log(`Server started on: ${server.info.uri}`)
  })

  const kubernetes = this.options().plugin.kubernetes

  this
    .use('mesh', {
      host: kubernetes.myip,
      bases: kubernetes.pods
        .filter(pod => pod.labels['seneca-base'] === 'yes')
        .filter(pod => pod.status === 'Running')
        .map(pod => `${pod.ip}:39000`),
      type: 'tcp'
    })
}