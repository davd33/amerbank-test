function api(options) {

  // LOGIN
  this.add('gate:user,cmd:login', function (msg, respond) {

    let data = {
      email: msg.args.body.email,
      password: msg.args.body.password
    }

    this.act('role:user,cmd:login', data, respond)
  })

  // REGISTER
  this.add('gate:user,cmd:register', function (msg, respond) {
    let data = {
      email: msg.args.body.email,
      password: msg.args.body.password,
      repeat: msg.args.body.repeat,
      name: msg.args.body.name
    }

    this.act('role:user,cmd:register', data, respond)
  })

  // AUTHENTICATE TOKEN
  this.add('gate:user,cmd:auth', function (msg, respond) {
    let data = {
      token: msg.args.body.token
    }

    this.act('role:user,cmd:auth', data, respond)
  })

}

module.exports = api
